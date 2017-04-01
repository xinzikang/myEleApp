<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="clickShow">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo">
              <i class="icon-shopping_cart icon"></i>
            </div>
            <div class="num">{{allCount}}</div>
          </div>
          <div class="price">￥{{allMoney}}</div>
          <div class="desc">配送费￥{{this.deliveryPrice}}</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop="GoTOPay">
            {{payDiff}}
          </div>
        </div>
      </div>
      <!--点击小球的运动层-->
      <transition-group name="ball-fade" id="ballFade" v-on:before-enter="beforeEnter" v-on:enter="enter"
                        v-on:after-enter="afterEnter">
        <div class="ball-container ball" v-show="ball.show" v-for="ball in balls" key="ball">
          <div class="inner"></div>
        </div>
      </transition-group>
      <!--点击购物车弹出的具体菜单-->
      <transition name="list-fade">
        <div class="shopcart-list" v-show="listShow" >
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listWrapper">
            <ul>
              <li class="food" v-for="item in arrFoods">
                <span class="name">{{item.name}}</span>
                <div class="price">
                  <span>{{item.price}}</span>
                </div>
                <div class="CarControl-wrapper">
                  <CarControl :food="item"></CarControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="mask-fade">
      <div class="list-mask" v-show="listShow" @click="clickShow"></div>
    </transition>
  </div>
</template>


<script type="text/ecmascript-6">
  import CarControl from '../carControl/CarControl.vue';
  import BScroll from 'better-scroll';

  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      arrFoods: {
        type: Array,
        default() {
          return [
            {
              price: 0,
              count: 0
            }
          ];
        }
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ], // 所有的小球
        dropBalls: [], // 已经掉落的小球
        fold: true, // 购物车清单是否展开
        scrollY: 0
      };
    },
    computed: {
      allMoney() {
        let money = 0;
        this.arrFoods.forEach(function (food) {
          money += food.price * food.count;
        });
        return money;
      },
      allCount() {
        let count = 0;
        this.arrFoods.forEach(function (food) {
          count += food.count;
        });
        return count;
      },
      payDiff() {
        if (this.allMoney === 0) {
          return `￥${this.minPrice}起送`;
        }
        if (this.allMoney < this.minPrice) {
          return `还差${this.minPrice - this.allMoney}`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.allMoney < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
          if (this.allCount > 0 && !this.fold) {
            this.$nextTick(() => {
                if (!this.listScroll) {
                  this.listScroll = new BScroll(this.$refs.listWrapper, {
                    probeType: 3,
                    click: true
                  });
                } else {
                    this.listScroll.refresh();
                }
              this.listScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));
              });
            });
              return true;
          }
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          // 找出show为假的ball，让其变化为真
          if (!this.balls[i].show) {
            let ball = this.balls[i];
            ball.show = true;
            ball.el = el; // 给每一个变化的ball一个自定义属性，并赋值为DOM元素
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        for (let i = 0; i < this.balls.length; i++) {
          // 找到显示的小球
          if (this.balls[i].show) {
            let rect = this.balls[i].el.getBoundingClientRect();
            let x = rect.left - 24;
            let y = -(window.innerHeight - rect.top - 38);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(${x}px,${y}px,0)`;
            el.style.transform = `translate3d(${x}px,${y}px,0)`;
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        /* 用于重绘页面 */
        let rf = el.offsetHeight;
        /* 下一帧使小球回到原始位置 */
        this.$nextTick(() => {
          el.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) {
        /* 释放已经掉下的小球，重复利用 */
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      clickShow() {
          this.fold = !this.fold;
      },
      empty() {
          this.arrFoods.forEach((item) => {
              item.count = 0;
          });
          this.fold = true;
      },
      GoTOPay() {
          if (this.allMoney < this.minPrice) {
              return;
          }
          window.alert('去支付');
      }
    },
    components: {
      CarControl
    }
  };
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/font.css"
  @import "../../../static/css/mixin.styl"
  @import "../../../static/css/base.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        background-color: #2b343b
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-fade-enter-active
      transition: all 0.6s ease-in-out
    #ballFade
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
    .shopcart-list
      position: absolute
      transform: translate3d(0, -100%, 0)
      left: 0
      top: 0
      z-index: -1
      width: 100%
      &.ball-fade-enter-active, &.ball-fade-leave-active
        transition: all 0.5s ease
      &ball-fade-enter, &.ball-fade-leave-active
        transform: translate3d(0, 0, 0)
      &ball-fade-leave, &.ball-fade-enter-active
        transform: translate3d(0, -100%, 0)
  .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 150px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .CarControl-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur( 10px )
    background: rgba(7, 17, 27, 0.6)
    &.mask-fade-enter-active,&.mask-fade-leave-active
      transition: 0.5s all ease
    &.mask-fade-enter-active,&.mask-fade-leave
      background: rgba(7, 17, 27, 0.6)
    &.mask-fade-leave-active,&.mask-fade-enter
      background: rgba(7, 17, 27, 0)
</style>
