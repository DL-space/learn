<style lang="css" scoped>
.cash-detail{
  padding: .2rem;
}
.detail-cash{
  text-align: center;
  font-size: .4rem;
  color:#444;
}
.detail-status{
  text-align: center;
  color:#999;
}
.list-item{
  color:#444;
  padding: .2rem 0;
}
.list-item::before{
  border-bottom: 1px solid #e0dede;
}
.item-right{
  position: absolute;
  right: 0;
  color:#888;
}
.detail-list{
  margin-top: .5rem;
}
.list-item-jump .item-right{
  /*right: .3rem;*/
  color:#444;
}
.cash-state{
  text-align: center;

}
.cash-state img{
  width: .6rem;
}
.cash-state p{
  margin-top: .1rem;
  font-size: .18rem;
  color:#333;
  font-weight: bold
}
/*.list-item-jump{
  background: url(../../../static/images/client/icon-right-jump.png) right center / .24rem  no-repeat;
}*/
</style>

<template lang="html">
   <div class="cash-detail">

      <div class="cash-state">
        <img src="../../../static/images/client/icon_submit_await.png" alt="">
        <p>提现申请已提交</p>
      </div>

      <ul class="detail-list">
        <li class="list-item br1_bottom" v-for="v in dt">
          <span>{{v.n}}</span>
          <span class="item-right">{{v.v}}</span>
        </li>

      </ul>
   </div>
</template>

<script>
import { Axios } from '@/assets/Util'
// import { mapGetters,mapActions } from 'vuex'
import { Toast } from 'mint-ui'

export default {
   data(){
     return {
       dt:[]
     }
   },
   created(){
      const { arriveAmount,withdrawAmount,feeAmount } = this.$route.query

      this.dt=[
        {v:'24小时以内',n:'预计到账时间'},
        {v:arriveAmount,n:'提现到账金额'},
        {v:withdrawAmount,n:'提现金额'},
        {v:feeAmount,n:'手续费'},
      ];
   },
}
</script>
