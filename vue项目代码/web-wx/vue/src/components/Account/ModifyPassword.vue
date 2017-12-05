<template>
  <div class="page login">
    <div class="logo_wrap"></div>
    <div class="login_wrap">
      <div class="input-wrap">
        <input-client v-for="(item,index) of form" :key="index" :data="item" @sendMsgToParent="showMsgFromChild"></input-client>
      </div>
      支持6~16位字母、数字或字符组成
      <button-client :data="btnObj" @listenButtonEvent="handleSubmit"></button-client>
    </div>
  </div>
</template>

<script>
  import InputClient from '@/components/Common/Form/InputClient'
  import ButtonClient from '@/components/Common/Form/ButtonClient'
  import {Ajax,Cookie} from '@/assets/Util'
  import {mapState} from 'vuex'
  const time=1000
  export default {
    components: {InputClient, ButtonClient},
    data(){
      return {
        tip:{},
        form:[{
          value: '',
          placeholder: '请输入新密码',
          field: 'password',
          require: true,
          type: 'password'
        },{
          value: '',
          placeholder: '请再次输入新密码',
          field: 'again_password',
          require: true,
          type: 'password'
        }],
        btnObj: {
          txt: '修改',
          style: {marginTop: '.3rem'},
          disabled: false
        }
      }
    },
    computed:mapState({
      accountInfo:state=>state.accountInfo
    }),
    methods: {
      showMsgFromChild (field, data) {
        this.form.forEach(v => {
          if (v.field === field) {
            v.value = data
          }
        })
      },
      handleSubmit(){
        const data=this.accountInfo,name=this.$route.query.path;
        this.btnObj.style={background:'#ddd',marginTop:'.3rem'};
        this.btnObj.disabled=true;
        for(let val of this.form){
          if(val.value==''&&val.require){
            this.$store.dispatch('changeTip',{txt:val.placeholder,isTip:true,time,cb:()=>{
              this.btnObj.style={background:'#4392ff',marginTop:'.3rem'};
              this.btnObj.disabled=false;
            }});
            return;
          }
        }
        if(this.form[0].value!=this.form[1].value){
          this.$store.dispatch('changeTip',{isTip:true,txt:'两次输入密码不一致！',time,cb:()=>{
            this.btnObj.style={background:'#4392ff',marginTop:'.3rem'};
            this.btnObj.disabled=false;
          }});
          return;
        }else{
          let exp=/^\w{6,16}$/;
          if(!this.form[0].value.match(exp)){
            this.$store.dispatch('changeTip',{isTip:true,txt:'该密码由16位数字、字母或下划线组成！！',time,cb:()=>{
              this.btnObj.style={background:'#4392ff',marginTop:'.3rem'};
              this.btnObj.disabled=false;
            }})
            return;
          }else if(this.form[0].value==data.oldPassword){
            this.$store.dispatch('changeTip',{isTip:true,txt:'不可与原密码相同',time,cb:()=>{
              this.btnObj.style={background:'#4392ff',marginTop:'.3rem'};
              this.btnObj.disabled=false;
            }})
            return;
          }else{
            data.password=this.form[0].value;
            Ajax('/wx/binding',data,(res)=>{
              if(res.code==1){
                Cookie.setCookie('openid',data.openid);
                this.$store.dispatch('changeTip',{isTip:true,txt:'密码修改成功，请牢记新密码！',time,cb:()=>{
                  this.$router.replace({name})
                }})
              }else{
                this.$store.dispatch('changeTip',{isTip:true,txt:res.msg,time,cb:()=>{
                  this.btnObj.disabled=false;
                  this.btnObj.style={background:'#4392ff',marginTop:'.3rem'};
                }})
              }
            },(res)=>{
              if(res.code==1){
                Cookie.setCookie('openid',data.openid);
                this.$store.dispatch('changeTip',{isTip:true,txt:'密码修改成功，请牢记新密码！',time,cb:()=>{
                  this.$router.replace({name})
                }})
              }else{
                this.$store.dispatch('changeTip',{isTip:true,txt:res.msg,time,cb:()=>{
                  this.btnObj.disabled=false;
                  this.btnObj.style={background:'#4392ff',marginTop:'.3rem'};
                }})
              }
//                this.$store.dispatch('changeTip',{isTip:true,txt:'服务器错误',time,cb:()=>{
//                  this.btnObj.disabled=false;
//                  this.btnObj.style={background:'#4392ff',marginTop:'.3rem'};
//                }})
            });
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
