<template>
  <div class="search-client-item" @click="handleClick">
    <button class="item-left">
      {{index+1}}
    </button>
    <div class="item-mid">
      <p><span class="mid-tit">客户名称：</span>{{data.orgName}}</p>
      <p><span class="mid-tit">创建时间：</span>{{data.createTime}}</p>
    </div>
    <div class="item-right">

    </div>
  </div>
</template>
<script>
  export default{
    props:{
      data:{
        type:Object
      },
      index:{
        type:[String,Number]
      }
    },
    methods:{
      handleClick(){
        this.$emit('handleClick');
      }
    }
  }
</script>
<style scoped>
  .item-left,.item-mid,.item-right{
    display: inline-block;
    vertical-align: middle;
  }
  .search-client-item{
    font-size: 0;
    padding: .16rem .16rem .16rem 0;
    margin-bottom: .1rem;
    background: #fff;
    font-size: .16rem;
    position: relative;
  }
  .item-left{
    color:#fff;
    background: #a5b0c6;
    padding: .02rem .08rem;
    vertical-align: top;
    font-size: .14rem;
    border-top-right-radius:.2rem;
    border-bottom-right-radius:.2rem;
    border: none;
    margin-right:.08rem;
  }
  .mid-tit{
    color:#6c6c6c;
  }
  .item-mid{
    width: 2.9rem;
  }
  .item-right{
    width: .09rem;
    height: .165rem;
    background: url(../../../static/images/clerk/icon/icon-enter.png) 50% 50% no-repeat;
    background-size: contain;
    position: absolute;
    right: .16rem;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    top:50%;
  }
</style>
