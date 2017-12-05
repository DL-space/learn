<template>
  <transition name="loading" appear>
     <div class="loading-box" v-show="isShow">
        <div class="box-content">
          <div class="loading-anim">
            <div class='uil-default-css' style='transform:scale(0.2);'><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(0deg) translate(0,-.6rem);transform:rotate(0deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(30deg) translate(0,-.6rem);transform:rotate(30deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(60deg) translate(0,-.6rem);transform:rotate(60deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(90deg) translate(0,-.6rem);transform:rotate(90deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(120deg) translate(0,-.6rem);transform:rotate(120deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(150deg) translate(0,-.6rem);transform:rotate(150deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(180deg) translate(0,-.6rem);transform:rotate(180deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(210deg) translate(0,-.6rem);transform:rotate(210deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(240deg) translate(0,-.6rem);transform:rotate(240deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(270deg) translate(0,-.6rem);transform:rotate(270deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(300deg) translate(0,-.6rem);transform:rotate(300deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div><div style='top:.8rem;left:.93rem;width:.14rem;height:.4rem;background:#ffffff;-webkit-transform:rotate(330deg) translate(0,-.6rem);transform:rotate(330deg) translate(0,-.6rem);border-radius:.1rem;position:absolute;'></div>
            </div>
          </div>
          <p class="loading-text">{{text}}</p>
        </div>

     </div>
  </transition>
</template>

<script>
export default {
   name:'loading',
   data(){
     return {
       isShow:false,
       text:'请稍候...'
     }
   },
   watch:{
     '$route'(){
       if(this.isShow) this.isShow=false;

     }
   }
}
</script>

<style lang="css" scoped>
.loading-box{
   position: fixed;
   transform: translate(-50%,-50%);
   -webkit-transform: translate(-50%,-50%);

   top:50%;
   left:50%;
   text-align: center;
   background: rgba(0, 0, 0, 0.7);
   width: 1rem;
   height: 1rem;
   border-radius: .1rem;
}
.loading-text{
  font-size: .14rem;
  color: #fff;
  transform: translateZ(0);
  margin-top: .1rem;
}
.loading-anim{
  width: 1rem;
  height: 1rem;
  margin: -.7rem 0 .3rem 0;
}
.box-content{
  display: inline-block;
  position: absolute;
  /*width: 2rem;
  height: 2rem;*/
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
}
@-webkit-keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }@keyframes uil-default-anim { 0% { opacity: 1} 100% {opacity: 0} }.uil-default-css > div:nth-of-type(1){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -1s;animation-delay: -1s;}.uil-default-css { position: relative;background:none;width:2rem;height:2rem;margin-left:-.5rem;}.uil-default-css > div:nth-of-type(2){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.9166666666666666s;animation-delay: -0.9166666666666666s;}.uil-default-css > div:nth-of-type(3){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.8333333333333334s;animation-delay: -0.8333333333333334s;}.uil-default-css > div:nth-of-type(4){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.75s;animation-delay: -0.75s;}.uil-default-css > div:nth-of-type(5){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.6666666666666666s;animation-delay: -0.6666666666666666s;}.uil-default-css > div:nth-of-type(6){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.5833333333333334s;animation-delay: -0.5833333333333334s;}.uil-default-css > div:nth-of-type(7){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.5s;animation-delay: -0.5s;}.uil-default-css > div:nth-of-type(8){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.4166666666666667s;animation-delay: -0.4166666666666667s;}.uil-default-css > div:nth-of-type(9){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.3333333333333333s;animation-delay: -0.3333333333333333s;}.uil-default-css > div:nth-of-type(10){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.25s;animation-delay: -0.25s;}.uil-default-css > div:nth-of-type(11){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.16666666666666666s;animation-delay: -0.16666666666666666s;}.uil-default-css > div:nth-of-type(12){-webkit-animation: uil-default-anim 1s linear infinite;animation: uil-default-anim 1s linear infinite;-webkit-animation-delay: -0.08333333333333333s;animation-delay: -0.08333333333333333s;}

.loading-enter-active{
    animation: notice-in .3s linear;

}
.loading-leave-active {
    animation: notice-out .3s linear;
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
