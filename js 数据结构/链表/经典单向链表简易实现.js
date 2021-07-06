/*
 * @Author: FHSWar
 * @Date: 2021-07-05 06:24:49
 * @Last Edit Time: Do not edit
 */
/* 接口定义
append 向列表尾部添加一个新的项
insert 向列表的特定位置插入一个新的项
remove 从列表中移除一项
indexOf 返回元素在列表中的索引。如果列表中没有该元素则返回-1
removeAt 从列表的特定位置移除一项
isEmpty 如果链表中不包含任何元素，返回true，如果链表长度大于0则返回false
size 返回链表包含的元素个数。与数组的length属性类似
toString 重写继承自JavaScript对象默认的toString方法，让其只输出元素的值
*/
function LinkedList() {
	let Node = function (element) {
		this.element = element
		this.next = null
	};
	let length = 0
	let head = null
	this.append = function (element) {
		let node = new Node(element), current
		if (head === null) {
			head = node
		} else {
			current = head
			while (current.next) { current = current.next }
			current.next = node
		}
		length++
	}
	this.insert = function (position, element) {
		if (position >= 0 && position <= length) {
			let node = new Node(element),
				current = head,
				previous,
				index = 0
			// 在第一个位置添加
			if (position === 0) {
				current = position.next
				head = node
			} else {
				// 遍历到指定 position 位置，插进去
				while (index++ < position) {
					previous = current
					current = current.next
				}
				node.next = current
				previous.next = node
			}
			// 更新长度列表
			length++
			// 成功插入就返回 true
			return true
		} else {
			return false
		}
	}
	this.indexOf = function (element) {
		let current = head,
			index = -1
		while (current) {
			// 进到 while 就要维护 index，书上这里错了
			index++
			if (element === current.element) {
				return index
			}
			current = current.next
		}
		return -1
	}
	this.remove = function (element) {
		let index = this.indexOf(element)
		console.log(index)
		return this.removeAt(index)
	}
	this.removeAt = function (position) {
		// 检查越界值
		if (position > -1 && position < length) {
			let current = head,
				previous,
				index = 0
			//移除第一项
			if (position === 0) {
				head = current.next
			} else {
				while (index++ < position) {
					previous = current
					current = current.next
				}
				//将previous与current的下一项链接起来：跳过current，从而移除它
				previous.next = current.next
				length--
				return current.element
			}
		} else {
			return null
		}

	}
	this.isEmpty = function () {
		return length === 0
	}
	this.size = function () {
		return length
	}
	this.getHead = function () {
		return head
	}
	this.toString = function () {
		let current = head
		string = ''
		while (current) {
			string += current.element + (current.next ? 'n' : '')
			current = current.next
		}
		return string
	}
	this.print = function () {
		return JSON.stringify(this.getHead(), null, 4)
	}
}

let list = new LinkedList();
list.append(15);
list.append(10);
list.append(5);
list.append(0);
list.append(-5);
list.append(-10);
const head = list.getHead()
console.log(head)
console.log(list.print())