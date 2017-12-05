<template>
  <div class="clerk">
    <div class="unbind-client">
      <title-style :data="title"></title-style>
      <div class="unbind-list">
        <div class="item" v-for="(v,i) of bindList" :key="i">
          <div class="fl">
            {{v.nickName}}
          </div>
          <div class="fr">
            <button @click="handleClick(v.openid)">解绑</button>
          </div>
        </div>
      </div>
    </div>
    <!--<confirm-component :data="confirm" v-if="isConfirm" @handleCancel="handleCancel" @handleConfirm="handleConfirm"></confirm-component>-->
  </div>
</template>
<script>
  import TitleStyle from '@/components/Common/Title/Title'
  import {ConfirmComponent} from '@/components/Common/Tip'
  import {Ajax} from '@/assets/Util'
  import {mapState} from 'vuex'
  export default{
    components:{ConfirmComponent,TitleStyle},
    data(){
      return {
        title:{
          style: 'style5',
          txt:'绑定微信数:0'
        },
        bindList:[]
      }
    },
    computed:mapState({
      clientInfo:state=>state.clientInfo,
      confirm:state=>state.confirm
    }),
    created(){
      this.title.name1=this.clientInfo.orgName;
      this.getData();
    },
    methods:{
      getData(){
        const id=this.$route.query.id;
        Ajax('/api/saler/customer/wechatUser/query',{id},(data)=>{
          if(data.result){
            this.bindList=[];
            this.title.txt='绑定微信数:'+data.data.length;
            data.data.forEach((v,i)=>{
              this.bindList.push({nickName: v.nickName,openid: v.openid});
            })
          }
        })
      },
      handleClick(openid){
        this.confirm.isConfirm=true;
        this.confirm.txt='是否解除当前微信号?';
        this.confirm.confirmCallBack=()=>{
          Ajax('/wechat/unbindClient',{openid},(data)=>{
            if(data.result){
              this.$store.dispatch('changeTip',{txt:'解绑成功',isTip:true,loading:false,time:1000,cb:()=>{
                  this.getData();
                  this.confirm.cancelCallBack();
              }});
            }
          });
        };

        this.$store.dispatch('setConfirm',this.confirm);
      },
      handleConfirm(){
        const openid=this.openid;
        Ajax('/wechat/unbindClient',{openid},(data)=>{
          if(data.result){
            this.$store.dispatch('changeTip',{txt:'解绑成功',isTip:true,loading:false,time:1000,cb:()=>{
              this.getData();
              this.isConfirm=false;
            }});
          }
        });
      },
      handleCancel(){
        this.openid='';
        this.isConfirm=false;
      }
    }

  }
</script>
