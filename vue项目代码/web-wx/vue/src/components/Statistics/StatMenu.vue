<template>
	<div class="stat_wrap">
		<div class="stat">
			<!--统计菜单页面  --start-->
			<div class="stat_total">
				<div class="account-cash in-bk-center" v-if="isAccount">
					<div class="center-box">
						<div class="cash-yes" >
							<p>账户余额(元)</p>
							<p class="cash-text">￥{{accountCash}}</p>
						</div>
						<!-- <div class="cash-no" v-else>
              <p>{{accountCash}}</p>
						</div> -->

					</div>

				</div>
				<div class="plate fl">
					<img src="../../../static/images/client/BJ1.png" />
					<div class="money"><span class="lfcolor">{{TotalNum.receivedPaymentMoney}}</span>
						<p>代收货款总额（￥）</p>
					</div>
				</div>
				<div class="plate fr">
					<img src="../../../static/images/client/BJ2.png" />
					<div class="money">
						<span class="rgcolor">{{TotalNum.unreceivedPaymentMoney}}</span>
						<p>未提取代收货款</p>
					</div>
				</div>
			</div>
			<ul class="menu_list">
				<li @click="Received()" class="br1_bottom">
					<img class="fl_icon" src="../../../static/images/client/icon01.png" />
					<h4>已提取代收货款</h4>
					<img class="fr_goto" src="../../../static/images/clerk/icon/icon-enter.png" />
				</li>
				<li @click="NrcyReceived()" class="br1_bottom">
					<img class="fl_icon" src="../../../static/images/client/icon02.png" />
					<h4>未提取代收货款</h4>
					<img class="fr_goto" src="../../../static/images/clerk/icon/icon-enter.png" />
				</li>
				<li @click="Paymentgoods()" class="br1_bottom">
					<img class="fl_icon" src="../../../static/images/client/icon03.png" />
					<h4>我付的货款</h4>
					<img class="fr_goto" src="../../../static/images/clerk/icon/icon-enter.png" />
				</li>
				<li @click="PaymentFreight()" class="br1_bottom">
					<img class="fl_icon" src="../../../static/images/client/icon04.png" />
					<h4>我付的运费</h4>
					<img class="fr_goto" src="../../../static/images/clerk/icon/icon-enter.png" />
				</li>
				<li @click="MonthlyState()" class="br1_bottom">
					<img class="fl_icon" src="../../../static/images/client/icon05.png" />
					<h4>运费月结</h4>
					<img class="fr_goto" src="../../../static/images/clerk/icon/icon-enter.png" />
				</li>
				<li class="br1_bottom">
					<img class="fl_icon" src="../../../static/images/client/icon06.png" />
					<h4>运费包月</h4>
					<img class="fr_goto" src="../../../static/images/clerk/icon/icon-enter.png" />
				</li>
			</ul>

			<!--统计菜单页面 --end-->
		</div>
	</div>
</template>
<script>
	import {
		mapState
	} from 'vuex'
	import {
		Ajax,Axios,Cookie
	} from '@/assets/Util'
	export default {
		data() {
				return {
					TotalNum: 0,
					accountCash:'',
					isAccount:false
				}
			},
      watch:{
        openid(newVal,oldVal){
          const openId=newVal;
          //请求接口，得到代收货款总额与未收到代收货款
          Ajax('/wechat/fina/stat/home/list', {openId}, (data) => {
            if(data.result) {
              this.TotalNum = data.data;
            }
          });
        }
      },
      created(){
        const openId=this.openid;
        //请求接口，得到代收货款总额与未收到代收货款

        Ajax('/wechat/fina/stat/home/list', {openId}, (data) => {
          if(data.result) {
            this.TotalNum = data.data;
          }
        });
				this.getStatus();
      },
			computed: mapState({
				openid: state => state.openid,
				orderList: state => state.orderList

			}),

			methods: {

				//已收到代收货款
				Received() {
					this.$router.push({
						name: 'received',
						params: {}
					})
				},
				getStatus(){
		      let ast = Cookie.getCookie('ast');
		      if(ast == '1') return this.status=2,this.getMyAccount();
		      Axios('/account/accountapp/getAccountInfo',{openId:this.openid},{api:1}).then(data=>{
		        if(data.result){
							// if(this.status==2) this.getMyAccount();
		          if(this.status==2) this.getMyAccount();
		        }else{
		              return this.accountCash="未注册虚拟账户";
		        }
		      })
		    },
		    getMyAccount(){
		      Cookie.setCookie('ast','1');
		      Axios('/account/accountapp/getAssetInfo',{openId:this.openid},{api:1}).then(dt=>{
		        if(!dt.result || !dt.code==0) return;
		        if(dt.data.state==-1) return Toast(dt.data.message)
						this.isAccount=true;
		        this.accountCash=dt.data.accountBalance;
		      })
		    },
				//未收到代收货款
				NrcyReceived() {
					this.$router.push({
						name: 'noreceived',
						params: {}
					})
				},
				//我付的货款
				Paymentgoods() {
					this.$router.push({
						name: 'paymentgoods',
						params: {}
					})
				},
				//我付的运费
				PaymentFreight() {
					this.$router.push({
						name: 'paymentfreight',
						params: {}
					})
				},
				//运费月结
				MonthlyState() {
					this.$router.push({
						name: 'monstate',
						params: {}
					})
				}
			}
	}
</script>
<style scoped>
	.account-cash{
		height: 1rem;
		text-align: center;
	}
	.account-cash p{
		font-size: .16rem;
		color: #666;
	}
	.account-cash .cash-text{
		color:#333;
		font-size: .3rem;
	}
</style>
