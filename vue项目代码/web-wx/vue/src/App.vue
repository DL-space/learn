<template>
  <div id="app">
    <router-view v-if="show"></router-view>
    <tip v-if="tip.isTip" :data="tip"></tip>
    <confirm-component v-if="confirm.isConfirm" :data="confirm" @handleCancel="handleCancel" @handleConfirm="handleConfirm"></confirm-component>
  </div>
</template>

<script>
  import {Tip,ConfirmComponent} from '@/components/Common/Tip';
  import {Ajax,Cookie} from '@/assets/Util';
  import { mapState } from 'vuex';
  import config from '../conf.js'
export default {
  name: 'app',
  components:{Tip,ConfirmComponent},
  data(){
    return {
      show:false
    }
  },
  computed:mapState({
      tip:state=>state.tip,
      confirm:state=>state.confirm
  }),
  created(){
    this.show=false;

    // Cookie.setCookie('openid','or3W_s61P4Ie0Yupy1wTk1YZLY50');
    // Cookie.setCookie('openid','or3W_s8N0p8GXnGRcp6VLWdxure4');
    // Cookie.setCookie('openid','or3W_s4JN0i1OmDKO5pdAoW0T0ks');

    // console.log(this.$route)

    const name=this.$route.name,parentPath=this.$route.path.match(/^\/(\w+)\/?/)[1],openid=Cookie.getCookie('openid')!=undefined && Cookie.getCookie('openid')!=null?Cookie.getCookie('openid'):'';
    let userType=parentPath=='clerk'?2:1;
    if(parentPath!='detail'&&parentPath!='account'&&parentPath!='download'&&parentPath!='pickerDownload'&&parentPath!='x'){
      // openid = openid.tirm();
      if(openid){
        this.$store.dispatch('setOpenid',openid);


        Ajax('/api/saler/customer/userRole/query',{openId:openid},(data2)=>{

          // console.log('data1>>>',data2)

          if(userType==1){
            if(data2.data.flag==2||data2.data.flag==0){
              this.$store.dispatch('changeTip',{isTip:false,txt:''})
              this.$router.replace({name: 'guid', params: {type: userType},query:{path:name}})
            }
          }else{
            if(data2.data.flag==1||data2.data.flag==0){
              this.$router.replace({name: 'login', params: {type: userType},query:{path:name}});
            }else{
              //this.getPermission(openid)
            }

          }
          // console.log(11111)
          this.show=true;

        })
      }else{
        const code=window.location.href.match(/code/)?window.location.href.match(/\?code=(.*)&/)[1]:'';

        if(!code) return alert('缺少参数[code]');

        // if(Cookie.getCookie('wxcode')==code) return location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb40f75a4ee5f5e51&redirect_uri=http://c.wl.motorsc.com/webapp/dist/index.html#/clerk&response_type=code&scope=snsapi_userinfo&state=wx%23wechat_redirect';

        Ajax('/wx/userid',{code},(data)=>{
          console.log(data);
          if(data.code==1){ 
            // console.log(1111)

            if(data.data==''||data.data==null||data.data==undefined){
              this.show=false;



              this.$store.dispatch('changeTip',{isTip:true,txt:'由于网络原因，获取信息失败，请点左上角返回重新操作！'});
              // location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb40f75a4ee5f5e51&redirect_uri=http://c.wl.motorsc.com/webapp/dist/index.html#/clerk&response_type=code&scope=snsapi_userinfo&state=wx%23wechat_redirect';

            }else{
              const openid=data.data;
              this.$store.dispatch('setOpenid',openid);
              Cookie.setCookie('wxcode',code);

              Ajax('/api/saler/customer/userRole/query',{openId:openid},(data2)=>{
                if(userType==1){
                  if(data2.data.flag==2||data2.data.flag==0){
                    this.$store.dispatch('changeTip',{isTip:false,txt:''})
                    this.$router.replace({name: 'guid', params: {type: userType},query:{path:name}})
                  }else{
                    Cookie.setCookie('openid',openid);
                  }
                  this.show=true;
                }else{
                  if(data2.data.flag==1||data2.data.flag==0){
                    this.$router.replace({name: 'login', params: {type: userType},query:{path:name}});
                  }else{
                    Cookie.setCookie('openid',openid);
                    //this.getPermission(openid)
                  }
                  this.show=true;

                }
              })
            }
          }
        })
      }
    }
    else{
      this.show=true;
    }
  },
  methods:{
    handleConfirm(){
      this.confirm.confirmCallBack();
    },
    handleCancel(){
      this.confirm.cancelCallBack();
    },
    getPermission(id){
      Ajax('/api/saler/customer/saler/permission',{openId:id},(data)=>{
        if(!data.result) return;
        this.$store.dispatch('setClerkPermission',data.data.permissionMap);
      });
    }
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  @import '../static/css/base.css';
  @import '../static/css/account.css';
  @import '../static/css/client.css';
  @import '../static/css/clerk.css';
  @import '../static/css/download.css';
  @import '../static/css/weui.css';
  @import '../static/css/statistics.css';
</style>
