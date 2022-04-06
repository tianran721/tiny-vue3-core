import {reactive} from "../reactive";
import {effect,stop} from "../effect";

describe('effect', () => {
    test('happy path', function () {
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
    test("scheduler", () => {
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


    test("stop", () => {
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        });

        obj.prop = 2;
        expect(dummy).toBe(2);
        // 调用stop后 => set 不更新
        stop(runner);
        // obj.prop = 3;

        obj.prop++
        expect(dummy).toBe(2);

        runner();
        expect(dummy).toBe(3);
    });

    test("onStop", () => {
        const obj = reactive({
            foo: 1,
        });
        const onStop = jest.fn(() => {
            console.log('onStop')
        });
        let dummy;
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            {
                onStop,
            }
        );
        // effect 可以接收onStop ,当调用stop时,回调onStop
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    });
})
