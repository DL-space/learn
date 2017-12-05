<template>
  <transition name="bg-fade" appear>
    <div class="alert" v-if="isShow">
          <div class="alert-panel">
              <h6>提现{{cash}}元</h6>
              <p class="get-cash-tit">输入手机尾号{{phone | getBankNum}}接收的验证码</p>
              <div class="cash-code">
                <input-text placeholder="输入验证码" :number="true" v-model="smsVerificationCode" :max="6" type="tel">
                  <button-code slot="slot-right" :phone="phone" :api="true" url="/account/accountapp/sendMessage" phoneKey="referenceNumber" :ck="getCode" :params="codeParams"/>
                </input-text>
              </div>
              <h6>支付密码</h6>
              <div class="password-box">
                <pass-word @getPassWord="getPassWord" ref="passWord"/>
              </div>
              <div class="cash-msg">
                <p>预计到账金额：{{(Number(cash)-Number(fee)).toFixed(2)}}元</p>
                <p>手续费：{{fee}}元</p>
              </div>
              <div class="panel-button br1">
                 <button v-for="item in buttons" key="butt" :type="item.type" @click="item.fn">{{item.name}}</button>
              </div>
          </div>
    </div>
  </transition>
</template>

<script>
import inputText from '../../Form/inputText'
import buttonCode from '../../Form/buttonCode'
import passWord from './password'
import { Toast } from 'mint-ui'
import {Axios} from '@/assets/Util'

import { mapGetters } from 'vuex'

export default {
  name: 'getCashModel',
  data(){
    return {
      codeParams:{
        openId:'',
        scene:'18'
      },
      payPassword:'',
      smsVerificationCode:'',
      locked:true
    }
  },
  filters:{
    getBankNum(v){

      if(v) {
        v = v.toString();
        return v.substring(v.length-4,v.length)
      }
    }
  },
  props:{
    phone:{
        type:[String,Number],
    },
    cash:{
      type:[String,Number],
      default:''
    },
    fee:{
      type:[String,Number],
    },
    orderIds:{
      type:Array,
      default(){
        return []
      }
    },
    closeFn:{
      type:Function
    },
    buttons:{
        type:Array,
        default(){
           let that=this;
           return [
               {name:'好的',type:'0',fn(){
                   that.close()
               }}
           ]
        }
    },
    isShow:{
        type:Boolean,
        default:false
    },
  },
  computed:{
    ...mapGetters([
      'openid'
    ])
  },
  created(){
    this.codeParams.openId = this.openid
  },
  methods:{
      opens(){
          // this.isShow=true
      },
      close(){
          // this.isShow=false
          this.$emit('handle')
      },
      getCode(){

      },
      getPassWord(v){
        this.payPassword=v
      },
      getCash(){
        if(!this.locked) return
        let { smsVerificationCode,payPassword,openid,cash,orderIds } = this
        if(!smsVerificationCode) return Toast('请输入验证码')
        if(!payPassword) return Toast('请输入密码')
        this.locked = false

          Axios('/account/accountapp/withdraw',{amount:cash,smsVerificationCode,payPassword,openId:openid,orderIds},{api:1})
            .then(dt=>{
              this.locked=true
              if(!dt.result || !dt.code==0) return;
              if(dt.data.state==-1) return Toast(dt.data.reason)

              Toast('提现申请提交成功！')

              this.closeFn && this.closeFn();

              this.$router.push({name:'getCashSuccess',query:{feeAmount:dt.data.feeAmount,arriveAmount:dt.data.arriveAmount,withdrawAmount:dt.data.withdrawAmount}})
            })
            .catch(err=>this.locked=true)


      }
  },
  components:{
    inputText,
    buttonCode,
    passWord
  }
}
</script>

<style lang='css' scoped>
   .alert{
       width: 100%;
       height: 100%;
       position: fixed;
       top:0;
       left:0;
       background: rgba(34, 34, 34,.5);
       z-index: 300;
   }
  .alert-panel{
      position: absolute;
      top:50%;
      left:50%;
      width: 3rem;
      transform: translate(-50%,-50%);
      -webkit-transform: translate(-50%,-50%);
      background: #fff;
      border-radius:.125rem;
      /*// border-top-left-radius:.25rem;*/
      text-align: center;
      padding-top:.16rem;

  }
  .alert-panel h6{
      padding: .12rem 0;
      font-size: .18rem;
      font-weight: bold;
      line-height: .1rem;
      margin-top: .2rem;
      color:#333;
  }
  .alert-panel .panel-content{
      font-size: .15rem;
      line-height: .2rem;
      padding: 0 .16rem;
  }
  .get-cash-tit{
    padding: .1rem 0;
    color:#666;
    margin-top: .1rem;
  }
  .panel-button::before{
    border-top: 1px solid #e0dede;
    z-index: -1;
  }
  .panel-button{
     height: .435rem;
     width: 100%;
     margin-top: .16rem;
     line-height: .435rem;
  }
  .password-box{
    padding: .3rem 0;
  }
  .panel-button button{
     font-size: .16rem;
     color:#007aff;
     background: none;
     border-bottom-left-radius:.125rem;
     border-bottom-right-radius:.125rem;
     border: none;


  }
  .panel-button button[type='0']{
    width: 100%;
    height: 100%;
  }
  .panel-button button[type='1']{
    width: 50%;
    height: 100%;
    color:#7a7a7a;
    border-right: 1px solid #e0e0e0;
    border-bottom-right-radius:0;
  }
  .cash-msg{
    color:#8a8a8a;
  }
  .cash-code{
    padding: 0 .28rem;
  }
  .panel-button button[type='2']{
    width: 50%;
    height: 100%;
    border-bottom-left-radius:0;
  }
  .button-active{
      transition: all .1s;
      -webkit-transition: all .1s;
      background: rgba(221, 221, 221, 0.6)!important;
  }

  .bg-fade-enter-active, .bg-fade-leave-active{
     transition: all .3s;
  }
   .bg-fade-enter, .bg-fade-leave-to /* .fade-leave-active in <2.1.8 */ {
     opacity: 0;

   }

</style>
