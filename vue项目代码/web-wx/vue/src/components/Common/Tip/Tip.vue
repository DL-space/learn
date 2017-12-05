<template>
  <div class="dialog" style="">
    <i v-if="data.loading" class="weui-loading"></i>
    <span class="weui-loadmore__tips">{{data.txt}}</span>
  </div>
</template>

<script>
  export default {
    name: 'tip',
    props:['data'],
    data () {
      return {
      }
    }

  }
</script>
