<template>
  <button v-if="loadFinish?loadFinish.isShowButton:true" class="btn" :disabled="disabled?disabled:(data.disabled?data.disabled : false)" @click="childEventToParent" :type="data.type ? data.type : 'button'" :style="data.style ? data.style : ''" >
    {{loadFinish && loadFinish.txt?loadFinish.txt:data.txt}}
  </button>
</template>
<script>
  export default {
    props: ['data','disabled','loadFinish'],
    data () {
      return {

      }
    },
    methods: {
      childEventToParent () {
        this.$emit('listenButtonEvent')
      }
    }
  }

</script>
