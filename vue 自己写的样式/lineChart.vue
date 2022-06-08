<template>
  <div class="stacked-line-chart__wrapper mt-20 mb-20">
      <div class="stacked-line-chart" ref="stackedLineChart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    mounted() {
        this.assembleFlow(this.list)
    },
    methods: {
        // 将数据组装为折线图堆叠需要的格式
        assembleFlow(list) {
            const isTimerList = list.filter(item => item.isTimer === true)
            const errorTypeArr = this.classifyErrorByType(isTimerList)
            const errorArrByDate = this.classifyErrorsByDate(isTimerList)
            const errorCountByType = this.caclErrorCountByType(errorArrByDate)
            const option = this.assembleOption(errorTypeArr, errorCountByType)
            this.mountEchart(option)
        },
        assembleOption(errorTypeArr, errorCountByType) {
            const option = {
                tooltip: { 
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter(params) {
                        let result = params[0].name + '<br>';
                        params.forEach((item) => {
                            let errorType = errorTypeArr.find(errorType => errorType.startsWith(item.seriesName))
                            if(!errorType) errorType = '定时任务触发次数'
                            result += item.marker 
                                + ' '
                                + errorType
                                + ' : '
                                + item.value
                                + '</br>';
                        });
                        
                        return result;
                    },
                },
                legend: { data: [] },
                grid: {
                    left: '6%',
                    right: '6%',
                    bottom: '5%'
                },
                toolbox: { feature: { saveAsImage: {} } },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            };

            const dateArr = Object.keys(errorCountByType).sort()
            const simplifiedErrorTypeArr = errorTypeArr.map(errorType => errorType.slice(0, 4))

            option.legend.data.push(...simplifiedErrorTypeArr)
            option.xAxis.data.push(...dateArr)
            option.series = errorTypeArr.map((errorType, index) => {
                // 日期要按顺序
                const data = dateArr.reduce((acc, date) => {
                    // 对应日期对应错误类型个数，没有就推入 0
                    errorCountByType[date][errorType]
                        ? acc.push(errorCountByType[date][errorType])
                        : acc.push(0)
                    return acc
                }, [])
                return {
                    data,
                    name: simplifiedErrorTypeArr[index],
                    type: 'line',
                    smooth: true
                }
            })

            return option
        },
        caclErrorCountByType(obj) {
            const dateArr = Object.keys(obj).sort()

            return dateArr.reduce((acc, date) => {
                acc[date] = {}
                obj[date].forEach(errMsg => {
                    if(!acc[date][errMsg]) acc[date][errMsg] = 1
                    else acc[date][errMsg] += 1
                })
                return acc
            }, {})
        },
        classifyErrorsByDate(list) {
            return list.reduce((acc, cur) => {
                const date = cur.createTime.slice(0, 10)

                // 没有对应日期的键就新增，有就推入对应日期的错误数组
                if(!acc[date]) acc[date] = []
                else acc[date].push(...cur.errorTypeCounts)

                return acc
            }, {})
        },
        classifyErrorByType(list) {
            const errArr = list.reduce((acc, cur) => {
                acc.push(...cur.errorTypeCounts)
                return acc
            }, [])
            return [...new Set(errArr)]
        },
        mountEchart(option) {
            this.$nextTick(() => {
                echarts
                    .init(this.$refs.stackedLineChart, 'dark')
                    .setOption(option);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.stacked-line-chart {
    width: 100%;
    height: 700px;
    &__wrapper {
        position: relative;
    }
}
</style>