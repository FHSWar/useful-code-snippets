/*
 * @Author: FHSWar
 * @Date: 2021-06-13 19:45:05
 * @Last Edit Time: Do not edit
 */
let Queue = (function () {
	const items = new WeakMap()
	class Queue {
		constructor() {
			// 这里一个 items 能存所有的 queue 实例
			items.set(this, []) // items.get(this) 就是拿到相应的队列
		}
		enqueue(element) {
			items.get(this).push(element)
		}
		dequeue() {
			return items.get(this).shift()
		}
		front() {
			return items.get(this)[0]
		}
		isEmpty() {
			return items.get(this).length === 0
		}
		size() {
			return items.get(this).length
		}
		print() {
			console.log(JSON.stringify(items.get(this)))
		}
	}
	return Queue
})()
let queue = new Queue()
console.log(queue.isEmpty()) // true
queue.enqueue("John")
queue.enqueue("Jack")
queue.enqueue("Camila")
queue.print() // ["John","Jack","Camila"]
console.log(queue.size()) // 3
console.log(queue.isEmpty()) // false
queue.dequeue()
queue.dequeue()
queue.print() // ["Camila"]