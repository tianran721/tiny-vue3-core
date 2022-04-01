class ReactiveEffect {
	private _fn: any;
	constructor(fn) {
		this._fn = fn;
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
		effect.run();
	}
}
let activeEffect;
export function effect(fn) {
	const _effect = new ReactiveEffect(fn);
	_effect.run();
	const runner = _effect.run.bind(_effect);
	// 返回run
	return runner;
}
