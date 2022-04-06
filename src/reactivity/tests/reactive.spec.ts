import {isReactive, reactive} from '../reactive'
describe('reactive', () => {
    it('happy path', function () {
        const original = {foo:1}
        // 只传了original
        const observed = reactive(original)
        expect(observed).not.toBe(original)
        // 单纯触发track
        expect(observed.foo).toBe(1)
        //
        expect(isReactive(observed)).toBe(true);
        // 不触发get,value.xxx 返回false
        expect(isReactive(original)).toBe(false);
    });
})
