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

/*.list-item-jump{
  background: url(../../../static/images/client/icon-right-jump.png) right center / .24rem  no-repeat;
}*/
</style>

<template lang="html">
   <div class="cash-detail">
      <div class="detail-cash">
         {{dt.transactionType==2?'+':'-'}}{{dt.amount}}
      </div>
      <div class="detail-status">
      {{dt.transactionStatesDesc?dt.transactionStatesDesc:'未知状态'}}
      </div>

      <ul class="detail-list">
        <li class="list-item br1">
          <span>交易类型</span>
          <span class="item-right">{{dt.transactionTypeDesc?dt.transactionTypeDesc:'未知类型'}}</span>
        </li>
         <li class="list-item br1">
           <span>交易时间</span>
           <span class="item-right">{{dt.transactionTime}}</span>
         </li>
         <li class="list-item br1">
           <span>交易单号</span>
           <span class="item-right">{{dt.transId}}</span>
         </li>
         <li class="list-item br1 list-item-jump">
           <span>运单号</span>
           <router-link tag="span" class="item-right" :to="{name:'orderDetail',query:{sn:dt.orderCode}}">
             {{dt.orderCode}}
           </router-link>

         </li>
      </ul>
   </div>
</template>

<script>
export default {
   data(){
     return {
       dt:{},
     }
   },
   created(){
     let dt = JSON.parse(localStorage.getItem('AccountRecord'));
     this.dt = dt;
   },
}
</script>
