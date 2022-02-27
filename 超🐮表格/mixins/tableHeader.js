export const tableHeaderMixin = {
	data() {
		return {
			dirtyTree: [],
			dirtyHeaderConfig: []
		}
	},
	computed: {
		// 宽高和对齐方式
		customCell() {
			return ({ align, column, width, isFirstColumn, isTh }) => {
				const stickyLeft = {}
				if (isFirstColumn) stickyLeft.left = `${column * parseInt(width)}px`

				// 宽度只给表头就好了，td 会跟着 th, 行数多的还是节约很多的
				const styleObj = isTh ? {
					...stickyLeft,
					width: `${width}`,
					minWidth: `${width}`,
					maxWidth: `${width}`,
					textAlign: align
				} : {
					...stickyLeft,
					textAlign: align
				}
				return styleObj
			}
		},
		// 只保留表头渲染需要的键值对
		headerConfig() {
			const res = this.dirtyHeaderConfig.map(headerLayer => {
				return headerLayer.map(({ align, colspan, isFirstColumn, label, minWidth, prop, rowspan, sortable }) => {
					const cleanTh = { align, colspan, prop, rowspan, sortable, title: label, width: `${minWidth / 2}px` }
					if (isFirstColumn) cleanTh.isFirstColumn = true
					return cleanTh
				})
			})
			return res
		},
		// 表头与数据交接的表头单元格都有对应的 prop 需要被渲染，也就是表头 tree 的所有叶子结点
		headerContentBoundary() {
			const dirtyRes = []
			function flatLeaves(arr) {
				for (const item of arr) {
					item.children.length === 0
						? dirtyRes.push(item)
						: flatLeaves(item.children)
				}
			}
			flatLeaves(this.dirtyTree)
			const res = dirtyRes.map(({ align, colspan, isFirstColumn, label, minWidth, prop, rowspan, sortable }) => {
				const cleanTh = { align, colspan, prop, rowspan, sortable, title: label, width: `${minWidth / 2}px` }
				if (isFirstColumn) cleanTh.isFirstColumn = true
				return cleanTh
			})
			return res
		},
		// 表头左上角，tree 的第一行第一个节点的所有子节点都属于第一列，简称第一大列
		headerFirstColumn() {
			const res = this.headerConfig
			// 取其中 isFirstColumn 为 true 的
				.map(headerLayer => headerLayer.filter(({ isFirstColumn }) => isFirstColumn))
			// 去掉数组长度为 0 的
				.filter(headerLayer => headerLayer.length !== 0)
			return res
		},
		isBoundary() {
			return ({ column, row }) => {
				return this.headerContentBoundary[column].prop.includes(this.headerConfig[row][column].prop)
			}
		},
		// 第一大列最右边不需要伪类作边框，需要识别出来后单独处理一下
		isFirstColumnRightEdge() {
			const eachLayerColumns = this.headerFirstColumn.map(arr => arr.length)
			const lastLayerColumns = eachLayerColumns[eachLayerColumns.length - 1]
			return ({ column, row }, isTh) => {
				// 传进来是第几行，这行这列是不是在 eachLayerColumns 的边边
				if (isTh && eachLayerColumns[row] === column + 1) return true
				return column + 1 === lastLayerColumns
			}
		},
		// th 的样式类的维护：基础的有单元格和 th，计算的包括首行，末行，首列，末列，左上角，右上角
		thClasses() {
			// return 出去的每次都要被调用，这俩函数完全不需要反复创建，提到 return 之前显然更合理
			const thBemB = this.bemBlock('fhs-table')
			const thBemE = thBemB('head-cell', true)
			const classArr = [thBemB('cell'), thBemB('head-cell')]

			return ({ column, row }) => {
				const isFirstColumnRightEdge = this.isFirstColumnRightEdge({ column, row }, true)
				const isBoundary = this.isBoundary({ column, row })
				return classArr.concat([
					this.headerConfig[row][column].isFirstColumn ? thBemE('first-column') : '',
					isFirstColumnRightEdge ? thBemE('first-column-right-edge') : '',
					column === this.headerConfig[row].length - 1 ? thBemE('last-column') : '',
					row === 0 ? thBemE('first-row') : '',
					row === this.headerConfig.length - 1 ? thBemE('last-row') : '',
					isBoundary ? thBemE('last-row-boundary') : '',
					(row === 0 && column === 0) ? thBemE('left-corner') : '',
					(row === 0 && column === this.headerConfig[row].length - 1) ? thBemE('right-corner') : ''
				])
			}
		}
	},
	methods: {
		// 通过嵌套的工厂函数来避免写长长的 BEM 类名，字符串长了难免出错，还是函数靠谱
		bemBlock(block) {
			// 肯定有 block，这一层不做返回的判断
			return function (element, returnFunc) {
				// 有可能在 element 就停止，停止就给字符串，没停就返回一个拼 modifier 的函数
				if (returnFunc) return function (modifier) {
					return `${block}__${element}--${modifier}`
				}
				return `${block}__${element}`
			}
		},
		// 給表头各列加 colspan 属性并赋予正确的值
		handleColumns(arr) {
			const copy = JSON.parse(JSON.stringify(arr))

			// 数树形结构第一层每个节点各有多少子结点
			function countLeaves(obj) {
				let res = 0
				function toLeafLayer(obj) {
					if (obj.children.length !== 0) {
						for (const childObj of obj.children) {
							countLeaves(childObj)
							toLeafLayer(childObj)
						}
					} else {
						res++
					}
				}
				toLeafLayer(obj)
				obj.colspan = res
				return obj
			}
			// 给树形结构第一层第一个节点的所有子节点打标记
			function tagFistColumn(arr, init, isFirstColumn) {
				for (const [index, item] of arr.entries()) {
					// 只有第一大列才会有标记，才会往下
					if ((init && index === 0) || isFirstColumn) item.isFirstColumn = true
					// 有子结点且属于第一大列，就递归的打标记
					if (item.children.length !== 0 && item.isFirstColumn === true) {
						tagFistColumn(item.children, null, true)
					}
				}
			}
			copy.map(obj => countLeaves(obj))
			tagFistColumn(copy, true)

			return copy
		},
		// 计算表头行数，每个单元格深度，由深度及是否有 children 算出单元格 rowspan
		handleRows(arr) {
			let outerDepth = 1
			const copy = JSON.parse(JSON.stringify(arr))

			// 计算出 item 所在层级，由上至下，单向，不出错
			function tagLayer(copy, depth) {
				depth++
				for (const item of copy) {
					item.layer = depth - 1
					if (item.children.length !== 0) {
						if (Math.max(depth, outerDepth) !== outerDepth)
							outerDepth = depth
						tagLayer(item.children, depth)
					}
				}
			}
			// 根据 outerDepth 和所在 layer 计算具体 item 应有的 rowspan
			function calcRowspans(copy) {
				for (const item of copy) {
					if (item.children.length === 0) {
						item.rowspan = outerDepth - item.layer + 1
					} else {
						item.rowspan = 1
						calcRowspans(item.children)
					}
				}
			}
			tagLayer(copy, 1)
			calcRowspans(copy)

			return copy
		},
		// 把树结构摊平
		flatTree(root) {
			const result = [], queue = []
			queue.push(root)

			while (queue.length !== 0) {
				const item = queue.shift()
				if (item.children.length > 0) {
					item.children.map(childItem => queue.push(childItem))
				}
				result.push(item)
			}
			result.shift() // 以 {children: Array} 入参传进来的在第一个，要去掉

			return result
				.reduce((acc, cur) => {
					Array.isArray(acc[cur.layer - 1])
						? acc[cur.layer - 1].push(cur)
						: (acc[cur.layer - 1] = [cur])
					return acc
				}, [])
		},
		// 初始化 headerConfig 供模版渲染用
		initHeader(columns) {
			// dirty 是相对于模版渲染需要而言的
			this.dirtyTree = this.handleColumns(this.handleRows(columns))
			this.dirtyHeaderConfig = this.flatTree({ children: this.dirtyTree })
		}
	}
}