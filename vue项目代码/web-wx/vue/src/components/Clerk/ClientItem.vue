<template>
  <div class="client">
    <div class="title style2 br1_bottom" :style="{padding:index || index==0?'':'0 3%'}">
      <div class="left">
        <button class="item-left" v-if="index || index==0" >
          {{index+1}}
        </button>
        {{data.orgName}}
      </div>
      <a class="right" :href="'tel:'+data.userTel" v-show="data.userTel">
        {{data.userName}}
      </a>
    </div>
    <div class="client-info" @click="handleClick" :style="detail?'background-image:none':''">
      <div class="import">客户编码：{{data.customerCode?data.customerCode:'未分配'}}</div>
      <div class="address"><span class="item-left-tit">地址：</span>{{data.customerCode?data.areaInfo:data.address}}</div>
      <div class="station" v-if="$route.name=='detailClient' && data.stationName"><span class="item-left-tit">服务站：</span>{{data.stationName}}</div>
      <div class="station" v-if="$route.name=='detailClient' && data.stageName"><span class="item-left-tit">驿站：</span>{{data.stageName}}</div>
      <div v-if="data.salerName">业务员：{{this.state.data.salerName}}</div>
      <div><span class="item-left-tit">创建时间：</span>{{data.createTime}}</div>
    </div>
  </div>
</template>
<script>
  export default{
    props:['data','detail','index','total'],
    methods:{
      handleClick(){
        this.$emit('handleClick');
      }
    }
  }
</script>
<style scoped>
.item-left{
  color:#fff;
  background: #a5b0c6;
  padding: .02rem .08rem;
  /*vertical-align: -.2rem;*/
  font-size: .14rem;
  border-top-right-radius:.2rem;
  border-bottom-right-radius:.2rem;
  border: none;
  margin-right:.08rem;
}
.clerk .title.style2{
  padding: 0 3% 0 0;
  z-index:1;
}
.item-left-tit{
  color:#666;
  vertical-align: top;
  display: inline-block;
}
.item-add{
  display: inline-block;
  width: 2.6rem;
}
</style>
