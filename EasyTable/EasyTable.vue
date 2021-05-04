<template>
  <div>
    <slot></slot>
    <table-search :config="getSearchColumns" @handleSubmit="handleSubmit" v-show="searchArea">
      <template slot="extraButtons">
        <slot name="export"></slot>
      </template>
      <!-- 不具名插槽是给 table-search 的右边用的, 这里放置选择器, 每个表格都有 -->
      <template>
        <a-select
          mode="multiple"
          placeholder="'请选择展示列'"
          :default-value="`${getDefaultSelectOptions}`.split(',')"
          @change="handleSelectOptionsChange">
        <a-select-option v-for="(item, index) in getSelectOptions" :key="index">
          {{ item }}
        </a-select-option>
        </a-select>
      </template>
    </table-search>
    <span class="switch">
      显示搜索栏：
      <a-switch default-checked
                @change="handleSwitch"
                style="margin-left: -5px;"/>
    </span>
    <a-table @change="handleTableChange"
             :columns="getColumns"
             :data-source="dataSource"
             :pagination="pagination"
             :scroll="{ x: 'calc(700px + 100%)',y: 600 }"
             size="middle"
             class="table">
      <template slot="action" slot-scope="text, record">
        <!-- 用在最后一列, 放按钮们用 -->
        <slot name="tableButton"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import TableSearch from '@/components/EasyTable/TableSearch'

const columns = []

export default {
  name: 'EasyTable',
  components: { TableSearch },
  props: {
    // 传进来之前会滤一遍: 只要 isShow 不三等于 false 的都要展示
    config: {
      type: Array,
      default() {
        return []
      }
    },
    // 传进来的时候用短杠, 这里接的时候用驼峰
    dataSource: {
      type: Array,
      default() {
        return []
      }
    },
    pagination: {
      type: Object,
      default() {
        return { }
      }
    },
  },
  data() { return {searchArea: true} },
  computed: {
    getShouldDisplayColumns(){
      return this.config.filter(item => item.isShow !== false)
    },
    // 拿到默认展示的项, 也就是 config 中isShow 不为 false 的对象的 title 值
    getDefaultSelectOptions(){
      const res = []
      for (const item of this.getShouldDisplayColumns){
        item.isShow !== false ? res.push(item.title) : ''
      }
      return res
    },
    // 根据父组件传来的 config 生成 a-table 的 columns
    getColumns(){
      const res = []
      // 先统一梭进去
      for (const item of this.getShouldDisplayColumns){
        if(item.type !== 'select'){res.push({
          title: item.title,
          key: item.property,
          dataIndex: item.property,
          align: 'center',
          sorter: true
        })}else{res.push({
          title: item.title,
          key: item.property,
          dataIndex: `${item.property}_text`,
          align: 'center'
        })}
      }
      // 第一列固定在左边 (如果有的话)
      res[0] ? res[0].fixed = 'left' : ''
      // 如果传了按钮就放在最后一列
      if(this.$slots.tableButton){
        res.push({
          title: '操作',
          key: 'operation',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        })
      }
      return res
    },
    // 根据父组件传来的 config 生成 table-search 的 search_columns
    getSearchColumns(){
      // console.log('line111', this.getShouldDisplayColumns, this.getShouldDisplayColumns.length)
      const res = []
      for (const item of this.getShouldDisplayColumns){
        // noSearch 为 true 时不渲染对应搜索项
        if (item.noSearch === true) continue
        if(item.type !== 'select' && item.type !== 'cascader' && item.type !== 'range-picker'){
          res.push({
            key: item.property,
            name: item.title,
            placeholder: `请输入${item.title}`,
            type: 'input',
            show_name: item.showName
          })
        } else if (item.type === 'select'){
          res.push({
            key: item.property,
            name: item.title,
            placeholder: `请输入${item.title}`,
            type: 'select',
            show_name: item.showName,
            select_option: item.selectOption
          })
        } else if (item.type === 'range-picker'){
          res.push({
            key: item.property,
            name: item.title,
            placeholder: [`${item.title}起始`, `${item.title}截止`],
            type: 'range-picker',
            show_name: item.showName
          })
        }
      }
      // console.log('看看 getSearchColumns 结果：', res) // 结果儿确实没问题
      return res
    },
    // 可选的要一直从原始的 config 中拿
    getSelectOptions(){
      const res = []
      for(const item of this.config){
        res.push(item.title)
      }
      return res
    },
  },
  methods: {
    // TableSearch 这个, 这个再传给应用 EasyTable 组件的页面
    handleSubmit: function(formData){
      this.$emit('handleSubmit', formData)
    },
    // a-table 的页面发生了什么得让父组件知道
    handleTableChange: function(pagination, _, sorter){
      /*
        这样就可以做一套默认的处理，
        同时如果父组件传了对应方法，
        默认的处理就会被覆盖
      */
      if(this.$listeners['handleTableChange']){
        // 如果提供执行
        this.$emit('handleTableChange', pagination, _, sorter)
      }else{
        // 否侧执行其他
        console.log('老哥不得了')
      }
    },
    handleSelectOptionsChange(value) {
      // value 是个只有两个元素的数组, 第一个是我们的目标
      console.log('看看', value, Array.isArray(value))
      this.$emit('handleColumnChange', value)
    },
    handleSwitch(checked){
      this.searchArea = checked
    },
  }
}
</script>

<style scoped>
.switch{
  position: relative;
  top: -28px;
  right: calc(-73% + 50px);
  display: inline-block;
  width: 150px;
}
.table{
  position: relative;
  top: -21px;
}
</style>