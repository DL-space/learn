<style lang="css" scoped>


 .hjc-model-panel{
   width: 100%;
   /*position: absolute;*/
   /*height: 3rem;*/
   background: #fff;
   /*top:50%;
   left:50%;
   transform: translate(-50%,-50%);*/
   /*top:0;
   left:0;
   bottom:0;
   right:0;
   margin: auto;
   height: 50%;
   min-height: 50%;*/
   border-radius: .1rem;
   padding: .2rem .16rem;
 }

.cash-text{
  font-size: .14rem;
}
.help-close{
  width: .16rem;
  position: absolute;
  top:.1rem;
  right: .1rem;
}
.hjc-bg{
  width: 75%;
  position: fixed;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
}

.anim-scale-enter-active, .anim-scale-leave-active,.anim-fade-enter-active, .anim-fade-leave-active{
   transition: all .3s ease-out;
}
 .anim-scale-enter, .anim-scale-leave-to /* .fade-leave-active in <2.1.8 */ {
   transform: scale(0,0);

 }

</style>

<template>

     <model v-show="open">
         <div class="hjc-bg">
           <transition :name="'anim-'+animType">
             <div class="hjc-model-panel" v-if="open">
                <slot></slot>
                <img src="../../../../../static/images/client/icon-close.png" alt="" class="help-close" @click="closeFn">
             </div>
           </transition>

         </div>


     </model>


</template>

<script>
import model from '@/components/Common/Picker/model';
export default {
  data(){
    return {
      isShow:false,
    }
  },
  props:{
    open:{
      type:Boolean,
      default:false,
    },
    animType:{
      type:String,
      default:'fade'
    },
    closeFn:{
      type:Function,
      default(){
        return ()=>{

        }
      }
    }
  },
  computed:{
  },
  methods:{

  },
  components:{model}
}
</script>
