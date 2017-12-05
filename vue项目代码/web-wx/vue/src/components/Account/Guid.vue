<template>
  <div class="guid">
    <div class="guid_wrap">
      <div class="bar">
        <div class="inner"></div>
      </div>
      <div class="content">
        <img src='../../../static/images/login/1.png' width="100%" />
        <p class="txt-tip red">
          *本应用仅供参与车服云物流线下业务的客户使用
        </p>
        <p class="txt-description">
          车服云物流借助技术手段，采集了车辆运输过程中对位置、线路等信息，对物流流转信息进行全程跟踪。实现了人、车、货仓的物流信息透明。
        </p>
        <p class="txt-confirm">
          <input type="checkbox" :checked="true" @click="handleConfirm" />&nbsp;确定为车服云线下客户
        </p>
        <button-client :data="btnObj" @listenButtonEvent="handleClick"></button-client>
      </div>
    </div>
  </div>
</template>

<script>
  import ButtonClient from '@/components/Common/Form/ButtonClient'
  export default {
    name: 'guid',
    components: {ButtonClient},
    data () {
      return {
        btnObj: {
          disabled:false,
          txt: '知道了',
          style: {
            position: 'absolute',
            width: '40%',
            left: '30%',
            bottom: '-.2rem'
          }
        }
      }
    },
    methods: {
      handleConfirm(e){
        if(e.target.checked){
          this.btnObj.disabled=false;
          this.btnObj.style.background='#4392ff';
        }else{
          this.btnObj.style.background='#ddd';
          this.btnObj.disabled=true;
        }
      },
      handleClick () {
        const type = this.$route.params.type,path=this.$route.query.path
        this.$router.replace({name: 'login', params: {type},query:{path}})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
