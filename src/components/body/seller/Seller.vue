<template>
  <div class="out-wrapper" ref="outWrapper">
    <div>
      <div class="info">
        <div class="info-title">
          <div class="title-left">
            <p class="name">{{this.seller.name}}</p>
            <div class="stars">
              <Stars :size="36" :score="this.seller.score"></Stars>
              <span class="score">{{this.seller.score}}</span>
              <span class="count">月售{{this.seller.sellCount}}单</span>
            </div>
          </div>
          <div class="title-rigth" @click="_collectBtn($event)">
            <i class="icon icon-favorite" :class="{active:this.collected}" ></i>
            <p>{{this.collectFn}}</p>
          </div>
        </div>
        <div class="info-num">
          <div class="item">
            <h2>起送价</h2>
            <p>
              <span class="num">{{this.seller.minPrice}}</span>
              <span class="text">元</span>
            </p>
          </div>
          <div class="item">
            <h2>商家配送</h2>
            <p>
              <span class="num">{{this.seller.deliveryPrice}}</span>
              <span class="text">元</span>
            </p>
          </div>
          <div class="item item-last">
            <h2>配送时间</h2>
            <p>
              <span class="num">{{this.seller.deliveryTime}}</span>
              <span class="text">分钟</span>
            </p>
          </div>
        </div>
      </div>
      <Split></Split>
      <div class="actives">
        <h1>公告与活动</h1>
        <p class="text">{{seller.bulletin}}</p>
        <div class="preference">
          <div class="preference-item" v-for="item in seller.supports">
            <div class="littleImg" :class="arrClass[item.type]" v-if="seller.supports"></div>
            <span class="preferText" v-if="seller.supports">
                  {{item.description}}
            </span>
          </div>
        </div>
      </div>
      <Split></Split>
      <div class="pics">
        <h1>商家实景</h1>
        <div ref="picsWrapper" class="pics-wrapper">
          <ul class="pics-list" ref="picsList">
            <li class="pics-item" v-for="pic in seller.pics">
              <img :src="pic" alt="图片" height="90px" width="120px">
            </li>
          </ul>
        </div>
      </div>
      <Split></Split>
      <div class="seller-info">
        <h1>商家信息</h1>
        <ul class="seller-info-list">
          <li v-for="item in seller.infos" class="seller-info-item">
            <p>{{item}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import Split from '../../split/Split.vue';
  import Stars from '../../stars/stars.vue';
  import BScroll from 'better-scroll';
  import ShopCar from '../../shopcar/ShopCar.vue';

  export default {
    components: {
      Split,
      Stars,
      ShopCar
    },
    computed: {
      collectFn() {
          return this.collected ? '已收藏' : '收藏';
      }
    },
    watch: {
      'seller'() {
        this._initPics();  // 当seller赋值的时候(即重新刷新),滚动组件会刷新, 但是当切换页面时,watch不会触发
        this._initSeller();   // 当seller赋值的时候(即重新刷新),滚动组件会刷新, 但是当切换页面时,watch不会触发
      }
    },
    methods: {
      // 为了解决初始化滚动的问题  要注意给DOM添加滚动的时机
      _initSeller() {
        this.$nextTick(() => {
          // 是否有滚动，没有的话绑定，有的话调用刷新方法
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.outWrapper, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      _initPics() {
        let ulWidth = (120 + 6) * 4 - 6;
        let oUl = this.$refs.picsList;
        oUl.style.width = ulWidth + 'px';
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picsWrapper, {
              scrollX: true, // 允许横向滚动
              eventPassthrough: 'vertical' // 忽略纵向滚动
            });
          } else {
            this.picScroll.refresh();
          }
        });
      },
      _collectBtn(event) {
          if (!event._constructed) {
              return;
          }
          this.collected = !this.collected;
      }
    },
    mounted() {
      this._initSeller(); // 当切换完毕页面时，重新调用滚动初始化方法
      this._initPics(); // 当切换完毕页面时，重新调用横向滚动初始化
    },
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        arrClass: ['active1', 'active2', 'active3', 'active4', 'active5'],
        collected: false  // 是否已经收藏
      };
    }
  };
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../../static/css/font.css"
  @import "../../../../static/css/base.styl"
  @import "../../../../static/css/mixin.styl"
  .out-wrapper
    width 100%
    position: absolute
    top: 174px
    bottom: 0px
    overflow: hidden
    .info
      padding: 18px
      .info-title
        padding-bottom: 18px
        border-1px(rgba(7, 17, 127, 0.1))
        display: flex
        .title-left
          flex: 1
          .name
            margin-bottom: 8px
            font: 14px / 14px ''
            color: rgb(7, 17, 27)
            .stars
              font: 10px / 18px
              color: rgb(77, 85, 93)
              .score
                margin: 8px 12px
        .title-rigth
          text-align: center
          flex: 0 0 50px
          width: 50px
        & i
          font: 24px / 24px
          color: rgba(7, 17, 27, 0.3)
          &.active
            color: rgb(240, 20, 20)
        & p
          font: 10px / 10px
          color: rgb(77, 85, 93)
      .info-num
        display: flex
        .item
          margin-top: 18px
          text-align: center
          border-1px-right(rgba(7, 17, 27, 0.1))
          flex: 1
          & h2
            font: 10px / 10px ''
            margin-bottom: 4px
            color: rgb(147, 153, 159)
          .num
            font: 24px / 24px ''
            font-weight: 200
            color: rgb(7, 17, 27)
          .text
            font: 10px / 10px ''
            margin: 0
            color: rgb(7, 17, 27)
        .item-last
          border-1px-right(rgba(255, 255, 255, 0))
    .actives
      padding: 18px
      & h1
        font: 14px / 14px ''
        color: rgb(7, 17, 27)
      .text
        margin: 8px 0px 16px 0px
        font: 12px / 24px ''
        font-weight: 200
        color: rgb(240, 20, 20)
      .preference-item
        padding: 16px 0
        border-1px-top(rgba(7, 17, 27, 0.1))
        .littleImg
          height: 18px
          width: 18px
          display: inline-block
          margin-right: 6px
          vertical-align: middle
        .active1
          vertical-align: middle
          bg-img('decrease_1')
          background-repeat: no-repeat
          background-size: 18px 18px

        .active2
          vertical-align: middle
          bg-img('discount_1')
          background-repeat: no-repeat
          background-size: 18px 18px

        .active3
          bg-img('guarantee_1')
          vertical-align: middle
          background-repeat: no-repeat
          background-size: 18px 18px

        .active4
          bg-img('invoice_1')
          background-size: 18px 18px
          background-repeat: no-repeat
          vertical-align: middle

        .active5
          bg-img('special_1')
          background-repeat: no-repeat
          vertical-align: middle
          background-size: 18px 18px
    .pics
      padding: 18px 0 18px 18px
      & h1
        margin-bottom: 12px
        font: 14px / 14px ''
        color: rgb(7, 17, 27)
      .pics-wrapper
        width: 357px
        overflow: hidden
        white-space: nowrap
        .pics-list
          height: 90px
          .pics-item
            display: inline-block
            font-size: 0
            margin-right: 6px
            &:last-child
              margin-right: 0
    .seller-info
      padding: 18px
      & h1
        margin-bottom: 12px
        font: 14px / 14px ''
        color: rgb(7, 17, 27)
      .seller-info-item
        border-1px-top(rgba(7, 17, 27, 0.1))
        padding: 16px 12px
        & p
          font: 12px/16px ''
          font-width:200
          color: rgb(7, 17, 27)
</style>
