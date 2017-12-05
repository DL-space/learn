<style lang="css" scoped>
 .input-box{
   width: 100%;
   color:#333;
   /*padding-right: .2rem;*/
   margin-top: .1rem;
   height:.5rem;
 }
 .input-box::before{
   border-bottom: 1px solid #e0dede;
 }
 .input-text::-webkit-input-placeholder{
   color:#c6c6c6;
 }
 .input-text{
   width: 100%;
   height: calc(100% - .01rem);
   font-size: .16rem;
   display: inline-block;
 }
 .input-text-del{
   width:.16rem;
   height: .16rem;
   display: inline-block;

   vertical-align: middle;
   background: url(../../../../static/images/client/icon-del.png) 50% 50%  / cover no-repeat;
 }
 .input-right{
   transform: translateY(-50%);
   top:50%;
   position: absolute;
   right: 0;
 }
 .readonly-text{
   position: absolute;
   top:50%;
   transform: translateY(-50%);
   font-size: .16rem;
   color:#999;
 }
</style>

<template>
  <div class="input-box br1_bottom" :style="boxStyles">
    <input v-if="!readonly" class="input-text" :type="type" :placeholder="placeholder" :value="value" @input="updateValue($event.target.value)" :maxLength="max" ref="input"  @focus="getDelBtn(1)"  @blur="getDelBtn(0)">
    <span v-else class="readonly-text">{{value}}</span>
    <div class="input-right">
      <span @click="$refs.input.focus();$refs.input.value='';$emit('input', '');" class="input-text-del" v-show="(delBtn && value && !readonly && isBlur) || (isBlur && value)"></span>
      <slot name="slot-right" ref="slotRight"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    placeholder:{
      type:[String,Number]
    },
    value:{},
    delBtn:{
      type:Boolean,
      default:true
    },
    type:{
      type:String,
      default:'text'
    },
    number:{
      type:Boolean,
      default:false
    },
    boxStyle:{
      type:Object,
      default(){
        return {

        }
      }
    },
    readonly:{
      type:Boolean,
      default:false
    },
    max:{
      type:Number
    }
  },
  data(){
    return {
      paddingRight:0,
      isBlur:false,
      isDelShow:false
    }
  },
  computed:{
    boxStyles(){
      return {...this.boxStyle,'padding-right':this.delBtn?0.2+this.paddingRight+'rem':this.paddingRight+'rem'}
    }
  },
  mounted(){
    if(this.$slots['slot-right']) {
      let w = this.$slots['slot-right'][0].elm.offsetWidth/100;
      this.paddingRight = w;
    }
  },
  methods:{
    updateValue(v){
      // if(!v) return;
      let formattedValue = v;
      if(this.number){
        if(!/^\d+$/.test(v) && v) formattedValue=this.value;
      }
      if (formattedValue !== v) {
        this.$refs.input.value = formattedValue
      }

      this.$emit('input', formattedValue);
    },
    getDelBtn(v){
      setTimeout(()=>this.isBlur=v,0)
    }
  }
}
</script>
