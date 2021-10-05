// 1. 闭包
(function (window, undefined) {
	// 淦! 这个放末尾会报错, 哦哦, 未声明不能使用嗷
	let xhxQuery = function (selector) {
		return new xhxQuery.prototype.init(selector);
	};
	/*
    2. 由原型链的知识: 改动函数的 prototype 属性会导致
        prototype.constructor 不再指向函数本身,
        所以要手动建立指向关系
        */
	// 注意到这里就是一个普通对象, 并没有用到 class 这个关键字
	xhxQuery.prototype = {
		constructor: xhxQuery,
		init: function (selector) {
			// 空内容处理
			if (!selector) {
				// 入参取反为真的话, 就返回空的 jq 对象
				return this;
			} else if (xhxQuery.isString(selector)) {
				// 拙劣但可用的判断
				if (xhxQuery.isHTML(selector.trim())) {
					let temp = document.createElement("div");
					// 这个遇到标签会创建 DOM 元素
					temp.innerHTML = selector;
					// DOM 元素有 children 属性的
					// for (let i = 0; i < temp.children.length; i++){
					// 	  // 一行可以没花括号, 所以 this 里并没有 temp 的 div
					//    this[i] = temp.children[i];
					// }
					// this.length = temp.children.length;
					[].push.apply(this, temp.children);
					// return this;
				} else {
					let res = document.querySelectorAll(selector);
					// for (let i = 0; i < res.length; i++) this[i] = res[i];
					// this.length = res.length;
					// return this;
					[].push.apply(this, res);
				}
			} else if (xhxQuery.isFunction(selector)) {
				// 函数处理
				xhxQuery.ready(selector);
			} else if (xhxQuery.isArray(selector)) {
				// 数组, 类数组处理
				// 不是数组的伪数组也能包装作对象
				// 无论是数组还是伪数组, 进来就是转成真数组并添加到对象上
				[].push.apply(this, selector);
			} else {
				// 不加这个 eq 方法将只会返回空对象, 毕竟数字不属于上述任何一种
				this[0] = selector;
				this.length = 1;
			}
			return this;
		},
		jquery: "1.0.0",
		selector: "",
		length: 0,
		// [].push找到数组的push方法, 冒号前面的push将来由xhxQuery对象调用, 相当于 [].push.apply(this);
		push: [].push,
		sort: [].sort,
		splice: [].splice,
		toArray: function () {
			return [].slice.call(this);
		},
		// 这里假定调用者只会传数字进来
		get: function (num) {
			if (num >= 0) {
				return this[num];
			} else if (arguments.length === 0) {
				return this.toArray();
			} else {
				return this[this.length + num];
			}
		},
		eq: function (num) {
			// 没有传递参数
			if (arguments.length === 0) {
				return new xhxQuery();
			} else {
				return xhxQuery(this.get(num));
			}
		},
		first: function () {
			return this.eq(0);
		},
		last: function () {
			return this.eq(-1);
		},
		each: function (fn) {
			xhxQuery.each(this, fn)
		}
	};

	// 巧妙利用 this, 函数调就添加为静态方法, 对象调用就添加为实例方法
	xhxQuery.extend = xhxQuery.prototype.extend = function (obj) {
		for (let key in obj) {
			this[key] = obj[key];
		}
	};
	// 各种判断, 遍历, 钩子
	xhxQuery.extend({
		isString: (str) => typeof str === "string",
		isHTML: (str) => {
			return str.charAt(0) === "<" &&
				str.charAt(str.length - 1) === ">" &&
				str.length >= 3
				? true
				: false;
		},
		isObject: (selector) => typeof selector === "object",
		isWindow: (selector) => selector === window,
		isArray: (selector) => {
			if (
				xhxQuery.isObject(selector) &&
				!xhxQuery.isWindow(selector) &&
				"length" in selector
			) {
				return true;
			}
			return false;
		},
		isFunction: (selector) => typeof selector === "function", // 只有一个语句时, 可以省掉花括号和 return (一定要一起省掉)
		ready: (fn) =>
			document.addEventListener("DOMContentLoaded", function () {
				fn();
			}),
		each: (obj, fn) => {
			if (xhxQuery.isArray(obj)) {
				for (let i = 0; i < obj.length; i++) {
					// let res = fn(i, obj[i]);
					let res = fn.call(obj[i], i, obj[i]); // 这也是 jq 特性, 改了 this 指向
					if (res === true) {
						continue;
					} else if (res === false) {
						break;
					}
				}
			} else if (xhxQuery.isObject(obj)) {
				for (let key in obj) {
					// let res = fn(key, obj[key]);
					let res = fn.call(obj[key], key, obj[key]); // 这也是 jq 特性, 改了 this 指向
					if (res === true) {
						continue;
					} else if (res === false) {
						break;
					}
				}
			}
		},
		map: (obj, fn) => {
			let res = [];
			if (xhxQuery.isArray(obj)) {
				for (let i = 0; i < obj.length; i++) {
					let temp = fn(obj[i], i);
					if (temp) res.push(temp);
				}
			} else if (xhxQuery.isObject(obj)) {
				for (let key in obj) {
					let temp = fn(obj[key], key);
					if (temp) res.push(temp);
				}
			}
			return res;
		},
		// 芜湖
		get_nextsibling: function (n) {
            let x = n.nextSibling;
            while (x != null && x.nodeType!=1){
                x=x.nextSibling;
            }
            return x;
        },
        get_previoussibling: function (n) {
            let x=n.previousSibling;
            while (x != null && x.nodeType!=1){
                x=x.previousSibling;
            }
            return x;
        },
		getStyle: function (dom, styleName) {
			// 做兼容性处理
            if(window.getComputedStyle){
                return window.getComputedStyle(dom)[styleName];
			} else {
				// IE 8 得用这个
                return dom.currentStyle[styleName];
            }
        },
        addEvent: function(dom, name, callBack) {
            if(dom.addEventListener){
                dom.addEventListener(name, callBack);
			} else {
				// 照顾 IE 8
                dom.attachEvent("on"+name, callBack);
            }
        }
	});
	// 这个和 xhxQuery.extend 是一样的嗷, 提醒一下愚蠢的自己
	// DOM 操作相关方法
	xhxQuery.prototype.extend({
		// empty 这儿不能用箭头函数嗷, 不然 this 指向就不对了
		empty: function () {
			// 遍历合法元素对齐内容做置空操作
			this.each((_, value) => {
				value.innerHTML = "";
			})
			// 这里 return this 是为了方便链式编程
			return this;
		},
		// 跟 empty 类似, 不过有个注意点: js 中元素没法儿自己删自己
		remove: function (selector) {
			// 如果没传参, 直接就是 选择器.remove(), 也就是移除指定选择器
			if (arguments.length === 0) {
				this.each((_, value) => {
					const parent = value.parentNode;
					parent.removeChild(value);
				});
				// 有传参就要删除参数与选择器的交集部分, 即 选择器.remove(参数选择器)
			} else {
				// 1. 根据传入的参数选择器找到对应的元素
				$(selector).each((_, value) => {
					// 2. 遍历找到的元素, 获取对应的类型
					let typeOfSelector = value.tagName;
					// 3. 遍历指定的元素
					this.each((_, value2) => {
						// 4. 获取指定元素的类型
						let typeOfCaller = value2.tagName;
						// 5. 判断找到元素的类型和指定元素的类型
						if (typeOfCaller === typeOfSelector) {
							const parent = value.parentNode;
							// 不判空也有功能但是控制台会输出错误 (2021-02-10)
							parent && parent.removeChild(value);
						}
					})
				})
			}
			return this;
		},
		html: function (content) {
			if (arguments.length === 0) {
				// 不传参就返回找到的对象数组中的第一个
				return this[0].innerHTML;
			} else {
				this.each((_, value) => {
					value.innerHTML = content;
				})
			}
		},
		text: function (content) {
			if (arguments.length === 0) {
				// 不传参就取出找到的DOM对象的内容, 全部返回
				let res = "";
				this.each((_, value) => {
					// 这个 innerText 是返回节点及其子节点的文本内容
					res += value.innerText;
				})
				return res
			} else {
				// 如果传参, 就将 DOM 节点内容全部替换成自定内容 
				// (innerHTML 和 innerText 的区别在于是否解析 html, 现在我很清楚, 这是写给以后的我看的)
				this.each((_, value) => {
					value.innerText = content;
				})
			}
		},
		appendTo: function (selector) {
			// 1. 统一转为对象
			// (append 可以接收字符串, DOM 对象和伪数组, 这里通过让核心函数处理可以统一转为 jq 对象)	
			const $target = $(selector);
			const $this = $(this);
			let res = [];		
			// 1. 遍历取出所有指定的元素
			$.each($target, function (key, targetElement) {
				// 2. 遍历取出所有的元素
				$this.each(function (_, sourceElement) {
					// 3. 判断当前是否是第 0 个指定的元素
					if (key === 0) {
						// 如果是第一个, 直接添加
						targetElement.appendChild(sourceElement);
						res.push(sourceElement);
					} else {
						// 如果不是第一个了, 先拷贝再添加 (不然的话就是一个 DOM 挪来挪去, 不好)
						const temp = sourceElement.cloneNode(true);
						targetElement.appendChild(temp);
						res.push(temp);
					}
				});
			});
			// 3.返回所有添加的元素
			return $(res);
		},
		// 和 appendTo 大部分代码一致
		prependTo: function (selector) {
			const $target = $(selector);
			const $this = $(this);
			let res = [];		
			$.each($target, function (key, targetElement) {
				$this.each(function (_, sourceElement) {
					if (key === 0) {
						/* let insertedNode = parentNode.insertBefore(newNode, referenceNode);
							insertedNode 被插入节点(newNode)
							parentNode 新插入节点的父节点
							newNode 用于插入的节点
							referenceNode newNode 将要插在这个节点之前
						 */
						targetElement.insertBefore(sourceElement, targetElement.firstChild);
						res.push(sourceElement);
					} else {
						const temp = sourceElement.cloneNode(true);
						targetElement.insertBefore(temp, targetElement.firstChild);
						res.push(temp);
					}
				});
			});
			return $(res);
		},
		// 这个的实现我觉得不理想 
		append: function (selector) {
			// 判断传入的参数是否是字符串 (是的话直接拼接就完事儿)
			if (xhxQuery.isString(selector)) {
				// 从这里就知道只处理了 jq 对象中第一个, 想都添加就遍历操作咯
				/* this.innerHTML += selector;
				这样只能在第一个 div 的屁股后面添加字符串 p
				$("div").append("p");
				*/
				/* 这样又能每个 div 后面都添加 (因为这里不是字符串从而直接调了 appendTo 啊)
				let divs = document.querySelectorAll("div");
				let ps = document.querySelectorAll("p");
				$(divs).append(ps);
				*/
				// 这个就没问题
				for (const key in this) {
					this[key].innerHTML += selector;
				}
			} else {
				$(selector).appendTo(this);
			}
			return this; // 仿效原生 jq 的返回内容
		},
		prepend: function (selector) {
			// 判断传入的参数是否是字符串 (是的话直接拼接就完事儿)
			if (xhxQuery.isString(selector)) {
				for (const key in this) {
					this[key].innerHTML = selector + this[key].innerHTML; // 掉个个儿
				}
			} else {
				$(selector).prependTo(this);
			}
			return this; // 仿效原生 jq 的返回内容
		},
		// 几乎就是 prependTo 的翻版, 区别点是一点点关于节点的处理
		insertBefore: function (selector) {
			const $target = $(selector);
			const $this = $(this);
			let res = [];		
			$.each($target, function (key, targetElement) {
				// 拿到目标元素的爸爸
				const parent = targetElement.parentNode;
				$this.each(function (_, sourceElement) {
					if (key === 0) {
						/* let insertedNode = parentNode.insertBefore(newNode, referenceNode);
							insertedNode 被插入节点(newNode)
							parentNode 新插入节点的父节点
							newNode 用于插入的节点
							referenceNode newNode 将要插在这个节点之前
						 */
						// 添加操作由目标元素的爸爸来发起
						parent.insertBefore(sourceElement, targetElement);
						res.push(sourceElement);
					} else {
						const temp = sourceElement.cloneNode(true);
						// 添加操作由目标元素的爸爸来发起
						parent.insertBefore(temp, targetElement);
						res.push(temp);
					}
				});
			});
			return $(res);
		},
		insertAfter: function (sele) {
            // 1.统一的将传入的数据转换为jQuery对象
            let $target = $(sele);
            const $this = this;
            let res = [];
            // 2.遍历取出所有指定的元素
            $.each($target, function (key, value) {
                let parent = value.parentNode;
                let nextNode = $.get_nextsibling(value);
                // 2.遍历取出所有的元素
                $this.each(function (_, v) {
                    // 3.判断当前是否是第0个指定的元素
                    if(key === 0){
                        // 直接添加
                        parent.insertBefore(v, nextNode);
                        res.push(v);
                    }else{
                        // 先拷贝再添加
                        let temp = v.cloneNode(true);
                        parent.insertBefore(temp, nextNode);
                        res.push(temp);
                    }
                });
            });
            // 3.返回所有添加的元素
            return $(res);
        },
		// 几乎是 insertBefore 的翻版, 区别点是一点点关于节点的处理
		replaceAll: function (selector) {
			const $target = $(selector);
			const $this = $(this);
			let res = [];		
			$.each($target, function (key, targetElement) {
				const parent = targetElement.parentNode;
				$this.each(function (_, sourceElement) {
					if (key === 0) {
						parent.insertBefore(sourceElement, targetElement);
						res.push(sourceElement);
						// 把源元素放在目标元素的前面
						$(sourceElement).insertBefore(targetElement);
						// 移除目标元素, 就好了
						$(targetElement).remove()
					} else {
						const temp = sourceElement.cloneNode(true);
						// 这里也是做同样目的改动
						$(temp).insertBefore(targetElement);
						$(targetElement).remove()
						res.push(temp);
					}
				});
			});
			return $(res);
		}
	})
	// 筛选相关方法
	xhxQuery.prototype.extend({
        next: function (sele) {
            let res = [];
            if(arguments.length === 0){
                // 返回所有找到的
                this.each(function (_, value) {
                    let temp = xhxQuery.get_nextsibling(value);
                    if(temp != null){
                        res.push(temp);
                    }
                });
            }else{
                // 返回指定找到的
                this.each(function (_, value) {
                    let temp = xhxQuery.get_nextsibling(value)
                    $(sele).each(function (_, v) {
                        if(v == null || v !== temp) return true;
                        res.push(v);
                    });
                });
            }
            return $(res);
        },
        prev: function (sele) {
            let res = [];
            if(arguments.length === 0){
                this.each(function (_, value) {
                    let temp = xhxQuery.get_previoussibling(value);
                    if(temp == null) return true;
                    res.push(temp);
                });
            }else{
                this.each(function (_, value) {
                    let temp = xhxQuery.get_previoussibling(value);
                    $(sele).each(function (_, v) {
                        if(v == null || temp !== v) return true;
                        res.push(v);
                    })
                });
            }
            return $(res);
        }
    });
	// 属性操作相关的方法
	xhxQuery.prototype.extend({
		attr: function (attr, value) {
			// 1.判断是否是字符串
			if(xhxQuery.isString(attr)){
				// 判断是一个字符串还是两个字符串
				if(arguments.length === 1){
					return this[0].getAttribute(attr);
				}else{
					this.each(function (_, element) {
						element.setAttribute(attr, value);
					});
				}
			}
			// 2.判断是否是对象
			else if(xhxQuery.isObject(attr)){
				let $this = this;
				// 遍历取出所有属性节点的名称和对应的值
				$.each(attr, function (key, value) {
					// 遍历取出所有的元素
					$this.each(function (_, element) {
						element.setAttribute(key, value);
					});
				});
			}
			return this;
		},
		prop: function (attr, value) {
			// 1.判断是否是字符串
			if(xhxQuery.isString(attr)){
				// 判断是一个字符串还是两个字符串
				if(arguments.length === 1){
					return this[0][attr];
				}else{
					this.each(function (_, element) {
						element[attr] = value;
					});
				}
			}
			// 2.判断是否是对象
			else if(xhxQuery.isObject(attr)){
				let $this = this;
				// 遍历取出所有属性节点的名称和对应的值
				$.each(attr, function (key, value) {
					// 遍历取出所有的元素
					$this.each(function (_, element) {
						element[key] = value;
					});
				});
			}
			return this;
		},
		css: function (attr, value) {
			// 1.判断是否是字符串
			if(xhxQuery.isString(attr)){
				// 判断是一个字符串还是两个字符串
				if(arguments.length === 1){
					return xhxQuery.getStyle(this[0], attr);
				}else{
					this.each(function (_, element) {
						element.style[attr] = value;
					});
				}
			}
			// 2.判断是否是对象
			else if(xhxQuery.isObject(attr)){
				let $this = this;
				// 遍历取出所有属性节点的名称和对应的值
				$.each(attr, function (key, value) {
					// 遍历取出所有的元素
					$this.each(function (_, element) {
						element.style[key] = value;
					});
				});
			}
			return this;
		},
		val: function (content) {
			if(arguments.length === 0){
				return this[0].value;
			}else{
				this.each(function (_, element) {
					element.value = content;
				});
				return this;
			}
		},
		// 对空字符串的利用很有趣
		hasClass: function (name) {
			let flag = false;
			if(arguments.length === 0){
				return flag;
			}else{
				this.each(function (_, element) {
					// 1.获取元素中class保存的值
					let className = " "+element.className+" ";
					// 2.给指定字符串的前后也加上空格
					name = " "+name+" ";
					// 3.通过indexOf判断是否包含指定的字符串
					if(className.indexOf(name) != -1){
						flag = true;
						return false;
					}
				});
				return flag;
			}
		},
		addClass: function (name) {
			if(arguments.length === 0) return this;

			// 1.对传入的类名进行切割
			let names = name.split(" ");
			// 2.遍历取出所有的元素
			this.each(function (_, element) {
				// 3.遍历数组取出每一个类名
				$.each(names, function (_, value) {
					// 4.判断指定元素中是否包含指定的类名
					if(!$(element).hasClass(value)){
						element.className = element.className + " " + value;
					}
				});
			});
			return this;
		},
		removeClass: function (name) {
			if(arguments.length === 0){
				this.each(function (key, element) {
					element.className = "";
				});
			}else{
				// 1.对传入的类名进行切割
				let names = name.split(" ");
				// 2.遍历取出所有的元素
				this.each(function (_, element) {
					// 3.遍历数组取出每一个类名
					$.each(names, function (_, value) {
						// 4.判断指定元素中是否包含指定的类名
						if($(element).hasClass(value)){
							element.className = (" "+element.className+" ").replace(" "+value+" ", "");
						}
					});
				});
			}
			return this;
		},
		toggleClass: function (name) {
			if(arguments.length === 0){
				this.removeClass();
			}else{
				// 1.对传入的类名进行切割
				let names = name.split(" ");
				// 2.遍历取出所有的元素
				this.each(function (_, element) {
					// 3.遍历数组取出每一个类名
					$.each(names, function (_, value) {
						// 4.判断指定元素中是否包含指定的类名
						if($(element).hasClass(value)){
							// 删除
							$(element).removeClass(value);
						}else{
							// 添加
							$(element).addClass(value);
						}
					});
				});
			}
			return this;
		}
	});
	// 事件操作相关方法
	xhxQuery.prototype.extend({
		on: function (name, callBack) {
			// 1. 遍历取出所有元素
			this.each(function (_, element) {
				// 2. 判断当前元素中是否有保存所有事件的对象(用于区分不同事件), 有就用, 没有就加上
				// eventsCache 让后面　off 的实现变得容易, 而且解决了低级浏览器绑定多个事件不按先后顺序执行的问题 (按顺序执行)
				if (!element.eventsCache) {
					element.eventsCache = {};
				}
				//  3. 判断 eventsCache 中有没有指定类型事件的数组, 有就用, 没有就加上
				if (!element.eventsCache[name]) {
					element.eventsCache[name] = [];
					// 4. 将回调函数放在对应的 element.eventsCache[name] 数组中
					element.eventsCache[name].push(callBack);
					// 5. 添加对应类型的事件
					// addEvent 调用的是 js 原生的绑定事件方法 (addEventListener), 原生也可以添加多个事件 
					xhxQuery.addEvent(element, name, function () {
						// element.eventsCache[name] 是数组, 这里 _ 就是数组下标, 用不上
						xhxQuery.each(element.eventsCache[name], function (_, method) {
							// 这里不懂去看 test 6
							method()
						})
					})
				} else {
					// 6. 将回调函数添加到数组中
					element.eventsCache[name].push(callBack);
				}
				return this;
			})
		},
		off: function (name, callBack) {
			// 1. 根据传入参数个数分别处理
			if (arguments.length === 0) {
				// 每个节点的事件对象都置空
				/* 由于 $(xx).on(事件, 回调) 中传给原生事件的是回调函数的引用, 
					因此在清空 eventsCache 后原生绑定的事件也不再生效, 
					所以这里可以通过移除 eventsCache 中的对应部分来移除通过 on 添加的事件 */
				/* demo
				let arr = [];
				let arr2 = arr;
				arr.push(1);
				console.log(arr2); // [ 1 ]
				arr.shift();
				console.log(arr2); // []
				*/
				this.each(function (_, element) {
					element.eventsCache = {};
				})
			} else if (arguments.length === 1) {
				this.each(function (_, element) {
					element.eventsCache[name] = {};
				})
			} else if (arguments.length === 2) {
				this.each(function (_, element) {
					xhxQuery.each(element.eventsCache[name], function (index, method) {
						// 判断当前遍历到的方法与传入的方法是否相同
						if (method === callBack) {
							element.eventsCache[name].splice(index, 1);
						}
					})
				})
			}
		}
	});
	// clone (原生 js 并没有提供获取所有事件的接口, 所以 clone 要借助上面实现的 eventsCache 对象)
	xhxQuery.prototype.extend({
		clone: function (deep) {
			let res = [];
			// 判断是否是深复制
			if (!deep) {
				// 浅复制
				this.each(function (_, element) {
					let temp = element.cloneNode(true); // js 的 cloneNode 并不能复制事件
					res.push(temp);
				})
				return $(res);
			} else {
				// 深复制 (借着自己的实现去实现更难的东西, 有点左脚踩右脚上天内味儿哈哈哈哈)
				this.each(function (_, element) {
					let temp = element.cloneNode(true);
					// 遍历元素中的 eventCache 对象
					xhxQuery.each(element.eventsCache, function (name, array) {
						// 遍历事件对应的数组
						xhxQuery.each(array, function (_, method) {
							// 给复制的元素添加事件
							$(temp).on(name, method);
						})
					})
					res.push(temp);
				})
				return $(res);
			}
		}
	})
	/*
    3. 在 jQuery 的原型对象里写个 init 函数,
        指定 jQuery 的原型对象为(其原型对象里的 )init 函数的原型对象,
        这样是为了做一些初始配置, 顺便解决递归调用自己导致爆栈的问题
        */
	xhxQuery.prototype.init.prototype = xhxQuery.prototype;
	// 4.把定义好的函数挂载到全局供人使用
	window.xhxQuery = window.$ = xhxQuery;
})(window);

// jq 是对原生 js 的封装, 同一个方法在不同浏览器下表现一致, 而且写法更简洁, 但过高的兼容性导致代码体积大
// jq 将 index 放在形参第一个位置, 本来我也觉得这样比较直观, 但实现其他方法的过程中发现 index 常常没用到, 白白写了许多 _