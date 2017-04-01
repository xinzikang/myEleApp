<template>
  <div class="outer" ref="foodWrapper" v-show="this.beShow">
    <div class="foodDisc-wrapper" >

      <div class="head-img">
        <img :src="food.image">
        <div class="back" @click="back">
          <i class="icon-arrow_lift icon"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <div class="carControl" v-show="food.count && food.count!==0">
          <CarControll :food="food"></CarControll>
        </div>
        <div class="buy" v-show="!food.count || food.count===0" @click="addCar($event)">加入购物车
        </div>
      </div>
      <Split></Split>
      <div class="info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{food.info}}</p>
        <Split></Split>
      </div>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <Ratings :ratings="food.ratings" :fn="changeRatings" ref="isOnly"></Ratings>
        <!--评价列表-->
        <div class="list">
          <ul>
            <li v-for="rating in selectRatings" class="item">
              <div class="time">
                <div class="rateTime">{{date(rating.rateTime)}}</div>
                <div class="user">
                  <span class="username">{{rating.username}}</span>
                  <div class="userImg">
                    <img class="avatar" :src="rating.avatar" height="12" width="12" alt="头像">
                  </div>
                </div>
              </div>
              <div class="content">
                <!--0是好评，1是差评-->
                <i class="icon bad icon-thumb_down" v-show="rating.rateType === 1"></i>
                <i class="icon nice icon-thumb_up" v-show="rating.rateType === 0"></i>
                <span v-if="rating.text" class="text">{{rating.text}}</span>
                <span v-if="!rating.text" class="noText">该用户没有评论</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import CarControll from '../carControl/CarControl.vue';
  import Split from '../split/Split.vue';
  import Ratings from '../ratings/Ratings.vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    components: {
      CarControll,
      Split,
      Ratings
    },
    data() {
      return {
        beShow: false,
        selectRatings: [], // 默认为选择的评价是所有评价  此处为bug，有待修复（初始化没有显示）
        childOnlyContent: true // 是否勾选了只显示有内容的选项
      };
    },
    // 为了给selectRatings赋值：监听页面是否显示，显示的话就可以赋值
    watch: {
      'beShow'() {
          this.selectRatings = this.food.ratings;
          console.log('beshow改变了,已经给this.selectRatings赋值了');
      }
    },
    methods: {
      // 根据子组件的参数判断是不是勾选了‘只显示内容’选项
      showContent() {
        if (this.$refs.isOnly.onlyContent) {
          this.childOnlyContent = true;
        } else {
          this.childOnlyContent = false;
        }
        return this.childOnlyContent;
      },
      // 添加到购物车
      addCar(ev) {
        if (!ev._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
          return;
        }
        this.food.count = 1;
      },
      showDisc() {
        this.beShow = true;
        this.$nextTick(() => {
          /* 如果没有绑定过 */
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodWrapper, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      // 回退按钮
      back() {
        this.beShow = false;
      },
      // 计算日期
      date(T) {
        let time = new Date(T);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();

        function ToDbl(n) {
          return n < 10 ? '0' + n : '' + n;
        };
        let str = year + '-' + ToDbl(month) + '-' + ToDbl(day) + '  ' + ToDbl(hours) + ':' + ToDbl(minutes) + ':' + ToDbl(seconds);
        return str;
      },
      changeRatings(num) {
        let that = this;
        this.showContent();
        if (num === 2) {
          /* 如果勾选了‘只显示有内容的’选项 */
          if (this.childOnlyContent) {
            let arr = [];
            this.food.ratings.forEach(function (item) {
              if (item.text) {
                arr.push(item);
              }
            });
            this.selectRatings = arr;
            console.log('勾选了');
          } else {
            /* 没有勾选只显示内容的选项 */
            this.selectRatings = this.food.ratings;
            console.log('没有勾选');
          }
        } else {
          let arr = [];
          this.food.ratings.forEach(function (item) {
            if (item.rateType === num) {
              /* 如果勾选了指显示有内容的选项 */
              if (that.childOnlyContent) {
                if (item.text) {
                  arr.push(item);
                }
                console.log('有勾选');
              } else {
                /* 如果没有勾只显示有内容的选项 */
                arr.push(item);
                console.log('没有勾选');
              }
            }
          });
          this.selectRatings = arr;
        }
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    }
  };
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/mixin.styl"
  @import "../../../static/css/font.css"
  @import "../../../static/css/base.styl"
  .outer
    position: fixed
    top: 0
    left: 0
    bottom: 48px
    /*z-index: 30*/
    width: 100%
    .foodDisc-wrapper /*position: fixed
      top: 0
      left: 0
      bottom: 48px
      z-index: 30
      width: 100%*/
      background: #ffffff
      transition: transform3d(100%, 0, 0)
      &.fade-enter-active, &.fade-leave-active
        transition: all .5s ease
      &.fade-enter, &.fade-leave-active
        transition: transform3d(100%, 0, 0)
      &.fade-leave, &.fade-enter-active
        transition: transform3d(0, 0, 0)
      .head-img
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 14px
            color: #fff

      .content
        position: relative
        padding: 18px
        .title
          line-height: 14px
          margin-bottom: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          height: 10px
          font-size: 0
          .sell-count, .rating
            font-size: 10px
            color: rgb(147, 153, 159)
          .sell-count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
        .carControl
          width: 70px
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          z-index: 10
          height: 24px
          line-height: 24px
          padding: 0 12px
          box-sizing: border-box
          border-radius: 12px
          font-size: 10px
          color: #fff
          background: rgb(0, 160, 220)
      .info
        padding: 18px 0 18px 0
        background-color: #fff;
        .title
          padding: 0 18px 0 18px
          line-height: 14px
          margin-bottom: 6px
          font-size: 14px
          color: rgb(7, 17, 27)
        .text
          padding: 18px
          line-height: 24px
          font-size: 12px
          color: rgb(77, 85, 93)
      .rating
        background-color: #fff
        .title
          padding: 18px 18px 0
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .list
          .item
            padding: 16px 18px
            background: #ffffff
            border-1px(rgba(7, 17, 27, 0.1))
            .time
              display: flex
              font-size: 10px
              color: rgb(147, 153, 159)
              line-height: 24px
              .rateTime
                flex: 1
              .user
                flex: 0 0 60px
                width: 60px
                .username
                  font-size: 10px
                  line-height: 12px
                  color: rgb(147, 153, 159)
                .userImg
                  height: 12px
                  width: 12px
                  border-radius: 50%
                  vertical-align: middle
                  display: inline-block
                  overflow: hidden
                  .avatar
                    vertical-align: top
          .content
            border-1px(7, 17, 27, 0.2)
            padding: 0
            .icon
              font-size: 12px
              line-height: 24px
              &.nice
                color: rgb(0, 160, 200)
              &.bad
                color: rgb(147, 153, 159)
            .text
              font-size: 12px
              line-height: 16px
              color: rgb(7, 17, 27)
            .noText
              font-size: 12px
              line-height: 16px
              color: rgba(7, 17, 27, 0.1)
</style>
