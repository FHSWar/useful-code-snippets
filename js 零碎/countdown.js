/*
 * @Author: FHSWar
 * @Date: 2021-06-03 10:46:14
 * @Last Edit Time: Do not edit
 */
const countDown = function (times) {
	if (!times || isNaN(parseInt(times))) return;
	console.log(times)
	setTimeout(() => { countDown.call(this, times--) }, 1000);
};
countDown(15)