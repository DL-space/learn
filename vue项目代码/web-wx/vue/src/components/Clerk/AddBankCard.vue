<template>
  <div class="clerk">
    <div class="add-client">
      <input-client v-for="(v,i) of form" :data="v" :key="i" @sendMsgToParent="getMsgFromChild" @listenChildrenAction="confirmMsgFromChild" @handleDelete="handleDelete" @handleUpload="handleUpload"></input-client>
    </div>
    
    <template v-if="btnShow">
      <button-client :data="button" @listenButtonEvent="handleSubmit"></button-client>
    </template>

  </div>
</template>
<script>
  import {InputClient,ButtonClient} from '@/components/Common/Form'
  import {Ajax,AjaxApi,Axios} from '@/assets/Util'
  import {mapGetters} from 'vuex'
  const time=1000
  export default{
    components:{InputClient,ButtonClient},
    props:['data','type'],
    data(){
      return{
        role:this.$route.query.role?this.$route.query.role:'',
        btnShow:true,
        dom:null,
        form:[{
          selected:{
            selected:[0],
            options:[{
              items: [{label: '工商银行', id: 1}, {label: '建设银行', id: 2}, {label: '中国银行', id: 3}, {
                label: '交通银行',
                id: 4
              },
                {label: '农业银行', id: 5}, {label: '招商银行', id: 6}, {label: '邮政储蓄银行', id: 7}, {
                  label: '光大银行',
                  id: 8
                },
                {label: '民生银行', id: 9}, {label: '平安银行', id: 10}, {label: '浦发银行', id: 11}, {
                  label: '中信银行',
                  id: 12
                },
                {label: '兴业银行', id: 13}, {label: '华夏银行', id: 14}, {label: '广发银行', id: 15}, {
                  label: '北京银行',
                  id: 16
                },{label:'长沙银行',id:17},{label:'长沙农村商业银行',id:18}],
            }]
          },
          label:'开户行',
          field:'bankName',
          value:'',
          placeholder:'请输入选择开户行',
          require:true,
          readonly:false,


        },{
          label:'支行名称',
          field:'bankBranchName',
          value:'',
          placeholder:'请输入支行名称',
          require:true,
          readonly:false,

        },{
          label:'银行卡号',
          field:'bankNum',
          value:'',
          placeholder:'请输入银行卡号',
          require:true,
          readonly:false,

        },{
          label:'开户名',
          field:'bankUserName',
          value:'',
          placeholder:'请输入开户人姓名',
          require:true,
          readonly:false,

        },
        {
          label:'开户人身份证',
          field:'cardNumber',
          value:'',
          placeholder:'请输入开户人身份证号',
          require:true,
          readonly:false,

        },
        {
          label:'银行预留手机号',
          field:'reservedTel',
          value:'',
          placeholder:'请输入银行预留手机号',
          require:true,
          readonly:false,

        },
        // {
        //   label:'财务打款手机号',
        //   field:'noticeTel',
        //   value:'',
        //   placeholder:'请输入财务打款手机号',
        //   require:true,
        //   readonly:false,
        //
        // },
        {
          label:'确认函',
          field:'bankCredit',
          fill:'',
          value:'',
          placeholder:'确认函上传',
          uploadImg:true,
          type:'hidden',
          readonly:false,
          require:true
        },{
          label:'银行卡正面',
          field:'bankCardFront',
          fill:'',
          value:'',
          placeholder:'银行卡正面上传',
          uploadImg:true,
          readonly:false,

          type:'hidden'
        },{
          label:'身份证正面',
          field:'identityCard',
          fill:'',
          value:'',
          placeholder:'身份证正面',
          uploadImg:true,
          type:'hidden',
          readonly:false,

          require:true
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
    computed:{
      ...mapGetters([
        'openid'
      ])
    },
    created(){

      this.$store.dispatch('initStore');
      const {id,type,canEdit}=this.$route.query;
      if(this.type=='postApply') {
        this.btnShow=false;
        return;
      }
      if(canEdit==0){
        this.btnShow=false;
        this.form.forEach(v=>{
          v.readonly=true;
        })


      }
      if(type=='see'){
        Axios('/account/accountapp/getBankInfo',{openId:this.openid},{api:1}).then(dt=>{
          if(!dt.result || !dt.code==0) return Toast(dt.data.message)
          // this.bankCardInfo = dt.data;
          this.form.forEach(v=>{
            v.readonly=true;

            if(v.field=='bankCredit'||v.field=='bankCardFront' || v.field=='identityCard'){
              // v.fill=info[v.field+'URL'];
            }
            else if(v.field=='bankName'){
              v.fill = dt.data['bankCode']
            }
            else{
              // let n = v.field;
              // if(v.field=='bankName') v.field='bankCode'
              v.value=dt.data[v.field]
            }
          })
        })
        return;
      }
      if(!id) return;
      Ajax('/api/saler/customer/bank/query',{id},(data)=>{
        let info=data.data;
        if(!data.result) return;
        if(JSON.stringify(info)!='{}'){
          if(info && info.bankNum){
            this.form.forEach(v=>{


              if(canEdit==1){
                v.readonly=false;
                if(info[v.field]){
                    v.readonly = true;
                }

              }else{
                // console.log(info[v.field].value)
                v.readonly=true;

                // if(this.type=='postApply') v.readonly=false;
              }

            })
          }
          this.form.forEach(v=>{
            if(v.selected){
              v.selected.options[0].items.forEach((v2,i2)=>{
                if(v2.id==info.bankName){
                  v.fill=v2.label;
                  v.selected.selected=[i2];
                }
              })
            }
            if(v.field!='id'){
              v.value = info[v.field];
            }
            if(v.field=='bankCredit'||v.field=='bankCardFront' || v.field=='identityCard'){
              v.fill=info[v.field+'URL'];
            }
            // if(v.field=='identityCard'){
            //   v.fill=info[v.field];
            // }
            if(this.role=='client'){
              v.placeholder='';
            }
            if(v.field == 'reservedTel'){

              if(info[v.field]) {
                v.value = '********'+info[v.field].substring(7,11);
                v.phone = info[v.field];
              }

            }

          })
        }else{
          this.form.forEach(v=>{
            if(this.role=='client'){
              v.placeholder='';
            }
          })
        }
      })
    },
    methods:{
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
      },
      getMsgFromChild(field,val){
        this.form.forEach(v=>{
          if(v.field==field){
            v.value=val;
          }
        })
      },
      handleDelete(field){
        this.form.forEach(v=>{
          if(v.field==field){
            v.fill='';
            v.value='';
          }
        })
      },
      handleUpload(data,field,e){
        this.form.forEach(v=>{
          if(v.field==field){
            v.fill=data.url;
            v.value=data.id;
          }
        })
      },
      handleSubmit(){

        let data={},canEdit=this.$route.query.canEdit;
        if(canEdit==1){

          for(let v of this.form){
            if((v.value==''||v.value==null)&&v.require){
              this.$store.dispatch('changeTip',{isTip:true,txt:v.placeholder,time});
              return;
            }else{
              if(v.field=='bankNum'&&!v.value.match(/^\d+$/)){
                this.$store.dispatch('changeTip',{isTip:true,txt:'请输入正确银行卡号！',time});
                return;
              }
              if(v.field=='reservedTel'){
                if(v.phone) v.value = v.phone;

                if(!v.value.match(/^\d{11}$/)) {
                    this.$store.dispatch('changeTip',{isTip:true,txt:v.label+'格式错误',time});
                    return;
                }


              }
            }
            data[v.field]= v.value;
          }
          if(this.type=='postApply') return data;
          if(this.$route.query.id){
            data.id=this.$route.query.id;
          }
          this.$store.dispatch('changeTip',{txt: '正在玩命处理中',isTip:true,loading:true});
          Ajax('/api/saler/customer/bank/edit',data,(data)=>{
            if(data.result){
              this.$store.dispatch('changeTip',{txt: data.message,isTip:true,loading:false,time:time,cb:()=>{
                  window.history.go(-1);
              }})
            }else{
              this.$store.dispatch('changeTip',{txt: data.message,isTip:true,loading:false,time:time})
            }
          })
        }else{
          window.history.go(-1);
        }
      }
    }
  }
</script>
