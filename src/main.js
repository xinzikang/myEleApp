// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/index.js';
import resource from 'vue-resource';

Vue.use(resource);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data: {
    eventHub: new Vue()
  },
  mounted() {
    Vue.set(this.eventHub, 'ratingsMain', this.$refs.appRef.ratings);
    console.log(this.eventHub.ratingsMain);
  },
  template: '<App ref="appRef"/>',
  components: {App}
});
