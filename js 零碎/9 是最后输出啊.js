/*
 * @Author: FHSWar
 * @Date: 2021-05-18 21:34:26
 * @Last Edit Time: Do not edit
 */
console.log(1)
setTimeout(() => {
	console.log(3)
}, 0)
new Promise(resolve => {
	console.log(4)
	resolve(5)
	console.log(6)
}).then(async (data) => {
	console.log(7)
	await new Promise(resolev => {
		setTimeout(() => {
			console.log(8);
			resolev();
		}, 0);
	})
	console.log(9)
})
console.log(2)
// 1 4 6 2 7 3 8 9