<template>
  <div class="table-search">
    <a-form-model ref="searchForm" :model="form_data" layout="inline" class="limited-width">
      <a-form-model-item
        :label="item.show_name ? item.name : ''"
        v-for="(item, key) in searchItems"
        :key="key"
        :prop="item.key">
        <template v-if="item.type === 'input'">
          <a-input
            v-model="form_data[item.key]"
            allowClear
            :placeholder="item.placeholder"
            :style="item.style || 'width:230px;'"
            @change="trimInput(form_data[item.key], item.key)"
          ></a-input>
        </template>
        <template v-if="item.type === 'select' && item.select_option.length">
          <a-select
            v-model="form_data[item.key]"
            allowClear
            :placeholder="item.placeholder"
            :style="item.style || 'width:230px;'">
            <a-select-option
              v-for="(select_item, select_key) in item.select_option"
              :key="select_key"
              :value="select_item.value">
              {{ select_item.label }}
            </a-select-option>
          </a-select>
        </template>
        <template v-if="item.type === 'range-picker'">
          <a-range-picker v-model="form_data[item.key]" :placeholder="item.placeholder" v-if="!item.flag"
                          @change="(date, dateString) => changeRangePicker(date, dateString, item.key, item.flag)"
                          style="width: 230px"/>
          <a-range-picker v-model="form_data[item.key]" :placeholder="item.placeholder" v-else-if="item.flag"
                          @change="(date, dateString) => changeRangePicker(date, dateString, item.key, item.flag)"
                          style="width: 330px" showTime/>
        </template>
        <template v-if="item.type === 'cascader'">
          <a-cascader
            :options="item.select_option"
            v-model="form_data[item.key]"
            :placeholder="item.placeholder"
            :fieldNames="item.fieldNames"
          />
        </template>
        <template v-if="item.type === 'range-input'">
          <range-input
            :ref="'rangeInput_' + item.key"
            v-model="form_data[item.key]"
            :placeholder="item.placeholder"
            @setData="data => setRangeInputData(data, item.key)"
          />
        </template>
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="resetFields">重置</a-button>
        <a-divider type="vertical"/>
        <a-button type="primary" @click="submit">查询</a-button>
        <slot name="extraButtons"/>
      </a-form-model-item>
    </a-form-model>
    <div class="right-part">
      <slot/>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import 'moment/locale/zh-cn';
import RangeInput from '@/components/Input/RangeInput'
export default {
  name: 'TableSearch',
  components: { RangeInput },
  props: {
    config: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      form_data: {},
      searchItems: this.config
    }
  },
  watch: {
    config: {
      handler: function(val){
        this.searchItems = this.config
      },
      deep: true
    }
  },
  created () { this.handleSubmit() },
  methods: {
    moment,
    // 重置表单
    resetFields () {
      for (const i in this.$refs) {
        if (i.includes('rangeInput_')) {
          console.log('i', i, this.$refs[i])
          this.$refs[i][0].resetFields()
        }
      }
      this.$refs.searchForm.resetFields()
      this.submit()
    },
    // 查询时时将页面偏移值设为零, 也就是 current 为 1
    submit () {
      let pagination = { current: 1 }
      this.handleSetPage(pagination)
      this.handleSubmit()
    },
    // 提交表单数据到父组件
    handleSubmit () { this.$emit('handleSubmit', this.form_data) },
    // 设置rangeInput的值
    setRangeInputData (data, key) { this.$set(this.form_data, key, data) },
    // 修改日期
    changeRangePicker (date, dateString, key, flag) {
      // 设一个 flag, 为 true 时要传时间
      if(!flag){
        if (Array.isArray(date)) {
          date[0] = moment(date[0]).set("hour", "00").set("minute", "00").set("second", "00")
          date[1] = moment(date[1]).set("hour", "23").set("minute", "59").set("second", "59")
        }
      }
      this.$set(this.form_data, key, date)
    },
    // trim 掉首尾空格
    trimInput(value, key){ this.$set(this.form_data, key, value.replace(/(^\s*)|(\s*$)/g, ""))},
    // 设置父组件的pagination参数
    handleSetPage (pagination) { this.$emit('handleSetPage', pagination) },
  }
}
</script>

<style lang="less" scoped>
.table-search {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .limited-width{
    max-width: 80%;
  }
  .right-part{
    display: inline-block;
    width: 20%;
    max-height: 200px;
    overflow-y: auto;
  }
}
</style>
