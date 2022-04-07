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
        let original = { prop: 1 }
        const proxyObj = reactive(original);
        /*
        * effect调用后:
        *   1.new 了个实例,
        *   2.将fn挂到实例上
        *   3.调用run方法,回调fn
        *   4.返回run方法的引用 runner
        *   5.runner上挂载了实例
        * */
        const runner = effect(() => {
            // 1.触发 get 2. 触发track
            dummy = proxyObj.prop;
        });
        // 触发set ,从而触发trigger, 从而调用实例的run/scheduler , 从而调用fn
        proxyObj.prop = 2;
        expect(dummy).toBe(2);

        // 调用stop, 触发 实例 上的stop方法 -> 删除deps里set容器中的实例
        stop(runner);
        // TODO:

        //  proxyObj.prop++  等价于 proxyObj.prop = proxyObj.prop + 1 , 触发了get和set
        //  先触发 代理的get(第二次触发get)
        proxyObj.prop++
        // 测试未通过 得到3的 原因:  proxyObj.prop++ 先(重新)收集可依赖,又push了dep到实例的deps中,再触发依赖回调fn ,所有dummy为3
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
        // options 可以接收onStop ,当调用stop时, 不触发fn,但是会回调onStop
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    });
})
