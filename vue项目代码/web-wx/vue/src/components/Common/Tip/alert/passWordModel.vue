<style lang="css" scoped>

.pass-tit{
  text-align: center;
  font-size: .2rem;
  margin-bottom: .14rem;
}
.pass-cash{
  color:#666;
  margin: .2rem 0 .1rem;
  text-align: left;
}
</style>

<template>

     <model-panel :closeFn="closeFn" :open="open">
        <h6 class="pass-tit">支付密码</h6>
        <p class="pass-cash">提现金额：{{cash}}</p>
        <pass-word @getPassWord="getPassWord" ref="passWord"/>
     </model-panel>


</template>

<script>
import modelPanel from './modelPanel';
import passWord from './password';
import {Toast} from 'mint-ui'

export default {
  name:'pass-word-model',
  data(){
    return {
      isHelp:false,
    }
  },
  props:{
    cash:{
      type:[String,Number],
      default:''
    },
    open:{
      type:Boolean,
      default:false
    },
    closeFn:{
      type:Function,
      default(){
        return ()=>{

        }
      }
    }
  },
  computed:{
  },
  methods:{
    getPassWord(v){
      console.log(v);
      if(v == 549008){
         this.closeFn();
      }
      else{
         Toast('密码错误，提现失败');
         this.$refs.passWord.value='';
      }
    }
  },
  components:{modelPanel,passWord}
}
</script>
