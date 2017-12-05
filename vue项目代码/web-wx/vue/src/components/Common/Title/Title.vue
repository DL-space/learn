<template>
  <div :class="'br1_bottom title '+data.style">
    <div class="left">
      {{data.name1}}
    </div>
    <a v-if="data.style=='style2'" class="right" :href="'tel:'+data.name3">
      {{data.name2}}
    </a>
    <div v-if="data.style=='style3'" class="right">
      状态：
      <span v-if="isForbidden" class='red'>禁用</span>
      <span v-else class="green">启用</span>
    </div>
    <div v-if="data.style=='style4'" class="right">
      <switch-forbidden :checked="!isForbidden" @handleChange="handleChange"></switch-forbidden>
    </div>
    <div v-if="data.style=='style5'" class="right">
      {{data.txt}}
    </div>
  </div>
</template>
<script>
  import SwitchForbidden from '@/components/Common/Form/Switch'
  export default{
    data(){
      return {

      }
    },
    components:{SwitchForbidden},
    props:['data','isForbidden'],
    methods:{
      handleChange(e){
        this.$emit('handleChange',e)
      }
    }
  }
</script>
