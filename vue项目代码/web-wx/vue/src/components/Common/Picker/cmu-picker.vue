<template lang="html">
  <Popup
    v-model="show"

    position="bottom">
    <div :style="{background:'#fff',height:panelHeight,width:'3.75rem'}">
       <Picker :slots="data" @change="getChange" :showToolbar="true" :valueKey="valueKey" ref="ps">
          <div class="picker-bar">
          <span class="bar-cancel" @click="show=false">关闭</span>
          <!-- <span class="bar-value bar-submit">当前已选：{{values[valueKey]}}</span> -->
          <span class="bar-submit" @click="submit">确定</span>
          </div>
       </Picker>

    </div>
  </Popup>
</template>

<script>
import {Popup,Picker } from 'mint-ui';
export default {
   components:{Popup,Picker},
   data(){
     return {
        show:false,
        picker:null,
        values:{},
        lock:true,
     }
   },
   props:{
     data:{
       type:Array
     },
     isShow:{
       type:Boolean,
       default:false
     },
     valueKey:{
       type:String
     },
     panelHeight:{
       type:String,
       default:'2.4rem'
     },
     showChange:{
       type:Boolean,
       default:false
     }
   },
   created(){
     this.$emit('ps',this.$refs.ps)
   },
   methods:{
     getChange(p,v){
       this.values=v;
       this.picker=p;
       if(!this.show || this.showChange) this.$emit('change',this.values,p);
     },
     submit(){
       this.show=false;
       if(this.showChange) return this.$emit('confirm',this.values,this.picker);
       this.$emit('change',this.values,this.picker);
     }
   },
   watch:{
     show(n){
       this.$emit('update:isShow',n)
     },
     isShow(n){
       this.show=n;
     }
   }
}
</script>

<style lang="css" scoped>
.picker-bar{
  font-size: .16rem;
  color:#4392ff;
  line-height: .4rem;
  height: 100%;
  background: #f5f5f5;
  padding: 0 .2rem;
  position: relative;
}
.bar-submit{
  position: absolute;
  transform: translateY(-50%);
  top:50%;
  right: .2rem;
}
.bar-value{
  color:#666;
  margin-left: .2rem;
  font-size: .14rem;
}
</style>
