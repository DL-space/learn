<template>
  <div class="search" ref="search">
    <div  class="holder" @click="handleFocus($refs.search)">
       <img src="../../../../static/images/order/icon-search.png" alt=""/><span class="search-text">搜索</span>
    </div>
    <div class="cancle" @click="handleCancel($refs.search)">
        <img src="../../../../static/images/order/icon-cancle.png" />
    </div>
    <div class="search_btn" @click="handleSearch($refs.search)">
        搜索
    </div>
    <input type="text" :value="searchTxt" :placeholder="placeholder" ref="input" @change="handleInput($event)" @focus="handleFocus($refs.search)"  />
    <div class="search-record">
        <div class="title">
            搜索记录
        </div>
        <div class="list" @click="handleSearchRecord(item,$refs.search)"  v-for="(item,index) of record" :key="index">
           {{item}}
        </div>
        <div class="clear" @click="handleClearSearchRecord">
            清空搜索记录
        </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:['placeholder','record','searchTxt'],
    data () {
      return {

      }
    },
    methods: {
      handleInput(tar){
        this.$emit('handleInput',tar)
      },
      handleFocus(tar){
        this.$emit('handleFocus',tar)
      },
      handleCancel(tar){
        this.$emit('handleCancel',tar)
      },
      handleSearch(tar){
        this.$emit('handleSearch',tar)
      },
      handleSearchRecord(txt,tar){
        this.$emit('handleSearchRecord',txt,tar)
      },
      handleClearSearchRecord(){
        this.$emit('handleClearSearchRecord');
      }
    }
  }
</script>
