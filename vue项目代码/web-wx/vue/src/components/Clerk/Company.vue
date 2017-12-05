<template>
  <div class="clerk">
    <div class="add-client">
      <input-client v-for="(v,i) of form" :data="v" :key="i" @handleUpload="handleUpload" @handleDelete="handleDelete" @sendMsgToParent="showMsgFromChild" @handleChecked="handleChecked" @handleInput="handleInput"></input-client>
    </div>
    <button-client  :disabled="disabled" @listenButtonEvent="handleSubmit" :data="button"></button-client>
  </div>
</template>
<script>
  import {InputClient,ButtonClient} from '@/components/Common/Form'
  import { Ajax,AjaxApi } from '@/assets/Util'
  import { mapState } from 'vuex';
  import cnCity from '@/data/cnCity';
  import { Toast } from 'mint-ui';
  const time=1000;
  export default {
    components:{InputClient,ButtonClient},
    data(){
      return {
        role:this.$route.query.role?this.$route.query.role:'',
        form:[{
          label:'公司名称',
          field:'companyName',
          value:'',
          placeholder:'请输入公司名称',
          require:true,
          readonly:false
        },{
          label:'营业执照号',
          field:'businessNumber',
          value:'',
          placeholder:'请输入营业执照号',
          require:true,
          readonly:false
        },{
          label:'营业执照',
          field:'businessId',
          value:'',
          type:'hidden',
          placeholder:'营业执照上传',
          uploadImg:true,
          require:true,
          fill:'',
          readonly:false
        },{
          label:'店长',
          field:'leader',
          value:'',
          placeholder:'请输入店长',
          require:true,
          readonly:false
        },{
          label:'维修品牌（最多选5个）',
          field:'brandInfo',
          value:'',
          type:'hidden',
          placeholder:'请选择维修品牌',
          brand:true,
          require:true,
          fill:{},
          style:{border:'none',paddingBottom:'.1rem'},
          car:[],
          filterCar:[],
          readonly:false
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
    Ajax('/api/saler/customer/company/query',{orgId:this.$route.query.id},(data)=>{
      const info = data.data;
      let car=[],filterCar=[];
      Ajax('/api/saler/customer/carTypeQuery',{},(data2)=>{
        data2.data.forEach(v=>{
          let tmp={id: v.id,name: v.dictName};
          if(info.brandInfo){
            const arr=info.brandInfo.split(',');
            arr.forEach(v2=>{
              if(v2==tmp.id){
                filterCar.push(tmp);
                tmp.checked=true;
              }
            })
          }
          car.push(tmp);
        });
        this.form.forEach((v,i)=>{
          v.value=info[v.field];
          if(v.field=='businessId'){
            v.fill=info.businessPath;
          }
          if(canEdit==0){
            v.readonly=true;
          }
          if(v.field=='brandInfo'){
            v.car=car;
            v.filterCar=filterCar;
          }
          if(this.role=='client'){
            v.placeholder='';
          }
        })
      })
    })
  },
  methods:{
    handleDelete(field){
      this.form.forEach(v=>{
        if(v.field=='businessId'){
          v.fill='';
          v.value='';
        }
      })
    },
    handleUpload(data,field,e){
      this.form.forEach(v=>{
        if(v.field=='businessId'){
          v.fill=data.url;
          v.value=data.id;
        }
      })
    },
    showMsgFromChild(field, data) {
      this.form.forEach((v) => {
        if (v.field === field) {
          v.value = data
        }
      })
    },
    handleChecked(o,e){
      this.form.forEach(v=>{
        if(v.field=='brandInfo'){
          v.car.forEach(v2=>{
            if(v2.id=== o.id){
              v2.checked=e==='cancel'?false:e.target.checked;
              if(v2.checked) {
                v.filterCar.push(o);
              }else{
                v.filterCar.forEach((v3,i3)=>{
                   if(v3.id=== o.id){
                    v.filterCar.splice(i3,1);
                  }
                })
              }
              if(v.filterCar.length==5){
                v.car.forEach(v3=>{
                  if(!v3.checked){
                    v3.disabled=true;
                  }
                })
              }else{
                v.car.forEach(v3=>{
                  if(v3.disabled){
                    v3.disabled=false;
                  }
                })
              }
            }
          })
          if(e==='cancel'){
            v.filterCar.forEach((v3,i3)=>{
              if(v3.id=== o.id){
                v.filterCar.splice(i3,1);
              }
            })
          }
          let tmp=[];
          v.filterCar.forEach(v=>{
            tmp.push(v.id);
          })
          v.value=tmp.join(',');
        }
      })
    },
    handleInput(t){
      this.form[4].car=[];
      Ajax('/api/saler/customer/carTypeQuery',{dictName:t},(data)=>{
        data.data.length>0 && data.data.forEach(v=>{
          let tmp={id: v.id,name: v.dictName};
          this.form[4].filterCar.forEach(v2=>{
            if(v.id==v2.id){
              tmp.checked=true;
            }
          })
          this.form[4].car.push(tmp);
        })
      });
    },
    handleSubmit(){
      const id=this.$route.query.id;
      const canEdit=this.$route.query.canEdit;
      let data={orgId:id};
      this.form.forEach(v=>{
        data[v.field]= v.value;
      })
      if(canEdit==1){
        for(let v of this.form){
          if((v.value==''||v.value==null)&&v.require){
            this.$store.dispatch('changeTip',{txt: v.placeholder,isTip:true,time:2000});
            return;
          }
        }

        this.$store.dispatch('changeTip',{txt: '正在玩命处理中',isTip:true,loading:true});

        Ajax('/api/saler/customer/businessSn/verify',{businessSn:data.businessNumber},dt=>{
           if(dt.result){
              if(dt.code){
                Toast(dt.message);
                return this.$store.dispatch('changeTip',{txt:'',isTip:false,})
              }

              Ajax('/api/saler/customer/company/edit',data, (data)=> {
                if (data.result){
                this.$store.dispatch('changeTip',{txt: '编辑成功',isTip:true,time:time,cb:()=>{
                    window.history.go(-1);
                }})
                }else{
                  this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time})
                }
              })
           }
        });

      }else{
        window.history.go(-1);
      }
    }
  }
  }
</script>
