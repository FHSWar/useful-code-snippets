let i = 0;
class xhxVue {
	constructor(options) {
		// 判断是否是 DOM 节点, 有就直接用, 没有就根据字符串去 query 出一个 DOM 节点
		if (this.nodeType === 1) {
			this.$el = options.el;
		} else {
			this.$el = document.querySelector(options.el);
		}
		this.$data = options.data;
		// 把 data 里的数据添加到实例上
		this.proxyData(this.$data);
		this.$methods = options.methods;
		this.$computed = options.computed;
		// 将 computed 中的方法添加到 $data 中, 这样使得渲染时能从 $data 中获取到 computed 中定义的计算属性
		this.computed2Data();
		// 根据指定的区域和数据去编译渲染页面
		if (this.$el) {
			new Observer(this.$data); // 1. 给外界所有传入的数据添加 get/set 方法, 对数据变化进行监听
			new Compiler(this); // 2. 编译并渲染数据到页面上
		}
	}
	proxyData() {
		for (let key in this.$data) {
			Object.defineProperty(this, key, {
				get: () => {
					return this.$data[key];
				}
			})	
		}
	}
	computed2Data() {
		for (const key in this.$computed) {
			Object.defineProperty(this.$data, key, {
				get: () => {
					return this.$computed[key].call(this);
				}
			})
		}
	}
}
let compileUtil = { // 这里都只考虑了通过点运算进行取值的情况, reduce 厉害了
	// 拿到这个变量在实力的 $data 中的值 (并处理了对象嵌套的情况)
	getValue(vm, value) {
		// 值可能是对象, 会有通过点进行取值的操作
		return value.split('.').reduce((data, currentKey) => {
			return data[currentKey.trim()];
		}, vm.$data);
	},
	// 应对一个 textContent 中有多个 {{}} 的情况
	getContent(vm, value) { 
		const reg = /\{\{(.+?)\}\}/gi;
		// 正则对调了 replace 方法
		let val = value.replace(reg, (...args) => { // 这个居然能一个函数多次匹配
			return this.getValue(vm, args[1]) // // console.log(args) // ["{{age}}", "age", 0, "{{age}}"]
		});
		return val;
	},
	setValue(vm, attr, newValue) {
		attr.split('.').reduce((data, currentAttr, index, arr) => {
			if (index === arr.length - 1) {
				data[currentAttr] = newValue;
			}
			return data[currentAttr];
		}, vm.$data)
	},
	model: function (node, value, vm) {
		// 给每个值都添加观察者
        new Watcher(vm, value, (newValue, oldValue)=>{
            node.value = newValue;
        });
		// node.value = vm.$data[value]; // 这样不行, 不能处理嵌套对象的问题
		const val = this.getValue(vm, value);
		node.value = val;
		// 用户输入了内容要更新到 $data 中
		node.addEventListener('input', (e) => {
			const newValue = e.target.value;
			// 仍然是处理对象嵌套的状况
			this.setValue(vm, value, newValue); 
		})
	},
	html: function (node, value, vm) {
		new Watcher(vm, value, (newValue, oldValue) => {
			node.innerHTML = newValue;
		});
		const val = this.getValue(vm, value);
		node.innerHTML = val; // 这能写成 HMTL 我也是服了自己
	},
	text: function (node, value, vm) {
		new Watcher(vm, value, (newValue, oldValue) => {
			node.innerText = newValue;
		});
		let val = this.getValue(vm, value);
		node.innerText = val;
	},
	content: function (node, value, vm) { // 别的都是直接传属性名, 这个传的是 {{xxx}}
		// 处理链条: {{xxx}} -> xxx -> $data[xxx]
		let reg = /\{\{(.+?)\}\}/gi;
		// 外层是为了拿到属性名称
		let val = value.replace(reg, (...args)=>{
            // 内层是为了保证数据完整性
			new Watcher(vm, args[1], (newValue, oldValue) => {
				// 处理 {{ age }}-{{desc.fascination}} 情况, 而不是简单直接赋值
                node.textContent = this.getContent(vm, value); 
			});
			i++;
			console.log(i); // 会一次打印 1, 2, 3 嗷, 即使 {{ age }}-{{desc.fascination}} 是在同一个 textContent 里	
            return this.getValue(vm, args[1]);
        });
        node.textContent = val;
	},
	on: function (node, value, vm, type) {
        node.addEventListener(type, (e)=>{
            vm.$methods[value].call(vm, e); // 改 this 为 vue 实例
        })
	}
}
class Compiler {
	constructor(vm) { // vm 是实例呀	
		this.vm = vm;
		// 1. 将网页上的数据放进内存中
		let fragment = this.node2fragment(this.vm.$el);
		// 2. 利用指定的数据编译内存中的元素
		this.buildTemplate(fragment);
		// 3. 将编译好的内容重新渲染到网页上
		this.vm.$el.appendChild(fragment); // 所谓的一次性更新, 性能更高
	}	
	node2fragment(app) {
		// 1. 创建一个空的文档碎片对象
		const fragment = document.createDocumentFragment();
		// 2. 遍历节点并编译 (不光是元素嗷)
		let node = app.firstChild;
		while (node) {
			fragment.appendChild(node);
			// 注意点: 只要将节点添加到文档碎片对象中, 那么这个节点就会自动从网页上消失
			node = app.firstChild;
		}
		// 3. 返回储存了所有元素的文档碎片对象
		return fragment;
	}
	buildTemplate(fragment) {
		// 将伪数组转为真数组
		let nodeArray = [...fragment.childNodes];
		// 判断当前遍历到的节点是元素还是文本
			// 如果是一个元素, 需要判断有没有 v-model 属性
			// 如果是一个文本节点, 需要判断有没有 {{}} 
		nodeArray.forEach(node => {	
			if (node.nodeType === 1) {
				// console.log('是一个元素', node);
				this.buildElement(node);
				// 没这个 buildText 不 work
				this.buildTemplate(node);
			} else {
				// console.log('是一个文本节点', node);
				this.buildText(node);
			}
		})
	}
	// 元素有 v- 指令时得元素内容的处理
	buildElement(node) {
		// console.log('靠终于对上了');
		const attrs = [...node.attributes];
		attrs.forEach(attr => {
			/*
            v-model='name': name=v-mode / value=name
            v-on:click="myFn": name=v-on:click / value=myFn
            */
			let {name, value} = attr; // 这就拿出了标签属性和标签属性值, 比如 {"v-model", "name"}
			if (name.startsWith('v-')) {
				// 处理下 v-on:
				let [directiveName, directiveType] = name.split(':'); // ['v-on', 'click']
				// 去除指令去掉 v- 的部分
				const [_, directive] = directiveName.split('-');
				// 用了哪个指令来操作哪个实例的哪个节点的值, 这里的 value 是自定义指令属性标签的值
				compileUtil[directive](node, value, this.vm, directiveType);
			}
		})
	}
	// 元素内容中有双花括号时对其内容的处理
	buildText(node) {
		const content = node.textContent;
		// 判断文本内容中是否有双花括号
		const reg = /\{\{.+?\}\}/gi; // 
		if (reg.test(content)) {
			compileUtil['content'](node, content, this.vm);
		}
	}
}
// 监听数据变化用
class Observer{
    constructor(data){
        this.observe(data);
    }
    observe(obj){
        if(obj && typeof obj === 'object'){
            for(let key in obj){
                this.defineReactive(obj, key, obj[key])
            }
        }
    }
	defineReactive(obj, attr, value) {
		// 如果属性值是对象, 里面的东西也要 observe
		this.observe(value);
		// 用发布订阅对象将观察者们管理起来
		let dep = new Dep(); // 创建属于当前属性的发布订阅对象
        Object.defineProperty(obj, attr, {            
			get() {
				Dep.target && dep.addSub(Dep.target)
                return value;
            },
            set: newValue => {
                if(value !== newValue){
                    // 更新的时候值可能从简单类型变成对象, 所以也 observe 一下
					this.observe(newValue);
					value = newValue;
					dep.notify();
                }
            }
        })
    }
}
/* 可以通过发布订阅模式来实现数据变化后对页面实时更新
	具体实现:
		1. 定义一个观察者类,
		2. 定义一个发布订阅类,
		3. 通过发布订阅的类来管理观察者类 */
class Dep{ // 维护一个观察者们组成的数组
	constructor() {
		// 这个数组专门用于管理某个属性所有的观察者对象
		this.subs = [];
	}
	// 添加订阅者 (把观察者添加到 subs 数组中) 
	addSub(watcher) {
		this.subs.push(watcher);
	}
	// 发布给订阅者 (执行数组中所有观察者的更新方法)
	notify() {
		this.subs.forEach(watcher => watcher.update());
	}
}
class Watcher{ // 一上来就获取旧值, 每次 update 在做值的比较, 有变化就更新 (观察者同时也是干活的)
	constructor(vm, attr, cb) {
		this.vm = vm;
		this.attr = attr;
		this.cb = cb;
		// 在创建观察者的时候就去获取当前的旧值
		this.oldValue = this.getOldValue();
	}
	getOldValue() {
		Dep.target = this;
		let oldValue = compileUtil.getValue(this.vm, this.attr);
		Dep.target = null;
		return oldValue;
	}
	// 定义一个更新的方法, 用于判断新值和旧值是否相同
	update() {
		let newValue = compileUtil.getValue(this.vm, this.attr);
		if (this.oldValue !== newValue) {
			this.cb(newValue, this.oldValue);
		}
	}
}

