/*
 * @Author: FHSWar
 * @Date: 2021-07-10 13:46:12
 * @Last Edit Time: Do not edit
 */
"use strcit";
// 这函数 tm 的神了!
function arrayToTree(list) {
	const map = {}, roots = [], len = list.length
	let node, i;
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
			roots.push(node);
		}
	}
	return roots;
}
var entries = [
	{
		"id": "12",
		"parentId": "0",
		"text": "Man",
		"level": "1",
		"children": null
	},
	{
		"id": "6",
		"parentId": "12",
		"text": "Boy",
		"level": "2",
		"children": null
	},
	{
		"id": "888",
		"parentId": "6",
		"text": "Boy",
		"level": "3",
		"children": null
	},
	{
		"id": "999",
		"parentId": "888",
		"text": "Gold",
		"level": "4",
		"children": null
	},
	{
		"id": "666",
		"parentId": "999",
		"text": "Diamond",
		// "level": "5",
		"children": null
	},
	{
		"id": "7",
		"parentId": "12",
		"text": "Other",
		"level": "2",
		"children": null
	},
	{
		"id": "9",
		"parentId": "0",
		"text": "Woman",
		"level": "1",
		"children": null
	},
	{
		"id": "11",
		"parentId": "9",
		"text": "Girl",
		"level": "2",
		"children": null
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