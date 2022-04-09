import {PublicInstanceProxyHandlers} from "./componentPublicInstance";

export function createComponentInstance(vnode) {
    const component = {
        // {}
        vnode,
        // String | Component
        type: vnode.type,
        setupState: {},
        proxy: null,
        render:null
    };
    return component;
}


export function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()

    // 封装一下
    setupStatefulComponent(instance);
}

// 初始化有状态组件
function setupStatefulComponent(instance) {
    // 主逻辑是去调用setup,拿到返回值 -> 就需要拿到根组件的配置
    // Component -> 用户定义的组件
    const Component = instance.type;
    // TODO proxy
    instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers);

    const {setup} = Component;

    if (setup) {
        const setupResult = setup();

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
