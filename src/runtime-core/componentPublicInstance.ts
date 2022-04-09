const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        // setupState
        const { setupState } = instance;
        // in 操作符
        // $el 不在 setupState上
        if (key in setupState) {
            return setupState[key];
        }
        // if this.$el 那么key 是$el
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            // 返回组件的根dom节点
            return publicGetter(instance);
        }
    },
};
