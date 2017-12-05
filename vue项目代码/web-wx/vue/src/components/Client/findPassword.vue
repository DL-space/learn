<style lang="css" scoped>
 .password-list{
 }
 .find-password{
   padding: .4rem .2rem 0;
 }
 .login-submit{
   border: none;
   width: 100%;

   margin-top: .4rem;
   color:#fff;
   height: .45rem;
   background: #3caaff;
 }
 .pay-password{

   width: 100%;

 }
 .pay-btns{
   position: relative;
   padding: 0 .4rem;
   color:#666;
   font-size: .14rem;
   margin-top: .2rem;
 }
 .btns-right{
   position: absolute;
   right: .4rem;
 }

</style>

<template lang="html">
  <div class="find-password">




    <div class="pay-password" v-if="!isMakePay">
      <input-text placeholder="输入姓名" v-model="form[0].value"/>
      <input-text placeholder="输入银行卡号" v-model="form[1].value" type="tel"/>
      <input-text placeholder="输入身份证号" v-model="form[2].value"/>
      <input-text placeholder="输入银行预留手机号" v-model="form[3].value" :number="true" :max="11" type="tel">
        <button-code slot="slot-right" :phone="form[3].value" :api="true" url="/account/accountapp/sendMessage" :params="codeParams" phoneKey="referenceNumber" :ck="getCode"/>
      </input-text>
      <input-text placeholder="输入验证码" v-model="form[4].value" :number="true" :max="6" type="tel"/>
      <button class="login-submit" @click="next()">下一步</button>


       <!-- <password :borderStyles="{width:'.5rem',height:'.5rem'}" @getPassWord="getPassWord" ref="passWord"/>
       <div class="pay-btns">
         <span>输入原支付密码</span>
         <span class="btns-right">忘记密码？</span>
       </div> -->
    </div>

    <div class="password-list" v-else>
      <input-text placeholder="输入新支付密码(6位数字)" v-model="pass[0].value" :number="true" :max="6" type="password"/>
      <input-text placeholder="再次输入新支付密码" v-model="pass[1].value" :number="true" :max="6" type="password"/>
      <button class="login-submit" @click="setPayPassword()">确认</button>

    </div>


  </div>
</template>

<script>
import inputText from '@/components/Common/Form/inputText'
import buttonCode from '@/components/Common/Form/buttonCode'
import password from '@/components/Common/Tip/alert/password';
import { mapGetters } from 'vuex'
import { Axios } from '@/assets/Util'



import { Toast } from 'mint-ui'

export default {
  data(){
    let _this = this;
    return {
      newPassword:'',
      newPassword2:'',
      isMakePay:false,
      code:'',
      phone:'',
      name:'',
      bankCard:'',
      idCard:'',
      codeParams:{
        scene:'07',
        openId:''
      },
      locked:true,
      form:[
        {
          value:'',
          name:'姓名',
          key:'customerName'
        },
        {
          value:'',
          name:'银行卡号',
          key:'bankCardNumber'
        },
        {
          value:'',
          name:'身份证号',
          key:'certCode'

        },
        {
          value:'',
          name:'银行预留手机号',
          type:'phone',
          key:'referenceNumber'

        },
        {
          value:'',
          name:'验证码',
          type:'code6',
          key:'verificationCode'
        },
      ],
      pass:[

        {
          value:'',
          name:'新支付密码',
          type:'pass6_n',
          key:'newPayPassword'
        },
        {
          value:'',
          index:'0',
          compare:'!=',
          name:'新支付密码',
          msg:'请再次输入新支付密码',
          regMsg:'两次支付密码输入不一致'
        },
      ],
      oldPayPassword:''
    }
  },
  computed:{
    ...mapGetters([
      'openid'
      ])
  },
  created(){
    this.codeParams.openId=this.openid;
  },
  methods:{
    forms(i){
      return this.form[i];
    },
    getCode(d){

    },
    next(){
       if(!this.locked) return
       let { openid,form } = this
       let validate = this.$validate(this.form)
       if(!validate) return
       this.locked=false
       let data = {openId:openid}
       form.forEach(v => data[v.key] = v.value)


       Axios('/account/accountapp/getResetPayPasswordToken',data,{api:1}).then(dt=>{
         this.locked=true
         if(!dt.result || !dt.code==0) return Toast('发送失败，请重试')
         if(dt.data.state==-1) return Toast(dt.data.message)
         this.oldPayPassword = dt.data.authToken

         this.isMakePay=true

       }).catch(()=>this.locked=true)



    },
    setPayPassword(){
       if(!this.locked) return;
       let { pass,openid,oldPayPassword } = this
       let validate = this.$validate(pass);
       if(!validate) return;

       this.locked = false;

       Axios('/account/accountapp/updatePayPassword',{openId:openid,oldPayPassword,newPayPassword:pass[0].value,type:2},{api:1})
       .then(dt=>{
          this.locked=true
          if(!dt.result || !dt.code==0) return Toast('提交错误,请重试')
          if(dt.data.state==-1) return Toast(dt.data.message)
          Toast('重新设置密码成功!')
          setTimeout(()=>this.$router.go(-2),1000)
       })
       .catch(()=>this.locked=true)

      //  console.log(validate)


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
    password,
    buttonCode
  },

}
</script>
