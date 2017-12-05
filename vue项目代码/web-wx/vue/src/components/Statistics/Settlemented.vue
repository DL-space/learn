<template>
	<div class="order_wrap">
		<div class="serTop">
			<div class="clientSearch">
				<div class="searchLeft">
					<input type="text" placeholder="输入单号/收货方名称" class="inputOrder" />
					<i class="clearSearch">X</i>
				</div>
				<input type="button" value="搜索" class="inputBtn" />
			</div>
			<div class="noSettleTip">
				<span class="infoLeft fontChange">2017-4-10至2017-9-1</span>
				<span class="infoRight">已结算</span>
			</div>
		</div>
		<div class="topInfos">
			<div class="amount_payment">
				<div class="amountTop">
					<p class="amountLeft">发货单数量：<i>2</i></p>
					<p class="amountRight">件数：<i>30</i></p>
				</div>
				<div class="amountTop">
					<p class="amountLeft">金额：<i>2</i></p>
					<p class="amountRight">实付金额：<i>2</i></p>
				</div>
				<p>付款方式：<b class="fontColBl">现金</b></p>
				<p>支付时间：<b class="fontColBl">2017-5-13 12:05:00</b></p>
			</div>
		</div>
		<div class="order">
			<div class="order_list" v-if="isList">
        <order-item v-if="orderList.length>0" v-for="(item,index) of orderList" :data="item" :key="index" :type="type" @jumpDetail="jumpDetail"></order-item>
        <div v-if="orderList.length==0" style="padding-top:.2rem;text-align:center;background:#fff;color:#666">暂无数据</div>
      </div>
		</div>
		
	</div>
	</div>
</template>
<script>
  import OrderItem from '@/components/Client/OrderItem'
  import { mapState } from 'vuex'
  export default {
    components: {OrderItem},
    data () {
      return {
        isNav:true,
        placeholder:'',
        searchTxt:'',
        type:this.$route.name=='receive'?1:2,
        menus:[
          {name:'全部',focus:1,status:0},
          {name:'已收货',status:11},
          {name:'配送中',status:30},
          {name:'已签收',status:32},
          {name:'拒签',status:33}
        ],
        record:[],
        isList:true,
        status:0
      }
    },
    created(){
      this.$store.dispatch('setOrderList',{type:this.type,openid:this.openid})
      this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true})
    },
    computed:mapState({
      openid:state=>state.openid,
      orderList:state=>state.orderList
    }),
    methods: {
      jumpDetail(sn){
        
      },
      handleTab(obj){
        this.menus.forEach(v=>{
          if(v.name==obj.name){
            v.focus=1
          }else{
            v.focus=0
          }
        });
        this.status=obj.status;
        this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
        this.$store.dispatch('setOrderList',obj.status!=0?{type:this.type,openid:this.openid,status:obj.status}:{type:this.type,openid:this.openid});
      },
      handleInput(e){
        console.log(e.target.value)
        this.searchTxt= e.target.value;
      },
      handleFocus(tar){
        const input=tar.getElementsByTagName('input')[0];
        if(input.value==''){
          const holder=tar.getElementsByClassName('holder')[0];
          const searchBtn=tar.getElementsByClassName('search_btn')[0];
          const searchRecord=tar.getElementsByClassName('search-record')[0];
          const cancle=tar.getElementsByClassName('cancle')[0];
          searchBtn.style.display = "block";
          searchRecord.style.display="block";
          cancle.style.display = "block";
          holder.style.display = "none";
          searchRecord.style.display="block";
          input.focus();
          this.placeholder=this.type==1?'输入单号／编码／发货方名称':'输入单号／编码／收货方名称';
          this.isNav=false;
          this.isList=false;
        }
      },
      handleCancel(tar){
        const input=tar.getElementsByTagName('input')[0];
        const holder=tar.getElementsByClassName('holder')[0];
        const searchBtn=tar.getElementsByClassName('search_btn')[0];
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        const cancle=tar.getElementsByClassName('cancle')[0];
        searchRecord.style.display="none";
        searchBtn.style.display = "none";
        cancle.style.display = "none";
        holder.style.display = "block";
        this.placeholder='';
        this.isNav=true;
        this.isList=true;
        this.searchTxt='';
        this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
        this.$store.dispatch('setOrderList',this.status!=0?{type:this.type,openid:this.openid,status:this.status}:{type:this.type,openid:this.openid})
      },
      handleSearch(tar){
        const input=tar.getElementsByTagName('input')[0];
        if(input.value==''){
          this.$store.dispatch('changeTip',{isTip:true,txt:'搜索信息不能为空'});
          setTimeout(()=>{
            this.$store.dispatch('changeTip',{isTip:false,txt:''});
          },1000)
          input.focus();
          return;
        }
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        searchRecord.style.display="none";
        this.isNav=false;
        this.isList=true;
        this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
        this.$store.dispatch('setOrderList',{type:this.type,openid:this.openid,search:this.searchTxt})
      }
    }
  }
</script>