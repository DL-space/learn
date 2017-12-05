<template>
    <transition name="bg-fade" appear>
      <div class="all-model">
      <slot></slot>
      </div>
    </transition>


</template>

<script>


export default {
  name: 'model',
  data () {
    return {

    }
  },
  computed:{
  },
  methods:{

  },
  created(){

  },
}
</script>

<style lang='css' scoped>

.all-model{
   width: 100%;
   height: 100%;
   background: rgba(0,0,0,.7);
   position: fixed;
   top:0;
   left: 0;
   z-index: 10;
}
.model-panel{
   width: 85%;
  /*//  padding: .2rem .2rem .4rem .2rem;*/
   max-height: 70%;
   min-height: 40%;
   position: absolute;
   transform: translate(-50%,-50%);
   -webkit-transform: translate(-50%,-50%);
   left:50%;
   top:50%;
   background: #f1f1f1;
   border-radius: .2rem;
}

.bg-fade-enter-active, .bg-fade-leave-active{
   transition: all .3s;
}
 .bg-fade-enter, .bg-fade-leave-to /* .fade-leave-active in <2.1.8 */ {
   opacity: 0;
 }
</style>
