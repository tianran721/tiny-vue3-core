import {mutableHandlers, readonlyHandlers, shallowReadonlyHandlers} from './baseHandler'
import {isObject} from "../shared/index";

export const enum ReactiveFlags {
    IS_REACTIVE = "__v_isReactive",
    IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
    // mutableHandlers 对应普遍proxy的handlers
    return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}

// target 是 普通obj
// baseHandlers 为 mutableHandlers/readonlyHandlers
function createReactiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
        return target
    }
    return new Proxy(target, baseHandlers);
}

export function isReactive(value) {
    // value.xxx 会触发Proxy 对象的get
    // 如果是普通对象,会被转成false
    // 如果是proxy 返回true
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
