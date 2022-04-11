import {hasOwn} from "../shared/index";

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
};

export const PublicInstanceProxyHandlers = {
    get({_: instance}, key) {
        const {setupState, props} = instance;

        if (hasOwn(setupState, key)) {
            return setupState[key];
        } else if (hasOwn(props, key)) {
            return props[key];
        }
        // if this.$el 那么key 是$el
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            // 返回组件的根dom节点
            return publicGetter(instance);
        }
    },
};
