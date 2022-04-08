
export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
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
function setupStatefulComponent(instance: any) {
    // 主逻辑是去调用setup,拿到返回值 -> 就需要拿到根组件的配置

    const Component = instance.type;

    const { setup } = Component;

    if (setup) {
        const setupResult = setup();

        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance, setupResult: any) {
    // 返回值可能是 function | Object
    // TODO function
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
    const Component = instance.type;

    instance.render = Component.render;
}
