export function reactive(origin){
    return new Proxy(origin, {
        // {foo : 1}
        get(target, key){
            const value = Reflect.get(target, key);
            // TODO 依赖收集

            return value;
        },
        set(target, key, value, receiver){
            const oldValue = Reflect.get(target, key, receiver);
            if(oldValue !== value){
                let res = Reflect.set(target, key, value, receiver);
                // TODO 依赖通知
                return res;
            }
            return oldValue;
        }
    });
}

