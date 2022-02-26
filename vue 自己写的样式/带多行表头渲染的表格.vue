<template>
  <!-- 表格的边框一定是直角的，不符合 UI 要求，通过 div 包裹来实现圆角效果 -->
  <div class="fhs-table__container" :style="customStyle">
    <table class="fhs-table__body">
      <!-- 表头的动态渲染 -->
      <tr v-for="(rowData, row) in headerConfig" :key="`head-${row}`">
        <th
          v-for="({align, colspan, rowspan, title, width}, column) in rowData"
          :key="`${row}-${column}`"
          :colspan="colspan"
          :rowspan="rowspan"
          :style="{width, textAlign: align}"
          :class="thClasses({column, headerConfig, row})"
        >
          {{ title }}
        </th>
      </tr>
      <!-- 数据的动态渲染 -->
      <tr v-for="(rowData, row) in content" :key="`data-${row}`">
        <td
          v-for="(key, index) in dataProps"
          :key="`${key}-${index}`"
          :class="tdClasses({column: index, content, row})"
        >
          {{ rowData[key] || '-' }}
        </td>
      </tr>
    </table>
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
			content: mockList
		}
	},
	computed: {
		// .fhs-table__container 内所有的 CSS 变量都可以在这里面根据特定条件调整，暂不暴露给组件使用者，以保持较高的 UI 统一性
		customStyle() {
			// 根据每一列宽度·计算出表格总宽度
			const tableWidth = this.headerContentBoundary.reduce((accumulator, cur) => {
				accumulator += parseInt(cur.width)
				return accumulator
			}, 0)
			return {
				'--table-width': `${tableWidth}px`
			}
		},
		// 表格数据的 prop 只来自于表头的最后一行，computed 算方便用
		dataProps() {
			return this.headerContentBoundary.map(({prop}) => prop)
		},
		// 只保留表头渲染需要的键值对
		headerConfig() {
			return this.dirtyHeaderConfig.map(headerLayer => {
				return headerLayer.map(({align, colspan, prop, rowspan, sortable, label, minWidth}) => {
					return {
						align,
						colspan,
						prop,
						rowspan,
						sortable,
						title: label,
						width: `${minWidth}px`
					}
				})
			})
		},
		// 表头与数据交接的表头单元格都有对应的 prop 需要被渲染，也就是表头 tree 的所有叶子结点
		headerContentBoundary() {
			const res = []
			function flatLeaves(arr) {
				for(const item of arr) {
					item.children.length === 0
						? res.push(item)
						: flatLeaves(item.children)
				}
			}
			flatLeaves(this.dirtyTree)
			return res
		},
		// 表头左上角
		headerLeftCorner() {
			if(this.dirtyTree[0]) return this.flatTree({children: [this.dirtyTree[0]]})
			return []
		},
		// th 的样式类的维护：基础的有单元格和 th，计算的包括首行，末行，首列，末列，左上角，右上角
		thClasses() {
			return ({column, headerConfig, row}) => {
				const thBemB = this.bemBlock('fhs-table')
				const thBemE = thBemB('head-cell', true)
				const classArr = [thBemB('cell'), thBemB('head-cell')]

				return classArr.concat([
					column === 0 ? thBemE('first-column') : '',
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
			return ({column, content, row}) => {
				const tdBemB = this.bemBlock('fhs-table')
				const tdBemE = tdBemB('data-cell', true)
				const classArr = [tdBemB('cell'), tdBemB('data-cell')]
				return classArr.concat([
					column === 0 ? tdBemE('first-column') : '',
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
			return function(element, returnFunc) {
				// 有可能在 element 就停止，停止就给字符串，没停就返回一个拼 modifier 的函数
				if(returnFunc) return function(modifier) {
					return `${block}__${element}--${modifier}`
				}
				return `${block}__${element}`
			}
		},
		// 給表头各列加 colspan 属性并赋予正确的值
		calcColspans(arr) {
			const copy = JSON.parse(JSON.stringify(arr))
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
			copy.map(obj => countLeaves(obj))
			return copy
		},
		// 计算表头行数，每个单元格深度，由深度及是否有 children 算出单元格 rowspan
		calcDepth(arr) {
			if (arr.length === 0) return 0

			let outerDepth = 1
			const copy = JSON.parse(JSON.stringify(arr))

			// 计算出 item 所在层级，由上至下，单向，不出错
			function layerTag(copy, depth) {
				depth++
				for (const item of copy) {
					item.layer = depth - 1
					if (item.children.length !== 0) {
						if (Math.max(depth, outerDepth) !== outerDepth)
							outerDepth = depth
						layerTag(item.children, depth)
					}
				}
			}
			// 根据 outerDepth 和所在 layer 计算具体 item 应有的 rowspan
			function calcRowspans(copy) {
				for (const item of copy) {
					if(item.children.length === 0) {
						item.rowspan = outerDepth - item.layer + 1
					} else {
						item.rowspan = 1
						calcRowspans(item.children)
					}
				}
			}
			layerTag(copy, 1)
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
			this.dirtyTree = this.calcColspans(this.calcDepth(columns))
			this.dirtyHeaderConfig = this.flatTree({children: this.dirtyTree})
		}
	}
}
</script>

<style lang="scss">
@import "@styles/common.scss";
.fhs-table {
  &__container {
    --table-margin: 16px;
    --table-border-width: 1.5px;
    --table-radius: 10px;
    --table-width: 3360px;

	--th-background-color: #f6f9fe;

	--td-background-color: #ffffff;

	--cell-border-width: 1px;
    --cell-border-color: #e2ecfd;
	--cell-width:  120px;
    --cell-height: 40px;
	--cell-padding: 4px;
	--cell-font-size: 12px;

    margin: var(--table-margin);
    border: var(--table-border-width) solid var(--cell-border-color);
    border-radius: var(--table-radius);
    width: calc(100% - 2*var(--table-margin));
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
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
  }

  &__head-cell {
    background-color: var(--th-background-color);
    &--first-row {
      border-top: none;
    }
  }
  &__data-cell {
    min-width: var(--cell-width);
    background-color: #fff;
  }
  &__head-cell, &__data-cell {
    &--first-column {
      border-left: none;
    }
    &--last-column {
      border-right: none;
    }
    &--last-row {
      border-bottom: none;
      max-width: var(--cell-width);
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