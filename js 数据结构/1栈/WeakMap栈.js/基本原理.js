/*
 * @Author: FHSWar
 * @Date: 2021-06-03 23:08:02
 * @Last Edit Time: Do not edit
 */
const items = new WeakMap(); //{1}
class Stack {
	constructor() {
		items.set(this, []); //{2}
	}
	push(element) { items.get(this).push(element) }// {3}
	pop() { return items.get(this).pop() }
	print() { console.log(JSON.stringify(items.get(this))) }
	//其他方法
}
const stack = new Stack()
stack.print() // []
stack.push(1)
stack.push(2)
stack.push(3)
stack.print() // [1,2,3]
stack.pop()
stack.pop()
stack.print() // [1]
const stack2 = new Stack()
console.log(stack === stack2) // false
stack2.print() // []	
console.log(items) // WeakMap { <items unknown> }