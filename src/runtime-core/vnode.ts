import {ShapeFlags} from "../shared/ShapeFlags";

export function createVNode(type, props?, children?) {
    const vnode = {
        // String | Component
        type,
        // {}
        props,
        // String | []
        children,
        // DOM
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (typeof children === "string") {
        // 等价于 vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    } else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    // todo
    if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
        if(typeof children === "object"){
            vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
        }
    }
    return vnode;
}

function getShapeFlag(type) {
    return typeof type === "string"
        ? ShapeFlags.ELEMENT
        : ShapeFlags.STATEFUL_COMPONENT;
}

