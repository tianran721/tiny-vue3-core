import {extend} from "./index";

class ReactiveEffect {
	private _fn: any;
	private scheduler: Function | undefined;
	onStop?:() => void;
	// 这么写是定义实例属性 active
	active = true;
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
				this.onStop();
			}
			// cleanupEffect只做1次
			this.active = false;
		}
	}
}
function cleanupEffect(effect){
	// [ set ]
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
	if (!activeEffect) return;
	// reactiveEffect
	dep.add(activeEffect);
	// [ set ]
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

let activeEffect;
// 添加scheduler 可选
export function effect(fn,options:any = {}) {
	const _effect = new ReactiveEffect(fn,options.scheduler);
	// 浅拷贝 _effect -> + onStop
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
