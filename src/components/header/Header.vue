<template>
    <div id="header">
      <!--主要内容头部-->
      <div id="content">
        <!--头像-->
        <div id="avatar"></div>
        <!--头像右侧描述-->
        <div id="description">
          <div class="title">
            <div class="brand"></div>
            <span class="name">
              {{seller.name}}
            </span>
          </div>

          <div class="express">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div class="preference">
            <div :class="arrClass[seller.supports[0].type]" v-if="seller.supports"></div>
            <span class="preferText" v-if="seller.supports">
              {{seller.supports[0].description}}
            </span>
          </div>
        </div>
      </div>
      <!--底部信息-->
      <div id="bulletin" @click="showCover">
        <div class="img"></div>
        <span class="text">
          {{seller.bulletin}}
        </span>
        <i class="icon icon-keyboard_arrow_right"></i>
      </div>
      <!--按钮-->
      <div class="button" @click="showCover">
        <span>5个</span>
        <i class="icon icon-keyboard_arrow_right"></i>
      </div>
      <!--弹出层-->
      <transition name="fade">
        <div id="cover" v-show="coverShow">
          <div class="cover-wrapper">
            <div class="cover-main">
              <h1>{{seller.name}}</h1>
              <div class="star-wrapper">
                <stars :size="48" :score="seller.score"></stars>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="title-text">优惠信息</div>
                <div class="line"></div>
              </div>
              <div class="preference-main">
                <div class="preference-item" v-for="item in seller.supports">
                  <div class="littleImg" :class="arrClass[item.type]" v-if="seller.supports"></div>
                  <span class="preferText" v-if="seller.supports">
                  {{item.description}}
                </span>
                </div>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="title-text">商家公告</div>
                <div class="line"></div>
              </div>
              <p class="text-mian">
                {{seller.bulletin}}
              </p>
            </div>
          </div>
          <div class="cover-close" @click="hideCover">
            <i class="icon-close icon"></i>
          </div>
        </div>
      </transition>

    </div>
</template>


<script type="text/ecmascript-6">
  import Stars from '../stars/stars.vue';
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      coverShow: false
    };
  },
  methods: {
    showCover() {
      this.coverShow = true;
    },
    hideCover() {
      this.coverShow = false;
    }
  },
  mounted() {
    this.arrClass = ['active1', 'active2', 'active3', 'active4', 'active5'];
  },
  components: {
      stars: Stars
  }
};
</script>


<style scoped>
  @import "../../../static/css/font.css";
  #header{
    overflow: hidden;
    position: relative;
    background-color: rgba(7, 17, 27, 0.5);
    padding-top: 1px;
  }
  #content{
    margin: 24px 0 18px 24px;
  }
  #avatar{
    height: 64px;
    width: 64px;
    background: url('avatar.png');
    background-size: 64px 64px;
    display: inline-block;
    vertical-align: middle;
  }
  #description{
    display: inline-block;
    vertical-align: middle;
  }
  .title{
    margin-bottom: 4px;
  }
  #description .brand{
    background-size: 30px 18px;
    height: 18px;
    width: 30px;
    display: inline-block;
    vertical-align: middle;
  }
  #description .name{
    vertical-align: middle;
    font-size: 16px;
    line-height: 18px;
    font-weight: bold;
  }
  .express{
    font-size: 12px;
    line-height: 12px;
    font-weight: 200;
  }
  .preference div{
    height: 12px;
    width: 12px;
    display: inline-block;
    vertical-align: middle;
  }
  .preferText{
    font-size: 10px;
    line-height: 12px;
    vertical-align: middle;
    font-width: 200;
  }
  #bulletin{
    height: 28px;
    width: 100%;
    background-color: rgba(7, 17, 27, 0.3);
    padding: 0px 12px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  #bulletin div{
    /*margin-left: 12px;*/
    -webkit-background-size: 22px 12px;
    background-size: 22px 12px;
    height: 12px;
    width: 22px;
    display: inline-block;
    vertical-align: middle;
  }
  #bulletin .text{
    font-size: 10px;
    font-weight: 200;
    line-height: 28px;
    white-space: nowrap;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: middle;
    color: #fff;
    /*margin: 0 38px;*/
    width: 84%;
  }
  .icon-keyboard_arrow_right{
    vertical-align: middle;
    color: white;
  }

  .button{
    width: 38px;
    height: 24px;
    font-size: 10px;
    font-weight: 200;
    color: #ffffff;
    line-height: 24px;
    padding-left: 6px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background-color: rgba(0,0,0,0.2);
    position: absolute;
    right: 12px;
    bottom: 48px ;
  }
  #cover{
    width: 100%;
    height: 100%;
    background-color: rgba(7, 17, 27, 0.8);
    position: fixed;
    z-index:100;
    top: 0;
    left: 0;
    overflow: auto;
  }
</style>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/mixin.styl"
  @import "../../../static/css/base.styl"
  .preference .active1
    bg-img('decrease_1')
    background-repeat:  no-repeat
    background-size: 12px 12px

  .preference .active2
    bg-img('discount_1')
    background-repeat:  no-repeat
    background-size: 12px 12px

  .preference .active3
    bg-img('guarantee_1')
    background-repeat:  no-repeat
    background-size: 12px 12px

  .preference .active4
    bg-img('invoice_1')
    background-size: 12px 12px
    background-repeat: no-repeat
  .preference .active5
    bg-img('special_1')
    background-repeat:  no-repeat
    background-size: 12px 12px
  #bulletin div
    bg-img('bulletin')
  #description .brand
    bg-img('brand')

  /*弹出层内容*/
  .fade-enter-active, .fade-leave-active
    transition: 0.5s all ease
  .fade-enter-active,.fade-leave
    opacity:1
  .fade-leave-active,.fade-enter
    opacity:0

  .cover-wrapper
    padding-top: 64px
    min-height: 100%
    box-sizing border-box
    .cover-main
      padding-bottom: 32px
    & h1
      font-weight: 700
      font-size: 16px
      line-height: 16px
      color: #ffffff
      text-align: center
    & .star-wrapper
      margin-top: 16px
      margin-bottom: 28px
      line-height: 24px
      text-align: center
    .title
      display: flex
      width: 80%
      margin:0 auto 24px auto
      height: 14px
      line-height: 14px
      color: #ffffff
      .line
        flex: 1
        position: relative
        top: -7px
        border-bottom: 1px solid rgba(255, 255, 255, 0.2)
      .title-text
        padding: 0 12px
        line-height: 14px
        font-weight: 700
        font-size: 14px
  .preference-main
    padding: 0 10%
    margin-bottom: 28px
    .preference-item
      margin: 0 12px 12px 12px
      height: 16px
      .littleImg
        height: 16px
        width: 16px
        display: inline-block
        vertical-align: middle
      .active1
        bg-img('decrease_2')
        background-repeat:  no-repeat
        background-size: 16px 16px
      .active2
        bg-img('discount_2')
        background-repeat:  no-repeat
        background-size: 16px 16px
      .active3
        bg-img('guarantee_2')
        background-repeat:  no-repeat
        background-size: 16px 16px
      .active4
        bg-img('invoice_2')
        background-size: 16px 16px
        background-repeat: no-repeat
      .active5
        bg-img('special_2')
        background-repeat:  no-repeat
        background-size: 16px 16px
      .preferText
        margin-left: 6px
        font-size: 12px
        font-weight: 200
        line-height: 12px
        color: #ffffff
        vertical-align: middle
  .text-mian
    width: 80%
    margin: 0 auto 40px auto
    padding: 0 12px
    font-size: 12px
    line-height: 24px
    color: #ffffff
  .cover-close
    position: relative
    margin: -32px auto 0
    height: 32px
    width: 32px
    i
      display: block
      margin: 0 auto
      height: 16px
      width: 16px
</style>
