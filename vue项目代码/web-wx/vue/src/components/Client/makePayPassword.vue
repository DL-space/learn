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
        font-size: .5rem;
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
    .account-get::after{
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
        font-size: .16rem;
        color:#888;
        padding:.3rem .4rem 0;
        line-height:.2rem
    }

    .input-list{
        padding:0 .2rem;
    }
    .pay-submit{
        border: none;
        width: 100%;
        margin-top: .6rem;
        color:#fff;
        height: .45rem;
        background: #3caaff;
    }
    .btns-right{
      position: absolute;
      right: 0;
      color:#666;
      font-size: .14rem;
    }
    .btns-box{
      position: relative;
      margin-top: .1rem;
    }
</style>

<template lang="html">
  <div class="make-pay-password">
      <div class="pay-password">
          <h1 class="password-tit">修改密码成功后请牢记新密码，以防耽误您的使用！</h1>
          <div class="input-list">
              <input-text placeholder="请输入原支付密码" v-model="pay.oldPayPassword" :number="true" :max="6" type="password"/>
              <input-text placeholder="请输入新支付密码(6位数字)" v-model="pay.newPayPassword" :number="true" :max="6" type="password"/>
              <input-text placeholder="请再次输入新支付密码" v-model="pay.newPayPassword2" :number="true" :max="6" type="password"/>
              <div class="btns-box">
                <router-link tag="span" class="btns-right" :to="{name:'findPassword'}">忘记密码？</router-link>
              </div>
              <button class="pay-submit" @click="payPasswordBtn">确认修改</button>
          </div>
      </div>


    <!--<div class="password-list" v-if="isMakePay">-->
      <!--<input-text placeholder="输入新支付密码(6位数字)" v-model="newPassword" :number="true" :max="6" type="password"/>-->
      <!--<input-text placeholder="再次输入新支付密码" v-model="newPassword2" :number="true" :max="6" type="password"/>-->
      <!--<input-text placeholder="输入登记手机号进行验证" v-model="phone" :number="true" :readonly="true" :max="11">-->
         <!--<button-code slot="slot-right" :phone="phone"/>-->
      <!--</input-text>-->
      <!--<input-text placeholder="输入验证码" v-model="code" :number="true" :max="6"/>-->
      <!--<button class="login-submit" @click="makeLoginPassword()">确认修改</button>-->

    <!--</div>-->
    <!--<div class="pay-password" v-else>-->
       <!--<password :borderStyles="{width:'.5rem',height:'.5rem'}" @getPassWord="getPassWord" ref="passWord"/>-->
       <!--<div class="pay-btns">-->
         <!--<span class="pay-tit">输入原支付密码</span>-->
         <!--<router-link tag="span" class="btns-right" :to="{name:'findPassword'}">忘记密码？</router-link>-->
       <!--</div>-->
    <!--</div>-->

  </div>
</template>

<script>
import inputText from '@/components/Common/Form/inputText'
import password from '@/components/Common/Tip/alert/password'
import { Axios } from '@/assets/Util'

import { mapGetters } from 'vuex'

import { Toast } from 'mint-ui'

export default {
  data(){
    return {
        pay:{
            openId:'',
            type:1,
            oldPayPassword:'',
            newPayPassword:'',
            newPayPassword2:'',

        },
        locked:true
//      oldPassword:'',
//      newPassword:'',
//      newPassword2:'',
//      isMakePay:false,
//      code:'',
//      phone:17301106857,
    }
  },
    computed:{
      ...mapGetters([
        'openid'
        ])
    },
  methods:{
    payPasswordBtn(){

       let { openid,pay,locked } = this,
           { oldPayPassword,newPayPassword,newPayPassword2 } = pay,
           payReg = /^\d{6}$/;

       if(!locked) return;

       if(!oldPayPassword) return Toast('请输入原支付密码');

       if(!newPayPassword) return Toast('请输入新支付密码');

       if(!payReg.test(newPayPassword)) return Toast('支付密码必须为6位数字组成');

       if(!newPayPassword2) return Toast('请再次输入新支付密码');

       if(newPayPassword == oldPayPassword) return Toast('原新支付密码不可相同');

       if(newPayPassword != newPayPassword2) return Toast('两次输入新支付密码不一致');

       this.locked=false;


       Axios('/account/accountapp/updatePayPassword',{openId:openid,oldPayPassword,newPayPassword,type:1},{api:1})
       .then(dt=>{
          this.locked=true
          if(!dt.result || !dt.code==0) return Toast('修改密码错误,请重试')
          if(dt.data.state==-1) return Toast(dt.data.message)
          Toast('修改密码成功!')
          setTimeout(()=>this.$router.back(),1000)
       })
       .catch(()=>this.locked=true)

    },
    getPassWord(p){
      if(p==549008){
        this.oldPassword=p;
        this.isMakePay=true;
      }
      else{
        Toast('密码错误，还剩5次机会')
        this.$refs.passWord.value='';

      }
    }
  },
  components:{
    inputText,
  },

}
</script>
