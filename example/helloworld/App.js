import {h} from "../../lib/guide-mini-vue.esm.js";
// 通过self获取render this
window.self = null;
// this.$el
// App 根组件
export const App = {
    // 假设了用户必须写render
    render() {
        window.self = this;
        return h("div", {id: "root", class: ["red", "hard"],},
            [
                h("p", {class: "red"}, "hi "+this.msg),
                h("p", {class: "blue"}, "mini-vue")
            ]);
    },

    setup() {
        return {
            msg: "mini-vue",
        };
    },
};
