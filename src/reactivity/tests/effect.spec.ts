import {reactive} from "../reactive";
import {effect} from "../effect";

describe('effect', () => {
    it('happy path', function () {
        const user = reactive({
            age: 10
        });
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        });
        expect(nextAge).toBe(11);
        // 触发set
        user.age++
        expect(nextAge).toBe(12);
    });

    it("should return runner when call effect", () => {
        let foo = 0;
        const runner = effect(() => {
            foo++;
            return foo;
        });
        expect(foo).toBe(1);
        runner();
        expect(foo).toBe(2);
        expect(runner()).toBe(3);
    });
    it("scheduler", () => {
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({ foo: 1 });
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();
        // 说明effect回调被调用
        expect(dummy).toBe(1);
        // set -> scheduler被调用
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);

        // 不变
        expect(dummy).toBe(1);
        run();
        expect(dummy).toBe(2);
    });
})
