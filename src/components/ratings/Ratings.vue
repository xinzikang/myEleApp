<template>
  <div class="rating-wrapper" ref="zujian">
    <!--顶部选择按钮-->
    <div class="btn">
      <span class="all" @click="selectBtn(2)" :class="{'active':this.selectNum === 2}">{{this.btnDisc.all}}
        <i>{{this.ratings.length}}</i>
      </span>
      <span class="nice" @click="selectBtn(0)" :class="{'active':this.selectNum === 0}">{{this.btnDisc.nice}}
        <i>{{ratingsNice()}}</i>
      </span>
      <span class="bad" @click="selectBtn(1)" :class="{'active':this.selectNum === 1}">{{this.btnDisc.bad}}<i>{{ratingsBad()}}</i></span>
    </div>
    <!--是否只是显示有内容的-->
    <div class="onlyContent" @click="selectOnlyCon">
      <i class="icon icon-check_circle" :class="{'active':this.onlyContent}"></i>
      <span class="text">只看有内容的评价</span>
    </div>

  </div>
</template>


<script type="text/ecmascript-6">
  /*
   商品评价组件：
   需要维护的传入参数： 1.外部传入的三个按钮描述； 2.传入的food数据对象
   当选择不同评价按钮时，需要传递给父级选择结果
   * */
  export default {
    props: {
      btnDisc: {  // 按钮的文字描述
        type: Object,
        default() {
          return {
            all: '全部',
            nice: '好评',
            bad: '差评'
          };
        }
      },
      ratings: {
        type: Array,
        default() {
            return [];
        }
      },
      fn: {
          type: Function // 为了触发父组件的选择数组事件
      }
    },
    data() {
      return {
        onlyContent: false, // 是否只显示有内容的评论
        selectNum: 2, // 选择按钮的序号，默认为0 ，即‘全部’
        isActive: false,
        whichNum: 2
      };
    },
    mounted() {
        this.selectBtn(2);
    },
    methods: {
      selectOnlyCon() {
        this.onlyContent = !this.onlyContent;
        this.fn(this.selectNum);
      },
      selectBtn(num) {
        console.log(this.ratings, '组件中的ratings');
        this.selectNum = num;
        this.fn(num);
      },
      ratingsNice() { // 返回的是点击的哪个按钮
          let num = 0;
          this.ratings.forEach(function (item) {
            if (item.rateType === 0) {
                num++;
            }
          });
          return num;
      },
      ratingsBad() {  // 返回的是点击的哪个按钮
        let num = 0;
        this.ratings.forEach(function (item) {
          if (item.rateType === 1) {
            num++;
          }
        });
        return num;
      }
    }

  };
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/mixin.styl"
  @import "../../../static/css/font.css"
  @import "../../../static/css/base.styl"
  .rating-wrapper
    background-color: #fff
    border-bottom: 2px solid rgba(7, 17, 27, 0.1)
    .btn
      padding-bottom: 16px
      margin: 16px 18px
      border-1px(rgba(7, 17, 27 0.1))
      span
        color: rgb(77, 85, 93)
        border-radius: 2px
        padding: 8px 12px
        font-size: 12px
        display: inline-block
        line-height: 8px
        background-color: rgba(0, 160, 220, 0.2)
        margin-right: 8px
        & i
          font-size: 10px
          vertical-align: middle
          line-height: 10px
          font-style: normal
      .bad
        background-color: rgba(77, 85, 93, 0.2)
      .active
        color: #ffffff
        background-color: rgb(0, 160, 220)
    .onlyContent
      padding: 0px 18px 16px
      .icon
        font-size: 24px
        line-height: 24px
        color: rgb(147, 153, 159)
        vertical-align: middle
        &.active
          color: green
      .text
        vertical-align: middle
        font-size: 14px
        line-height: 24px
        color: rgb(145, 153, 159)


</style>
