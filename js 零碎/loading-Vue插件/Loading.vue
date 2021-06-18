<template>
    <div class="container" v-show="isShow">
      <div class="loading"></div>
      <p class="title">{{title}}</p>
    </div>
</template>

<script>
export default {
  name: 'Loading',
  data: function () {
    return {
      title: '正在加载...',
      isShow: false
    }
  }
}
</script>

<style scoped lang="scss">
  .container{
    width: 200px;
    height: 200px;
    border-radius: 20px;
    background: rgba(0,0,0,0.5);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .loading{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 5px solid #fff;
      margin: 20px auto;
      border-right-color: #409eff;
      animation: loading 2s linear infinite;
    }
    .title{
      text-align: center;
      font-size: 16px;
      color: #fff;
    }
  }
  @keyframes loading {
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(360deg);
    }
  }
</style>
