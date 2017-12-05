<template>
  <div class="service-area">
    <gd-map @getMap="getMap" :isMarkList="true" mListUrl="/api/saler/customer/service/scope" :mListArgs="{openId:openid}"/>
  </div>
</template>

<script>
import gdMap from '@/components/Common/map'
import { mapGetters } from 'vuex';
export default {
  data(){
    return {

    }
  },
  computed:{
    ...mapGetters([
      'openid'
    ])
  },
  methods:{
    getMap(map){
      console.log(map)
    }
  },
  components:{
    gdMap
  }
}
</script>

<style lang="css" scoped>

.service-area{
  width: 100%;
  height: 100vh;
}
</style>
