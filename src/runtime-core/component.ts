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
    setupStatefulComponent(instance);
}
// 初始化有状态组件
function setupStatefulComponent(instance: any) {
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

    if (!Component.render) {
        instance.render = Component.render;
    }
}
