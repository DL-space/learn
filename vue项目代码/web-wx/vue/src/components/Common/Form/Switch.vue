<template>
  <div>
    <input :checked="checked" @change="handleChange($event)" class="weui-switch" type="checkbox"/>
    <span class="weui-icon-checked"></span>
  </div>
</template>
<script>
  export default{
    props:['checked'],
    methods:{
      handleChange(e){
        this.$emit('handleChange',e)
      }
    }
  }
</script>
