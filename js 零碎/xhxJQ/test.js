"use strict";

// let undefined = "fhs";
// console.log(undefined);

// function xhx() {}
// // xhx.prototype = { age: 22 };
// console.log(xhx.prototype.constructor === xhx);

// console.log(!("" && null && undefined && NaN && 0 && false)); // true
// console.log(!"" && !null && !undefined && !NaN && !0 && !false); // true

// let arr = [];
// arr.push(["x", "h", "x"]);
// console.log(arr); // [ [ 'x', 'h', 'x' ] ]

// 嚯, 这么这么酷!
// let obj = {};
// [].push.apply(obj, ["x", "h", "x"]);
// console.log(obj); // { '0': 'x', '1': 'h', '2': 'x', length: 3 }

// 伪数组数组给伪数组也能行, 秀的我头皮发麻
// let obj = {
// 	name: "xhx",
// };
// [].push.apply(obj, { 0: "x", 1: "h", 2: "x", length: 3 });
// console.log(obj); // { '0': 'x', '1': 'h', '2': 'x', name: 'xhx', length: 3 }

// this 指向问题
// function science() {
// 	console.log(this); // 没有 "use strict" 就指向 global, 有就指向 undefined
// }
// science();

// let arr = [];
// let obj = { 0: "x", 1: "h", 2: "x", name: "xhx", 5: "f", length: 3 };
// [].push.apply(arr, obj);
// console.log(arr); // [ 'x', 'h', 'x' ]

// 嚯, 多懂了一点 toString
// let arr = ["x", "h", "x"];
// let obj = { 0: "x", 1: "h", 2: "x", length: 3 };
// console.log({}.toString.apply(arr)); // [object Array]
// console.log(obj.toString()); // [object Object]

// let arr = [];
// let obj = ["x", "h", "x"];
// [].push.apply(arr, obj);
// console.log(arr); // [ 'x', 'h', 'x' ]

// console.log(!{}); // false
// console.log(1 || 2); // 1
// console.log({} || []); // {}

// let a = {};
// console.log(a.b || 1); // 1

// extend 的本质时利用 this
// function xhx() {}
// xhx.extend = function (obj) {
// 	for (let key in obj) {
// 		this[key] = obj[key];
// 	}
// };
// xhx.extend({
// 	tellAge: function () {
// 		console.log(22);
// 	},
// });
// xhx.tellAge();

// console.log(typeof function xhx() {}); // function

// function xhx() {}
// xhx.prototype = {
// 	init: function () {
// 		console.log(this === xhx); // false
// 	},
// };
// let Mousse = new xhx();
// Mousse.init();

// function xhx() {}
// xhx.prototype = {
// 	constructor: xhx,
// 	init: function () {
// 		return this === Mousse;
// 	},
// };
// let Mousse = new xhx();
// let illusion = new xhx();
// console.log(Mousse.init()); // true
// console.log(illusion.init()); // false

// function xhx() {}
// xhx.prototype = {
// 	constructor: xhx,
// 	init: function () {
// 		return this;
// 	},
// };
// let Mousse = new xhx();
// let illusion = new xhx();
// console.log(Mousse.init() === Mousse); // false
// console.log(illusion.init() === illusion); // false

// function createPerson(myName, myAge) {
// 	let obj = new Object();
// 	this = obj;
// 	obj.name = myName;
// 	obj.age = myAge;
// 	obj.say = {
// 		say: () => {
// 			console.log(this);
// 		},
// 	};
// 	return obj;
// }
// let fhs = createPerson("fhs", 23);
// fhs.say.say(); // SyntaxError: Invalid left-hand side in assignment

// let xhx = {
// 	age: 22,
// 	say: function () {
// 		console.log(this);
// 		console.log(this.age);
// 	},
// 	talk() {
// 		console.log(TouchList);
// 		console.log(this.age);
// 	},
// };
// xhx.say();
// // { age: 22, say: [Function: say], talk: [Function: talk] }
// // 22
// xhx.talk();
// // { age: 22, say: [Function: say], talk: [Function: talk] }
// // 22

// 所以函数套函数不靠谱
// function xhx() {
// 	console.log(22);
// 	function fhs() {
// 		console.log(23);
// 	}
// }
// fhs(); // 报错
// xhx(); // 22
// xhx.fhs(); // 报错

// try {
// 	console.log(1);
// } catch {
// 	console.log(2);
// }
// console.log(3);

// function fhs() {
// 	try {
// 		return (globalThis.n = { age: 23 });
// 	} finally {
// 		return (globalThis.n.age = 22);
// 	}
// }
// console.log(fhs()); // 22
// console.log(globalThis.n); // { age: 22 }

// let a = [];
// let b = new Array(3);
// console.log(a instanceof Array); // true
// console.log(b instanceof Array); // true
// console.log(a.length); // 0
// console.log(b.length); // 3

// function createPerson(myName, myAge) {
// 	let obj = new Object();
// 	obj.name = myName;
// 	obj.age = myAge;
// 	obj.say = {
// 		say: function () {
// 			console.log(this);
// 		},
// 	};
// 	return obj;
// }
// let fhs = createPerson("fhs", 23);
// console.log(fhs instanceof createPerson); // false

// function wula() {
// 	return new Promise((resolve, reject) => {
// 		throw new Error("不对劲");
// 	});
// }
// wula(); // 报错

// // Promise 里面的 error 得 catch 完手动 console.log 才行
// new Promise((resolve, reject) => {
// 	throw new Error("不对劲");
// })
// 	.then(console.log("ooo"))
// 	.catch((e) => console.log(`啊?\n${e}`));
// /*
// ooo
// 啊?Error: 不对劲
// */

// // 不用参接就不打印啦
// new Promise((resolve, reject) => {
// 	throw new Error("不对劲");
// })
// 	.then(console.log("ooo"))
// 	.catch(console.log(`啊?`));

// let a = new Promise((res, rej) => {
// 	res();
// });
// a.then(
// 	(res) => {
// 		throw new Error("olei");
// 	},
// 	(rej) => {
// 		console.log(rej);
// 	}
// );
// // UnhandledPromiseRejectionWarning: Error: olei

// let a = new Promise((res, rej) => {
// 	res();
// });
// a.then(
// 	(res) => {
// 		throw new Error("olei");
// 	},
// 	(rej) => {
// 		console.log(rej);
// 	}
// ).catch((e) => {
// 	console.log(e);
// });
// // Error: olei

