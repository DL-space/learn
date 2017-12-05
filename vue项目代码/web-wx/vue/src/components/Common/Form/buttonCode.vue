<template>
  <button :class="['box-code-butt','transCenter',cls]" @click="getCode">
       {{codeTime+codeString}}
  </button>
</template>

<script>
import { mapActions } from 'vuex'
import { Toast } from 'mint-ui'
import { Axios } from '@/assets/Util'
import config from '../../../../conf'
// import ajax from '../store/ajax'

export default {
  name: 'button-code',
  data () {
    return {
        codeTime:'获取验证码',
        codeString:'',
        code:'',
    }
  },
  props:{
     phone:{
        type:[Number,String],
     },
     cls:{
        type:String
     },
     ck:{
        type:Function
     },
     type:{
        type:Boolean,
        default:false
     },
     url:{
       type:String
     },
     api:{
       type:Boolean,
       default:true
     },
     params:{
       type:Object,
       default(){
         return {}
       }
     },
     phoneKey:{
       type:String,
       default:'phone'
     }
  },
  methods:{

    getCode(){
       if(typeof this.codeTime=='number') return;
       var {phone,$parent,ck,type}=this,phoneReg=/^[1][0-9]{10}$/;
       if(!phone) return Toast('请输入手机号')
       if(!phoneReg.test(phone)) return Toast('手机号有误')
       var body={phone};


       this.countDown(60);
       localStorage.setItem('smsCode2',60);

       let url = this.api?config.api_api_url:config.api_url;
           url = url+this.url;

       this.params[this.phoneKey]=this.phone;

       Axios(url,this.params).then(dt=>{

          if(!dt.result || dt.code!=0) return Toast('验证码发送失败');
          Toast('验证码已发送，请注意查收！')
          // $parent.isShow=true;
          this.countDown(60);
          localStorage.setItem('smsCode2',60)
          ck && ck(dt.data);
       })
    },
    countDown(time){

       this.codeTime=time;
       this.codeString='s'
       clearInterval(this.$timer);
       this.$timer=setInterval(()=>{
          if(this.codeTime==1){
             clearInterval(this.$timer);
             this.codeTime='获取验证码';
             this.codeString='';
             localStorage.removeItem('smsCode2');
          }
          else{
             this.codeTime--;
             localStorage.setItem('smsCode2',this.codeTime)
          }
       },1000)
    },
    submit(){
      let {code}=this,codeReg=/^\d{6}$/;
      if(!code) return Toast('请填写验证码');
      if(!codeReg.test(code)) return Toast('验证码格式不对');

      this.$parent.submit(code).then(()=>{
         clearInterval(this.$timer);
         localStorage.removeItem('smsCode2');
      })
    }
  },
  created(){
     var codeTime=localStorage.getItem('smsCode2');
     if(codeTime) this.countDown(Number(codeTime));
  }
}
</script>

<style lang='css' scoped>

 .box-code-butt{
    border: none;
    /*position: absolute;
    right: 0;*/
    height: .24rem;
    background: none;
    color: #888;
    font-size: .15rem;
    border-left: 1px solid #e0dede;
    padding: 0 .17rem;
 }

</style>
