import { track, trigger } from "./effect";
// reactive 返回代理对象
export function reactive(origin){
    return new Proxy(origin, {
        // {foo : 1}
        get(target, key){
            const value = Reflect.get(target, key);
            // 依赖收集
            track(target,key)
            return value;
        },
        set(target, key, value) {
            const res = Reflect.set(target, key, value);
            // 触发依赖
            trigger(target, key);
            return res;
        },
    });
}

