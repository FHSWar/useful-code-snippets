/*
 * @Author: FHSWar
 * @Date: 2021-05-09 07:18:47
 * @Last Edit Time: Do not edit
 */
// https://stackoverflow.com/questions/40291987/javascript-deep-clone-object-with-circular-references
// stack overflow 是真正的黑魔法!
function deepClone(obj, hash = new WeakMap()) {
	// Do not try to clone primitives or functions
	if (Object(obj) !== obj || obj instanceof Function) return obj;
	if (hash.has(obj)) return hash.get(obj); // Cyclic reference
	try { // Try to run constructor (without arguments, as we don't know them)
		var result = new obj.constructor();
	} catch (e) { // Constructor failed, create object without running the constructor
		// 其实普通对象也能用这个， 大概作者认为 new 的效率比这个高一些吧
		result = Object.create(Object.getPrototypeOf(obj));
	}
	// Optional: support for some standard constructors (extend as desired)
	if (obj instanceof Map)
		Array.from(obj, ([key, val]) => result.set(deepClone(key, hash),
			deepClone(val, hash)));
	else if (obj instanceof Set)
		Array.from(obj, (key) => result.add(deepClone(key, hash)));
	// Register in hash    
	hash.set(obj, result);
	// Clone and assign enumerable own properties recursively
	return Object.assign(result, ...Object.keys(obj)
		.map(key => ({ [key]: deepClone(obj[key], hash) })));
}
// 演示
const a = { aa: 1 }
const b = { bb: 1 }
a.c = b
b.d = a
const aaa = deepClone(a)
console.log(aaa) // { aa: 1, c: { bb: 1, d: [Circular] } }
console.log(a.c === aaa.c) // false
console.log(a === aaa) // false

// 解释
// 构造函数直接运行也返东西
console.log(Object()) // {}
console.log(Function()) // [Function: anonymous]
console.log(Array()) // []

// __proto__ 和 getPrototypeOf 效果是相同
const obj = {}
console.log(obj.__proto__ === Object.getPrototypeOf(obj)) // true

// 为什么 try...catch
const map = new Map()
console.log(map.constructor()) // TypeError: Constructor Map requires 'new'

// Map 的 Array.from() 为什么那样
const map = new Map()
map.set('a', 1)
map.set('b', 2)
map.set('c', 3)
console.log(map)
Array.from(map, ([key, val]) => console.log(key, val))
/*
Map { 'a' => 1, 'b' => 2, 'c' => 3 }
a 1
b 2
c 3
[ undefined, undefined, undefined ]
*/

// 为什么 .map() 最后的对象里的 key 要包中括号: 不包就变成字符串 'key' 