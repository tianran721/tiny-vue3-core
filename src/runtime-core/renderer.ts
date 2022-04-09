import {createComponentInstance, setupComponent} from "./component";
import {isObject} from "../shared/index";

export function render(vnode, container) {
    // 修补 进一步封装下
    patch(vnode, container);
}

// 判断vnode的类型
function patch(vnode, container) {
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container);
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container);
}

function mountComponent(initialVNode: any, container) {
    // TODO 创建真正组件实例
    const instance = createComponentInstance(initialVNode);

    setupComponent(instance);

    setupRenderEffect(instance, initialVNode, container);
}

function mountElement(vnode, container) {
    // el: 是组件根节点
    const el = (vnode.el = document.createElement(vnode.type));
    let children = vnode.children;
    // children

    if (typeof children === "string") {
        el.textContent = children;
    } else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    // props
    let props = vnode.props;
    for (let key in props) {
        let val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}


function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}

function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    // todo subTree
    const subTree = instance.render.call(proxy);
    // patch完 所有 subTree出初始化完成
    patch(subTree, container);

    // TODO *
    initialVNode.el = subTree.el;
}
