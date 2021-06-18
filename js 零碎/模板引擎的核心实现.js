/*
 * @Author: FHSWar
 * @Date: 2021-05-08 14:36:54
 * @Last Edit Time: Do not edit
 */
"use strict";
const data = {
	name: 'xiaoming',
	age: '18'
};
const template = "My name is {$name}, my age is {$age}"

function shenmegui(template, data) {
	let res = ''
	const shellReg = /\{\$[^\}]*\}/g
	const variableReg = /[^\$\{\}]/g
	for (const item of template.match(shellReg)) {
		const variable = item.match(variableReg).join('')
		res === ''
			? res = template.replace(item, data[variable])
			: res = res.replace(item, data[variable])
	}
	return res
}
console.log(shenmegui(template, data))