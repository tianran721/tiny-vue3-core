import {extend} from "./index";
let activeEffect;
let shouldTrack = false;
class ReactiveEffect {
	private _fn: any;
	private scheduler: Function | undefined;
	onStop?:() => void;
	// 这么写是定义实例属性 active
	// active 记录 dep里 有 没有 activeEffect 可以删除, 默认是有的
	active = true;
	// deps 保存 dep ,dep里保存activeEffect
	deps = [];
	constructor(fn,scheduler?: Function) {
		this._fn = fn;
		this.scheduler = scheduler;
	}
	run() {
		activeEffect = this;
		// effect 回调的返回值
		return this._fn();
	}
	//
	stop(){
		if(this.active){
			cleanupEffect(this)
			if(this.onStop){
				// 回调 onStop 函数
				this.onStop();
			}
			// 删除activeEffect后,将active置为false
			// 当第二次 执行stop时,就不会重复执行
			this.active = false;
		}
	}
}
// 遍历 deps , 删除 activeEffect
function cleanupEffect(effect){
	effect.deps.forEach(dep=>{
		dep.delete(effect)
	})
}

// target=>map
const targetMap = new Map();

export function track(target, key) {
	let depsMap = targetMap.get(target);
	if (!depsMap) {
		depsMap = new Map();
		targetMap.set(target, depsMap);
	}
	// key => set
	let dep = depsMap.get(key);
	if (!dep) {
		dep = new Set();
		depsMap.set(key, dep);
	}
	// 单纯触发 track 时, effect函数没有调用, activeEffect 是undefined,不是[],这种情况直接结束函数
	if (!activeEffect) return;
	// reactiveEffect
	dep.add(activeEffect);
	// 将dep push 到 []
	activeEffect.deps.push(dep)
}

export function trigger(target, key) {
	let depsMap = targetMap.get(target);
	let dep = depsMap.get(key);
	// effect : reactiveEffect
	for (const effect of dep) {
		// 触发依赖前先判断
		if(effect.scheduler){
			effect.scheduler()
		}else{
			effect.run();
		}
	}
}
type effectOptions = {
	scheduler? : Function
}

// 添加scheduler 可选
export function effect(fn,options:any = {}) {
	const _effect = new ReactiveEffect(fn,options.scheduler);
	// 浅拷贝-> 把options 里的一项项 复制到 _effect
	extend(_effect,options)
	_effect.run();
	const runner:any = _effect.run.bind(_effect);
	// runner上挂 reactiveEffect
	runner.effect = _effect;
	// 返回run
	return runner;
}

export function stop(runner){
	// 调用 effect 的 stop 方法
	runner.effect.stop()
}
