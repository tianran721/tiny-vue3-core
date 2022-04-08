import { createApp } from "../../lib/guide-mini-vue.esm.js";
import { App } from "./App.js";
// 获取根节点
const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);
