<template>
  <div class="goods">
    <div class="goods-menu" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="list border-1px" :class="{'active':currentIndex===index}"
            @click="_selectMenu(index,$event)">
            <span class=" litleSpan">
              <span v-show="item.type > 0" :class="arrClass[item.type]" class="littleImg"></span>
              <span class="list-text">{{item.name}}</span>
            </span>
        </li>
      </ul>
    </div>
    <div class="goods-main" ref="foodsWrapper">
      <ul>
        <li v-for="item01 in goods" class="bigList">
          <h1 class="bigTitle">{{item01.name}}</h1>
          <ul>
            <li v-for="item02 in item01.foods" class="smallList border-1px" @click="selectFood(item02,$event)">
              <div class="bigImg">
                <img :src="item02.image" alt="" class="img">
              </div>
              <div class="info">
                <h2 class="smallTitle">{{item02.name}}</h2>
                <p class="desc">{{item02.description}}</p>
                <p class="sellNum">
                  <span class="sellCount">月售{{item02.sellCount}}份</span>
                  <span class="sellRating">好评率{{item02.rating}}%</span>
                </p>
                <p class="price">
                  <span class="nowPrice"><i class="leftI">￥</i>{{item02.price}}</span>
                  <span v-show="item02.oldPrice" class="oldPrice">￥{{item02.oldPrice}}</span>
                </p>
                <div class="carCover">
                  <CarControl :food="item02"></CarControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <ShopCar ref="ShopCar" :arrFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></ShopCar>
    <FoodDisc :food="selectedFood" ref="food"></FoodDisc>
  </div>
</template>


<script type="text/ecmascript-6">
  import FoodDisc from '../../foodDisc/FoodDisc.vue';
  import BScroll from 'better-scroll';
  import ShopCar from '../../shopcar/ShopCar.vue';
  import CarControl from '../../carControl/CarControl.vue';
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    mounted() {
      console.log(111);
    },
    data() {
      return {
        goods: [], // 接收模拟后台的数据
        arrClass: [], // 存放类名
        arrHeight: [], // 存放计算高度的数组
        scrollY: 0,
        arrFoods: [], // 存放选中的食物
        selectedFood: {} // 用来给每一个食品的详情页传递信息
      };
    },
    created() {
      this.arrClass = ['active1', 'active2', 'active3', 'active4', 'active5'];
      this.$http.get('/api/goods').then((res) => {
        if (res.body.errno === ERR_OK) {
          this.goods = res.body.data;
          this.$nextTick(() => {
            this._initScroll();
            this._computedHeight();
          });
        }
      });
      this.$root.eventHub.$on('count-add', (target) => {
          this._drop(target);
      });
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.arrHeight.length; i++) {
          let height1 = this.arrHeight[i];
          let height2 = this.arrHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
          // 二次循环出选中食物的数量
        this.goods.forEach((foods) => {
          foods.foods.forEach((food) => {
            if (food.count && this.arrFoods.indexOf(food) === -1) {
              this.arrFoods.push(food);
            }
            if (food.count === 0 && this.arrFoods.indexOf(food) !== -1) {
                this.arrFoods.splice(this.arrFoods.indexOf(food), 1);
            }
          });
        });
        return this.arrFoods;
      }
    },
    components: {
      ShopCar,
      CarControl,
      FoodDisc
    },
    methods: {
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.showDisc();
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _computedHeight() {
        let iHeight = 0;
        this.arrHeight.push(iHeight);
        let item = this.$refs.foodsWrapper.getElementsByClassName('bigList');
        for (let i = 0; i < item.length; i++) {
          let height01 = item[i].clientHeight;
          iHeight += height01;
          this.arrHeight.push(iHeight);
        }
      },
      _selectMenu(index, ev) {
        if (!ev._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('bigList');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      _drop(target) {
          this.$refs.ShopCar.drop(target);
      }
    }
  };
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../../static/css/mixin.styl"
  @import "../../../../static/css/base.styl"

  .goods
    position: absolute
    top: 174px
    bottom: 46px
    display: flex
    width: 100%
    overflow: hidden
    .goods-menu
      width: 80px
      flex: 0 0 80px
      background-color: #f3f5f7
      .active
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
      .list
        height: 54px
        width: 56px
        padding: 0 12px
        display: flex
        font-size 12px
        font-weight: 200
        line-height: 14px
        .litleSpan
          margin: auto
          .littleImg
            height: 12px
            width: 12px
            display: inline-block
            vertical-align: top
            margin-right: 2px
            font-size: 0
            vertical-align: middle
          .active1
            bg-img('decrease_3')
            background-repeat: no-repeat
            background-size: 12px 12px

          .active2
            bg-img('discount_3')
            background-repeat: no-repeat
            background-size: 12px 12px

          .active3
            bg-img('guarantee_3')
            background-repeat: no-repeat
            background-size: 12px 12px

          .active4
            bg-img('invoice_3')
            background-size: 12px 12px
            background-repeat: no-repeat
          .active5
            bg-img('special_3')
            background-repeat: no-repeat
            background-size: 12px 12px
          .list-text
            color: rgb(77, 85, 93)
            vertical-align: middle
    .goods-main
      flex: 1
      .bigList
        .bigTitle
          border-left: 2px solid #d9dde1
          height: 26px
          line-height: 26px
          font-size: 12px
          color: rgb(147, 153, 159)
          background-color: #f3f5f7
          padding-left: 14px
        .smallList
          margin: 18px
          padding-bottom: 18px
          border-1px(rgba(7, 17, 27, 0.1))
          .bigImg
            vertical-align: top
            display: inline-block
            height: 57px
            width: 57px
            .img
              height: 57px
              width: 57px
          .info
            display: inline-block
            margin-left: 10px
            .smallTitle
              font-size: 14px
              color: rgb(7, 17, 27)
              line-height: 14px
              margin: 2px 0 8px 0
            .desc
              line-height: 14px
              margin-bottom: 8px
              width: 130px
            .sellNum, .desc
              font-size: 10px
              color: rgb(147, 153, 159)
              .sellCount
                margin-right: 4px
            .price
              .nowPrice
                color: rgb(240, 20, 20)
                line-height: 24px
                font-weight: 700px
                font-size: 14px
                .leftI
                  font-style: normal
                  font-weight: normal
                  font-size: 10px
              .oldPrice
                font-size: 8px
                margin-left: -2px
                color: rgb(147, 153, 159)
                line-height: 24px
                font-weight: 700
            .carCover
              position: absolute
              right: 0
              bottom: 6px

</style>
