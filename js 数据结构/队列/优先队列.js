/*
 * @Author: FHSWar
 * @Date: 2021-06-13 20:06:04
 * @Last Edit Time: Do not edit
 */
/* 跟队列的区别
1. 在优先级相同时先进先出
2. 优先级高的一定在优先级低的前面
*/
let PriorityQueue = (function () {
	const items = new WeakMap()
	class QueueElement {
		constructor(element, priority) {
			this.element = element;
			this.priority = priority;
		}
	}
	class PriorityQueue {
		constructor() {
			// 这里一个 items 能存所有的 PriorityQueue 实例
			items.set(this, [])
		}
		enqueue(element, priority) {
			// 这里队列里实际推入的是 QueueElement 的实例对象
			let queueElement = new QueueElement(element, priority);
			let added = false;
			for (let i = 0; i < items.length; i++) {
				// 如果新推入的元素优先级小于当前元素, 就插在紧挨着的当前元素后面
				// 注意到新推入的元素前面的一定都是优先级大于新推入元素的(没有等于)
				if (queueElement.priority < items.get(this)[i].priority) {
					items.get(this).splice(i, 0, queueElement)
					added = true
					break
				}
			}
			// 优先级搞得一定在前面, 到这里一定是推入队列的末端
			if (!added) {
				items.get(this).push(queueElement)
			}
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
			for (let i = 0; i < items.get(this).length; i++) {
				console.log(
					`${items.get(this)[i].element} - ${items.get(this)[i].priority}`
				);
			}
		}
	}
	return PriorityQueue
})()
let priorityQueue = new PriorityQueue();
priorityQueue.enqueue("John", 2);
priorityQueue.enqueue("Jack", 1);
priorityQueue.enqueue("Camila", 1);
priorityQueue.print();
/*
John - 2
Jack - 1
Camila - 1
*/