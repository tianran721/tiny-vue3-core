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
    };

    return vnode;
}
