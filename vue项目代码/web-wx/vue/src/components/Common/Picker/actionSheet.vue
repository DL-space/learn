<template>
  <!-- <transition name="bg-fade" appear> -->
   <model v-show="isSlider">
      <div class="slider-model"  key="bg" @click.self="$emit('close')">
        <transition :name="position+'-swipe'">
          <div :class="['slider-panel',typeCls]" v-show="isSlider"  :style="styles">
              <slot></slot>
              <ul>
                 <li v-for="(v,i) of slots" class="slots-item br1" @click="$emit('close'),$emit('getPicker',v.value)">
                   {{v.name}}
                 </li>
              </ul>
          </div>
        </transition>
      </div>
  <!-- </transition> -->
  </model>
</template>

<script>
// import { Toast } from 'mint-ui'
import model from './model'
export default {
  name: 'good-picker',
  props:{
     isSlider:{
         type:Boolean,
         default:false
     },
     position:{
       type:String,
       default:'bottom'
     },
     slots:{
       type:Array
     },
     styles:{
       type:[Object,String]
     }
  },
  computed:{
    typeCls(){
      return 'slider-panel-'+this.position
    }
  },
  components:{model}
}
</script>

<style lang='css' scoped>
   .slider-model{
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.2);
      position: fixed;
      top:0;
      -webkit-tap-highlight-color:rgba(255,255,255,0);
      /*left:50%;*/
      /*margin-left: -3.75rem;*/
      z-index: 300;
   }
   .slider-panel{
     width: 100%;
     background: #fff;
     position: absolute;

   }
   .slider-panel-bottom{
      bottom: 0;
   }
   .slider-panel-top{
      top: 0;
   }
   .slots-item{
     color:#000;
     font-size: .17rem;
     line-height: .5rem;
     height: .5rem;
     text-align: center;
     z-index: 20;
   }
   .slots-item::before{
     border-bottom: 1px solid #e0dede;
   }
   .bottom-swipe-enter-active, .bottom-swipe-leave-active,.top-swipe-enter-active, .top-swipe-leave-active,.bg-fade-enter-active, .bg-fade-leave-active{
      transition: all .4s;
   }
    .top-swipe-enter, .top-swipe-leave-to /* .fade-leave-active in <2.1.8 */ {
      transform: translate3d(0,-4rem,0);
    }
    .bottom-swipe-enter, .bottom-swipe-leave-to /* .fade-leave-active in <2.1.8 */ {
      transform: translate3d(0,4rem,0);
    }
     .bg-fade-enter, .bg-fade-leave-to /* .fade-leave-active in <2.1.8 */ {
         background: rgba(0,0,0,0);
     }

</style>
