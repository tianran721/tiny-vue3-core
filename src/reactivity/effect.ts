import {extend} from "./index";
let activeEffect;
// shouldTrack控制是否应该收集依赖
let shouldTrack = false;
export class ReactiveEffect {
	private _fn: any;
	private scheduler: Function | undefined;
	onStop?:() => void;
	// 这么写是定义实例属性 active
	// active 记录 dep(set)里 有 没有 实例(activeEffect) 可以删除, 默认是true,表示可以往deps添加set(因为单侧fn中会触发代理的get操作,将实例保存到set容器)
	// active 别名叫 isCouldDelEffect 我觉得还行
	active = true;
	// 将来会被push set容器(里面装实例)
	deps = [];
	constructor(fn,scheduler?: Function) {
		this._fn = fn;
		this.scheduler = scheduler;
	}
	run() {

		// 只有调用了stop,isCouldDelEffect变false, 直接调用fn,此时 shouldTrack 还是默认的false/被重置为false
		if(!this.active){
			return this._fn();
		}
		// 开启 shouldTrack, 下调用 fn , 调用后 将shouldTrack 重置为false
		shouldTrack = true;
		activeEffect = this;

		// 调用fn -> 触发 get
		const r = this._fn();
		// shouldTrack 重置为false, 如果调用了stop, 此时shouldTrack状态为false了
		shouldTrack = false;
		return r;
	}
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
	// 清空 deps
	effect.deps.length = 0;
}

// targetMap 容器: {原对象=>map}
const targetMap = new Map();

export function track(target, key) {
	// 1.第一次收集依赖时,isTracking() 返回true , ,不走
	// 2.调用完stop后 ,代理触发get, isTracking()返回false
	if(!isTracking()) return

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
	trackEffects(dep);


}
export function trackEffects(dep){
	if(dep.has(activeEffect)) return

	dep.add(activeEffect);
	activeEffect.deps.push(dep)
}

export function isTracking(){
	return shouldTrack && activeEffect !== undefined
}
export function triggerEffects(dep) {
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler();
		} else {
			effect.run();
		}
	}
}
export function trigger(target, key) {
	let depsMap = targetMap.get(target);
	let dep = depsMap.get(key);
	triggerEffects(dep);
}
type effectOptions = {
	scheduler? : Function
}

// 添加scheduler 可选
export function effect(fn,options:any = {}) {
	const _effect = new ReactiveEffect(fn,options.scheduler);
	// 浅拷贝-> 把options 里的一项项 复制到 _effect
	extend(_effect,options)
	// run()时,会调用fn
	_effect.run();
	//
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
