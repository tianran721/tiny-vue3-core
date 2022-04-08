import { h } from "../../lib/guide-mini-vue.esm.js";
// App 组件
export const App = {
    // 假设了用户必须写render
    render() {
        // ui
        return h("div", "hi, " + this.msg);
    },

    setup() {
        return {
            msg: "mini-vue",
        };
    },
};
