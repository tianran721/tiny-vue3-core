class ReactiveEffect{
    private _fn: any;
    constructor(fn){
        this._fn = fn;
    }
    run(){
        this._fn()
    }
}

export function effect(fn){
    // 触发fn
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}
