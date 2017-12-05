<template>
  <div class="bar br1_bottom" @click="handleTabBar(data)">
    {{data.name}}
  </div>
</template>
<script>
  export default{
    props:['data'],
    methods:{
      handleTabBar(path){
        this.$emit('handleTabBar',path)
      }
    }
  }
</script>
