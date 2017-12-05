<template lang="html">
   <button type="button" name="button" @click="delCookie">删除cookie</button>
</template>

<script>
import { Cookie } from '@/assets/Util'
export default {
  methods:{
    delCookie(){
      Cookie.delCookie('openid');
      alert('删除成功！')
    }
  }
}
</script>

<style lang="css">
</style>
