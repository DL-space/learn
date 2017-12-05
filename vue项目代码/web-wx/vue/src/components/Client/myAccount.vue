<style lang="css" scoped>
 .my-account{
   color:#333;
 }
 .account-head{
    height: .4rem;
    line-height: .4rem;
    font-size:.14rem;
    padding: 0 .2rem;
    position: relative;
 }
 .account-head::after{
    /*border-bottom:1px solid #e0dede;*/
 }
 .head-right{
   position: absolute;
   right: .1rem;
   /*color:#1296fb;*/
 }
 .account-balance{
   font-size: 0;
   /*padding: .1rem 0;*/
 }
 .balance-left,.balance-right{
   /*display: inline-block;*/
   /*width: 50%;*/
   /*padding: .3rem 0;*/
   /*text-align: center;*/
   padding: .28rem .2rem;
 }
 .balance-left::after{
   /*border-bottom:1px solid rgba(255,255,255,.2);*/
 }
 .balance-tit{
   font-size: .14rem;
 }
 .balance-num{
   font-size: .46rem;
   line-height: .5rem;
   margin-top: .16rem;
 }
  .account-get{
    /*height: .4rem;*/
    font-size: .18rem;
    /*line-height: .4rem;*/
    color:#666;
    padding: .18rem .2rem;
    /*z-index:-1;*/
  }
 .account-get::before{
   border-top:1px solid #e0dede;
   border-bottom:1px solid #e0dede;
   z-index: -1;
 }
 .get-right{
   width: .24rem;
   /*vertical-align: middle;*/
   transform: translateY(-50%);
   top:50%;
 }
 .left-alert{
   color:#999;
   font-size: .14rem;
 }
 .account-top{
   color:#fff;
   background: #3caaff;
 }
 .account-no-alert{
   text-align: center;
 }
 .alert-img{
   width: .6rem;
 }
 .alert-text{
   font-size: .15rem;
   margin-top: .1rem;
 }
 .account-no-alert{
   padding-top: .4rem;
   overflow: hidden;
 }
 .password-tit{
   text-align: center;
   font-size: .17rem;
   color:#888;
   padding-top: .4rem;
 }

 .input-list{
   padding:.2rem;
 }
 .pay-submit{
   border: none;
   width: 100%;
   margin-top: .4rem;
   color:#fff;
   height: .45rem;
   background: #3caaff;
 }
 .get-back{
   width: 3rem;
 }
</style>

<template lang="html">
  <div class="my-account" v-show="status!=null">
    <div class="account-content" v-if="status==2">
      <div class="account-top">
        <div class="account-head">
          <!-- <span>我的账户</span> -->
          <router-link tag="span" :to="{name:'accountRecord'}" class="head-right">交易记录</router-link>
        </div>
        <div class="account-balance">
           <div class="balance-left in-bk-center br1">
             <div class="center-box">
               <p class="balance-tit">账户余额(元)</p>
               <p class="balance-num">￥{{accountBalance}}</p>
             </div>
           </div>
           <!-- <div class="balance-right">
             <div class="center-box">
               <p class="balance-tit">待提运单</p>
               <p class="balance-num">5</p>
             </div>
           </div> -->
        </div>
      </div>

       <router-link tag="div" :to="{name:'orderPick'}" class="account-get br1">
          <span>
            提现
            <p class="left-alert" v-show="noGetCash">{{noGetCash}}个待提运单</p>
          </span>
          <img class="head-right get-right" src="../../../static/images/client/icon-right-jump.png">
       </router-link>
    </div>
    <div class="account-no-alert" v-else-if="status==0">
       <img class="alert-img" src="../../../static/images/client/icon-no-alert.png" alt="">
       <p class="alert-text">您尚未申请虚拟账户哦</p>
       <button @click="handleBack" class="pay-submit get-back">返回</button>
    </div>
    <div class="pay-password" v-else>
       <!--<h1 class="password-tit">首次登录设置支付密码</h1>-->
       <div class="input-list">
         <input-text placeholder="输入支付密码(6位数字)" v-model="pay.password" :number="true" :max="6" type="password"/>
         <input-text placeholder="再次输入支付密码" v-model="pay.password2" :number="true" :max="6" type="password"/>
         <input-text placeholder="输入登记手机号" v-model="pay.phone" :number="true" :max="11" type="tel">
            <button-code slot="slot-right" :phone="pay.phone" :api="true" url="/account/accountapp/sendMessage" :params="codeParams" phoneKey="referenceNumber" :ck="getCode"/>
         </input-text>
         <input-text placeholder="输入验证码" v-model="pay.code" :number="true" :max="6" type="tel"/>
         <button class="pay-submit" @click="payPasswordBtn()">提交</button>
       </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import {Axios,Cookie} from '@/assets/Util';
import { mapGetters } from 'vuex';
import inputText from '@/components/Common/Form/inputText'
import {ButtonClient,buttonCode} from '@/components/Common/Form'
import { Toast } from 'mint-ui'

export default {
  data(){
    return {
      status:null,
      accountBalance:'',
      pay:{
        openId:'',
        password:'',
        phone:'',
        password2:'',
        code:'',
        verificationCodeEncrypt:''

      },
      codeParams:{
        openId:'',
        scene:'01'
      },
      noGetCash:'',
      locked:true
    }
  },
  created(){
    this.getStatus();

  },
  computed:{
    ...mapGetters([
      'openid'
    ])
  },
  methods:{
    getStatus(){
      this.pay.openId=this.codeParams.openId=this.openid;
      let ast = Cookie.getCookie('ast');
      if(ast == '1') return this.status=2,this.getMyAccount();
      Axios('/account/accountapp/getAccountInfo',{openId:this.openid},{api:1}).then(data=>{
        console.log(data)
        if(data.result){
          this.status=data.data;
          if(this.status==2) this.getMyAccount();
        }else{
              return Toast('获取开户信息失败！');
        }
      })
    },
    getMyAccount(){
      Cookie.setCookie('ast','1');
      Axios('/account/accountapp/getAssetInfo',{openId:this.openid},{api:1}).then(dt=>{
        if(!dt.result || !dt.code==0) return;
        if(dt.data.state==-1) return Toast(dt.data.message)
        this.accountBalance=dt.data.accountBalance;
      })
      Axios('/chefu/account/transaction/queryDrawDetail',{openId:this.openid,presentStates:0},{api:1}).then(dt=>{
        if(!dt.result || !dt.code==0) return Toast(dt.message);
        this.noGetCash = dt.data.totalCount;
      })
    },
    getCode(d){
       if(d.state == -1) return Toast(d.message);
       this.pay.verificationCodeEncrypt=d.verificationCodeEncrypt;
    },
    handleBack(){
      window.history.go(-1);
    },
    payPasswordBtn(){
      if(!this.locked) return;
      let { openId,password,password2,phone,code,verificationCodeEncrypt } = this.pay,
          codeReg=/^\d{6}$/,
          phoneReg=/^[1][0-9]{10}$/;
      if(!password) return Toast('请设置支付密码')
      if(!codeReg.test(password)) return Toast('支付密码须为6位数字组成')
      if(!password2) return Toast('重新输入一次支付密码')
      if(password2 !== password) return Toast('两次密码不一致')
      if(!phone) return Toast('请输入手机号')
      if(!phoneReg.test(phone)) return Toast('手机号格式有误')
      if(!code) return Toast('请输入验证码')
      if(!codeReg.test(code)) return Toast('验证码格式有误')

      if(!this.pay.verificationCodeEncrypt){
        Toast('验证码获取失败，请重新获取');
        this.pay.code='';
        return;
      }
      this.locked=false;



      Axios('/account/accountapp/setPayPassword',{openId,password,verificationCode:code,verificationCodeEncrypt},{api:1}).then(data=>{
        this.locked=true
        if(data.result && data.code==0){
          if(data.data.state==-1) return Toast(data.data.message)
          Toast('支付密码设置成功！')
          Cookie.setCookie('ast','1');
          this.status=2;
          this.getMyAccount();
        }
        else {
          Toast('支付密码设置失败，请重试')
          this.locked=true
        }
      }).catch(()=>this.locked=true)
          //console.log(this.pay)

    }
  },
  components:{ inputText,buttonCode,ButtonClient }
}
</script>
