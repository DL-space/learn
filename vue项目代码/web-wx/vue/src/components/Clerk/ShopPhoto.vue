<template>
  <div class="shop-photo">
    <ul class="photo-list">
      <li class="photo-item" v-for="(v,i) in photos">

         <p class="item-name"><span class="red">*</span>{{v.name}}</p>
         <div class="item-upload">
           <uploadPhoto @getPhotoMsg="data=>getPhotoMsg(data,i)" :readonly="!canEdit" :url="v.url" @handleDelete="handleDelete(i)"></uploadPhoto>
         </div>

      </li>
    </ul>

    <div class="shop-save-box">
       <button class="btn" @click="save">{{!canEdit?'关闭':'保存'}}</button>
    </div>
  </div>
</template>
<script>
  import {uploadPhoto} from '@/components/Common/FileUpload'
  import { Ajax } from '@/assets/Util'
  import { Toast } from 'mint-ui'

  import { mapState,mapActions,mapMutations,mapGetters } from 'vuex'

  export default {
    components:{uploadPhoto},
    data(){
      return {
         photos:[
           {name:'门头',url:'',id:'',isEdit:0,ne:'mt'},
           {name:'工位',url:'',id:'',isEdit:0,ne:'gw'},
           {name:'接待区',url:'',id:'',isEdit:0,ne:'jdq'},
           {name:'库房',url:'',id:'',isEdit:0,ne:'kf'},
           {name:'整体/货架',url:'',id:'',isEdit:0,ne:'hj'},
         ],
         orgId:'',
         locked:true
      }
    },
    computed:{
      ...mapGetters([
        'loadFinish',
        'openid',
        'searchClient'
      ]),
      canEdit(){
        return this.$route.query.canEdit==1
      }
    },
    created(){
      this.loadData();
    },
    methods:{
      ...mapActions([
        'changeTip',
      ]),
      loadData(){
        this.orgId=this.$route.query.id;
        if(!this.orgId) return Toast('缺少客户编号！');

        this.changeTip({isTip:true,txt:'加载中...',loading:true,time:0});

        Ajax('/api/saler/customer/store/query',{orgId:this.orgId},res=>{

           let list = res.data || [];
           if(res.result){
             list.forEach((item,i)=>{
                let a=this.photos[Number(item.type)-1];
                a.id=item.id;
                a.url=item.url;
             })
           }
           this.changeTip({isTip:false,txt:'加载中...',loading:true,time:0});
        })
      },
      save(){

         if(!this.canEdit) return this.$router.back();

         if(!this.locked) return;

         let ps=this.photos,data={orgId:Number(this.orgId)};
         for(let i=0,len=ps.length;i<len;i++){
           let {id,url,isEdit,ne}=ps[i];
           if(!id || !url) return Toast('照片上传不完整');
           data[ne+'Id']=id;
           data[ne+'Photo']=url;
         }

         this.locked=false;

        //  console.log(data)
         this.changeTip({isTip:true,txt:'加载中...',loading:true,time:0});

         Ajax('/api/saler/customer/modifyStorePhotos',data,res=>{
            this.changeTip({isTip:false,txt:'',loading:true,time:0});
            // console.log(res)
            if(!res.result) return Toast('保存失败！');
            Toast('保存成功！');
            this.locked=true;
            setTimeout(()=>this.$router.back(),1500)
         },()=>{
           this.locked=true;
         })
      },
      getPhotoMsg(data,i){
        this.photos[i].id=data.id;
        this.photos[i].url=data.url;
        this.photos[i].isEdit=1;
      },
      handleDelete(i){
        this.photos[i].id='';
        this.photos[i].url='';
      }
    }
  }
</script>
<style scoped>
.shop-photo{
  padding: 0 .16rem .8rem .16rem;
  width: 100%;
}

.photo-item{
  display: inline-block;
  margin-left: .3rem;
}
.photo-list{
  font-size: 0;
  overflow: hidden;
  margin-left: -.3rem;
}
.item-upload{
  width: 1.56rem;
  height: 1.24rem;
}
.item-name{
  margin:.12rem 0;
  color:#666;
  font-size: .16rem;
}
.shop-save-box{
  position: fixed;
  bottom:.14rem;
  left:0;
  width: 100%;
  padding: 0 .16rem;
}

</style>
