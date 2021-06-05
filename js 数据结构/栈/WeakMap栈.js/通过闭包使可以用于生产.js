/*
 * @Author: FHSWar
 * @Date: 2021-06-03 23:08:36
 * @Last Edit Time: Do not edit
 */
// 注意到现在在这里(立即执行函数之外)拿不到 items 了
let Stack = (function () {
	const items = new WeakMap();
	class Stack {
		// 每次 new 出来的对象在这个内部实现里面要通过 item.get(this) 才能拿到
		constructor() {
			items.set(this, []);
		}
		push(element) { return items.get(this).push(element) }// {3}
		pop() { return items.get(this).pop() }
		peek() { return items.get(this)[items.get(this).length - 1] }
		isEmpty() { return items.get(this).length == 0 }
		size() { return items.get(this).length }
		clear() { items.get(this).length = 0 }
		print() { console.log(JSON.stringify(items.get(this))) }
	}
	return Stack; //{5}
})();
// 试试 api 是否可用
const stack = new Stack()
stack.print() // []
console.log(stack.isEmpty())
stack.push(1)
stack.push(2)
stack.push(3)
console.log(stack.peek()) // 3
console.log(stack.size()) // 3
stack.print() // [1,2,3]
stack.pop()
stack.pop()
stack.print() // [1]
const stack2 = new Stack()
console.log(stack === stack2) // false
stack2.print() // []

// 应用, 手写一个 parseInt
function baseConverter(decNumber, base) {
	const remStack = new Stack(),
		digits = '0123456789ABCDEF'
	let baseString = '', rem
	while (decNumber > 0) {
		rem = Math.floor(decNumber % base);
		remStack.push(rem);
		decNumber = Math.floor(decNumber / base);
	}
	while (!remStack.isEmpty()) {
		baseString += digits[remStack.pop()]; // {7}
	}
	return baseString;
}
console.log(baseConverter(6, 10));