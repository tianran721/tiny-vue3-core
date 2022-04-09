import {h} from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
// 通过self获取render this
window.self = null;
// this.$el
// App 根组件
export const App = {
    name:"App",
    // 假设了用户必须写render
    render() {
        window.self = this;
        return h("div", {
                id: "root", class: ["red", "hard"], onClick() {
                    console.log("click");
                },
            },
            [
                h("div", {}, "hi," + this.msg),
                h(Foo, {count: 1,}),
            ]);
    },

    setup() {
        return {
            msg: "mini-vue",
        };
    },
};
