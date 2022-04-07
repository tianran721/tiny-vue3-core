import {extend} from "./index";
let activeEffect;
// shouldTrack控制是否应该收集依赖
let shouldTrack = false;
class ReactiveEffect {
	private _fn: any;
	private scheduler: Function | undefined;
	onStop?:() => void;
	// 这么写是定义实例属性 active
	// active 记录 dep(set)里 有 没有 实例(activeEffect) 可以删除, 默认是有的(因为单测中有创建代理和track的操作)
	active = true;
	// 将来会被push set容器(里面装实例)
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
				// 回调 onStop
				this.onStop();
			}
			// 删除activeEffect一次就够了,将active置为false,当再调用stop时,就不会重复执行cleanupEffect逻辑
			this.active = false;
		}
	}
}
function cleanupEffect(effect){
	// 遍历数组deps,拿到set容器, 删掉容器里的实例
	effect.deps.forEach(dep=>{
		dep.delete(effect)
	})
}

// targetMap 容器: {原对象=>map}
const targetMap = new Map();

export function track(target, key) {
	// 感觉depsMap 叫 keyMap 更好理解
	let depsMap = targetMap.get(target);
	if (!depsMap) {
		depsMap = new Map();
		targetMap.set(target, depsMap);
	}
	// depsMap 容器: {原对象.的key => set }
	let dep = depsMap.get(key);
	if (!dep) {
		dep = new Set();
		depsMap.set(key, dep);
	}
	// 单纯触发 track 时, effect函数没有调用, activeEffect 是undefined,不是[],这种情况直接结束函数
	if (!activeEffect) return;
	// TODO :













	// dep-> set : 里面塞 activeEffect(new 的实例)
	dep.add(activeEffect);
	// 将装有实例的set, push 到 实例的deps中
	// 收集依赖时,把set容器push到实例的deps
	activeEffect.deps.push(dep)
}

export function trigger(target, key) {
	let depsMap = targetMap.get(target);
	let dep = depsMap.get(key);
	// for of 遍历 set
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
