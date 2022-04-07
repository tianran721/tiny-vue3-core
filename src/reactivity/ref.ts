import {hasChanged, isObject} from "./index";
import {isTracking, trackEffects, triggerEffects} from "./effect";
import {reactive} from "./reactive";

// Impl implement
class RefImpl {
    private _value: any;
    // set容器
    public dep;
    private _rawValue: any;

    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }

    // get https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/get
    get value() {
        trackRefValue(this);
        return this._value;
    }

    // set https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/set
    set value(newValue) {
        if (hasChanged(this._rawValue, newValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.dep);
    }
}

export function ref(value) {
    return new RefImpl(value);
}
