<template>
  <div class="clerk">
    <div class="forbidden-client">
      <title-style  :data="title" :isForbidden="isForbidden"></title-style>
      <title-style @handleChange="handleChange" :data="title2" :isForbidden="isForbidden"></title-style>
      <div class="red" style="padding:.1rem;font-size:.14rem">注：禁用后客户将不能用于创建发货单</div>
    </div>
  </div>
</template>
<script>
  import TitleStyle from '@/components/Common/Title/Title'
  import {AjaxApi} from '@/assets/Util'
  import {mapState} from 'vuex'
  export default {
    components:{TitleStyle},
    data(){
      return {
        isForbidden:false,
        title: {
          style: 'style3',
        },
        title2: {
          style: 'style4',
          name1: '变更客户的启/禁用状态',
        }
      }
    },
    computed:mapState({
      clientInfo:state=>state.clientInfo
    }),
    created(){
      this.title.name1=this.clientInfo.orgName;
      this.isForbidden=this.clientInfo.isUsed==0?false:true;
    },
    methods:{
      handleChange(e){
        const dom=e.target,id=this.$route.query.id;
        AjaxApi('/org/client/enable',{id},(data)=>{
          if(data.result){
            if(dom.checked){
              this.isForbidden=false;
            }else{
              this.isForbidden=true;
            }
          }
        });
      }
    }
  }
</script>
