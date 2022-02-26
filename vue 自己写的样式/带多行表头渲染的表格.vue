<template>
  <div :style="customStyle">
    <!-- 表格的边框一定是直角的，不符合 UI 要求，通过 div 包裹来实现圆角效果 -->
    <div class="fhs-table__container" @scroll.passive="handleTableScroll">
      <table class="fhs-table__body">
        <!-- 表头的动态渲染 -->
        <tr v-for="(rowData, row) in headerConfig" :key="`head-${row}`">
          <th
            v-for="({ align, colspan, isFirstColumn, rowspan, title, width }, column) in rowData"
            :key="`${row}-${column}`"
            :colspan="colspan"
            :rowspan="rowspan"
            :style="customCell({ align, column, isFirstColumn, isTh: true, width })"
            :class="thClasses({ column, headerConfig, row })"
          >
            {{ title }}
          </th>
        </tr>
        <!-- 数据的动态渲染 -->
        <tr v-for="(rowData, row) in content" :key="`data-${row}`">
          <td
            v-for="({ align, isFirstColumn, prop, width }, index) in headerContentBoundary"
            :key="`${prop}-${index}`"
            :style="customCell({ align, column: index, isFirstColumn, width })"
            :class="tdClasses({ column: index, content, row })"
          >
            {{ rowData[prop] || '-' }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import mockHeader from './mock.json'
import mockList from './mockList.json'

export default {
	data() {
		return {
			dirtyHeaderConfig: [],
			dirtyTree: [],
			content: mockList,
			isScrolled: false
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
		// .fhs-table__container 内所有的 CSS 变量都可以在这里面根据特定条件调整，暂不暴露给组件使用者，以保持较高的 UI 统一性
		customStyle() {
			// 根据每一列宽度·计算出表格总宽度
			const tableWidth = this.headerContentBoundary.reduce((accumulator, cur) => {
				accumulator += parseInt(cur.width)
				return accumulator
			}, 0)

			return {
				// UI 上做表格边框的 div，表格的容器
				'--container-width': 'calc(100% - 2*var(--container-margin))',
				'--container-margin': '16px',
				'--container-border-width': '1px',
				'--container-border-radius': '8px',
				// 表格宽度，其实不给也行，因为会被单元格的宽度撑开
				'--table-width': `${tableWidth}px`,
				// 表头单元格背景色
				'--th-background-color': '#f6f9fe',
				// 数据单元格背景色
				'--td-background-color': '#ffffff',
				// 单元格的细节
				'--cell-border-width': '1px',
				'--cell-border-color': '#e2ecfd',
				'--cell-height': '32px',
				'--cell-padding': '4px',
				'--cell-font-size': '10px',
				'--cell-edge-shadow': this.isScrolled ? 'rgba(188, 188, 188, 0.1)' : 'transparent',
				'--cell-edge-shadow-blur': this.isScrolled ? '2px 0px 3px rgba(188, 188, 188, 0.6)' : 'transparent'
			}
		},
		// 第一大列最右边不需要伪类作边框，需要识别出来后单独处理一下
		isFirstColumnRightEdge() {
			const eachLayerColumns = this.headerFirstColumn.map(arr => arr.length)
			const lastLayerColumns = eachLayerColumns[eachLayerColumns.length - 1]
			return ({ column, row }, isTh) => {
				// 传进来是第几行，这行这列是不是在 eachLayerColumns 的边边
				if(isTh && eachLayerColumns[row] === column + 1) return true
				return column + 1 === lastLayerColumns
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
		// th 的样式类的维护：基础的有单元格和 th，计算的包括首行，末行，首列，末列，左上角，右上角
		thClasses() {
			// return 出去的每次都要被调用，这俩函数完全不需要反复创建，提到 return 之前显然更合理
			const thBemB = this.bemBlock('fhs-table')
			const thBemE = thBemB('head-cell', true)
			const classArr = [thBemB('cell'), thBemB('head-cell')]

			return ({ column, headerConfig, row }) => {
				const isFirstColumnRightEdge = this.isFirstColumnRightEdge({ column, row }, true)

				return classArr.concat([
					headerConfig[row][column].isFirstColumn ? thBemE('first-column') : '',
					isFirstColumnRightEdge ? thBemE('first-column-right-edge') : '',
					column === headerConfig[row].length - 1 ? thBemE('last-column') : '',
					row === 0 ? thBemE('first-row') : '',
					row === headerConfig.length - 1 ? thBemE('last-row') : '',
					(row === 0 && column === 0) ? thBemE('left-corner') : '',
					(row === 0 && column === headerConfig[row].length - 1) ? thBemE('right-corner') : ''
				])
			}
		},
		// 作用类似于 thClasses
		tdClasses() {
			const firstColumnProps = this.headerFirstColumn.flat(Infinity).map(item => item.prop)
			const tdBemB = this.bemBlock('fhs-table')
			const tdBemE = tdBemB('data-cell', true)
			const classArr = [tdBemB('cell'), tdBemB('data-cell')]

			return ({ column, content, row }) => {
				// 判断这个要渲染数据的属性是否属于第一大列
				const isFirstColumn = firstColumnProps.includes(this.headerContentBoundary[column].prop)
				const isFirstColumnRightEdge = this.isFirstColumnRightEdge({ column })

				return classArr.concat([
					isFirstColumn ? tdBemE('first-column') : '',
					isFirstColumnRightEdge ? tdBemE('first-column-right-edge') : '',
					column === this.headerContentBoundary.length - 1 ? tdBemE('last-column') : '',
					row === 0 ? tdBemE('first-row') : '',
					row === content.length - 1 ? tdBemE('last-row') : '',
					(row === content.length - 1 && column === 0) ? tdBemE('left-corner') : '',
					(row === content.length - 1 && column === this.headerContentBoundary.length - 1)
						? tdBemE('right-corner')
						: ''
				])
			}
		}
	},
	mounted() {
		this.initHeader(mockHeader)
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
			if (arr.length === 0) return 0

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
		handleTableScroll(e) {
			// 响应式的数据尽量避免高频更新
			if(e.target.scrollLeft > 0 && this.isScrolled === false) this.isScrolled = true
			if(e.target.scrollLeft === 0) this.isScrolled = false
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
</script>

<style lang="scss">
@import "@styles/common.scss";
.fhs-table {
	&__container {
		position: relative;
		margin: var(--container-margin);
		border: var(--container-border-width) solid var(--cell-border-color);
		border-radius: var(--container-border-radius);
		width: var(--container-width);
		overflow-x: scroll;
	}

	&__body {
		width: var(--table-width);
	}
	&__cell {
		border: var(--cell-border-width) solid var(--cell-border-color);
		height: var(--cell-height);
		padding-left: var(--cell-padding);
		padding-right: var(--cell-padding);
		font-size: var(--cell-font-size);
	}

	&__head-cell {
		background-color: var(--th-background-color);
		&--first-row {
			border-top: none;
		}
	}
	&__data-cell {
		background-color: #fff;
	}
	&__head-cell,
	&__data-cell {
		&--first-column {
			position: -webkit-sticky;
			position: sticky; // left 值通过计算属性获得
			border-left: none;
			overflow: visible;
			// sticky 之后 border 没了，奇怪。用伪元素模拟好了。
			&::before {
				content: "";
				width: 100%;
				height: var(--cell-border-width);
				top: -1px;
				left: 0;

			}
			&::after {
				content: "";
				width: 1px;
				height: 100%;
				top: 0;
				right: -1px;
			}
			&::before,
			&::after {
				position: absolute;
				background-color: var(--cell-border-color);
			}
		}
		&--first-column-right-edge {
			&::after {
				background-color: var(--cell-edge-shadow);
				box-shadow: var(--cell-edge-shadow-blur);
				overflow: visible;
			}
		}
		&--last-column {
			border-right: none;
		}
		&--last-row {
			border-bottom: none;
		}
		&--left-corner {
			border-bottom: none;
			border-left: none;
		}
		&--right-corner {
			border-right: none;
			border-bottom: none;
		}
	}
}
</style>