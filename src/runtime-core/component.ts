import {PublicInstanceProxyHandlers} from "./componentPublicInstance";
import {shallowReadonly} from "../reactivity/reactive";
import {initProps} from "./componentProps";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode) {
    const component = {
        // {}
        vnode,
        // String | Component
        type: vnode.type,
        setupState: {},
        proxy: null,
        render: null,
        props: {},
        slots: {},
        emit: () => {},
    };
    component.emit = emit.bind(null, component) as any;
    return component;
}

export function setupComponent(instance) {

    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    // TODO

    setupStatefulComponent(instance);
}

// 初始化有状态组件
function setupStatefulComponent(instance) {

    const Component = instance.type;
    // TODO proxy
    instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers);

    const {setup} = Component;

    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
            // todo
        });
        handleSetupResult(instance, setupResult);
    }
}

// handleSetupResult,finishComponentSetup : 就是把用户定义的setup(),render挂到框架定义的instance上
function handleSetupResult(instance, setupResult: any) {
    // 返回值可能是 function | Object
    // TODO function 如果是fn,会作为渲染函数
    if (typeof setupResult === "object") {
        // 赋值
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
    const Component = instance.type;

    instance.render = Component.render;
}
