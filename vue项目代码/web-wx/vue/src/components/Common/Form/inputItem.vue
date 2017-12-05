<template>
   <div :class="['inp-item','in-bk-center',!noBorder?'br1_bottom':'']" @click="$emit('handleClick')" :style="itemStyle">
      <slot name="left"></slot>
      <span class="inp-left center-box" v-if="leftTitle">
        <span class="required" v-if="required && $route.query.canEdit=='1'">*</span>
        {{leftTitle}}{{readonly?'':'：'}}
      </span>
      <slot v-if="$slots.default"></slot>
      <div class="inp-right center-box" v-else>
        <input class="inp-value center-box" ref="input" :value="value" :readonly="readonly" :style="inputStyle"
@input="updateValue($event.target.value)" :placeholder="placeholder" @click="getBlur(readonly)">
      </div>
      <img src="../../../../static/images/clerk/icon/icon-selected.png" class="inp-right-down" v-if="rightIcon"/>
      <slot name="right"></slot>
      <!-- <span class="inp-right-text" v-if="rightText">{{rightText}}</span> -->
   </div>
</template>

<script>
export default {
  name:'inputItem',
  props:{
    leftTitle:{
      type:String,
    },
    required:{
      type:Boolean,
      default:true
    },
    rightIcon:{
      type:Boolean,
      default:false
    },
    rightText:{
      type:String,
    },
    value:{},
    number:{
      type:Boolean,
      default:false
    },
    readonly:false,
    cls:{
      type:[String,Object]
    },
    inputStyle:{
      type:Object
    },
    itemStyle:{
      type:Object
    },
    placeholder:{
      type:String
    },
    noBorder:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {

    }
  },
  methods:{
    updateValue(v){
      var formattedValue = v;
      if(this.number){
        if(isNaN(v)) formattedValue=this.value;

      }
      if (formattedValue !== v) {
        this.$refs.input.value = formattedValue
      }
      this.$emit('input', formattedValue);
    },
    getBlur(readonly,e){
      if(!readonly) return;
      this.$refs.input.blur();
    }
  }
}
</script>

<style lang="css" scoped>
.required{
  color:red;
}
.inp-right{
  height: 100%;
  width: 66%;
  font-size:.16rem;
  /*padding-left: .4rem;*/
}
.inp-value{
  height: 100%;
  width: 100%;
  font-size: .16rem;
  color:#333;

}
.inp-item{
  position: relative;
  /*line-height: .45rem;*/
  font-size: 0;
  height: .45rem;
}
.inp-item::before{
  border-bottom: 1px solid #e4e4e4;
}
.inp-left{
  /*position: absolute;*/
  /*text-align: right;*/
  width: 34%;
  line-height: 1;
  display: inline-block;
  font-size: .16rem;
  color:#666;
  white-space:nowrap;

}
.inp-right-down{
  position: absolute;
  transform: translateY(-50%);
  top:50%;
  width: .16rem;
  right: 0;
}

</style>
