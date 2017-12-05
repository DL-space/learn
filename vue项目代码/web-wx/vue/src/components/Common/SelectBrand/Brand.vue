<template>
  <div class="brand">
      <div class="select" v-if="filterCar&&filterCar.length>0">
        <div class="label">
          已选择：
        </div>
        <div class="options">
          <div class="item" v-for="(v,i) of filterCar" :key="i">
            {{v.name}}
            <div class="cancel" @click="handleCancelCar(v)"></div>
          </div>
        </div>
      </div>
      <div class="search_brand">
        <div class="cancel" @click="clearInput"></div>
        <input type="text" @change="handleInput($event)" :readonly="$route.query.canEdit==0" ref="input" placeholder="输入车型" />
        <div class="car_list">
          <div class="item" v-for="(v,i) of car" :key="i">
            <input type="checkbox" :disabled="v.disabled?v.disabled:false" :checked="v.checked" @click="handleChecked(v,$event)"  />{{v.name}}
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  import {Ajax} from '@/assets/Util'
  export default{
    props:['car','filterCar'],
    data(){
      return {

      }
    },
    methods:{
      clearInput(){
        this.$refs.input.value='';
        this.$emit('handleInput','');
      },
      handleInput(e){
        let v=e.target.value;
        this.$emit('handleInput',v);

      },
      handleCancelCar(o,flag='cancel'){
        this.$emit('handleChecked',o,flag);
      },
      handleChecked(o,e){
        this.$emit('handleChecked',o,e);
      }
    }
  }
</script>
<style>
  .brand{margin-top:.5rem}
  .brand  .select{
    padding:.1rem;
    line-height: .4rem;
    width: 100%;
    overflow: hidden;
  }
  .brand  .select .label{
    float: left;
    min-height:.4rem;
    line-height: .4rem;
    width:24%;
  }
  .brand  .select .options{
    float: left;
    width:76%;
  }
  .brand  .select .options .item{
    width:30%;
    position: relative;
    border:1px solid #262626;
    border-radius:2px;
    float:left;
    text-align: center;
    margin:0 0 .1rem .1rem;
  }
  .brand  .select .options .item:nth-child(3n+1){
    margin-left:0
  }
  .brand  .select .options .item .cancel{
    position: absolute;
    width:.2rem;
    height: .2rem;
    background-image: url('../../../../static/images/order/icon-cancle.png');
    background-size:100%;
    right:-.1rem;
    top:-.1rem;
  }
  .brand .search_brand{
    overflow: hidden;
    position: relative;
  }
  .brand .search_brand input[type='text']{
    width: 100%;
    border-bottom:.01rem solid #c2c2c2;
    padding-left:.1rem;
    height: .4rem;
  }
  .brand .search_brand .cancel{
    position: absolute;
    width:.2rem;
    height: .2rem;
    background-image: url('../../../../static/images/order/icon-cancle.png');
    background-size:100%;
    right:.1rem;
    top:.15rem;
  }
  .brand .search_brand .car_list{
    height: 2rem;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .brand .search_brand .car_list .item{
    height: .4rem;
    line-height: .4rem;
  }
</style>
