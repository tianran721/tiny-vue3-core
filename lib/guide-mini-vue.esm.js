function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
// 初始化有状态组件
function setupStatefulComponent(instance) {
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // 返回值可能是 function | Object
    // TODO function
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    instance.render = Component.render;
}

export function render(vnode, container) {
    patch(vnode, container);
}
export function patch(vnode, container) {
    // TODO 判断vnode 是不是一个 element
    // 是 element 那么就应该处理 element
    // 思考题： 如何去区分是 element 还是 component 类型呢？
    // processElement();
    processComponent(vnode);
}

export function processComponent(vnode, container) {
    mountComponent(vnode);
}
export function mountComponent(vnode, container) {
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
export function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    patch(subTree);
}
// 第一次传入根组件时,vnode的type 就是根组件的引用 => 也就是App对象
export function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
    };
    return vnode;
}

// 创建应用实例
// 接收根组件
export function createApp(rootComponent) {
    // 返回应用实例
    return {
        // 接收根容器, 最终目的是去把组件挂载到容器
        mount(rootContainer) {
            // 传入根组件App,返回根组件的vnode
            const vnode = createVNode(rootComponent);

            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
