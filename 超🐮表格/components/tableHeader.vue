<template>
  <div ref="tableHeadWrapper" class="fhs-table__header-wrapper">
    <table>
      <!-- 表头的动态渲染 -->
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
    </table>
  </div>
</template>

<script>
// 用于实现吸顶的头部，头部用 sticky 布局是不合适且难以实现的
import {tableHeaderMixin} from '../mixins/tableHeader'
export default {
	mixins: [tableHeaderMixin],
	props: {
		header: {
			type: Array,
			default: () => []
		},
		scrollLeft: {
			type: Number,
			default: 0
		}
	},
	watch: {
		// 父组件传进来，由于尽早计算显示会更快，于是在 created，这里相应的就要有 immediate 为 true
		header: {
			handler(newVal) {
				if(newVal.length > 0) this.initHeader(this.header)
			},
			immediate: true
		},
		// 把父组件滚动偏移位给到头部
		scrollLeft(newVal) {
			this.$refs.tableHeadWrapper.scrollLeft = newVal
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../mixins/mixin.scss";
.fhs-table {
	&__header-wrapper {
		@include container;
		position: relative;
		border-top-left-radius: var(--container-border-radius);
		border-top-right-radius: var(--container-border-radius);
		z-index: 2;
	}
	@include cell;
	@include head-cell;
	@include th-td;
}
</style>