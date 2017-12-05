<template>
  <div class="post-apply">
      <div class="post-status" v-if="status">
        <div class="apply-img-box"><img :src="stateMsg.icon" alt="" class=""></div>
        <div class="apply-msg">
           <p :style="{color:status==5?'#4392ff':'#ff6f6e'}">{{stateMsg.tit}}</p>
           <p v-if="stateMsg.msg" class="msg-text">{{stateMsg.msg}}</p>
        </div>
        <button class="btn btn-reset" v-if="stateMsg.start" @click="applyReset">重新申请</button>
      </div>


      <div class="post-put" v-if="!status && isShowPage">
         <div class="post-top">
           <input-item leftTitle="驿站属性" :rightIcon="true">
              <span @click="attrs.attrShow=true"  class="inp-value inp-show center-box">{{attrs.attrValue}}</span>
              <Actionsheet :actions="attrs.attrData" v-model="attrs.attrShow"/>
           </input-item>
           <input-item leftTitle="合作周期" v-model="times.startTime">
              <div class="inp-right center-box">
                <span @click="selectDate(0)" class="right-start">{{times.startTime}}<span class="right-rili"></span>至</span><span class="right-start" @click="selectDate(1)">{{times.endTime}}<span class="right-rili"></span></span>
             </div>
           </input-item>
           <input-item leftTitle="物流费用分成" :number="true" v-model="revenueMoney" :readonly="readonly" :inputStyle="priceInput">
           <span slot="right" @click="price.isShow=true">
             <span class="inp-right-text">{{price.priceType}}<img src="../../../static/images/clerk/icon/icon-selected.png" class="inp-icon-down"/></span>

             <span @click.stop>
               <Actionsheet slot="right" :actions="price.data" v-model="price.isShow"/>
             </span>
           </span>
           </input-item>
           <div class="post-upload">
             <p class="item-name"><span class="red" v-if="$route.query.canEdit=='1'">*</span>电子合同</p>
             <div class="upload-item" v-for="(v,i) in photos">
                <uploadPhoto :url="v.url" @handleDelete="handleDelete(i)"/>
             </div>
             <div class="upload-item">
               <uploadPhoto @getPhotoMsg="data=>getPhotoMsg(data)" :readonly="readonly"/>
             </div>
           </div>
         </div>
         <div class="space" style="background:#f5f5f5;"></div>
         <div class="post-bottom">
           <input-item leftTitle="提货人" v-model="consignee" :readonly="readonly">
           </input-item>
           <input-item leftTitle="联系方式" v-model="contact" :readonly="readonly" :number="true">
           </input-item>
           <p class="post-call-text">联系方式将作为登录提货员APP用户名使用，默认密码123456</p>
           <p class="post-alert">注：如果此客户已经归属某个驿站，请先解除归属后再申请成为驿站！</p>



         </div>
         <div class="space" style="background:#f5f5f5;"></div>
         <div class="post-money">
           <p class="title-text">驿站财务信息</p>
           <add-bank-card type='postApply' ref="addBankCard"/>
         </div>
         <div class="post-btn">
            <button class="btn submit" @click="submit">{{readonly?'关闭':'提交'}}</button>
         </div>


         <!-- <DatetimePicker
           ref="datePicker"
           @confirm="handleConfirm"
           v-model="times.nowDate"
           type="date"
           :startDate="times.initDate"
           :endDate="times.endInitDate"
           year-format="{value} 年"
           month-format="{value} 月"
           date-format="{value} 日" /> -->

           <!-- <yd-datetime type="date" v-model="times.nowDate" ref="datetimeStart" v-show="false" :startDate="times.initDate" :endDate="times.endInitDate" @pickerConfirm="handleConfirm"></yd-datetime>

           <yd-datetime type="date" v-model="times.nowEndDate" ref="datetimeEnd" v-show="false" :startDate="times.initDate2" :endDate="times.endInitDate" @pickerConfirm="handleConfirm"></yd-datetime> -->

           <date-picker :value="times.nowDate" :startDate="times.initDate" :endDate="times.endInitDate" :isShow="openDatepickerStart" @update:isShow="val => openDatepickerStart = val" @change="handleConfirm" type="postApply"/>

           <date-picker :value="times.nowEndDate" :startDate="times.initDate2" :endDate="times.endInitDate" :isShow="openDatepickerEnd" @update:isShow="val => openDatepickerEnd = val" @change="handleConfirm" type="postApply"/>
      </div>
  </div>

</template>
<script>
import {uploadPhoto} from '@/components/Common/FileUpload'

import {Ajax}from '@/assets/Util';
import { Actionsheet,DatetimePicker,Toast } from 'mint-ui';
// import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';

import datePicker from '@/components/Common/Picker/datepicker';


import inputItem from '@/components/Common/Form/inputItem'
import addBankCard from './AddBankCard'

import {mapGetters,mapMutations,mapActions} from 'vuex';
  export default{
    data(){
      let t = this;
      return {
        id:null,
        status:0,
        orgId:'',
        isShowPage:false,
        states:{
          4:{
            tit:'申请已提交，审核中...',
            msg:'',
            icon:require('../../../static/images/clerk/icon/post-apply-pedding.png')
          },
          1:{
            tit:'申请已通过，驿站合同生效：',
            msg:'合同时间：',
            icon:require('../../../static/images/clerk/icon/post-apply-succ.png')
          },
          5:{
            tit:'申请未通过，未通过原因：',
            msg:'',
            start:true,
            icon:require('../../../static/images/clerk/icon/post-apply-fail.png')
          },
          0:{
            tit:'无合同信息',
            msg:'',
            icon:require('../../../static/images/clerk/icon/post-apply-fail.png')
          },
          2:{
            tit:'合同已到期',
            msg:'',
            start:true,
            icon:require('../../../static/images/clerk/icon/post-apply-fail.png')
          },
          3:{
            tit:'合同已终止',
            msg:'',
            start:true,
            icon:require('../../../static/images/clerk/icon/post-apply-fail.png')
          },
        },
        canEdit:1,
        attrs:{
          attrShow:false,
          attrValue:'加盟',
          attrType:21,
          attrData:[
            {
             name:'加盟',
             method:(n)=>t.pickerAttr(n,21)
            },
            // {
            //  name:'自营',
            //  method:()=>t.pickerAttr(n,22)
            // },
           ]
        },
        times:{
          startTime:'',
          endTime:'',
          startTimeDate:this.fomatTime(new Date()),
          endTimeDate:this.fomatTime(new Date()),
          timeType:2,
          initDate:this.fomatTime(new Date()),
          initDate2:this.fomatTime(new Date()),

          endInitDate:this.fomatTime(new Date(new Date().getFullYear()+3,0,1)),
          nowDate:this.fomatTime(new Date()),
          nowEndDate:this.fomatTime(new Date())
        },
        openDatepickerStart:false,
        openDatepickerEnd:false,
        price:{
          priceType:'每件(元)',
          revenueMoneyType:13,
          isShow:false,
          data:[
            {
             name:'每件(元)',
             method:(n)=>t.pickerPrice(n.name,13)
            },
            {
             name:'每单(元)',
             method:(n)=>t.pickerPrice(n.name,12)
            },
           ]
        },
        revenueMoney:'',
        consignee:'',
        contact:'',
        photos:[],
        readonly:false,
        locked:true,
        priceInput:{
           paddingRight:'.8rem'
         }

      }
    },
    computed:{
      ...mapGetters([
        'postApplyState',
        'openid'
      ]),
      stateMsg(){
        return this.states[this.status];
      },
    },
    methods:{
      ...mapActions([
        'setPostApplyState',
        'getCommon'
      ]),
      applyReset(){
        this.status=0;
        this.isShowPage=true;
      },
      pickerAttr(n,d){

        this.attrs.attrValue=n.name;
        this.attrs.attrType=d;
      },
      pickerPrice(n,d){

        this.price.priceType=n;
        this.price.revenueMoneyType=d;
      },
      getPhotoMsg(d){
        this.photos.push({url:d.url,id:d.id});
      },
      handleDelete(i){
        this.photos.splice(i,1);
      },
      selectDate(i){
        this.times.timeType=i;

        let name=i?'End':'Start';

        this['openDatepicker'+name]=true;

        // this.times.nowDate=this.times[this.typeUpdate('TimeDate')];
        //
        // this.$nextTick(this.$refs.datePicker.open);

        // let name=i?'datetimeEnd':'datetimeStart';

        // this.$refs[name].open();

      },
      typeUpdate(n){
        let type=this.times.timeType?'end':'start';
        return type+n;
      },
      handleConfirm(value){
        if(this.times.timeType ==2) return;
        this.times[this.typeUpdate('TimeDate')]=value;
        this.times[this.typeUpdate('Time')]=value;
        let {startTime,endTime}=this.times;
        let type=this.times.timeType?'End':'Start';

        if(startTime && endTime){
           if(startTime == endTime){
             Toast('合作起止时间不可为同一天');
             this.times[this.typeUpdate('Time')]='';
             return setTimeout(()=>this['openDatepicker'+type]=true,0);
           }
           let st=startTime.split('-'),et=endTime.split('-');
           for(let i=0;i<st.length;i++){
              if(st[i]>et[i]){
                Toast('结束时间不能小于开始时间');
                this.times[this.typeUpdate('Time')]='';
                return setTimeout(()=>this['openDatepicker'+type]=true,0);
              }
              else if(st[i]<et[i]) return;
           }
        }
      },
      addZero(a){
        return a>9?a:'0'+a.toString()
      },
      fomatTime(d){
        let y=d.getFullYear(),m=this.addZero(d.getMonth()+1),dd=this.addZero(d.getDate());
        return y+'-'+m+'-'+dd;
      },
      submit(){

         //
         if(this.readonly) return this.$router.back();
         if(!this.locked) return;
         let {attrs,times,revenueMoney,consignee,contact,photos,openid,orgId,price} = this;
         let { startTime,endTime } = times;

         if(!startTime || !endTime) return Toast('请输入合作周期时间');
         if(!revenueMoney) return Toast('请输入物流费用分成');
         if(!consignee) return Toast('请输入提货人');
         if(!contact) return Toast('请输入联系方式');
         if(!photos.length) return Toast('请上传图片');

         let bankValue = this.$refs.addBankCard.handleSubmit();

         console.log(bankValue)

         if(!bankValue) return;


         let ps = this.photos.map(v=>v.id).join();

         let data = {
           startTime,
           endTime,
           orgId,
           consignee,
           contact,
           revenueMoney,
           revenueMoneyType:price.revenueMoneyType,
           postHouseType:attrs.attrType,
           openId:this.openid,
           contractPhotos:ps,
         }

        //  console.log(bankValue)
         for(var i in bankValue){
           if(bankValue[i]) data[i] = bankValue[i]
         }


        //  return;
         this.locked = false;

        //  var data={
        //    startTime:'2017-08-15',
        //   endTime:'2018-01-05',
        //   orgId:20834,
        //   consignee:'黄静超22',
        //   contact:17301106856,
        //   revenueMoney:10,
        //   revenueMoneyType:13,
        //   postHouseType:21,
        //   openId:'or3W_s8N0p8GXnGRcp6VLWdxure4',
        //   contractPhotos:'28910,28912',
        //   bankName:3,
        //   bankBranchName:1214,
        //   bankNum:14124124,
        //   bankUserName:'黄静超22',
        //   cardNumber:'340822199203251418',
        //   reservedTel:17301106856,
        //   noticeTel:17301106856,
        //   bankCredit:28914,
        //   identityCard:28916,
        //  }

         this.getCommon({url:'/api/saler/customer/stage/apply',data}).then(dt=>{
            this.locked = true;
            if(!dt.result) return Toast(dt.message);
            if(dt.code){
              Toast('驿站申请成功！请等待审核');
              this.status=4;
              this.locked=false;
            }
            else{
              Toast(dt.message);
            }

         }).catch(err=>{
            this.locked = true;
         })


      }
    },
    created(){
      const {id,canEdit} = this.$route.query;

      this.orgId=id;

      if(canEdit == 0) this.readonly=true;


      if(!this.orgId) return Toast('缺少参数[orgId]');


      this.getCommon({url:'/api/saler/customer/stage/queryApplyStatus',data:{orgId:this.orgId}}).then(dt=>{
         this.status= dt.data.status;
         this.states[this.status].msg+=dt.data.content || '';
         this.isShowPage=true;

         if(dt.data.status == 0 && canEdit==1){
           this.getCommon({url:'/api/saler/customer/stage/isCommit',data:{orgId:this.orgId}}).then(dt=>{
              if(dt.code) return Toast('此客户已绑定驿站，请先解除'),this.readonly=true;
           })
         }
      })
    },
    components:{inputItem,Actionsheet,uploadPhoto,datePicker,addBankCard}
  }
</script>
<style scoped>
 .post-apply{


 }
 .post-top,.post-bottom{
   padding: 0 .1rem;
 }
 .post-status{
   padding:.95rem .2rem 0 .2rem;
   text-align: center;
 }
 .apply-img-box{
   width: .84rem;
   margin: 0 auto .35rem auto
 }
 .apply-img-box img{
   width: 100%;
 }
 .post-put .inp-show{
   width: 65%;
   line-height: .45rem;
 }
 .msg-text{
   color:#666;
   font-size: .15rem;
   margin-top: .05rem;
 }
 .btn-reset{
   margin-top: .45rem;
 }

 .post-put{
 }
 .item-name{
   margin:.12rem 0;
   color:#666;
   font-size: .16rem;
 }
 .post-call-text{
   font-size: .12rem;
   color:#999;
   margin-top: .05rem;
   line-height: 1;
 }
 .post-alert{
   font-size: .12rem;
   color:#ff0000;
   margin-top:.5rem;
 }
 .submit{
   margin: .1rem 0 .2rem 0;
 }
 .upload-item{
   width: 1.4rem;
   height: 1.4rem;
   display: inline-block;
   margin-right: .74rem;
   margin-bottom: .1rem;
 }
 .upload-item:nth-child(odd){
   margin-right: 0;
 }
 .post-upload{
   margin-bottom: .2rem;
   font-size: 0;
 }
 .inp-right{
   font-size: .14rem;
   color:#666;
   line-height: .45rem;
   text-align: right;
 }
 .right-start{
   margin-left: .02rem;
   min-width: 1rem;
   display: inline-block;
   font-size: .14rem;
 }
 .right-rili{
   width: .26rem;
   height: .26rem;
   vertical-align: -.08rem;
   display: inline-block;
   margin: 0 .02rem 0 .02rem;
   background: url(../../../static/images/clerk/icon/icon-rili.png) 50% 50% / contain no-repeat;
 }
 .inp-right-text{
   position: absolute;
   transform: translateY(-50%);
   right: 0;
   top:50%;
   font-size: .16rem;
   color:#666;
 }
 .inp-icon-down{
   width: .16rem;
   margin-left: .05rem;
   vertical-align: middle;
 }
 .price-input{
   padding-right: .4rem;
 }
 .post-money{
   /*padding: 0 .15rem;*/
 }
 .title-text{
    font-size: .16rem;
    color:#4392ff;
    margin-top: .2rem;
    padding: 0 .1rem;
 }
 .post-btn{
    padding: 0 .1rem;
 }
</style>
