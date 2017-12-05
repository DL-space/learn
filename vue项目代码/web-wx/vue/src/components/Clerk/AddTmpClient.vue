<template>
  <div class="add-user">
    <div class="base-msg">
      <p class="title-text">基本信息</p>
      <input-item leftTitle="客户名称" v-model="postData.orgName" :readonly="readonly" placeholder="请填写客户名称"></input-item>

      <input-item leftTitle="物流公司" v-model="postData.companyId" :readonly="readonly" :rightIcon="true">
        <span @click="!readonly && (postData.company.isShow=true)"  class="inp-value inp-show center-box">{{postData.company.value}}</span>
        <cmu-picker :isShow="postData.company.isShow" @update:isShow="val => postData.company.isShow = val" :data="postData.company.data" @change="companyValuesChange" :valueKey="postData.company.valueKey" />

      </input-item>
      <input-item leftTitle="服务站" v-model="postData.stationId" :readonly="readonly" :rightIcon="true">
        <span @click="!readonly && (postData.station.isShow=true)"  class="inp-value inp-show center-box">{{postData.station.value}}</span>
        <cmu-picker :isShow="postData.station.isShow" @update:isShow="val => postData.station.isShow = val" :data="postData.station.data" @change="stationValuesChange" :valueKey="postData.station.valueKey" />
      </input-item>

      <input-item leftTitle="客户类型" :readonly="readonly" :itemStyle="{border:'none'}" :rightIcon="true">
          <span @click="!readonly && (postData.clientType.isShow=true)"  class="inp-value inp-show center-box">{{postData.clientType.clientType}}</span>
          <Actionsheet :slots="postData.clientType.data" @getPicker="getclientType" @close="()=>postData.clientType.isShow=false" :isSlider="postData.clientType.isShow"/>
      </input-item>
    </div>
    <div class="space" style="background:#f5f5f5;"></div>
    <div class="add-photo">
      <p class="title-text">门店照片</p>
      <p class="item-name"><span class="red">*</span>门头照</p>
      <div class="photo-box">
         <uploadPhoto @getPhotoMsg="data=>getPhotoMsg(data)" :deleteImgFn="handleDelete" :url="postData.mtUrl" :readonly="readonly" title="门头照" />
      </div>
    </div>
    <div class="add-map">
      <p class="title-text">地图定位</p>
      <div class="map-geo" @click="getPosition">
         <p class="map-tit">地图定位({{postData.address?'已采集':'未采集'}})
           <span class="item-right"></span>
         </p>
         <p class="map-show">
           <img slot="left" class="icon-map" src="../../../static/images/clerk/icon/map.png">
           {{postData.address?postData.address+' '+postData.areaInfo:'点击采集位置信息'}}
         </p>
      </div>
    </div>
    <div class="submit-box">
      <button class="btn submit" @click="submit" v-if="!readonly" >{{readonly?'关闭':'提交'}}</button>
    </div>
  </div>
</template>

<script>
import {uploadPhoto} from '@/components/Common/FileUpload'
import {Ajax,Axios}from '@/assets/Util';
import {mapGetters,mapMutations,mapActions} from 'vuex';
import { Toast,Popup,Picker } from 'mint-ui';
import inputItem from '@/components/Common/Form/inputItem'
import Actionsheet from '@/components/Common/Picker/actionSheet'
import cmuPicker from '@/components/Common/Picker/cmu-picker'

export default {
  name:'addNewClient',
  components:{inputItem,uploadPhoto,Actionsheet,cmuPicker},
  data(){
    let t= this;
    return {
      readonly:false,
      first:true,
      stationCom:{},
      cid:'',
      sid:'',
      locked:true,
      postData:{
        orgName:'',
        // mtUrl:'http://10.143.47.27/group2/M00/00/23/Co8vJFlnG0-AFZh9AACM3Kh8eaI9880494',
        // mtId:15660,
        mtUrl:'',
        mtId:'',
        longitudeLatitude:'',
        address:'',
        companyId:'',
        stationId:'',
        provinceId:'',
        areaId:'',
        cityId:'',
        areaInfo:'',
        company:{
          isShow:false,
          value:'',
          valueKey:'orgName',
          slotValue:{},
          data:[
            {
              flex: 1,
              values: [{orgName:'...',id:'',i:0}],
              ids:[],
              className: 'slot1',
              textAlign: 'center',
              defaultIndex:0,
            }
          ]
        },
        station:{
          isShow:false,
          value:'',
          valueKey:'orgName',
          slotValue:{},
          data:[
            {
              flex: 1,
              values: [{orgName:'...',id:'',i:0}],
              className: 'slot1',
              textAlign: 'center',
              // defaultIndex:0,
            }
          ]
        },
        clientType:{
          data:[
            {
             name:'汽修厂',
             value:{type:6,name:'汽修厂'}
            },
            {
             name:'汽配商',
             value:{type:5,name:'汽配商'}
            },
          ],
          isShow:false,
          clientType:'汽修厂',
          clientId:6
      }
     }
    }
  },
  computed:{
    ...mapGetters([
      'clientInfo',
      'openid',
      'allCompanyList',
      'allStation'
    ])
  },
  created(){
     let {canEdit,id} = this.$route.query;
     let companys = this.allCompanyList;
     if(canEdit==0 || id) this.readonly = true;

     this.getAllCompanyList(this.openid).then(data=>{
       this.postData.company.data[0].values=data;
       this.postData.companyId=data[0].id;
     }).catch(()=>{
       Toast('物流公司获取失败！')
     })


     if(JSON.stringify(this.clientInfo)!='{}'){


        let {longitudeLatitude,address,provinceId,areaId,cityId,orgName,mtUrl,mtId,clientType,station,company,areaInfo} = this.clientInfo;


        this.postData.longitudeLatitude=longitudeLatitude;
        this.postData.address=address;
        this.postData.provinceId=provinceId;
        this.postData.areaId=areaId;
        this.postData.cityId=cityId;
        this.postData.orgName=orgName;
        this.postData.mtUrl=mtUrl;
        this.postData.mtId=mtId;
        this.postData.areaInfo=areaInfo;
        this.postData.clientType.clientType=clientType.clientType;
        this.postData.clientType.clientId=clientType.clientId;
        this.postData.company.data[0].defaultIndex=company.slotValue.i;

        this.getAllStation(company.slotValue.id).then(data=>{
           this.postData.station.data[0].values=data.list;
           this.postData.stationId=data.list[station.slotValue.i].id;
           this.postData.station.data[0].defaultIndex=station.slotValue.i;
        })
     }
     else {
        // id && this.initValue(id)
     }
  },
  methods:{
    ...mapActions([
      'setClientInfo',
      'getAllCompanyList',
      'getAllStation'
    ]),
    getclientType(v){
      // console.log(v)
      this.postData.clientType.clientType=v.name;
      this.postData.clientType.clientId=v.type;
    },
    getPhotoMsg(data){
      let {id,url} = data;
      this.postData.mtUrl=url;
      this.postData.mtId=id;
    },
    handleDelete(){
      this.postData.mtUrl='';
      this.postData.mtId='';
    },
    pickerClientType(n,d){
      this.postData.clientType.clientType=n;
      this.postData.clientType.clientId=d;
    },
    getPosition(){

      this.setClientInfo({...this.postData});

      !this.readonly && this.$router.push({name:'position',query:{...this.$route.query}});
    },
    companyValuesChange(v,p){
      if(!v[0]) return;
      let {orgName,id,i} =v[0]
      if(!orgName || !id) return;
      this.postData.company.value=orgName;
      this.postData.companyId=id;
      this.postData.company.slotValue={orgName,id,i};

      this.getAllStation(id).then(data=>{
         this.postData.station.data[0].values=data.list;
         this.postData.stationId=data.list[0].id;
      })



    },
    stationValuesChange(v,p){
      if(!v[0]) return;

      let {orgName,id,i} =v[0]
      this.stationCom=p;
      this.postData.station.slotValue={orgName,id,i};
      if(!orgName) return;
      this.postData.station.value=orgName;
      this.postData.stationId=id;
      const orgid = this.$route.query.id;


      if(this.first){
         if(orgid){
            this.initValue(orgid)
         }
         this.first=false;
      }

    },
    initValue(id){
        if(id){
          Axios('/api/saler/customer/baseinfo/query',{id,openid:this.openid}).then(data=>{
             if(!data.result || data.code) return Toast(data.message);
             let {orgName,mtId,mtUrl,longitudeLatitude,address,companyId,stationId,userTypeStr,userType,areaInfo}=data.data;

             this.postData.longitudeLatitude=longitudeLatitude;
             this.postData.address=address;
             this.postData.areaInfo=areaInfo;
             this.postData.mtId=mtId;
             this.postData.mtUrl=mtUrl;
             this.postData.orgName=orgName;

             this.postData.clientType.clientType=userTypeStr;
             this.postData.clientType.clientId=userType;


             this.setClientInfo({...this.postData});
             let allCompanyList = this.allCompanyList;
             let allStation = this.allStation;


            //  companyId=8814;
            //  stationId=8816;

             if(!companyId) return;

             allCompanyList.forEach((v,i)=>{
                if(v.id==companyId){
                    return this.postData.company.data[0].defaultIndex=v.i;
                }

             })

               this.getAllStation(companyId).then(data=>{

                        data.list.forEach((v,i)=>{
                           if(v.id==stationId){
                              return setTimeout(()=>this.stationCom.setSlotValue(0,data.list[v.i]),20)
                           }
                        })
                    })




          })
        }
    },
    reset(){
      this.setClientInfo({});
      location.reload();
    },
    submit(){

       if(!this.locked) return;
       let {orgName,companyId,stationId,station,clientType,mtId,longitudeLatitude,address,provinceId,cityId,areaId,areaInfo} = this.postData;


       if(!orgName) return Toast('请输入客户名称');
       if(!mtId) return Toast('请上传门头照');
       if(!address) return Toast('请采集位置信息');

       this.locked=false;

       let data ={
         orgName,
         mtId,
         address,
         areaInfo,
         longitudeLatitude,
         provinceId,
         cityId,
         areaId,
         companyId,
         stationId:station.slotValue.id,
         openId:this.openid,
         userType:clientType.clientId
       }
        // return console.log(data);

       Axios('/api/saler/customer/baseinfo/operateClient',data).then(data=>{
          this.locked=true;
          if(!data.result || data.code) return Toast(data.message);

          Toast('提交成功！');


          setTimeout(() => {
            this.reset();
          }, 1000);
       })
    }
  }
}
</script>

<style lang="css" scoped>
.add-user{
  padding-bottom: .8rem;
}
.base-msg,.add-photo,.add-map{
  padding: 0 .15rem;
}
.title-text{
   font-size: .16rem;
   color:#4392ff;
   margin-top: .1rem;
}
.item-name{
  margin:.12rem 0;
  color:#666;
  font-size: .16rem;
}
.photo-box{
  width: 1rem;
  height: 1rem;
}
.add-photo{
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: .2rem;
}
.add-map{
  border-bottom: 1px solid #f5f5f5;
}
.map-geo{
  color:#666;
  margin: .1rem 0;

}
.map-tit{
  position: relative;
}
.item-right{
  width: .09rem;
  height: .165rem;
  background: url(../../../static/images/clerk/icon/icon-enter.png) 50% 50% no-repeat;
  background-size: contain;
  position: absolute;
  right: 0;

  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  top:50%;
}
.icon-map{
  width: .26rem;
  vertical-align: middle;
  margin-right: .04rem;
}
.map-show{
  margin: .1rem 0;
}
.base-msg .inp-show{
  width: 65%;
  line-height: .45rem;
}
.submit-box{
  position: fixed;
  bottom:.1rem;
  width: 100%;
  padding: 0 .15rem;
}
.submit{
  /*margin: .1rem 0 .2rem 0;*/
}

</style>
