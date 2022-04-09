var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // setupState
        var setupState = instance.setupState;
        // in 操作符
        // $el 不在 setupState上
        if (key in setupState) {
            return setupState[key];
        }
        // if this.$el 那么key 是$el
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            // 返回组件的根dom节点
            return publicGetter(instance);
        }
    },
};

function createComponentInstance(vnode) {
    var component = {
        // {}
        vnode: vnode,
        // String | Component
        type: vnode.type,
        setupState: {},
        proxy: null,
        render: null
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    // 封装一下
    setupStatefulComponent(instance);
}
// 初始化有状态组件
function setupStatefulComponent(instance) {
    // 主逻辑是去调用setup,拿到返回值 -> 就需要拿到根组件的配置
    // Component -> 用户定义的组件
    var Component = instance.type;
    // TODO proxy
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
// handleSetupResult,finishComponentSetup : 就是把用户定义的setup(),render挂到框架定义的instance上
function handleSetupResult(instance, setupResult) {
    // 返回值可能是 function | Object
    // TODO function 如果是fn,会作为渲染函数
    if (typeof setupResult === "object") {
        // 赋值
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    // 修补 进一步封装下
    patch(vnode, container);
}
// 判断vnode的类型
function patch(vnode, container) {
    var shapeFlag = vnode.shapeFlag;
    // 获取
    if (shapeFlag & 1 /* ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    // TODO 创建真正组件实例
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function mountElement(vnode, container) {
    // el: 是组件根节点
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, shapeFlag = vnode.shapeFlag;
    // children
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
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
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    // todo subTree
    var subTree = instance.render.call(proxy);
    // patch完 所有 subTree出初始化完成
    patch(subTree, container);
    // TODO *
    initialVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    var vnode = {
        // String | Component
        type: type,
        // {}
        props: props,
        // String | []
        children: children,
        // DOM
        el: null,
        shapeFlag: getShapeFlag(type),
    };
    if (typeof children === "string") {
        // 等价于 vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    // 返回应用实例对象
    return {
        mount: function (rootContainer) {
            // vue3 先将根组件转为vnode
            // 之后基于vnode进行操作
            // 实质上h函数就是 createVNode ,  能在未来生成html的js
            // TODO vnode
            var vnode = createVNode(rootComponent);
            // 进一步处理 封一下
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
