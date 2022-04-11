import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
    //传入 setup 函数的第二个参数是一个 Setup 上下文 对象
    setup(props, { emit }) {
        const emitAdd = () => {
            console.log("emit add");
            // TODO
            emit("add",1,2);
            emit("add-foo");
        };

        return {
            emitAdd,
        };
    },
    render() {
        const btn = h(
            "button",
            {
                onClick: this.emitAdd,
            },
            "emitAdd"
        );
        const foo = h("p", {}, "foo");

        // h
        return h("div", {}, [foo, btn]);
    },
};
