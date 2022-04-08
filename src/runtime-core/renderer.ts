import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
    // 修补
    patch(vnode, container);
}

function patch(vnode, container) {
    // process : 加工处理
    processComponent(vnode, container);
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
    const instance = createComponentInstance(vnode);

    setupComponent(instance);
    setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container) {
    const subTree = instance.render();

    patch(subTree, container);
}
