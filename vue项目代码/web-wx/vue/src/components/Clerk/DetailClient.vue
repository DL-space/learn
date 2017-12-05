<template>
  <div class="clerk">
    <div class="client-list" style="border:none">
      <client-item :data="clientInfo" detail="true"></client-item>
    </div>
    <div class="tab-list">
      <tab-bar v-for="(v,i) of tab" :data="v" :key="i" @handleTabBar="handleTabBar"></tab-bar>
    </div>
  </div>
</template>
<script>
  import ClientItem from '@/components/Clerk/ClientItem'
  import {TabBar} from '@/components/Common/Tab'
  import loading from '@/components/Common/loading'
  import {Ajax,ChangeObj,Axios} from '@/assets/Util'
  import { mapGetters,mapActions } from 'vuex'
  import { Toast } from 'mint-ui'
  export default{
    components:{ClientItem,TabBar},
    data(){
      return {
        tab: [],
        clientInfo:{},
        address:false
      }
    },
    computed:{
      ...mapGetters([
        'openid',
        //clientInfo:state=>state.clientInfo,
        //'clerkPermission'
      ])
    },
    created(){
      loading.open();
      const openId=this.openid,
            {id,canEdit,role} = this.$route.query;
      this.setClientInfo({});
      Axios('/api/saler/customer/homepage/query',{id,openId}).then(data=>{

        if(data.result){
          this.clientInfo=data.data;
          this.changeTip({isTip:false,txt:'',loading:false});
          if(canEdit==1){
            Ajax('/api/saler/customer/saler/permission',{openId,id},(data2)=>{
              this.init(data2.data.permissionMap);
            });
          }else{
            this.tab=[
              {name:'客户基本信息',path:'addClient'},
              // {name:'地图定位',path:'position'},
              {name:'银行账号信息',path:'addBankCard'},
              {name:'门店照片',path:'shopPhoto'},
              {name:'业务资料',path:'material'},
              {name:'驿站申请',path:'postApply'},
              {name:'公司信息',path:'company'},


            ];
             if(role=='client'){

               this.tab.push({name:'修改登录密码',path:'makePassword'},{name:'修改支付密码',path:'makePayPassword'})
             }
            //  else{
            //    this.tab.push({name:'解除绑定',path:'unbind'});
            //  }
            Axios('/api/saler/customer/baseinfo/query',{id,openId:this.openid},{load:0}).then(data=>{
              loading.close();

              if(!data.result || data.code) return Toast(data.message);
              if(data.data.address){
                this.tab[0].name='客户基本信息(已采集)';
              }
            })
          }

        }else{
          this.changeTip({isTip:false,txt:'',loading:true});

          Toast(data.message)

          loading.close();
        }
      })



    },
    methods:{
      ...mapActions([
        'changeTip',
        'setClientInfo'
      ]),
      handleTabBar(obj){
        const id=this.$route.query.id,
          canEdit=this.$route.query.canEdit==0?0:obj.canEdit,
          role=this.$route.query.role?this.$route.query.role:'';
        this.$router.push({name:obj.path,query:role?{id,canEdit,role}:{id,canEdit}})
      },
      init(n){
        let {canEdit,id}=this.$route.query;
        let ooo=ChangeObj(n,['baseInfo','bankAccount','picture','business','posthouse','company','customerUnbind'])
        for(let item in ooo){
          let canSee,canEdit,path,name,tmp;
          if(ooo[item].view){
            canSee=1;
            if(ooo[item].edit){
              canEdit=1;
            }else{
              canEdit=0;
            }
          }else{
            canSee=0;
            canEdit=0;
          }
          switch(item) {
            case 'baseInfo':{
              name='客户基本信息';
              path='addClient';
              break;
            }
            // case 'map':{
            //   name='地图定位';
            //   path='position';
            //   break;
            // }
            case 'bankAccount':{
              name='银行账号信息';
              path='addBankCard';
              break;
            }
            case 'picture':{
              name='门店照片';
              path='shopPhoto';
              break;
            }
            case 'business':{
              name='业务资料';
              path='material';
              break;
            }
            case 'posthouse':{
              name='驿站申请';
              path='postApply';
              break;
            }
            case 'company':{
              name='公司信息';
              path='company';
              break;
            }
            case 'customerUnbind':{
              name='解除绑定';
              path='unbind';
              break;
            }

          }
          tmp={name,path,canEdit};
          if(canSee){
            this.tab.push(tmp);
          }
        }

        Axios('/api/saler/customer/baseinfo/query',{id,openId:this.openid},{load:0}).then(data=>{
          loading.close();

          if(!data.result || data.code) return Toast(data.message);
          if(data.data.address){
            if(this.tab[0])this.tab[0].name='客户基本信息(已采集)';
          }
        })
        // if(canEdit==1){
        //   this.tab.push({name:'解除绑定',path:'unbind'})
        // }
      }
    }
  }
</script>
