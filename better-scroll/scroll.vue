<template>
  <div ref="container" class="nui-better-scroll" :style="{'--nui-better-scroll-width': containerWidth}">
    <div ref="scroll" class="nui-better-scroll__wrapper" :style="{'--nui-better-scroll-bg': backgroundColor}">
      <div>
        <!-- 下拉提示语：提示松手，提示加载中，提示加载完成， 一般只做数据的刷新 -->
        <slot
          v-if="emitPullDown && pullDownTipsShow"
          name="pullDownTips"
          :state="{ loading, beforePullDown }"
        >
          <div class="nui-better-scroll__pulldown-tips">
            <div v-if="loading" class="loading">
              <loading />
            </div>
            <!-- UI要求这里只能是粘性气泡 -->
            <div v-else-if="beforePullDown">
              <bubble ref="bubble" />
            </div>
            <div v-else>{{ pullDownCompetedText }}</div>
          </div>
        </slot>

        <!-- 用来放内容的 -->
        <div ref="content">
          <slot></slot>
        </div>

        <!-- 上划提示语，提示上划加载，提示加载中，提示没有更多数据，一般用于数据的加载 -->
        <slot v-if="emitPullUp && pullUpTipsShow" name="pullUpTips" :state="{ loading, noMore }">
          <div class="nui-better-scroll__pullup-tips">
            <div v-if="loading" class="nui-better-scroll__pullup-loading">
              <loading />
              {{ pullUpLoadingText }}
            </div>
            <div v-else-if="noMore && !loading">{{ noMoreText }}</div>
            <div v-else-if="!loading">{{ pullUpText }}</div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
import PullDown from '@better-scroll/pull-down';
import Pullup from '@better-scroll/pull-up';
// 注意到 loading 共用了原有 scroll 的 loading
import loading from '../scroll/loading.vue';
import bubble from './bubble.vue';
import { preventDefault, preventDefaultException } from '../../utils/global';

BScroll.use(PullDown);
BScroll.use(Pullup);

const TIME_BOUNCE = 800;
const THRESHOLD = 70;
const STOP = 56;
const EVENT_PULLING_DOWN = 'pulling-down';
const EVENT_PULLING_UP = 'pulling-up';

export default {
  name: 'NuiBetterScroll',
  components: {
    loading,
    bubble,
  },
  props: {
    // better-scroll 配置项
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    // 数据的总数
    total: {
      type: Number,
      default: 0,
    },
    // 容器高度，默认撑满
    wrapperHeight: {
      type: [String, Number],
      default: '100%',
    },
    // 加载提示语
    loadingText: {
      type: String,
      default: '加载中...',
    },
    pullUpText: {
      type: String,
      default: '上划加载数据',
    },
    pullUpLoadingText: {
      type: String,
      default: '数据加载中',
    },
    // 下拉加载完成提示语
    pullDownCompetedText: {
      type: String,
      default: '加载完成',
    },
    // 没有更多数据的提示语
    noMoreText: {
      type: String,
      default: '没有更多了',
    },
    // 得能控制背景色才行啊
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    containerWidth: {
      type: String,
      default: '100%',
    },
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 滚动容器实例，先注册函数防止到处判空，通过 bscroll.enabled (new 出来的滚动对象才有) 来判断是否有真实滚动容器
      bscroll: {
        finishPullDown: () => {},
        finishPullUp: () => {},
        refresh: () => {},
      },
      // 用于控制顶部提示的显隐
      pullDownTipsShow: true,
      // 用于控制底部提示的显隐
      pullUpTipsShow: false,
      // 用于控制是否发射 pullDown 事件
      emitPullDown: true,
      // 用于控制是否发射 pullUp 事件
      emitPullUp: true,
      // 用于控制是否发射 scroll 事件
      emitScroll: false,
      // 用于判断是否发送 better-scroll 对象給父组件
      emitScrollObj: false,
      // 11-03 新增
      beforePullDown: true,
      loading: false,
      // 用于控制是否处于触发了下拉事件又未结束的阶段
      emittingPullDown: false,
      // 用于控制是否处于触发了上划事件又未结束的阶段
      emittingPullUp: false,
      // 通过 total 让组件来控制 noMore
      noMore: false,
      // 初始化的状态维护有不同
      init: true,
    };
  },
  // 只要容器高度变化就 refresh 一下容器，以保证正确的显示
  watch: {
    wrapperHeight: {
      handler(newVal, oldVal) {
        this.calcSize(newVal, oldVal);
      },
      // immediate: true
    },
    // data 和 data.length 都是用来监听是否发射了上下拉事件
    data: {
      handler(newVal) {
        if (this.init) {
          this.init = false;
          if (this.total !== 0 && this.total === this.data.length) this.noMore = true;
          return;
        }
        if (newVal.length !== 0 && newVal.length !== this.total) {
          this.noMore = false;
        } else {
          this.noMore = true;
        }
        if (this.emittingPullDown) {
          this.emittingPullDown = false;
          this.finishPullDown();
        }
        if (this.emittingPullUp) {
          this.emittingPullUp = false;
          if (this.total !== 0) {
            if (this.data.length === this.total) {
              this.noMore = true;
            } else {
              this.noMore = false;
            }
          }
          this.finishPullUp();
        }
      },
      immediate: true,
    },
    'data.length': {
      handler() { // newLen
        if (this.emittingPullDown) {
          this.emittingPullDown = false;
          this.finishPullDown();
        }
        if (this.emittingPullUp) {
          this.emittingPullUp = false;
          if (this.total !== 0) {
            if (this.data.length === this.total) {
              this.noMore = true;
            } else {
              this.noMore = false;
            }
          }
          this.finishPullUp();
        }
      },
      immediate: true,
    },
    // 由于不再把结束滚动交给父组件控制，noMore 时又没有 data 的变化，于是需要单独监听
    noMore: {
      handler(newVal) {
        if (newVal === true && this.emittingPullUp) {
          this.finishPullUp();
        }
      },
    },
    // 监听options
    options: {
      handler(newVal, oldVal) {
        // 防止反复触发
        if (oldVal && JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
        if (this.bscroll.enabled) {
          this.bscroll.destroy();
          this.$nextTick(() => {
            // 这里不能用 initScroll，否则有 data 中状态被重制的 bug
            this.initEmits();
            });
          }
        },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initEmits();
      this.initWrapper();
    });
  },
  activated() {
    this.bscroll.refresh();
  },
  updated() {
    this.calcSize();
  },
  beforeDestroy() {
    if (this.bscroll.enabled) {
      this.bscroll.destroy();
    }
  },
  methods: {
    // 初始化容器，wrapper 高度和底部提示显隐
    initWrapper() {
      // 设置 wrapper 高度, 默认给到百分百
      this.$refs.scroll.style.height = this.wrapperHeight ? `${this.wrapperHeight}px` : '100%';
      if (this.bscroll.enabled) {
        this.bscroll.refresh();
      }
    },
    initEmits() {
      const listeners = Object.keys(this.$listeners);
      // eslint-disable-next-line
      listeners.includes(EVENT_PULLING_DOWN)
        ? (this.emitPullDown = true)
        : (this.emitPullDown = false) && (this.pullDownTipsShow = false);
      // eslint-disable-next-line
      listeners.includes(EVENT_PULLING_UP)
        ? (this.emitPullUp = true)
        : (this.emitPullUp = false) && (this.pullUpTipsShow = false);
      // eslint-disable-next-line
      listeners.includes("scroll")
        ? (this.emitScroll = true)
        : (this.emitScroll = false);
      // eslint-disable-next-line
      listeners.includes('getBS')
        ? (this.emitScrollObj = true)
        : (this.emitScrollObj = false);
      this.initScroll();
    },
    // 初始化 better-scroll
    initScroll() {
      if (!this.$refs.scroll) {
        return;
      }
      const bscroll = new BScroll(this.$refs.scroll, this.setOptions());
      // 用于组件销毁前销毁 bscroll 实例
      this.bscroll = bscroll;
      if (this.emitPullDown) {
        // 发射下拉事件
        bscroll.on('pullingDown', () => {
          this.beforePullDown = false;
          this.loading = true;
          this.emittingPullDown = true;
          this.$emit(EVENT_PULLING_DOWN, bscroll);
        });
      }
      if (this.emitPullUp) {
        // 设置触发上划加载的阈值
        if (bscroll.openPullUp) {
          bscroll.openPullUp({
            threshold: 100,
          });
        }
        // 发射上划事件
        bscroll.on('pullingUp', () => {
          // 只有 noMore 标记位为 false 时才有加载一说
          if (!this.noMore) {
              this.loading = true;
          // noMore 为 true 的时候也不一定 noMore 了，要结合比较
          } else if (this.total === this.data.length && this.total !== 0) {
              this.bscroll.finishPullUp();
              this.calcSize();
              return;
          }
          this.emittingPullUp = true;
          this.$emit(EVENT_PULLING_UP, bscroll);
        });
      }
      // 要给到粘性气泡正确的高度，必须初始化时就监听
      bscroll.on('scroll', (pos) => {
        if (this.beforePullDown && this.$refs.bubble !== undefined) {
          this.$refs.bubble.$data.y = pos.y - 64;
        }
        // 标记位为 true 就发射给自组件
        if (this.emitScroll) {
          this.$emit('scroll', pos);
        }
      });
      if (this.emitScrollObj) {
        // 发射滚动容器对象
        this.$emit('getBS', bscroll);
      }
      // bscroll.on("scrollEnd", () => {console.log("scrollEnd")});
      // bscroll.on("enterThreshold", () => {console.log("阶段一阈值触发")});
      // bscroll.on("leaveThreshold", () => {console.log("阶段二阈值触发")});
    },
    setOptions() {
      // 上拉刷新参数
      const pullDownRefresh = this.emitPullDown ?
        {
          threshold: THRESHOLD,
          stop: STOP,
        } : false;
      const ua = window.navigator.userAgent.toLocaleLowerCase();// 当前浏览器
      const isAndroid = /android/.test(ua); // 是否为Android系统
      const options = {
        // bounceTime: TIME_BOUNCE,
        // 容器内容需要点击事件
        click: true,
        // 只在父组件传了对应方法时才开启
        pullDownRefresh,
        // 只在父组件传了对应方法时才开启
        pullUpLoad: this.emitPullUp,
        // 处理ios14.0系统新容器滚动元素消失问题，新增一个useTransition配置项默认值，安卓为true，ios为false
        useTransition: isAndroid,
        preventDefault,
        preventDefaultException,
        ...this.options,
      };
      return options;
    },
    // 计算 data 与 wrapper 的相对高度，content 比 wrapper 短的话就隐藏 pullUpTips
    calcSize(newVal, oldVal) {
      // 未加载到dom则return
      if (!this.$refs.content || !this.$refs.scroll) {
        return;
      }
      // 如果容器高度改变就重新赋值一下
      if (newVal !== oldVal) {
        this.$refs.scroll.style.height = (typeof this.wrapperHeight === 'string')
          ? this.wrapperHeight
          : `${this.wrapperHeight}px`;
      }
      // 判断 data 是否小于 wrapper， 是就隐藏底部上划提示语
      // eslint-disable-next-line
      this.$refs.content.offsetHeight < this.$refs.scroll.offsetHeight
        ? (this.pullUpTipsShow = false)
        : (this.pullUpTipsShow = true);
      // refresh 以使滚动正常工作
      if (this.bscroll.enabled) {
        this.bscroll.refresh();
      }
    },
    finishPullDown() {
      this.loading = false;
      this.beforePullDown = false;
      setTimeout(() => { this.beforePullDown = true; }, TIME_BOUNCE - 50);
      // 这个组件逻辑上不需要判空的，去除判空，如果有调空报错再进一步完善
      this.bscroll.finishPullDown();
    },
    finishPullUp() {
      this.loading = false;
      this.bscroll.finishPullUp();
    },
  },
};
</script>

<style lang="scss">
  @import './index.scss';
</style>
