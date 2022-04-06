import {track, trigger} from "./effect"
import {ReactiveFlags} from "./reactive";
// 一上来就创建 get等, 给mutableHandlers等,以后每次使用get应用,而不是重复调用方法
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true)


function createGetter(isReadonly = false){
    // proxy.key => 你.谁, key就是谁
   return function get(target,key){
       // 如果 proxy.xxx, 走这段逻辑 ,isReactive,isReadonly才会走这段逻辑
       // 如果点的是 ReactiveFlags.IS_xxx
       if(key === ReactiveFlags.IS_REACTIVE){
           return !isReadonly
       }else if(key === ReactiveFlags.IS_READONLY){
           return isReadonly
       }

       let res = Reflect.get(target,key)

       // readonly的响应式对象,不会track收集依赖,因为不会触发,不需要收集
       if(!isReadonly){
           track(target,key)
       }
       return res;
   }
}

function createSetter(){
    return function set(target,key,value){
        let res = Reflect.set(target,key,value);
        trigger(target,key)
        return res;
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target,key){
        console.warn(
            `key :"${String(key)}" set 失败，因为 target 是 readonly 类型`,
            target
        );
        return true;
    }
}
