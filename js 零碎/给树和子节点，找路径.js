/*
 * @Author: FHSWar
 * @Date: 2021-07-07 06:35:24
 * @Last Edit Time: Do not edit
 */
/*
 * @Author: FHSWar
 * @Date: 2021-05-14 06:40:50
 * @Last Edit Time: Do not edit
 */
'use strict';
/**
 * 要求：
 * 写一个函数，接收一个 id 值作为入参，输出从 obj 访问到该值的路径
 * 如 func(6) 应输出 [{id: 1, value: 'a'}, {id: 5, value: 'e'}, {id: 6, value: 'f'}]
 */
// 题解来自杨喆
function getParentIdList(list, id) {
	if (!list || !id) {
		return new Error("参数缺失");
	}
	let arr = [];
	let findParent = (currentLevel, targetId, parentId) => {
		for (const currentObj of currentLevel) {
			// 如果相等 按规定格式添加到 arr
			if (currentObj.id === targetId) {
				arr.unshift({
					id: currentObj.id,
					value: currentObj.value
				});
				// 这方法的第二个参是目标 id 没错,但在找到初始目标后还要找初始目标的直系先辈
				findParent(list, parentId)
			} else {
				// 很重要，不加这个的话路径有几个节点就完全遍历几遍整个 list，很低效
				if (targetId === undefined) break
				// 都没找到且有子集, 递归调用 findParent
				if (currentObj.children) {
					findParent(currentObj.children, targetId, currentObj.id)
				}
			}
		}
		return arr;
	}
	return findParent(list, id);
}

const arr = [
	{
		id: 1,
		value: 'a',
		children: [
			{ id: 2, value: 'b' },
			{ id: 3, value: 'c' },
			{ id: 4, value: 'd' },
			{
				id: 5, value: 'e', children: [
					{ id: 6, value: 'f' },
					{ id: 7, value: 'g' },
					{ id: 8, value: 'h' },
				]
			},
		]
	},
	{
		id: 9,
		value: 'i',
		children: [
			{ id: 10, value: 'j' },
			{ id: 11, value: 'k' },
			{ id: 12, value: 'l' },
			{
				id: 13, value: 'm', children: [
					{ id: 14, value: 'n' },
					{ id: 15, value: 'o' },
					{ id: 16, value: 'p' },
				]
			},
		]
	}
]

let res = getParentIdList(arr, 7);
console.log(res);

/*
function getPath(arr, id) {
	let path = []
	for (let i = 0; i < arr.length; i++) {
		if (arr[i]['id'] === id) {
			path = [{ id: arr[i]['id'], value: arr[i]['value'] }]
		} else {
			for (let j = 0; j < arr[i]['children'].length; j++) {
				if (arr[i]['children'][j].id === id) {
					path = [
						{ id: obj[i]['id'], value: arr[i]['value'] },
						{ id: arr[i]['children'][j]['id'], value: arr[i]['children'][j]['value'] }
					]
				} else {
					// console.log(obj[i]['children'][j]['children']);
					if (!arr[i]['children'][j]['children']) continue;
					for (let k = 0; k < arr[i]['children'][j]['children'].length; k++) {
						if (arr[i]['children'][j]['children'][k].id === id) {
							path = [
								{ id: arr[i]['id'], value: arr[i]['value'] },
								{ id: arr[i]['children'][j]['id'], value: arr[i]['children'][j]['value'] },
								{ id: arr[i]['children'][j]['children'][k]['id'], value: arr[i]['children'][j]['children'][k]['value'] }]
						}
					}
				}
			}
		}
	}
	return path
}
console.log(getPath(arr, 6))
*/
/*
let resArr = [];
let resFatherPath = {};
let resGrandpaPath = {};
function getPath(id, arr) {
	arr.forEach((item, index) => {
		// console.log(item);
		if (item.id === id) {
			// console.log(item.value);
			resArr.push({ id: item.id, value: item.value });
		}
		if (item.children && item.children instanceof Array) {
			resFatherPath = item;
			getPath(id, item.children);
			return (resGrandpaPath = arr[index]);
		}
	});
	return resArr;
}
let res = getPath(16, arr);
console.log(res);
console.log(resFatherPath);
console.log(resGrandpaPath);
*/
