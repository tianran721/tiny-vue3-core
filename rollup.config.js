import pkg from "./package.json";
// 编译ts
import typescript from "@rollup/plugin-typescript";
export default {
    // 入口
    input: "./src/index.ts",
    output: [
        // 1. cjs -> commonjs
        {
            format: "cjs",
            file: pkg.main,
        },
        // 2. 打包成 esm
        {
            format: "es",
            file: pkg.module,
        },
    ],

    plugins: [typescript()],
};
