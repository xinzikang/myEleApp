<template>
  <div class="out-wrapper" ref="outWrapper">
    <div>
      <div class="score">
        <div class="score-left">
          <p class="score-num">{{seller.score}}</p>
          <p class="score-title">综合评分</p>
          <p class="score-desc">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="score-rigth">
          <div class="item">
            <span>服务态度</span>
            <Stars :size="36" :score="seller.serviceScore" :style="this.css"></Stars>
          </div>
          <div class="item">
            <span>饰品美味</span>
            <Stars :size="36" :score="seller.foodScore" :style="this.css"></Stars>
          </div>
          <div class="item">
            <span>送达时间</span>
            <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <Split></Split>
      <Ratings :btnDisc="this.btnDisc" :ratings="this.ratings" :fn="this.changeRatings" ref="isOnly"></Ratings>
      <div class="list">
        <ul>
          <li v-for="item in selectRatings" class="list-item">
            <div class="ratings-left">
              <div class="imgBox">
                <img :src="item.avatar" alt="头像" height="28" width="28">
              </div>
            </div>
            <div class="ratings-right">
              <div class="name">
                <p class="name-left">{{item.username}}</p>
                <p class="name-right">{{date(item.rateTime)}}</p>
              </div>
              <div class="stars">
                <Stars :size="24" :score="item.score"></Stars>
                <span v-if="item.deliveryTime">{{item.deliveryTime}}分钟送达</span>
              </div>
              <div class="text" v-if="item.text">{{item.text}}</div>
              <p v-if="!item.text" class="noText">该用户没有评论</p>
              <div class="type">
                <!--0是好评，1是差评-->
                <i class="icon bad icon-thumb_down" v-show="item.rateType === 1"></i>
                <i class="icon nice icon-thumb_up" v-show="item.rateType === 0"></i>
                <span class="itemCont" v-for="itemCont in item.recommend">{{itemCont}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>


<script type="text/ecmascript-6">
  import Split from '../../split/Split.vue';
  import BScroll from 'better-scroll';
  import Ratings from '../../ratings/Ratings.vue';
  import Stars from '../../stars/stars.vue';
  let ERR_OK = 0;
  export default {
    components: {
      Split,
      Ratings,
      Stars
    },
    data() {
      return {
        css: {
          'vertical-align': 'middle'
        },
        btnDisc: {  // 按钮的文字描述
          all: '全部',
          nice: '满意',
          bad: '吐槽'
        },
        onlyContent: false,
        selectRatings: [],
        ratings: []         // deletNum: null  调试使用
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    watch: {  // 通过监控this.ratings的改变，触发点击按钮，已解决刷新未渲染的bug
        'ratings'() {
          console.log('临时数据改变了');
          this.selectRatings = this.ratings;
          console.log(this.ratings);
          this.$refs.isOnly.selectBtn(2);
        }
    },
    /* 这是在调ratings自动渲染的代码，通过监控ratings的赋值，在它改变的时候自动调用点击事件
    beforeCreate() {
      console.log('beforeCreattes');
      this.deletNum = 0;
    },
    mounted() {
      this.deletNum = 1;
      console.log('ssmounted');
    }, */
    created() {
        this.beShow = false;
//      console.log(this.ratings, 'body中的创建时期的rating');
      // 因为如果直接在该页刷新时，会因为请求不到数据而报错，所以直接再重新获取一下数据
      this.$http.get('/api/ratings').then((response) => {
        if (response.body.errno === ERR_OK) {
          this.ratings = response.body.data;
          console.log('rating改变了');
        };
      });
      this.$nextTick(() => {
        /* 如果没有绑定过 */
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.outWrapper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    methods: {
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
            this.ratings.forEach(function (item) {
              if (item.text) {
                arr.push(item);
              }
            });
            this.selectRatings = arr;
          } else {
            /* 没有勾选只显示内容的选项 */
            this.selectRatings = this.ratings;
          }
        } else {
          let arr = [];
          this.ratings.forEach(function (item) {
            if (item.rateType === num) {
              /* 如果勾选了指显示有内容的选项 */
              if (that.childOnlyContent) {
                if (item.text) {
                  arr.push(item);
                }
              } else {
                /* 如果没有勾只显示有内容的选项 */
                arr.push(item);
              }
            }
          });
          this.selectRatings = arr;
        }
        // 重新刷新滚动
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      // 根据子组件的参数判断是不是勾选了‘只显示内容’选项
      showContent() {
        if (this.$refs.isOnly.onlyContent) {
          this.childOnlyContent = true;
        } else {
          this.childOnlyContent = false;
        }
        return this.childOnlyContent;
      }
    }
  };
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../../static/css/mixin.styl"
  @import "../../../../static/css/base.styl"
  .out-wrapper
    position: fixed
    overflow: hidden
    top: 174px
    bottom:0
    left:0
    width:100%
    .score
      display: flex
      padding: 18px 24px
      .score-left
        flex: 0 0 130px
        width: 130px
        border-1px-right(rgba(7, 17, 27, 0.1))
        .score-num
          font-size: 24px
          text-align: center
          line-height: 28px
          color: rgb(255, 153, 0)
          margin-bottom: 6px
        .score-title
          font-size: 12px
          text-align: center
          line-height: 12px
          color: rgb(7, 17, 27)
          margin-bottom: 8px
        .score-desc
          font-size: 10px
          text-align: center
          line-height: 10px
          color: rgb(147, 153, 159)
      .score-rigth
        flex: 1
        margin-left: 20px
        .item
          font-size: 12px
          margin-bottom: 8px
          line-height: 18px
          & span
            margin-right: 12px
            vertical-align: top
            color: rgb(7, 17, 27)
          & .deliveryTime
            color: rgb(147, 153, 159)
    .list
      padding: 0 18px
      .list-item
        border-1px(rgba(7, 17, 27, 0.1))
        padding: 18px 0
        display: flex
        .ratings-left
          flex: 0 0 40px
          .imgBox
            height: 28px
            width: 28px
            margin-right: 12px
            border-radius: 50%
            overflow: hidden
        .ratings-right
          flex: 1
          .name
            font: 10px/12px ''
            padding-bottom: 4px
            .name-left
              color: rgb(7, 17, 27)
            .name-right
              float: right
              color: rgb(147, 153, 159)
              font-weight: 200
          .stars
            & span
              margin-left: 6px
              font: 10px/12px ''
              color: rgb(147, 153, 159)
              font-weight: 200
          .text
            margin: 8px 0
            font: 12px/18px
            color: rgb(7, 17, 27)
          .type
            .icon
              font: 12px / 16px ''
              &.nice
                color: rgb(0, 160, 200)
              &.bad
                color: rgb(147, 153, 159)
            .itemCont
              border(rgba(7, 17, 27, 0.1))
              font-size: 9px
              color: rgb(147, 153, 159)
              padding: 4px
              margin-right: 6px
          .noText
            margin: 8px 0
            font: 12px/18px
            color: rgba(7, 17, 27, 0.1)
</style>
