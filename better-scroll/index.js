import betterScroll from './scroll.vue';

/* istanbul ignore next */
betterScroll.install = (Vue) => {
  Vue.component(betterScroll.name, betterScroll);
};

export default betterScroll;
