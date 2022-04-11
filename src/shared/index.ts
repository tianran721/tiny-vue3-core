// 抽出来以为后序会用到
export const extend = Object.assign;

export const isObject = (value) => {
    return value !== null && typeof value === "object";
};
export const hasChanged = (val, newValue) => {
    return !Object.is(val, newValue);
};
export const hasOwn = (val, key) =>
    Object.prototype.hasOwnProperty.call(val, key);
// add, add-foo -> addFoo
export const camelize = (str: string) => {
    // _:匹配到的整体, c : 匹配到()里的内容
    return str.replace(/-(\w)/g, (_, c: string) => {
        return c ? c.toUpperCase() : "";
    });
};

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
// + on
export const toHandlerKey = (str: string) => {
    return str ? "on" + capitalize(str) : "";
};
