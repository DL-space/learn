<template>
  <div class="clerk">
    <div class="add-client">
      <input-client v-for="(v,i) of form" :data="v" :key="i"  @sendMsgToParent="showMsgFromChild"></input-client>
    </div>
    <button-client  :disabled="disabled" @listenButtonEvent="handleSubmit" :data="button"></button-client>
  </div>
</template>
<script>
  import {InputClient,ButtonClient} from '@/components/Common/Form'
  import { Ajax,AjaxApi } from '@/assets/Util'
  import { Toast } from 'mint-ui'
  import { mapState } from 'vuex';
  import cnCity from '@/data/cnCity';
  const time=1000;
  export default {
    components:{InputClient,ButtonClient},
    data(){
      return {
        role:this.$route.query.role?this.$route.query.role:'',
        form:[{
          label:'举升机(数量)',
          field:1,
          value:'',
          type:'number',
          placeholder:'请输入举升机数量'
        },{
          label:'大小剪(数量)',
          field:2,
          value:'',
          type:'number',
          placeholder:'请输入大小剪数量',
        },{
          label:'工位(数量)',
          field:3,
          value:'',
          type:'number',
          placeholder:'请输入工位数量',
        },{
          label:'营业额',
          field:4,
          value:'',
          type:'number',
          placeholder:'请输入营业额',
        },{
          label:'员工数量',
          field:5,
          value:'',
          type:'number',
          placeholder:'请输入员工数量'
        },{
          label:'汽修店面积',
          field:6,
          value:'',
          type:'number',
          placeholder:'请输入汽修店面积',
          util:'平方米'
        },{
          label:'主营业务',
          field:7,
          value:'',
          placeholder:'请输入主营业务',
          style:{border:'none'},
        }],
        button:{
          txt:this.$route.query.canEdit==1?'保存':'关闭',
          style:{
            width:'94%',
            margin:'.2rem 3%'
          }
        }
      }
    },
    computed:mapState({
      openid:state=>state.openid,
      disabled:state=>state.disabled
  }),
  created(){
    this.$store.dispatch('initStore');
    const id=this.$route.query.id,canEdit=this.$route.query.canEdit;
    if(canEdit==0){
      this.form.forEach((v, i) => {
        v.readonly=true;
      })
    }
    Ajax('/api/saler/customer/business/info',{orgId:id},(data)=>{
      const info = data.data;
      if(info.length!=0) {
        this.form.forEach((v, i) => {
          v.value = info[i][v.field];
          if (canEdit == 0) {
            v.readonly = true;
          }
          if (this.role == 'client') {
            v.placeholder = '';
          }
        })
      }
    })
  },
  methods:{
    showMsgFromChild(field, data) {
      this.form.forEach((v) => {
        if (v.field === field) {
          v.value = data
        }
      })
    },
    handleSubmit(){
      const id=this.$route.query.id;
      const canEdit=this.$route.query.canEdit;
      let data=[],url,phone,isSave=false;
      this.form.forEach(v=>{
        let obj={};
        v.value && (isSave=true);
        obj.type= v.field;
        obj.value= v.value;
        data.push(obj);
      })
      if(canEdit==1){
        if(!isSave) return Toast('至少填写一项');
        this.$store.dispatch('changeTip',{txt: '正在玩命处理中',isTip:true,loading:true});
        Ajax('/api/saler/customer/business/edit', {orgId:id,serviceData:JSON.stringify(data)}, (data)=> {
          if (data.result){
            this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time,cb:()=>{
                window.history.go(-1);
            }})
          }else{
            this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time})
          }
        })
      }else{
        window.history.go(-1);
      }
    }
  }
  }
</script>
