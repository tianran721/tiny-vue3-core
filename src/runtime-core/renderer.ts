import {createComponentInstance, setupComponent} from "./component";
import {ShapeFlags} from "../shared/ShapeFlags";

export function render(vnode, container) {
    // 修补 进一步封装下
    patch(vnode, container);
}

// vnode / subTree
function patch(vnode, container) {
    const {shapeFlag} = vnode;
    // 获取
    if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
    const instance = createComponentInstance(initialVNode);

    setupComponent(instance);
    // TODO

    setupRenderEffect(instance, initialVNode, container);
}

function mountElement(vnode, container) {
    // el: 是组件根节点
    const el = (vnode.el = document.createElement(vnode.type));
    const {children, shapeFlag} = vnode;
    // children

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el);
    }
    // props
    let props = vnode.props;
    for (let key in props) {
        let val = props[key];
        const isOn = (key: string) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        } else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}


function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}

function setupRenderEffect(instance, initialVNode, container) {

    const {proxy} = instance;
    // subTree -> vnode
    const subTree = instance.render.call(proxy);
    // TODO

    patch(subTree, container);

    initialVNode.el = subTree.el;
}
