<style lang="css" scoped>
 .account-record{
   color:#333;
   padding-top: .4rem;
 }
 .record-head{
   height: .4rem;
   line-height: .4rem;
   text-align: right;
   padding: 0 .1rem;
   position: fixed;
   top:0;
   width: 100%;
   z-index: 30;
   background: #fff;
   /*transform: translateY(-50%);*/
 }
 .head-right{
   z-index: 20;
   position: relative;
 }
 .list-item{
    padding: .1rem .2rem;

 }
.record-head::before{
  border-bottom: 1px solid #e0dede;
  z-index: 1;
  /*background: #fff;*/
}
 .list-item::before{
    border-bottom: 1px solid #e0dede;
 }
 .row-right{
    position: absolute;
    right: .2rem;
 }
 .row-time{
   font-size: .14rem;
   color:#999;
 }
 .picker-img{
   transform: rotate(90deg);
   vertical-align: middle;
   width: .2rem;
   margin-left: .02rem;
   transition: transform .3s;
 }
 .type-text{
   color:#b1afaf;
 }
 .item-fail-msg{
   color:#ff4444;
   margin-left: .1rem;
 }
 .item-status-color,.row-right-cor{
   color:#3caaff;
 }
 .icon-type{
   width: .2rem;
   vertical-align: middle;
   margin-right: .03rem;
 }
</style>

<template>
  <div class="account-record">
     <div class="record-content">
       <div class="record-head br1">
          <span class="head-right" @click="isPicker=!isPicker">
            <img src="../../../static/images/client/icon-type.png" alt="" class="icon-type">
            <span class="type-text">{{pickerType.type}}</span>
            <img src="../../../static/images/client/icon-right-jump.png" alt="" class="picker-img" :style="pickDownIcon">
          </span>
       </div>
       <div class="record-list">
         <list :isMore="accountRecordList.isMore" :load="loadData" :downRefresh="()=>loadData(1)">
           <ul>
              <li v-for="(v,i) of accountRecordList.list" @click="getQuerys(v)" class="list-item br1" key="cash">
                 <div class="item-row">
                  <span>{{v.transactionTypeDesc?v.transactionTypeDesc:'未知类型'}}</span>
                  <span class="row-right row-time">{{v.transactionTime}}</span>
                 </div>
                 <div class="item-row">
                   <span>余额:{{v.accountBalance}}</span>
                   <span :class="['row-right',v.transactionType==2?'row-right-cor':'']">{{v.transactionType==2?'+':'-'}}{{v.amount}}</span>
                 </div>
                 <div class="item-row">
                   <span class="item-status-color">{{v.transactionStatesDesc?v.transactionStatesDesc:'未知状态'}}<span class="item-fail-msg">{{v.remarks}}</span></span>
                   <!-- <span class="row-right">{{v.value}}</span> -->
                 </div>
              </li>
           </ul>
         </list>
       </div>
     </div>
     <actionSheet :isSlider="isPicker" position="top" :slots="types" @close="()=>isPicker=false" @getPicker="getTypes" :styles="{top:'.4rem'}"/>
  </div>

</template>

<script>
import actionSheet from '@/components/Common/Picker/actionSheet';
import list from '@/components/Common/Tab/list';
import { mapGetters,mapActions } from 'vuex';

export default {
  data(){

    return {
      isPicker:false,
      types:[
        {name:'转入',value:{status:0,type:'转入'}},
        {name:'转出',value:{status:1,type:'转出'}},
        {name:'手续费',value:{status:2,type:'手续费'}}
      ],
      pickerType:{status:0,type:'转入'},
      params:{
        beginDate:'',
        endDate:'',
        page:1,
        pageSize:10,
        query_type:0,
        trans_status:'',
        trans_means:'',
        // userName:'',
        openid:''
      }

    }
  },
  created(){
    this.params.openid=this.openid
    if(!this.accountRecordList.list.length) this.loadData(1);
  },
  computed:{
    pickDownIcon(){
      let s={transform:this.isPicker?'rotate(270deg)':'rotate(90deg)'}
      return s
    },
    ...mapGetters([
      'openid',
      'accountRecordList'
    ])
  },
  methods:{
    ...mapActions([
      'getAccountRecordList'
    ]),
    getQuerys(v){
      localStorage.setItem('AccountRecord',JSON.stringify(v));
      this.$router.push({name:'cashDetail'});
    },
    getTypes(v){
      console.log(v.status);
      this.params.query_type=this.pickerType.status=v.status;
      this.pickerType.type=v.type;
      this.loadData(1);
    },
    loadData(type){
      return new Promise((resolve,reject)=>{

        if(type) this.params.page=1;
        else this.params.page++;


        this.getAccountRecordList({body:this.params,url:'/wechat/fina/transaction/list'})
        .then(dt=>{
           resolve();
        })
        .catch(err=>reject(err))
      })

    },
  },
  components:{actionSheet,list}
}
</script>
