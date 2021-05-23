/*
 * @Author: FHSWar
 * @Date: 2021-05-17 19:56:15
 * @Last Edit Time: Do not edit
 */
function formatNumber(number) {
	let result = ''
	number = String(number)
	while (number.length > 3) {
		result = ',' + number.slice(-3) + result
		number = number.slice(0, number.length - 3)
	}
	if (number) result = number + result
	return result
}

console.log(formatNumber(123))    // 123,456
console.log(formatNumber(1234))    // 123,456
console.log(formatNumber(123456))    // 123,456