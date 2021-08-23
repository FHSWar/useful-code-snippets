/*
 * @Author: FHSWar
 * @Date: 2021-05-17 19:57:29
 * @Last Edit Time: Do not edit
 */
// 专业
function flattenArray(arr) {
	const result = arr.reduce((prev, cur) => {
		return prev.concat(
			Array.isArray(cur)
				? flattenArray(cur)
				: cur
		)
	}, [])
	return result
}
console.log(flattenArray([2, 3, [3, 5], [[2, 3, 4]]]))
// [2, 3, 3, 5, 2, 3, 4]

const nestedArr = [1, [2, [3, [4]]]]
const nestObjArr = [{ a: 1 }, [{ a: 1 }, [{ a: 1 }, [{ a: 1 }]]]]

// 儿戏
// console.log([...nestedArr.join(',').split(',')])
// [ '1', '2', '3', '4' ] (靠，这也太儿戏了, 不过这个拍平不了对象数组)

// 方便但是体现不出水平
// console.log(nestObjArr.flat(Infinity))
// [ { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 } ] (flat 好)

function flatten(arr) {
	// 利用了 concat 既可以拼接数组也可以拼接值的特点
	// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
	while (arr.some(item => Array.isArray(item))) {
		console.log(...arr)
		arr = [].concat(...arr)
	}
	return arr
}
console.log(flatten(nestObjArr))