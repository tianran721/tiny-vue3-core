import { createComponentInstance, setupComponent } from "./component";
import { isObject } from "../shared/index";

export function render(vnode, container) {
    // 修补 进一步封装下
    patch(vnode, container);
}

// 判断vnode的类型
function patch(vnode, container) {
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container);
}

function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
    // 根据vnode 返回一个组件实例,上面挂载了很多属性(包括vnode)
    const instance = createComponentInstance(vnode);

    setupComponent(instance);

    setupRenderEffect(instance, container);
}

function mountElement(vnode, container) {
    var el = document.createElement(vnode.type);
    var children = vnode.children;
    // children
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    // props
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}


function  mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}
function setupRenderEffect(instance: any, container) {
    const subTree = instance.render();
    patch(subTree, container);
}
