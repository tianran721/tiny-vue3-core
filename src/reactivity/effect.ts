class ReactiveEffect {
	private _fn: any;
	private scheduler: Function | undefined;
	constructor(fn,scheduler?: Function) {
		this._fn = fn;
		this.scheduler = scheduler;
	}
	run() {
		activeEffect = this;
		// effect 回调的返回值
		return this._fn();
	}
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
	// reactiveEffect
	dep.add(activeEffect);
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
export function effect(fn,options:effectOptions={}) {
	const _effect = new ReactiveEffect(fn,options.scheduler);
	_effect.run();
	const runner = _effect.run.bind(_effect);
	// 返回run
	return runner;
}
