import Vue from 'vue';
import Router from 'vue-router';

import Seller from '@/components/body/seller/Seller.vue';
import Goods from '@/components/body/goods/Goods.vue';
import Ratings from '@/components/body/ratings/Ratings.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/Goods'
    },
    {
      path: '/seller',
      component: Seller
    },
    {
      path: '/ratings',
      component: Ratings
    },
    {
      path: '/goods',
      component: Goods
    }
  ]
});
