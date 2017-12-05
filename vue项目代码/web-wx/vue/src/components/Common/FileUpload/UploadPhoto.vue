<template>
  <div class="upload-photo" @click="handleClick">
     <button class="upload-box">
       <div class="upload-no" v-if="!url">
         <img class="upload-icon" src="../../../../static/images/clerk/icon/icon-upload.png" alt="">
         <p v-text="title" v-if="title" class="upload-title"></p>
         <input type="file" ref="uploadFile" class="upload-file" @click="getInput($event)" @change="getPhoto($event)">
       </div>
       <div class="upload-yes" v-else :style="{background:`url(${url}) 50% 50% / contain no-repeat`}">
       </div>

     </button>
     <!-- <img :src="img" alt="" v-show="false" ref="showImg"> -->
     <div class="upload-show" v-if="isShow">
        <img :src="url" alt="" class="show-img">
        <div class="show-btns">
           <span class="btns-del" @click.stop="handleDelete" v-if="$route.query.canEdit==1 && !readonly"></span>
           <span class="btns-close" @click.stop="modelClose"></span>
        </div>
     </div>
  </div>
</template>
<script>
  import { mapState,mapActions,mapMutations,mapGetters } from 'vuex'
  import { Ajax,AjaxApi } from '@/assets/Util'

  const time=1000;

  export default{
    props:{
      title:{
        type:String,
        default:''
      },
      readonly:{
        type:Boolean,
        default:false
      },
      url:{
        type:String,
      },
      count:{
        type:Number,
        default:1
      },
      deleteImgFn:{
        type:Function
      }
    },
    data(){
      return {
        isShow:false,
        img:null
      }
    },
    created(){
      // this.getCommon({url:'/wechat/camera/savepic',data:{mediaId:'d-Fx15KWsoBZgFDULMtrTVttyq5YxQAINADogH23hrjt1SCyTV8yFzk4bnBKrczJ'}}).then(dt=>{
      //    if(!dt.result) return Toast(dt.message);
      //    const {id,url} = dt.data;
      //    this.$emit('getPhotoMsg',{id,url})
      // })
    },
    methods:{
      ...mapActions([
        'changeTip',
        'getCommon'
      ]),
      handleClick(){
        if(!this.url || this.isShow) return;
        this.isShow=true;
      },
      getInput(e){
        const isWx = this.$isWx();

        if(isWx){
          e.preventDefault();

          if(!this.readonly){
            this.$wxConfig().then(wx=>{
              wx.chooseImage({
                 count: this.count, // 默认9
                 sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                 sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                 success: res => {
                     let localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    //  console.log(localId)

                     wx.uploadImage({
                       localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                       isShowProgressTips: 1, // 默认为1，显示进度提示
                       success: res=>{
                           let mediaId = res.serverId; // 返回图片的服务器端ID
                          //  console.log(mediaId);
                          //  alert('正在调试')

                           this.getCommon({url:'/wechat/camera/savepic',data:{mediaId}}).then(dt=>{
                              console.log('返回图片:',dt)
                              if(!dt.result) return Toast(dt.message);
                              const {id,url} = dt.data;
                              this.$emit('getPhotoMsg',{id,url})
                           })
                       }
                     });
                 }
              });
            })
          }
        }
        else{
          if(!this.readonly) return;
          e.preventDefault()
        }

      },
      modelClose(){
        this.isShow=false;
      },
      handleDelete(){
        this.isShow=false;

        this.$emit('handleDelete');

        this.deleteImgFn && this.deleteImgFn();
      },
      imgToBlob(image){
        let dom = this.$refs.uploadFile;
        let canvas = document.createElement("canvas"),
        ctx = canvas.getContext('2d');
        var w = image.naturalWidth,h = image.naturalHeight;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(image, 0, 0, w, h);
        var data = canvas.toDataURL("image/jpeg", 0.2);
        data = data.split(',')[1];
        data = window.atob(data);
        var ia = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
          ia[i] = data.charCodeAt(i);
        }
        var blob = new Blob([ia], {
          type: "image/jpeg"
        });
        AjaxApi('/attach/upload',{},(data)=>{
          if(data.result){
              let {id,url}=data.data;
              this.$emit('getPhotoMsg',{id,url})
              dom.value=null;
              this.changeTip({isTip:false,txt:'上传中...',loading:true});

          }
        },null,'',true,blob);
      },
      getPhoto(e){
        this.changeTip({isTip:true,txt:'上传中...',loading:true});

        let file=e.target.files[0];
        let dom = this.$refs.uploadFile;
        if(!/\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)){
          this.changeTip({isTip:true,txt:'图片类型必须是.gif,jpeg,jpg,png中的一种',time});
          return e.target.value=null;
        }

        let image = new Image();

        let reader = new FileReader();
        reader.readAsDataURL(file);


        reader.onload = ()=>{
          var url = reader.result;
          image.src = url;

          image.onload=()=>{

            this.imgToBlob(image);

          }
        }

      }
    }
  }
</script>
<style scoped>
.upload-photo{
  width: 100%;
  height: 100%;
}
.upload-box{
  background: #f2f8ff;
  width: 100%;
  height: 100%;
  border: 1px solid #b3cdfa;
  position: relative;
  overflow: hidden;
  vertical-align: top;
}
.upload-title{
  color:#4986e0;
  font-size: .14rem;
  padding: 0 .1rem;
  line-height: .16rem;
}
.upload-icon{
  width: .3rem;
}
.upload-file{
  width: 100%;
  height: 100%;
  position: absolute;
  left:0;
  top:0;
  opacity: 0;
}
.upload-yes{
  width: 100%;
  height: 100%;
}
.upload-show{
  background: #000;
  width: 100%;
  height: 100%;
  position: fixed;
  top:0;
  left:0;
  z-index: 2;
  overflow: auto;
}
.show-img{
  width: 100%;
  position: absolute;
  transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
  top:50%;
  left:50%;
}
.show-btns{
  position: fixed;
  bottom: 0;
  height: .5rem;
  width: 100%;
  text-align: center;
  line-height: .5rem;
  background: rgba(0,0,0,.2);
}
.btns-del,.btns-close{
  display: inline-block;
  width: .24rem;
  height: .24rem;
  vertical-align: middle;
  margin: 0 .4rem;
}
.btns-del{
  background: url(../../../../static/images/clerk/icon/icon-del.png) 50% 50% / contain no-repeat;
}
.btns-close{
  background: url(../../../../static/images/clerk/icon/icon-close.png) 50% 50% / contain no-repeat;
}
</style>
