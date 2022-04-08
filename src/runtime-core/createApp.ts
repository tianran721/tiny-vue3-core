import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
    // 返回应用实例对象
    return {
        mount(rootContainer) {
            // vue3 先将根组件转为vnode
            // 之后基于vnode进行操作
            // 实质上h函数就是 createVNode ,  能在未来生成html的js
            const vnode = createVNode(rootComponent);

            // 进一步处理 封一下
            render(vnode, rootContainer);
        },
    };
}

