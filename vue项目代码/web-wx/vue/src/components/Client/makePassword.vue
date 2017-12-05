<style lang="css" scoped>
 .password-list{
   padding: .2rem;
 }
 .login-submit{
   border: none;
   width: 100%;

   margin-top: .4rem;
   color:#fff;
   height: .45rem;
   background: #3caaff;
 }
</style>

<template lang="html">
  <div class="make-login-password">
    <div class="password-list">
      <input-text placeholder="输入原密码" v-model="oldPassword" type="password"/>
      <input-text placeholder="输入新密码(6-12位字母数字组合，字母开头)" v-model="newPassword" type="password"/>
      <input-text placeholder="再次输入新密码" v-model="newPassword2" type="password"/>
      <button class="login-submit" @click="makeLoginPassword()">确认修改</button>

    </div>


  </div>
</template>

<script>
import inputText from '@/components/Common/Form/inputText'
import buttonCode from '@/components/Common/Form/buttonCode'
import {Axios} from '@/assets/Util'

import { Toast } from 'mint-ui'
import { mapGetters } from 'vuex'

export default {
  data(){
    return {
      oldPassword:'',
      newPassword:'',
      newPassword2:'',
    }
  },
  computed:{
    ...mapGetters([
      'openid'
    ])
  },
  methods:{
    makeLoginPassword(){
       let { oldPassword,newPassword,newPassword2 } = this,
           loginReg=/^[a-zA-Z]([a-zA-Z0-9]){5,11}$/;
       if(!oldPassword) return Toast('请输入原密码');

       if(!newPassword) return Toast('请输入新密码');

       if(!loginReg.test(newPassword)) return Toast('登陆密码为6-12位字母数字组合，字母开头')

       if(!newPassword2) return Toast('请再次输入新密码');

       if(oldPassword === newPassword) return Toast('新旧密码不可相同');

       if(newPassword !== newPassword2) return Toast('两次输入新密码不一致');

       Axios('/api/saler/customer/modifyPassword',{openId:this.openid,oldPwd:oldPassword,newPwd:newPassword}).then(dt=>{
         if(!dt.result || !dt.code==0) return Toast(dt.message);
         Toast('修改登录密码成功！')

         setTimeout(()=>this.$router.back(),1000)
       })
    }
  },
  components:{
    inputText
  },

}
</script>
