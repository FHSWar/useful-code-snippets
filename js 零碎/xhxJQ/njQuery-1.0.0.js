(function (window, undefined) {
	var njQuery = function (selector) {
		return new njQuery.prototype.init(selector);
	};
	njQuery.prototype = {
		constructor: njQuery,
		init: function (selector) {
			/*
             1.传入 '' null undefined NaN  0  false, 返回空的jQuery对象
             2.字符串:
             代码片段:会将创建好的DOM元素存储到jQuery对象中返回
             选择器: 会将找到的所有元素存储到jQuery对象中返回
             3.数组:
             会将数组中存储的元素依次存储到jQuery对象中立返回
             4.除上述类型以外的:    
             会将传入的数据存储到jQuery对象中返回
            */
			// 0.去除字符串两端的空格
			selector = njQuery.trim(selector);

			// 1.传入 '' null undefined NaN  0  false, 返回空的jQuery对象
			if (!selector) {
				return this;
			}
			// 2.方法处理
			else if (njQuery.isFunction(selector)) {
				njQuery.ready(selector);
			}
			// 3.字符串
			else if (njQuery.isString(selector)) {
				// 2.1判断是否是代码片段 <a>
				if (njQuery.isHTML(selector)) {
					// 1.根据代码片段创建所有的元素
					var temp = document.createElement("div");
					temp.innerHTML = selector;
					/*
                    // 2.将创建好的一级元素添加到jQuery当中
                    for(var i = 0; i < temp.children.length; i++){
                        this[i] = temp.children[i];
                    }
                    // 3.给jQuery对象添加length属性
                    this.length = temp.children.length;
                    */
					[].push.apply(this, temp.children);
					// 此时此刻的this是njQuery对象
					// 4.返回加工好的this(jQuery)
					// return this;
				}
				// 2.2判断是否是选择器
				else {
					// 1.根据传入的选择器找到对应的元素
					var res = document.querySelectorAll(selector);
					// 2.将找到的元素添加到njQuery上
					[].push.apply(this, res);
					// 3.返回加工上的this
					// return this;
				}
			}
			// 4.数组
			// else if(typeof selector === "object" &&
			//         "length" in selector &&
			//          selector !== window){
			else if (njQuery.isArray(selector)) {
				/*
                // 3.1真数组
                if(({}).toString.apply(selector) === "[object Array]"){
                    [].push.apply(this, selector);
                    return this;
                }
                // 3.2伪数组
                else {
                    // 将自定义的伪数组转换为真数组
                    var arr = [].slice.call(selector);
                    // 将真数组转换为伪数组
                    [].push.apply(this, arr);
                    return this;
                }
                */
				// 将自定义的伪数组转换为真数组
				var arr = [].slice.call(selector);
				// 将真数组转换为伪数组
				[].push.apply(this, arr);
				// return this;
			}
			// 5.除上述类型以外
			else {
				this[0] = selector;
				this.length = 1;
				// return this;
			}
			return this;
		},
	};
	njQuery.extend = njQuery.prototype.extend = function (obj) {
		for (var key in obj) {
			this[key] = obj[key];
		}
	};
	njQuery.extend({
		isString: function (str) {
			return typeof str === "string";
		},
		isHTML: function (str) {
			return (
				str.charAt(0) == "<" &&
				str.charAt(str.length - 1) == ">" &&
				str.length >= 3
			);
		},
		trim: function (str) {
			if (!njQuery.isString(str)) {
				return str;
			}
			// 判断是否支持trim方法
			if (str.trim) {
				return str.trim();
			} else {
				return str.replace(/^\s+|\s+$/g, "");
			}
		},
		isObject: function (sele) {
			return typeof sele === "object";
		},
		isWindow: function (sele) {
			return sele === window;
		},
		isArray: function (sele) {
			if (
				njQuery.isObject(sele) &&
				!njQuery.isWindow(sele) &&
				"length" in sele
			) {
				return true;
			}
			return false;
		},
		isFunction: function (sele) {
			return typeof sele === "function";
		},
		ready: function (fn) {
			// 判断DOM是否加载完毕
			if (document.readyState == "complete") {
				fn();
			} else if (document.addEventListener) {
				document.addEventListener("DOMContentLoaded", function () {
					fn();
				});
			} else {
				document.attachEvent("onreadystatechange", function () {
					if (document.readyState == "complete") {
						fn();
					}
				});
			}
		},
	});

	njQuery.prototype.init.prototype = njQuery.prototype;
	window.njQuery = window.$ = njQuery;
})(window);
