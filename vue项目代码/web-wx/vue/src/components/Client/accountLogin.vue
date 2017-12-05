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
      <input-text placeholder="输入你的虚拟账号" v-model="loginName"/>
      <input-text placeholder="输入登陆密码" v-model="loginPassword" type="password"/>
      <button class="login-submit" @click="login()">确认修改</button>

    </div>


  </div>
</template>

<script>
import inputText from '@/components/Common/Form/inputText'
import buttonCode from '@/components/Common/Form/buttonCode'
import { Toast } from 'mint-ui'
import {stringify} from 'qs'

export default {
  name:'accountLogin',
  data(){
    return {
      loginName:'',
      loginPassword:'',
    }
  },
  methods:{
    login(){
       let { loginName,loginPassword } = this;
       if(!loginName) return Toast('请输入虚拟账号');
       if(!loginPassword) return Toast('请输入登陆密码');



       this.$router.replace({name:'myAccount'})
    }
  },
  components:{
    inputText
  },
  // created(){
  //   console.log(stringify({a:123,b:'ddd',c:[1,2,4]}))
  // }

}
</script>
