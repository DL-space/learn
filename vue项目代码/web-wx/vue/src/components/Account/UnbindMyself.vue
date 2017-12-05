<template>
  <div class="clerk">
    <confirm-component :data="confirm" v-if="isConfirm" @handleCancel="handleCancel" @handleConfirm="handleConfirm"></confirm-component>
  </div>
</template>
<script>
  import TitleStyle from '@/components/Common/Title/Title'
  import {ConfirmComponent} from '@/components/Common/Tip'
  import {Ajax,Cookie} from '@/assets/Util'
  export default{
    components:{ConfirmComponent,TitleStyle},
    data(){
      return {
        isConfirm:true,
        confirm:{
          txt:'是否解除当前微信号？'
        },
      }
    },
    created(){

    },
    methods:{
      handleConfirm(){
        if(Cookie.getCookie('openid')){
          const openid=Cookie.getCookie('openid');
          Cookie.delCookie('openid');
          this.$store.dispatch('changeTip',{txt:'解绑成功',isTip:true,loading:false,time:1000});
//          Ajax('/wechat/unbindClient',{openid},(data)=>{
//            if(data.result){
//              this.$store.dispatch('changeTip',{txt:'解绑成功',isTip:true,loading:false,time:1000,cb:()=>{
//                Cookie.delCookie('openid');
//                this.isConfirm=false;
//              }});
//            }
//          });
        }
      },
      handleCancel(){
        this.openid='';
        this.isConfirm=false;
      }
    }

  }
</script>
