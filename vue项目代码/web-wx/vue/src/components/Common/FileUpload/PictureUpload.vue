<template>
  <div class="upload-picture" style="">
    <div v-if="show" class="weui-gallery" style="display:block">
      <div class="weui-gallery__img" :style="'background-image:url('+data.fill+')'"></div>
      <div class="weui-gallery__opr">
        <a v-if="!data.readonly" class="weui-gallery__del">
          <i class="weui-icon-delete weui-icon_gallery-delete" @click="handleDelete(data.field)"></i>
          &#12288;&#12288;&#12288;&#12288;
          <i class="weui-icon-cancel weui-icon_gallery-cancel" style="color:#fff" @click="handleCancel(data.field)"></i>
        </a>
        <a v-else class="weui-gallery__del">
          <i class="weui-icon-cancel weui-icon_gallery-cancel" style="color:#fff" @click="handleCancel(data.field)"></i>
        </a>
      </div>
    </div>
    <div class="upload-wrap">
      <div v-if="data.fill" class="img-wrap" @click="handleShowPicture" :style="'background-image:url('+data.fill+')'"></div>
      <input type="file" class="upload" @change="handleUpload(data.field,$event)" />
      <div style="text-align:center;line-height:.2rem;color: #4986e0;padding-top:.2rem">
        <img src="../../../../static/images/clerk/icon/icon-upload.png" width="34%" />
        <p>{{data.placeholder}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    props:['data','show'],
    data(){
      return {
        showPic:this.show
      }
    },
    mounted(){
    },
    methods:{
      handleDelete(field){
        this.$emit('handleDelete',field)
      },
      handleCancel(){
        this.$emit('handleCancel')
      },
      handleUpload(field,e){
        this.$emit('handleUpload',field,e)
      },
      handleShowPicture(){
        this.$emit('handleShowPicture')
      }
    }
  }

</script>
<style>
  .upload-picture{
    width:1.4rem;
    padding:.2rem;
    margin-top:.3rem;
  }
  .upload-wrap{
    height:1rem;
    background-color: #f2f8ff;
    border:.01rem solid #b3cdfa;
    text-align:center;
    line-height:1rem;
    position: relative;
  }
  .upload-wrap .upload{
    width: 100% !important;
    height: 100% !important;
    position: absolute;
    left:0;
    top:0;
    z-index:1;
    opacity: 0;
  }
  .upload-wrap span{
    display: block;
    height: 100%;
  }
  .upload-wrap .img-wrap{
    position: absolute;
    z-index:2;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #000;
    background-position:center center;
    background-repeat:no-repeat;
    background-size: contain;
  }
  /*.upload-wrap .img-wrap img{*/
  /*height: 100%;*/
  /*}*/


</style>
