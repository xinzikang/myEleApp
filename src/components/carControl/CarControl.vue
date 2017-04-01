<template>
  <div class="carControl">
    <transition name="fade">
      <div class="count_delete icon-remove_circle_outline icon" @click.stop="countDelete($event)"
           v-show="this.food.count"></div>
    </transition>
    <div class="count" v-show="this.food.count">
      {{this.food.count}}
    </div>
    <div class="count_add icon-add_circle icon" @click.stop="countAdd($event)"></div>
  </div>
</template>


<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      countDelete(ev) {
        if (!ev._constructed) {
          return;
        }
        this.food.count -= 1;
      },
      countAdd(ev) {
        if (!ev._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
          this.$root.eventHub.$emit('count-add', event.target);
          return;
        }
        this.food.count += 1;
        this.$root.eventHub.$emit('count-add', event.target);
      }
    }
  };
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../static/css/font.css"
  .carControl
    font-size: 0
    .fade-enter-active, .fade-leave-active
      transform: all 0.5s ease
    .fade-enter-active, .fade-leave
      opacity: 1
      transform: translate3d(0, 0, 0) rotateZ(0deg)
    .fade-enter, .fade-leave-active
      opacity: 0
      transform: translate3d(36px, 0, 0) rotateZ(180deg)
    .count_delete
      display: inline-block
      line-height: 24px
      padding: 2px
      font-size: 24px
      color: rgb(0, 160, 220)
    .count
      display: inline-block
      vertical-align: top
      width: 10px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .count_add
      display: inline-block
      padding: 4px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
