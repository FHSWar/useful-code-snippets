/*
 * @Author: FHSWar
 * @Date: 2021-05-09 07:57:09
 * @Last Edit Time: Do not edit
 */
function deepClone(obj, hash = new WeakMap()) {
	if (Object(obj) !== obj || obj instanceof Function) return obj;
	if (hash.has(obj)) return hash.get(obj);
	const result = new obj.constructor();
	// const result = Object.create(Object.getPrototypeOf(obj));
	hash.set(obj, result); // very very important
	return Object.assign(result, ...Object.keys(obj)
		.map(key => ({ [key]: deepClone(obj[key], hash) })));
}

const a = { aa: 1 }
const b = { bb: 1 }
a.c = b
b.d = a
const aaa = deepClone(a)
console.log(aaa) // { aa: 1, c: { bb: 1, d: [Circular] } }
console.log(a.c === aaa.c) // false
console.log(a === aaa) // false