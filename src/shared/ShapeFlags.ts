export const enum ShapeFlags {
    // string
    ELEMENT = 1, // 0001
    // App
    STATEFUL_COMPONENT = 1 << 1, // 0010
    TEXT_CHILDREN = 1 << 2, // 0100
    ARRAY_CHILDREN = 1 << 3, // 1000
    SLOT_CHILDREN = 1 << 4, // 10000 16
}
// 位运算更高效


// | 两位都是0,才为0
// & 两位都是1 才是1

// 修改 -> |

// 0000
// 0001
// ----
// 0001

// 查找 -> &

// 0001
// 0001
// ----
// 0001
