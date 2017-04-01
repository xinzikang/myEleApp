<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div id="tab" class="border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="this.seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from './components/header/Header.vue';
  const ERR_OK = 0; // 代表请求成功
  export default {
    data() {
     return {
      seller: {}
     };
    },
    mounted() {
      this.$http.get('/api/seller').then((response) => {
        if (response.body.errno === ERR_OK) {
          this.seller = response.body.data;
        };
      });
      this.$http.get('/api/ratings').then((response) => {
        if (response.body.errno === ERR_OK) {
          this.ratings = response.body.data;
        };
      });
    },
    name: 'app',
    components: {
      'v-header': Header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../static/css/mixin.styl"
  @import "../static/css/base.styl"
  #tab {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;

  }
  .border-1px{
    border-1px(rgba(7, 17, 27, 0.1));
  }
  #tab .tab-item {
    flex: 1;
    text-align: center;
  }

  #tab .tab-item a {
    display: block;
    font-size: 14px;
    color: rgb(77, 85, 93);
  }

  #tab .tab-item .router-link-active {
    color: rgb(240, 20, 20);
  }

</style>
