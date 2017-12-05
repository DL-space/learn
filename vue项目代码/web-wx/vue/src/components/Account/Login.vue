<template>
  <div class="page login">
    <div class="logo_wrap"></div>
    <div class="login_wrap">
      <div class="input-wrap">
        <input-client v-for="(item, index) of form" :data="item" :key="index" @changeCode="changeCode" @listenChildrenAction="confirmMsgFromChild"  @sendMsgToParent="showMsgFromChild"></input-client>
      </div>
      <button-client :data="submitBtn" @listenButtonEvent="handleSubmit"></button-client>
    </div>
  </div>
</template>
<script>
  import {ButtonClient, InputClient} from '@/components/Common/Form'
  import {Ajax,Cookie} from '@/assets/Util'
  import {mapState} from 'vuex'
  import config from '../../../conf.js';
  const time=1000
  export default {
    name: 'login',
    components: {ButtonClient, InputClient},
    data () {
      const type = this.$route.params.type
      let data
      if (type == 1) {
        data = {
          form: [{
            value: '',
            placeholder: '请选择物流公司',
            fill: '',
            field: 'companyId',
            require: true,
            selected: {
              selected: [0],
              options: [{
                items: []
              }]
            }
          }, {
            value: '',
            placeholder: '请填写客户编号',
            field: 'account',
            require: true
          }, {
            value: '',
            type: 'password',
            placeholder: '请输入密码',
            field: 'password',
            require: true
          }],
          submitBtn: {
            txt: '登录',
            style: {marginTop: '0.3rem'}
          },
          count:0
        }
      } else {
        data = {
          form: [{
            value: '',
            placeholder: '请填写业务员账号',
            field: 'account',
            require: true
          }, {
            value: '',
            type: 'password',
            placeholder: '请输入密码',
            field: 'password',
            require: true
          }],
          submitBtn: {
            txt: '登录',
            style: {marginTop: '0.3rem'}
          },
          count:0
        }
      }
      return data
    },
    computed:mapState({
      openid:state=>state.openid,
    }),
    created () {
      // localStorage.setItem('loginState','0');
      // const code=window.location.href.match(/code/)?window.location.href.match(/\?code=(.*)&/)[1]:'';
      //
      // let loginState = localStorage.getItem('loginState');
      //
      //   if(this.openid && loginState==0){
      //     Cookie.delCookie('openid');
      //     this.$store.dispatch('setOpenid','');
      //
      //     localStorage.setItem('loginState','1')
      //
      //     let url = location.origin + location.pathname +'#'+this.$route.fullPath;
      //
      //     url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+config.appid+'&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&state=wx%23wechat_redirect'
      //
      //     console.log(url,this.$route.fullPath)
      //
      //
      //
      //     setTimeout(()=>{
      //       location.href=url;
      //     },0)
      //
      //     return;
      // }


      const type = this.$route.params.type;
      if (type == 1) {
        Ajax('/wechat/getAllCompany', {}, (data) => {
          let tmp = []
          data.data.forEach(function (v) {
            tmp.push({id: v.id, label: v.orgName})
          })
          this.form.forEach(function (v) {
            if (v.field === 'companyId') {
              v.selected.options[0].items = tmp
            }
          })
        })
      }
    },
    methods: {
      changeCode(field){
        this.form.forEach((v)=>{
          if(v.field==field){
            v.time=new Date().getTime();
          }
        })
      },
      handleSubmit() {
        const type=this.$route.params.type;
        const path=this.$route.query.path;
        var data={};
        if(this.count<3){
          data.code=0;
        }
        data.openid=this.openid;
        data.type=type;
        for(let val of this.form){
          if(val.value==''&&val.require){
            this.$store.dispatch('changeTip',{txt:val.placeholder,isTip:true,time});
            return;
          }
          data[val.field]= val.value;
        }
        Ajax('/api/saler/customer/user/verify',data,(res)=>{
          if(res.result){
            if(res.data==1){
              Cookie.setCookie('openid',data.openid);
              if(this.$route.params.type==1){
                this.$router.replace({name:path})
              }else{
                this.$router.replace({name:'clerk'});
              }
            }
            if(res.data==2){
              var tmp={};
              for(let i in data){
                if(i=='openid'||i=='companyId'||i=='account'||i=='type'){
                  tmp[i]=data[i];
                }
                if(i=='password'){
                  tmp['oldPassword']=data[i];
                }
              }
              this.$store.dispatch('setAccountInfo',tmp);
              this.$router.replace({name:'modifyPassword',params:{type},query:{path}});
            }
          }else{
            this.count++;
            this.$store.dispatch('changeTip',{isTip:true,txt:res.message,loading:false,time});
            if(this.count==3){
              let obj={
                value:'',
                placeholder:'请输入验证码',
                field:'code',
                require:true,
                isVerifyCode:true,
                time:new Date().getTime()
              };
              this.form.push(obj);
            }
            if(this.count>3){
              this.form.forEach((v)=>{
                if(v.field=='code'){
                  v.time=new Date().getTime();
                }
              });
            }
          }
        })
      },
      showMsgFromChild (field, data) {
        this.form.forEach((v) => {
          if (v.field === field) {
            v.value = data
          }
        })
      },
      confirmMsgFromChild (action,field,arr){
         if(action==='confirm'){
          this.form.forEach((v,i) => {
            if (v.field === field) {
              let tmp='',selected=[];
              arr.forEach((v2,i2)=>{
                tmp+=v2.label+' ';
                selected.push(v2.index);
              })
              v.value = arr[0].id;
              v.fill = tmp;
              v.selected.selected=selected;
            }
          })
         }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
