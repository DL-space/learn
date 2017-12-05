<template>
  <div class="download">
    <div class="downloadTop">
      <div class="fl downImg">
        <img src="../../../static/images/down/icon.png" />
      </div>
      <div class="fl downTxt">
        <h3>车服司机助手</h3>
        <h4>您的贴身物流管家</h4>
      </div>
    </div>
    <div id="slider" class="downloadCenter">
      <ul>
        <li>
          <img src="../../../static/images/down/1.png" alt="" />
        </li>
        <li>
          <img src="../../../static/images/down/2.png" alt="" />
        </li>
        <li>
          <img src="../../../static/images/down/3.png" alt="" />
        </li>
        <li>
          <img src="../../../static/images/down/4.png" alt="" />
        </li>
      </ul>
    </div>
    <div  class="downloadDown">
      <a ref="down" href="javascript:;">下载</a>
    </div>
  </div>
</template>
<script>
  import {AjaxApi} from '@/assets/Util';
  import TouchSlider from '@/assets/touchslider'
  export default{
    mounted(){
      new TouchSlider('slider',{
        duration:1000,
        direction:0,
        interval:5000,
        before: function(index) {
          //var es = document.getElementById('slider').getElementsByTagName('li');
        }
      });
      AjaxApi('/version/query',{},(data)=>{
        location.href=data.data.verurl;
        this.$refs.down.href=data.data.verurl;
      },function(err){},'get');
    }
  }
</script>
