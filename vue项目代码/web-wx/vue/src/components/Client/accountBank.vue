<style lang="css" scoped>
    .account-bank{
        color:#333;
        padding: 0 .15rem;
    }
    .right-text{
      position: absolute;
      right: 0;
      font-size: .16rem;
      transform: translateY(-50%);
      top:50%;
    }
    .right-img{
      width: 1rem;
      height: 1rem;
      /*position: absolute;*/
      margin: .1rem 0 0 .1rem;
    }
    .img-tit{
      color:#666;
      font-size: .16rem;
      margin-top: .1rem;
    }
    .bank-up-alert{
      background: #fff;
      padding:.1rem .1rem .2rem;
      font-size: .14rem;
      color:#999;
      margin-top: .3rem;
    }
    .input-list{
      padding-bottom: .4rem;
    }
    .input-list::before{
      border-top: 1px solid #e4e4e4;
    }
</style>

<template lang="html">
  <div class="account-bank">
      <div class="pay-password">
          <ul class="input-list br1_bottom">
              <li v-for="v in bankItems">
                <inputItem :readonly="true" :leftTitle="v.tit">
                  <span class="right-text">{{accountBank[v.key]}}</span>
                </inputItem>
              </li>
              <li>
                <p class="img-tit">确认函：</p>
                <div class="right-img">
                  <uploadPhoto  :url="accountBank.bankCreditURL" :readonly="true" />
                </div>
              </li>

          </ul>
          <div class="bank-up-alert" v-if="$route.query.type=='see'">
            注：如需要修改银行账户信息，请联系物流公司运营人员，联系电话：<a href="tel:13973146207">13973146207 廖经理</a>
          </div>
      </div>


  </div>
</template>

<script>
import inputItem from '@/components/Common/Form/inputItem'
import {uploadPhoto} from '@/components/Common/FileUpload'
import password from '@/components/Common/Tip/alert/password'
import { Axios } from '@/assets/Util'

import { mapGetters,mapActions } from 'vuex'

import { Toast } from 'mint-ui'

export default {
  data(){
    return {
      locked:true,
      bankItems:[
        {key:'bankCode',tit:'开户行'},
        {key:'bankNum',tit:'银行账号'},
        {key:'bankUserName',tit:'开户名'},
        {key:'bankBranchName',tit:'开户支行'},
        {key:'reservedTel',tit:'银行预留手机号'},
      ]
    }
  },
  computed:{
    ...mapGetters([
      'openid',
      'accountBank'
    ])
  },
  created(){
    this.getAccountBank();
  },
  methods:{
    ...mapActions([
      'getAccountBank'
    ]),
  },

  components:{
    inputItem,
    uploadPhoto
  },

}
</script>
