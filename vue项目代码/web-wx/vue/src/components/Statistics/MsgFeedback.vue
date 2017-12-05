<!--title 统计-客户信息反馈   lxm-->
<template>
	<div class="order_wrap">
		<div class="order">
			<div class="total_order">
				<div class="ordercd_top">
					<img src="../../../static/images/client/danhao.png">
					<span>支付单号：{{backInfo.paymentSn}}</span>
					<img class="opt_icon" src="../../../static/images/clerk/icon/icon-selected.png">
				</div>
				<div class="cb"></div>
				<p>发货单：<i>{{backInfo.orderCnt}}个</i></p>
				<p>结算金额：<b>{{backInfo.actualPayMoney}}.00</b></p>
				<p>支付时间：<i>{{backInfo.paymentTime}}</i></p>
			</div>

			<div class="order_list" v-if="isList" style="padding-top: 0;">
				<order-item v-if="orderList.length>0" v-for="(item,index) of orderList" :data="item" :key="index" :type="type" @jumpDetail="jumpDetail"></order-item>
				<div v-if="orderList.length==0" style="padding-top:.2rem;text-align:center;background:#fff;color:#666">暂无数据</div>
			</div>
			<button-client :loadFinish="loadFinish" :disabled="disabled" :data="button" @listenButtonEvent="handleMoreClient"></button-client>
		</div>
	</div>

	</div>
</template>
<script>
	import {
		ButtonClient
	}
	from '@/components/Common/Form'
	import {
		Ajax
	}
	from '@/assets/Util'
	import OrderItem from '@/components/Client/OrderItem'
	import {
		mapState
	}
	from 'vuex'
	export default {
		components: {
			OrderItem, ButtonClient
		},
		data() {
			return {
				button: {
					txt: '获取更多',
					style: {
						marginTop: '.1rem',
						borderRadius: '0',
						backgroundColor: '#eee',
						color: '#666'
					}
				},
				isNav: true,
				placeholder: '',
				searchTxt: '',
				type: 1,
				record: [],
				isList: true,
				status: 0,
				page: 1,
				rows: 10,
				backInfo: {}, //上面的对象
				orderList: [], //组件中的数组
				paymentId:''   //订单号
			}
		},
		created() {
			console.log(this.$route.query.paymentId)
			//			this.$store.dispatch('changeTip', {
			//				isTip: true,
			//				txt: '加载中...',
			//				loading: true
			//			})
			if(this.$route.query.paymentId){
				this.paymentId = this.$route.query.paymentId;
			}else{
//				this.paymentId = 4;
			}
			Ajax('/wechat/fina/stat/paymentsearch/onepayment', {
				paymentId: this.paymentId,
				page: 1,
				rows: 10
			}, (data) => {
				if (data.code == 0) {
					this.$store.dispatch('changeLoadFinish', {txt : '',isShowButton:true});
					this.backInfo = data.data.paymentInfo
					this.orderList = data.data.orderList
					setTimeout(() => {
						this.$store.dispatch('changeTip', {
							isTip: false,
							txt: ''
						});
					}, 200);
					if(data.data.total <= this.orderList.length){

					this.$store.dispatch('changeLoadFinish', {txt : '没有了...',isShowButton:false});
					}

				}
			})
		},
		computed: mapState({
			loadFinish: state => state.loadFinish,
			disabled: state => state.disabled,
			openid: state => state.openid
		}),
		methods: {
			jumpDetail(sn) {
					this.$router.push({
						name: 'detail',
						params: {
							sn: sn
						}
					})
				},
				//点击加载更多
				handleMoreClient: function() {
					this.page += 1;
					Ajax('/wechat/fina/stat/paymentsearch/onepayment', {
						paymentId: this.paymentId,
						page: this.page,
						rows: this.rows
					}, (data) => {
						if (data.code == 0) {
							this.backInfo = data.data.paymentInfo;
							this.orderList = data.data.orderList;
							setTimeout(() => {
								this.$store.dispatch('changeTip', {
									isTip: false,
									txt: ''
								});
							}, 200)
						}
					})
				}
		}
	}
</script>
