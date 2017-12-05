<!--title 统计-未收到代收货款    lxm-->
<template>
	<div class="order_wrap">
		<div class="order">
			<div class="top">
				<search-client ref="search" :searchTxt="searchTxt" :record="record" :placeholder="placeholder" @handleFocus="handleFocus" @handleCancel="handleCancel" @handleInput="handleInput" @handleSearch="handleSearch"></search-client>
			</div>
			<div class="select_date" style="padding-top: 0.8rem;">
				<span>统计</span>
				<div class="cb"></div>
			</div>
			<div class="amount_payment">
				<p>支付单数量：<i>{{receivedInfo.noPayOrderTotalCnt}}</i></p>
				<p>支付货款总额：<b>￥{{receivedInfo.noPayOrderTotalMoney}}.00</b></p>
			</div>
			<div class="order_list" style="padding: 0;">
				<order-item v-if="orderList.length>0" :type="2"  v-for="(item,index) of orderList" :data="item" :key="index" @jumpDetail="jumpDetail"></order-item>
				<div v-if="orderList.length==0" style="padding-top:.2rem;text-align:center;background:#fff;color:#666">暂无数据</div>
			</div>
			<button-client :loadFinish="loadFinish" :disabled="disabled" :data="button" @listenButtonEvent="handleMore"></button-client>
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
		SearchClient
	} from '@/components/Common/Search'
	import OrderItem from '@/components/Client/OrderItem'
	import {
		mapState
	} from 'vuex'
	import {
		Ajax
	} from '@/assets/Util'
	export default {
		components: {
			SearchClient,
			OrderItem,
			ButtonClient
		},
		data() {
			return {
				isNav: true,
				placeholder: '',
				searchTxt: '',
				record: [],
				status: 0,
				button: {
					txt: '获取更多',
					style: {
						marginTop: '.1rem',
						borderRadius: '0',
						backgroundColor: '#eee',
						color: '#666'
					}
				},
				page: 1,
				rows:20
			}
		},
		created() {
			this.$store.dispatch('changeTip', {
				isTip: true,
				txt: '加载中...',
				loading: true
			});
			//初始化请求接口，未收到代收货款
			const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt;
			this.$store.dispatch('setReceivedInfo',{openId,page,rows,condition});
		},
		computed: mapState({
			loadFinish: state => state.loadFinish,
			disabled: state => state.disabled,
			openid: state => state.openid,
			orderList:state=>state.orderList,
			receivedInfo:state=>state.receivedInfo
		}),
		methods: {
		
			////请求接口，未收到代收货款  ----分页请求
			handleMore() {
				this.page+=1;
				const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt;
				this.$store.dispatch('setReceivedInfo',{openId,page,rows,condition});
			},
			//点击订单跳转至详情页面
			jumpDetail(sn) {
				this.$router.push({
					name: 'orderDetail',
					query: {
						sn: sn
					}
				})
			},
			handleInput(e) {
				this.searchTxt = e.target.value;
			},
			handleFocus(tar) {
				const input = tar.getElementsByTagName('input')[0];
				if(input.value == '') {
					const holder = tar.getElementsByClassName('holder')[0];
					const searchBtn = tar.getElementsByClassName('search_btn')[0];
					const searchRecord = tar.getElementsByClassName('search-record')[0];
					const cancle = tar.getElementsByClassName('cancle')[0];
					searchBtn.style.display = "block";
					searchRecord.style.display = "none";
					cancle.style.display = "block";
					holder.style.display = "none";
					input.focus();
					this.placeholder = '输入单号／收货方名称';
				}
			},
			handleCancel(tar) {
				const input = tar.getElementsByTagName('input')[0];
				const holder = tar.getElementsByClassName('holder')[0];
				const searchBtn = tar.getElementsByClassName('search_btn')[0];
				const searchRecord = tar.getElementsByClassName('search-record')[0];
				const cancle = tar.getElementsByClassName('cancle')[0];
				searchRecord.style.display = "none";
				searchBtn.style.display = "none";
				cancle.style.display = "none";
				holder.style.display = "block";
				this.placeholder = '';
				this.searchTxt = '';
				//初始化请求接口，未收到代收货款
				const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt;
				this.$store.dispatch('setReceivedInfo',{openId,page,rows,condition});
			},
			handleSearch(tar) {
				const input = tar.getElementsByTagName('input')[0];
				if(input.value == '') {
					this.$store.dispatch('changeTip', {
						isTip: true,
						txt: '搜索信息不能为空'
					});
					setTimeout(() => {
						this.$store.dispatch('changeTip', {
							isTip: false,
							txt: ''
						});
					}, 1000)
					input.focus();
					return;
				}
				const searchRecord = tar.getElementsByClassName('search-record')[0];
				searchRecord.style.display = "none";
				//请求接口，未收到代收货款
			const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt;
			this.$store.dispatch('setReceivedInfo',{openId,page,rows,condition});
			}
		}
	}
</script>