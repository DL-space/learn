<template>
  <div class="client">
    <div class="banner">
      <div class="col-1 logo" @click="enterClientDetail"></div>
      <div class="col-2">{{clientInfo.userName}}</div>
      <div class="col-3">欢迎回来，{{clientInfo.orgName}}！</div>
    </div>
    <div class="show_order_msg">
      <div class="title br1">
        您的发货客户编码 <span class="red">{{clientInfo.customerCode}}</span>
      </div>
    </div>
    <ul class="tab_bar">
      <li class="tab-item br1" v-for="(v,i) of tab" :key="i" @click="handleTab(v.path)">
        {{v.name}}
      </li>
    </ul>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import {Ajax,Axios} from '@/assets/Util'
  export default{
    data(){
      return{
        tab:[
          {name:'收货运单',path:'receive'},
          {name:'发货运单',path:'send'},
          {name:'统计',path:'statmenu'},
          {name:'新建发货单',path:'invoice'},
          {name:'我的客户',path:'customers'},
          {name:'我的账户',path:'myAccount'}
        ]
      }
    },
    computed:mapState({
      openid:state=>state.openid,
      clientInfo:state=>state.clientInfo
    }),
    created(){
      const openid=this.openid;
      this.getInfo(openid);
      // Ajax('/wechat/getClientId',{openid},(res)=>{
      //   const id=res.data;
      //   Ajax('/api/saler/customer/homepage/query',{openId:openid,id},(data)=>{
      //     this.$store.dispatch('setClientInfo',data.data);
      //   })
      // })
    },
    watch:{
      openid(newVal,oldVal){
        const openid=newVal;
        this.getInfo(openid);
        // Ajax('/wechat/getClientId',{openid},(res)=>{
        //   const id=res.data;
        //   Ajax('/api/saler/customer/homepage/query',{openId:openid,id},(data)=>{
        //     this.$store.dispatch('setClientInfo',data.data);
        //   })
        // })
      }
    },
    methods:{
      getInfo(id){
        if(this.clientInfo.customerCode) return;
        Axios('/wechat/getClientId',{openid:id}).then(res=>{
          const uid=res.data;
          Axios('/api/saler/customer/homepage/query',{openId:id,id:uid}).then(data=>{
            this.$store.dispatch('setClientInfo',data.data);
          })
        })
      },
      handleTab(path){
        if(path=='invoice'){
          this.$store.dispatch('setClientInfo',{});
        }
        this.$router.push({name:path})
      },
      enterClientDetail(){
        const id=this.clientInfo.id,role='client',canEdit=0;
        this.$router.push({name:'detailClient',query:{id,canEdit,role}})
      }
    }
  }
</script>
