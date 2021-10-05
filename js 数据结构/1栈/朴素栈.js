/*
 * @Author: FHSWar
 * @Date: 2021-06-03 22:03:09
 * @Last Edit Time: Do not edit
 */
/* 栈的方法们
1. push(element(s))：添加一个（或几个）新元素到栈顶。
2. pop()：移除栈顶的元素，同时返回被移除的元素。
3. peek()：返回栈顶的元素，不对栈做任何修改（这个方法不会移除栈顶的元素，仅仅返
回它）。
4. isEmpty()：如果栈里没有任何元素就返回true，否则返回false。
5. clear()：移除栈里的所有元素。
6. size()：返回栈里的元素个数。这个方法和数组的length属性很类似。
*/
// 感觉没毛病, 但是想不出来怎么把方法们挪到 constructor 外面, 小蛋疼
class Stack {
	constructor() {
		let items = []
		this.push = (element) => items.push(element)
		this.pop = () => items.pop()
		this.peek = () => items[items.length - 1]
		this.isEmpty = () => items.length == 0
		this.size = () => items.length
		this.clear = () => items = []
		this.print = () => console.log(JSON.stringify(items))
	}
}
let stack = new Stack()
console.log(stack.isEmpty()) // true
stack.push(5)
stack.push(8)
console.log(stack.peek()) // 8
stack.push(11)
console.log(stack.size()) // 3
console.log(stack.isEmpty()) // false
stack.push(15)
stack.pop()
stack.pop()
console.log(stack.size()) // 2
stack.print() // [5,8]
console.log(stack)
/*
Stack {
  push: [Function],
  pop: [Function],
  peek: [Function],
  isEmpty: [Function],
  size: [Function],
  clear: [Function],
  print: [Function]
}
*/
const stack2 = new Stack()
console.log(stack === stack2) // false