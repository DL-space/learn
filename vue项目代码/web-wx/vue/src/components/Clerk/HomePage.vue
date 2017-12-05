<template>
  <div class="clerk">
    <div class="banner">
      <div class="name" style="padding-top:.02rem;">
        {{homePermission.userInfo.userName}}
      </div>
      <img src='../../../static/images/clerk/banner.png' style="width:100%;height:1.65rem;"/>
    </div>
    <title-style1 :data="title"></title-style1>
    <div class="menu menus">
      <div v-for="(v,i) of homePermission.tabs" class="menu-list" :key="i" @click="link(v.path)" :style="i%2==1?'borderRight:none':''">
        <div :class="'icon '+v.icon"></div>
        <div class="menu-txt">
          {{v.name}}
        </div>
      </div>
    </div>
    <!-- <select v-model="bb" @change="aa = bb">
       <option :value="v.id" v-for="v in items" >{{v.name}}</option>
    </select>
    <input type="text" name="" v-model="aa"> -->
  </div>
</template>
<script>
  import TitleStyle1 from '@/components/Common/Title/Title'




  import { mapActions,mapGetters } from 'vuex'
  import {Ajax,ChangeObj} from '@/assets/Util'
  export default {
    components: {TitleStyle1},
    data () {
      return {
        title: {
          style: 'style1',
          name1: '客户'
        },
        menu: [],
        userInfo:{},
        camera:null,
        // items:[
        //   {id:1,name:'aa'},
        //   {id:2,name:'bb'},
        //   {id:3,name:'cc'},
        // ],
        // aa:'',
        // bb:''

      }
    },
    computed:{
      ...mapGetters([
        'openid',
        'homePermission'
      ]),
    },
    watch:{
      openid(n){
        this.init(n);
      }
    },
    created(){
      this.init(this.openid);
      this.setClientInfo({});
    },
    methods: {
      ...mapActions([
        'setClientInfo',
        'getHomePermission'
      ]),
      link(path){
        this.$router.push({name:path,query:{canEdit:1}})
      },
      init(id){
        if(!id) return;
        this.getHomePermission(id);
      }

    }
  }
</script>
