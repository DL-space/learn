<template>
  <ul class="tab" :tab="obj">
     <li v-for="(item,index) of data" :style="'width:'+100/data.length+'%'" :key="index">
         <div :class="item.focus===1?'cont focus':'cont'" @click="handleTab(item)">
             {{item.name}}
         </div>
     </li>
  </ul>
</template>
<script>
  export default {
    props:['data'],
    data(){
      return {
        obj:null
      }
    },
    mounted(){

    },
    updated(){

    },
    methods: {
      handleTab(obj){
        this.obj=obj;
        this.$emit('handleTab',obj)
      }
    }
  }
</script>
