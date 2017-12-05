<template>
  <div class="feedback">
    <h1 class="feedback-tit">感谢您提出宝贵的意见和建议，车服云物流会倾听每位客户的声音，尽最大的努力提供最优质的服务！</h1>
    <textarea class="feedback-text" placeholder="写下您的意见" v-model="text"></textarea>
    <span class="feedback-num">字数:{{text.length}}/295</span>
    <button class="feedback-btn" @click="submit">提交</button>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
export default {
  data(){
    return {
      text:''
    }
  },
  watch:{
    text(n,o){
      if(n.length>=295){
        this.text=this.text.slice(0,295);
        return Toast('字数已满')
      }
    }
  },
  methods:{
    submit(){
      if(!this.text) return Toast('内容不可为空');
    }
  }
}
</script>

<style lang="css" scoped>
 .feedback{
   padding: .2rem .1rem;
   height: 100vh;
   background: #f4f4f4;
 }
 .feedback-text{
   width: 100%;
   height: 2rem;
   background: #fff;
   padding: .06rem;
   border-radius: .04rem;
   font-size: .15rem;
   color: #333;
 }
 .feedback-tit{
   margin-bottom: .2rem;
   font-size: .15rem;
   color:#888;
   line-height: .2rem;
 }
 .feedback-btn{
   width: 100%;
   height: .4rem;
   color:#fff;
   background: #3caaff;
   border-radius: .04rem;
   margin-top: .3rem;
 }
 .feedback-num{
   color: #8a8a8a;
 }
</style>
