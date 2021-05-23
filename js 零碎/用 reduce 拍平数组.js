/*
 * @Author: FHSWar
 * @Date: 2021-05-17 19:57:29
 * @Last Edit Time: Do not edit
 */
function flattenArray(arr) {
	const result = arr.reduce((prev, cur) => {
		return prev.concat(Array.isArray(cur) ? flattenArray(cur) : cur)
	}, [])
	return result
}
console.log(flattenArray([2, 3, [3, 5], [[2, 3, 4]]]))
// [2, 3, 3, 5, 2, 3, 4]