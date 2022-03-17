module.exports = {
  presets: [
    // 告诉babel使用当前node版本为环境
    ["@babel/preset-env", { targets: { node: "current" } }],
      //支持ts
    "@babel/preset-typescript",
  ],
};
