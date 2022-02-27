<template>
  <div ref="tableContainer" :style="cssVariables" style="position: relative;">
    <tableHeader :header="dirtyTree" :scroll-left="scrollLeft" />
    <!-- 表格的边框一定是直角的，不符合 UI 要求，通过 div 包裹来实现圆角效果 -->
    <div class="fhs-table__container" @scroll.passive="handleTableScroll">
      <table ref="fhsTable" class="fhs-table__body">
        <!-- 表头的动态渲染 -->
        <thead ref="tableHead">
          <tr v-for="(rowData, row) in headerConfig" :key="`head-${row}`">
            <th
              v-for="({ align, colspan, isFirstColumn, rowspan, title, width }, column) in rowData"
              :key="`${row}-${column}`"
              :colspan="colspan"
              :rowspan="rowspan"
              :style="customCell({ align, column, isFirstColumn, isTh: true, width })"
              :class="thClasses({ column, row })"
            >
              {{ title }}
            </th>
          </tr>
        </thead>
        <!-- 数据的动态渲染 -->
        <tbody ref="tableBody">
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
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {tableHeaderMixin} from './mixins/tableHeader'
import tableHeader from './components/tableHeader.vue'
import mockHeader from './mock/mock.json'
import mockList from './mock/mockList.json'

export default {
	components: {
		tableHeader
	},
	mixins: [tableHeaderMixin],
	data() {
		return {
			content: [...mockList],
			isScrolled: false,
			querying: false,
			scrollLeft: 0,
			tableHeadHeight: 0
		}
	},
	computed: {
		// .fhs-table__container 内所有的 CSS 变量都可以在这里面根据特定条件调整，暂不暴露给组件使用者，以保持较高的 UI 统一性
		cssVariables() {
			// 根据每一列宽度·计算出表格总宽度
			const tableWidth = this.headerContentBoundary.reduce((accumulator, cur) => {
				accumulator += parseInt(cur.width)
				return accumulator
			}, 0)
			const variablesObj = {
				// UI 上做表格边框的 div，表格的容器
				'--container-width': 'calc(100% - 2*var(--container-margin))',
				'--container-margin': '16px',
				'--container-border-width': '1px',
				'--container-border-radius': '8px',
				// 表格宽度，其实不给也行，因为会被单元格的宽度撑开
				'--table-width': `${tableWidth}px`,
				'--table-head-height': `${this.tableHeadHeight}px`,
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

			return variablesObj
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
	created() {
		this.initHeader(mockHeader)
	},
	mounted() {
		this.getTableHeadHeight()
	},
	methods: {
		handleTableScroll(e) {
			// 响应式的数据尽量避免高频更新
			if(e.target.scrollLeft > 0 && this.isScrolled === false) this.isScrolled = true
			if(e.target.scrollLeft === 0) this.isScrolled = false
			if(e.target.scrollTop + this.$refs.tableContainer.offsetHeight - 50 > this.$refs.fhsTable.offsetHeight 
				&& this.querying === false) this.queryData()
			this.scrollLeft = e.target.scrollLeft
		},
		getTableHeadHeight() {
			this.$nextTick(() => {
				this.tableHeadHeight = this.$refs.tableHead.offsetHeight
			})
		},
		queryData() {
			this.querying = true
			setTimeout(() => {
				console.log('queryData successed')
				this.content.push(...mockList)
				console.log('this.content.length', this.content)
				this.querying = false
			}, 500)
		}
	}
}
</script>

<style lang="scss" scoped>
@import "@styles/common.scss";
@import "mixins/mixin.scss";

.fhs-table {
	&__container {
		@include container;
		position: relative;
    	border-radius: var(--container-border-radius);
		top: calc(-1 * (var(--table-head-height) + var(--container-margin) + var(--cell-border-width)));
		z-index: 0;
		height: 600px;
	}

	@include body;
	@include cell;
	@include head-cell;
	&__head-cell {
		visibility: hidden;
	}
	&__data-cell {
		background-color: #fff;
	}
	@include th-td;
}
</style>