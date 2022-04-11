import { camelize, toHandlerKey } from "../shared/index";
// event : add / add-foo
export function emit(instance, event, ...args) {
    const { props } = instance;
    // add 变为 onAdd | add-foo
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}
