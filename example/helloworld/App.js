import {h} from "../../lib/guide-mini-vue.esm.js";
// App 组件
export const App = {
    // 假设了用户必须写render
    render() {
        return h(
            "div",
            { id: "root", class: ["red", "hard"],},
            // string / array类型
            [h("p", {class: "red"}, "hi"), h("p", {class: "blue"}, "mini-vue")]
        );
    },

    setup() {
        return {
            msg: "mini-vue",
        };
    },
};
