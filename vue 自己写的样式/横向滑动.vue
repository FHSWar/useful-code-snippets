<!--
 * @Author: FHSWar
 * @Date: 2021-04-26 07:01:44
 * @Last Edit Time: Do not edit
-->
<template>
	<div class="outer">
		<div class="inner">
			</a-table>
		</div>
	</div>
</template>

<style scoped>
    .outer {
      overflow: hidden;
      /*最外层设置  溢出隐藏  */
    }

    .inner {
      white-space: nowrap;
      /*第二层设置  不换行  */
      overflow-y: auto;
      /*溢出框 提供滚动机制*/
    }

    .inner div {
      height: 100%;
      text-align: center;
      display: block;
    }
</style>