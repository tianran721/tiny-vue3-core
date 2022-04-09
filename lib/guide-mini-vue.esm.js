// 抽出来以为后序会用到
var extend = Object.assign;
var isObject = function (value) {
    return value !== null && typeof value === "object";
};
var hasOwn = function (val, key) {
    return Object.prototype.hasOwnProperty.call(val, key);
};

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        // if this.$el 那么key 是$el
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            // 返回组件的根dom节点
            return publicGetter(instance);
        }
    },
};

// targetMap 容器: {原对象=>map}
var targetMap = new Map();
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}

// 一上来就创建 get等, 给mutableHandlers等,以后每次使用get应用,而不是重复调用方法
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    // proxy.key => 你.谁, key就是谁
    // ? target是谁 target 是 普通obj,是代理前的原对象, key是原对象.的prop
    return function get(target, key) {
        // 如果 proxy.xxx, 走这段逻辑 ,isReactive,isReadonly才会走这段逻辑
        // 如果点的是 ReactiveFlags.IS_xxx
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        var res = Reflect.get(target, key);
        // TODO
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key) {
        console.warn("key :\"".concat(String(key), "\" set \u5931\u8D25\uFF0C\u56E0\u4E3A target \u662F readonly \u7C7B\u578B"), target);
        return true;
    }
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
});

function reactive(raw) {
    // mutableHandlers 对应普遍proxy的handlers
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
// target 是 普通obj
// baseHandlers 为 mutableHandlers/readonlyHandlers
function createReactiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn("target ".concat(target, " \u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
        return target;
    }
    return new Proxy(target, baseHandlers);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

function createComponentInstance(vnode) {
    var component = {
        // {}
        vnode: vnode,
        // String | Component
        type: vnode.type,
        setupState: {},
        proxy: null,
        render: null,
        props: {},
    };
    return component;
}
function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    // TODO
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
        var setupResult = setup(shallowReadonly(instance.props));
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
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, val);
        }
        else {
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
