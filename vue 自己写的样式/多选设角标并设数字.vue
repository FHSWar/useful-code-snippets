<!--
 * @Author: FHSWar
 * @Date: 2021-04-20 18:21:43
 * @Last Edit Time: Do not edit
-->
<template>
	<!-- 真实代码中 card 是 v-for 出来的一个个 card, 每个 card 的数据都是 item -->
	<a-card class="container" @click="toggleSelected(item)">
        <!-- 用于角标 -->
        <template v-if="isSelected(item)">
            <div class="triangle"></div>
            <span class="num">{{ getSerialNum(item) }}</span>
        </template>
    </a-card>
</template>
<script>
    // 维护一个数组比维护几个数组性能好, 维护简单值数组比维护对象数组性能好
	export default{
        data (){
            return{
                selectedList: []
            }
        },
        methods: {
           toggleSelected(item) {
                const id = item.id
                let selectedList = this.selectedList
                if (selectedList.includes(id)) {
                    selectedList = selectedList.filter((n) => n != id)
                } else {
                    selectedList.push(id)
                }
                this.selectedList = selectedList
            },
        },
        computed: {
            _selectedList: function () {
                let selectedList = this.selectedList
                let arr = []
                let serialNum = 1
                for (let i in selectedList) {
                    arr.push({
                    id: selectedList[i],
                    serialNum: serialNum,
                    })
                    serialNum++
                }
                return arr
            },
            isSelected() {
                return function (item) {
                return this.selectedList.includes(item.id)
                }
            },
            getSerialNum() {
                return function (item) {
                    return this._selectedList.find((n) => n.id == item.id).serialNum || 1
                }
            },
        }
    }
</script>
<style scoped lang="less">
    .container {
        position: relative;
        width: 300px;
        height: 300px;
        background-color: #fafafa;
    }

    .triangle {
        /* border-left: 30px solid transparent; */
        border-right: 35px solid #40a9ff;
        border-bottom: 35px solid transparent;
        position: absolute;
        top: 0;
        right: 0;
    }

    .num {
        position: absolute;
        top: 0;
        right: 7px;
    }
</style>