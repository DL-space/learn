<template>
  <transition name="fade"><router-view></router-view></transition>
</template>
<script type="text/javascript">

  export default {

  }
</script>

<style scoped>
.fade-enter-active{
    animation: notice-in .5s ease;

}
.fade-leave-active {
    /*animation: notice-out .1s linear;*/
}
@keyframes notice-in {
 0% {
   opacity: 0;
 }
 100% {
   opacity: 1;
 }
}
@keyframes notice-out {
 0% {
   opacity: 1
 }

 100% {
   opacity: 0;
 }
}
</style>
