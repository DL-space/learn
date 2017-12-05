<style lang="css" scoped>
 .account-record{
   color:#333;
   /*padding-top: .4rem;*/
 }
 .record-head{
   height: .4rem;
   line-height: .4rem;
   text-align: right;
   padding: 0 .1rem;
   /*position: fixed;
   top:0;*/
   width: 100%;
   z-index: 1;
   background: #fff;
   /*transform: translateY(-50%);*/
 }
 .head-right{
   z-index: 20;
   position: relative;
   background: url(../../../static/images/client/icon-help.png) 50% 50%  / contain no-repeat;
   width: .22rem;
   height: .22rem;
   vertical-align: middle;

   display: inline-block;
 }
 .list-item{
    padding: .1rem .2rem;

 }
 .cash-tit{
   text-align: center;
   font-size: .2rem;
   margin-bottom: .1rem;
 }
 .cash-help{
   position: fixed;
   width: 75%;
   /*height: 3rem;*/
   background: #fff;
   top:50%;
   left:50%;
   transform: translate(-50%,-50%);
   border-radius: .1rem;
   padding: .2rem .16rem;
 }
.record-head::before{
  border-bottom: 1px solid #e0dede;
  z-index: 1;
  /*background: #fff;*/
}
.cash-text{
  font-size: .14rem;
  word-break:break-all;
}
.help-close{
  width: .18rem;
  position: absolute;
  top:.1rem;
  right: .1rem;
}
.pick-bank{
  padding: .1rem;
}
.bank-card{
  background: #3caaff;
  border-radius: .06rem;
  color:#fff;
  font-size: .17rem;
  padding: 0 0.2rem;
  height: 1rem;
}
.card-item{
  position: relative;
}
.card-right{
  position: absolute;
  right: 0;
  opacity: .5;
  font-size: .14rem;
}
.card-item-bottom{
  text-align: right;
}
.card-id{
  font-size: .2rem;
}
.list-tit::before{
  border-bottom: 1px solid #e0dede;
  /*border-top: 1px solid #e0dede;*/
}
.list-tit{
  height: .4rem;
  line-height: .4rem;
  padding: 0 .1rem;
  font-size: .16rem;
  color:#1b2b37;

}
.list-item{
  padding: .16rem .1rem;
  position: relative;
  /*margin-bottom: -.06rem;*/

}
.list-item::before{
  border-bottom: 1px solid #e0dede;
  z-index: -1;

}
.row-right{
  position: absolute;
  right: .1rem;
}
.row-id{
  /*color:#3caaff;*/
}
.row-put{
  color:#999;
}
.row-cash{
  /*color:#999;*/
  font-size: .18rem;
}
.item-row{
  margin-top: .06rem;
}
.row-get-btn{
  background: none;
  border: none;
  padding: .02rem .16rem;
  font-size: .14rem;
  color:#ff4444;
}
.row-get-btn::before{
  border: 1px solid #ff4444;
}
.card-center{
  width: 100%;
}
.allGetCash{
  position: absolute;
  right:.1rem;
  color:#3caaff;

}
.order-cash{
  position: relative;
  margin: .1rem 0;
  padding: 0 .1rem;
  height: .4rem;
  line-height: .43rem;

}
.order-cash::before{
  border-top:1px solid #e4e4e4;
  border-bottom:1px solid #e4e4e4;
}
.order-list{
  margin-top: .2rem;
}
.cash-tit-all{
  font-size: .16rem;
  line-height: 0;
}
</style>

<template>
  <div class="account-record">
     <div class="record-content">
       <div class="record-head br1">
          <span class="head-right" @click="isShow=!isShow"></span>
       </div>
       <div class="pick-bank " :style="{visibility:bankCardInfo.bankCode?'visible':'hidden'}">
         <div class="bank-card in-bk-center" @click="jumpPages({name:'accountBank',query:{canEdit:0,type:'see'}})">
           <div class="center-box card-center" >
             <p class="card-item">
               <span>{{bankCardInfo.bankCode}}</span>
               <span class="card-right">储蓄卡</span>
             </p>
             <p class="card-item card-item-bottom">
               <span class="card-id">{{bankCardInfo.bankNum}}</span>
             </p>
           </div>

         </div>

       </div>
       <div class="order-cash br1">
          <span class="cash-tit-all">可提现总金额(元): {{orderPickList.totalAmount}}</span>
          <span class="allGetCash" @click="getCash">全部提现</span>
       </div>
       <div class="order-list">
         <h1 class="list-tit br1_bottom">货款列表</h1>
         <list :isMore="orderPickList.isMore" :load="loadData" :downRefresh="()=>loadData(1)">
           <ul>
              <li v-for="(v,i) of orderPickList.list" class="list-item br1">
                <div class="item-row">
                  <span class="row-id" @click="jumpPages({name:'orderDetail',query:{sn:v.orderCode,type:1,cash:1,orderCode:v.id}})">{{v.orderCode}}</span>
                  <span class="row-right row-cash">{{v.amount}}元</span>
                </div>
                <div class="item-row">
                  <span class="row-put">{{v.orgName}}</span>
                  <button class="row-right row-get-btn br1" @click="getCash(v)">提现</button>
                </div>
              </li>
           </ul>
         </list>

       </div>
     </div>
     <model :open="isShow" :closeFn="()=>{isShow=false}" animType="scale">
          <h1 class="cash-tit">提现说明</h1>
          <div class="cash-text" v-pre>
            1、提现后，金额将转入客户所留存的银行账户中。</br>
            2、单个发货单提现单笔手续费1元。</br>
            3、提现钱到账银行账户的时间可能会有延迟，到账后会有微信推送，请注意查收。</br>
            4、提现后，提款状态会反应在交易记录中。</br>
            5、若需要修改银行账户信息，请联系物流公司运营人员。</br>联系电话：<a href="tel:13973146207">13973146207 廖经理</a></br>
            6、提现输入密码错误次数不得超过3次，如若超过3次，则需24小时后才能再次进行提款。</br>
          </div>
     </model>
     <get-cash-model ref="getCashMedel" :isShow="isPassWord" :cash="nowCash" :fee="fee" :orderIds="getCashOrderCodes" :phone="bankPhone" :closeFn="()=>{isPassWord=false}" :buttons="getCashBtns" />
  </div>

</template>

<script>
import actionSheet from '@/components/Common/Picker/actionSheet';
import model from '@/components/Common/Tip/alert/modelPanel';
import list from '@/components/Common/Tab/list';
import {Axios} from '@/assets/Util'
import getCashModel from '@/components/Common/Tip/alert/getCashModel';
import { mapGetters,mapActions } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  data(){
    let that = this;
    return {
      isShow:false,
      isPassWord:false,
      nowCash:0,
      isMore:true,
      page:1,
      rows:10,
      getCashBtns:[
        {name:'取消',type:'1',fn(){
            that.isPassWord=false
        }},
        {name:'确认提现',type:'2',fn(){

            that.$refs.getCashMedel.getCash()
        }}
      ],
      bankCardInfo:{},
      bankPhone:'',
      fee:'',
      getCashOrderCodes:[],
      totalCash:''
    }
  },

  computed:{
    ...mapGetters([
      'openid',
      'orderPickList'
    ])
  },
  created(){
    if(!this.orderPickList.list.length) this.loadData(1);
    this.getAccountBank().then(dt=>this.bankCardInfo = dt);
  },
  methods:{
    ...mapActions([
      'getAccountBank',
      'getOrderPickList'
    ]),
    getCash(v){
      if(!v) this.getCashOrderCodes = this.orderIds;
      else this.getCashOrderCodes[0] = v.id;
      Axios('/account/accountapp/getAssetInfo',{openId:this.openid},{api:1}).then(dt=>{
        if(!dt.result || !dt.code==0) return Toast('查询账户信息出错,请稍后再试');

        if(dt.data.state==-1) return Toast(dt.data.message)
        this.bankPhone = dt.data.phoneNumber;
        this.fee = dt.data.fee;


        let _this = this;
         this.$Alert({
           title:'确认提现',
           content:'注：每笔运单提现收取手续费'+dt.data.fee+'元',
           buttons:[
             {name:'取消',type:'1',fn(){
                 _this.$Alert(1)
             }},
             {name:'确认',type:'2',fn(){
                _this.$Alert(1);
                _this.nowCash=v.amount || _this.orderPickList.totalAmount;;

                _this.isPassWord=true;
             }}
           ]
         });
      }).catch(err=>Toast('提现信息获取失败，请稍后再试'))

    },
    jumpPages(route){
      this.$router.push(route);
    },
    loadData(type){
      return new Promise((resolve,reject)=>{

        if(type) this.page=1;
        else this.page++;

        this.getOrderPickList({url:'/chefu/account/transaction/queryDrawDetail',body:{openId:this.openid,page:this.page,rows:this.rows,presentStates:0}})
         .then(dt=>resolve())
         .catch(err=>reject())
      })
    }
  },
  components:{actionSheet,model,getCashModel,list}
}
</script>
