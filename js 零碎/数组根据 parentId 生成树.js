/*
 * @Author: FHSWar
 * @Date: 2021-07-10 13:46:12
 * @Last Edit Time: Do not edit
 */
"use strcit";
// 这函数 tm 的神了!
function arrayToTree(list) {
	const roots = [], map = {}, len = list.length
	let node, i;
	// 这个 for 完就得到 map = {id: idItem,...}
	for (i = 0; i < len; i++) {
		map[list[i].id] = i; // initialize the map
		list[i].children = []; // initialize the children
	}

	for (i = 0; i < len; i++) {
		node = list[i];
		if (node.parentId !== "0") {
			// if you have dangling branches check that map[node.parentId] exists
			list[map[node.parentId]].children.push(node);
		} else {
			// parentId 为零就在第一层
			roots.push(node);
		}
	}
	return roots;
}

// 精修版本 (搞懂了为什么有 break 会少一些迭代次数，因为第一次没 pId --2021/08/05)
function getPath(arr, id) {
	const res = []
	// let i = 0
	const handler = function (curLayer, curId, pId) {
		console.log(curId, pId)
		for (const item of curLayer) {
			if (item.id === curId) {
				res.unshift({ id: item.id, value: item.value })
				if (!pId) break
				handler(arr, pId)
			} else {
				// if (curId === undefined) break // 这和上面的 break 效果一致
				// console.log(i++)
				item.children && Array.isArray(item.children)
					? handler(item.children, curId, item.id)
					: null
			}
		}
		return res
	}
	return handler(arr, id)
}
var entries = [
	{
		"id": "12",
		"parentId": "0",
		"text": "Man",
		"level": "1",
	},
	{
		"id": "6",
		"parentId": "12",
		"text": "Boy",
		"level": "2",
	},
	{
		"id": "888",
		"parentId": "6",
		"text": "Boy",
		"level": "3",
		// "children": null
	},
	{
		"id": "999",
		"parentId": "888",
		"text": "Gold",
		// "level": "4",
	},
	{
		"id": "666",
		"parentId": "999",
		"text": "Diamond",
		// "level": "5",
	},
	{
		"id": "7",
		"parentId": "12",
		"text": "Other",
		"level": "2",
	},
	{
		"id": "9",
		"parentId": "0",
		"text": "Woman",
		"level": "1",
	},
	{
		"id": "11",
		"parentId": "9",
		"text": "Girl",
		"level": "2",
	}
];

console.log(JSON.stringify(arrayToTree(entries), null, 2));

const res = [
	{
		"id": "12",
		"parentId": "0",
		"text": "Man",
		"level": "1",
		"children": [
			{
				"id": "6",
				"parentId": "12",
				"text": "Boy",
				"level": "2",
				"children": [
					{
						"id": "888",
						"parentId": "6",
						"text": "Boy",
						"level": "3",
						"children": [
							{
								"id": "999",
								"parentId": "888",
								"text": "Gold",
								"level": "4",
								"children": [
									{
										"id": "666",
										"parentId": "999",
										"text": "Diamond",
										"children": []
									}
								]
							}
						]
					}
				]
			},
			{
				"id": "7",
				"parentId": "12",
				"text": "Other",
				"level": "2",
				"children": []
			}
		]
	},
	{
		"id": "9",
		"parentId": "0",
		"text": "Woman",
		"level": "1",
		"children": [
			{
				"id": "11",
				"parentId": "9",
				"text": "Girl",
				"level": "2",
				"children": []
			}
		]
	}
]