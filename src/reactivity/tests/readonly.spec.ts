import {isReadonly, readonly,isProxy} from "../reactive";
// readonly 和 reactive的区别是不能被set
describe("readonly", () => {
    it("should make nested values readonly", () => {
        const original = { foo: 1, bar: { baz: 2 } };
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(original)).toBe(false);
        expect(isReadonly(wrapped.bar)).toBe(true);
        expect(isReadonly(original.bar)).toBe(false);
        expect(isProxy(wrapped)).toBe(true);
        // readonly的get 正常返回结果
        expect(wrapped.foo).toBe(1);
    });

    it("should call console.warn when set", () => {
        console.warn = jest.fn();
        const user = readonly({
            age: 10,
        });
        // 表达式在等号左边 ,只会触发proxy 的set
        user.age = 11;
        expect(console.warn).toHaveBeenCalled();
    });
});
