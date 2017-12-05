<template>
  <div class="verify-code" @click="changeCode">
    <img :src="url+'?'+data" alt=""/>
  </div>
</template>
<script>
  import Config from '../../../../conf.js'
  export default{
    props:['data'],
    data(){
      return {
        url:Config.api_url+'/ImageServlet',
      }
    },
    methods:{
      changeCode(){
        this.$emit('changeCode')
      }
    }
  }
</script>
