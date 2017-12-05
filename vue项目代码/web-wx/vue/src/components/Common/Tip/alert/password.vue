<template lang="html">
  <div class="pass">
     <div class="pass-list">
       <div class="pass-btns">
         <button v-for="(v,i) in 6" :class="['list-item','br1',i==5?'list-item-right':'']" :style="borderStyles"><div class="pass-dian" v-if="value[i]"></div></button>
       </div>
       <input type="tel" class="pass-input" v-model.trim="value" maxlength="6" ref="pass">
     </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      value:'',

    }
  },
  props:{
    borderStyles:{
      type:Object
    },
    autoFocus:{
      type:Boolean,
      default:false
    }
  },
  watch:{
    value(n,o){
      if(isNaN(n)) return this.value=o;

      if(n.length==6) this.$emit('getPassWord',n)
    }
  },
  mounted(){
     if(this.autoFocus) this.$refs.pass.focus();
  }
}
</script>

<style lang="css" scoped>
.pass{
  /*margin-top: 1rem;*/
}
.list-item{
  width: .4rem;
  height: .4rem;
  /*border: 1px solid #333;*/
  display: inline-block;
  background: none;
  vertical-align: top;
  border: none;
}
/*.list-item:nth-child(even) .list-item::after{
  border-left:0;
  border-right:0;
}
.list-item:last-child .list-item::after{
  border-right: 1px solid #333;
}*/
.pass-list{
  font-size: 0;
  text-align: center;
  position: relative;
}
.pass-dian{
  width: .1rem;
  height: .1rem;
  background: #333;
  border-radius: 100%;
  display: inline-block;
}
.pass-input{
  width:3rem;
  height: .5rem;
  position: absolute;
  top:0;
  background: #f90;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  text-indent: -999em;
  margin-left: -50%;
  width: 200%;
}
.list-item::before{
  border: 1px solid #aba9a9;
  border-right: 0;

}
.list-item-right::before{
  border-right: 1px solid #aba9a9;;
}
</style>
