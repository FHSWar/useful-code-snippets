/*
 * @Author: FHSWar
 * @Date: 2021-06-11 07:02:27
 * @Last Edit Time: Do not edit
 */
/* 队列中可用的方法
1. enqueue(element(s))：向队列尾部添加一个（或多个）新的项。
2. dequeue()：移除队列的第一（即排在队列最前面的）项，并返回被移除的元素。
3. front()：返回队列中第一个元素——最先被添加，也将是最先被移除的元素。
	队列不做任何变动（不移除元素，只返回元素信息——与Stack类的peek方法非常类似）。
4. isEmpty()：如果队列中不包含任何元素，返回true，否则返回false。
5. size()：返回队列包含的元素个数，与数组的length属性类似。
*/
// 这里一个 items 就是一个队列实例
function Queue() {
	let items = []
	this.enqueue = function (element) {
		items.push(element)
	}
	this.dequeue = function () {
		return items.shift()
	}
	this.front = function () {
		return items[0]
	}
	this.isEmpty = function () {
		return items.length === 0
	}
	this.size = function () {
		return items.length
	}
	this.print = function () {
		console.log(JSON.stringify(items))
	}
}
// let queue = new Queue()
// console.log(queue.isEmpty()) // true
// queue.enqueue("John")
// queue.enqueue("Jack")
// queue.enqueue("Camila")
// queue.print() // ["John","Jack","Camila"]
// console.log(queue.size()) // 3
// console.log(queue.isEmpty()) // false
// queue.dequeue()
// queue.dequeue()
// queue.print() // ["Camila"]

// 循环队列的栗子 (第二个参数是说一轮能传几个人的意思, 这就没有策略可言了, 结局在开始时就定下来了)
function hotPotato(nameList, num) {
	let queue = new Queue()
	// 接受一个清单, 全部 for 进队列里
	for (let i = 0; i < nameList.length; i++) {
		queue.enqueue(nameList[i])
	}
	let eliminated = ''
	while (queue.size() > 1) {
		// 把队头的元素出列, 推到队尾
		for (let i = 0; i < num; i++) {
			queue.enqueue(queue.dequeue())
		}
		eliminated = queue.dequeue()
		console.log(eliminated + '在击鼓传花游戏中被淘汰。')
	}
	// 到这里
	return queue.dequeue()
}
let names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl']
let winner = hotPotato(names, 1)
console.log('The winner is: ' + winner)
/*
Jack在击鼓传花游戏中被淘汰。
Ingrid在击鼓传花游戏中被淘汰。
John在击鼓传花游戏中被淘汰。
Carl在击鼓传花游戏中被淘汰。
The winner is: Camila
*/