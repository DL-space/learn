<template>
	<div class="order_wrap">
		<div class="top">
			<search-client ref="search" :searchTxt="searchInfo" :record="record" :placeholder="placeholder" @handleFocus="handleFocus" @handleCancel="handleCancel" @handleInput="handleInput" @handleSearch="handleSearch" @handleBlur="handleBlur"></search-client>
		</div>
		<div class="serTop">
			<div class="noSettleTip">
				<span class="infoLeft fontChange">{{monthList.contractStartTime}} 至 {{monthList.clearingTime}}</span>
				<span class="infoRight fontRed" style="text-align: center;">{{monthList.finaDayClearStatusStr}}</span>
			</div>
		</div>
		<div class="topInfos">
			<div class="amount_payment">
				<div class="amountTop">
					<p class="amountLeft">发货单数量：<i>{{monthList.orderCount}}</i></p>
					<p>件数：<i>{{monthList.goodsTotalCnt}}</i></p>
				</div>
				<p>金额：<b>￥{{monthList.totalFreight}}</b></p>
			</div>
		</div>
		<div class="order">
			<div class="order_list" v-if="isList" style="padding-top: 0;">
				<order-item v-if="monthList.infoList.length>0" v-for="(item,index) of monthList.infoList" :data="item" :key="index" @jumpDetail="jumpDetail"></order-item>
				<div v-if="monthList.infoList.length==0" style="padding-top:.2rem;text-align:center;background:#fff;color:#666">暂无数据</div>
			</div>
		</div>

	</div>
	</div>
</template>
<script>
	import {
		Ajax
	}
	from '@/assets/Util'
	import {
		SearchClient
	}
	from '@/components/Common/Search'
	import OrderItem from '@/components/Client/OrderItem'
	import {
		mapState
	}
	from 'vuex'
	export default {
		components: {
			OrderItem, SearchClient
		},
		data() {
			return {
				isNav: true,
				placeholder: '',
				searchTxt: '',
				finaDayClearId: this.$route.query.finaDayClearId,
				compactId: this.$route.query.compactId,
				startTime: this.$route.query.startTime,
				endTime: this.$route.query.endTime,
				//				type: this.$route.name == 'receive' ? 1 : 2,
				menus: [{
					name: '全部',
					focus: 1,
					status: 0
				}, {
					name: '已收货',
					status: 11
				}, {
					name: '配送中',
					status: 30
				}, {
					name: '已签收',
					status: 32
				}, {
					name: '拒签',
					status: 33
				}],
				record: [],
				isList: true,
				status: 0,
				page: 1,
				rows: 10,
				searchInfo: '' //搜索内容
			}
		},
		created() {
			/*this.$store.dispatch('changeTip', {
				isTip: true,
				txt: '加载中...',
				loading: true
			})*/
			/*Ajax('/wechat/fina/stat/monthlypay/carriage/payorno/list', {
				finaDayClearId: this.finaDayClearId,
				compactId: this.compactId,
				startTime: this.startTime,
				endTime: this.endTime,
				page: 1,
				rows: 10
			}, (data) => {
				if (data.code == 0) {
					console.log(data);
					setTimeout(() => {
						this.$store.dispatch('changeTip', {
							isTip: false,
							txt: ''
						});
					}, 200)
				}
			})*/
			const page = this.page,
				rows = this.rows,
				finaDayClearId = this.finaDayClearId,
				compactId = this.compactId,
				startTime = this.startTime,
				endTime = this.endTime,
				searchInfo = this.searchInfo;
			this.$store.dispatch('setMonthList', {
				page, rows, finaDayClearId, compactId, startTime, endTime, searchInfo
			})
		},
		computed: mapState({
			openid: state => state.openid,
			monthList: state => state.monthList
		}),
		methods: {
			jumpDetail(sn) {
				this.$router.push({name: 'orderDetail', query: {sn: sn}})
			},
				handleInput(e) {
					this.searchTxt = e.target.value;
				},
				handleFocus(tar) {
					const input = tar.getElementsByTagName('input')[0];
					if (input.value == '') {
						const holder = tar.getElementsByClassName('holder')[0];
						const searchBtn = tar.getElementsByClassName('search_btn')[0];
						const searchRecord = tar.getElementsByClassName('search-record')[0];
						const cancle = tar.getElementsByClassName('cancle')[0];
						searchBtn.style.display = "block";
						searchRecord.style.display = "none";
						cancle.style.display = "block";
						holder.style.display = "none";
						input.focus();
						this.placeholder = '输入单号／收发货方名称／电话';
						this.isNav = false;
						this.isList = false;
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
					this.page = 1;
					this.placeholder = '';
					this.isNav = true;
					this.isList = true;
					this.searchTxt = '';
					/*const openid = this.openid,
						status = this.status,
						search = this.searchTxt,
						page = this.page,
						rows = this.rows,
						type = this.type;
					this.$store.dispatch('setOrderList', status != 0 ? {
						status, type, openid, search, page, rows
					} : {
						type, openid, search, page, rows
					});*/
				},
				handleSearch(tar) {
					this.page = 1;
					const input = tar.getElementsByTagName('input')[0],
						openid = this.openid,
						search = this.searchTxt,
						status = this.status,
						page = this.page,
						rows = this.rows,
						type = this.type;
					if (input.value == '') {
						this.$store.dispatch('changeTip', {
							isTip: true,
							txt: '搜索信息不能为空',
							time
						});
						input.focus();
						return;
					}
					const searchRecord = tar.getElementsByClassName('search-record')[0];
					searchRecord.style.display = "none";
					this.isNav = false;
					this.isList = true;
					//搜索请求接口
					const finaDayClearId = this.finaDayClearId,
						compactId = this.compactId,
						startTime = this.startTime,
						endTime = this.endTime,
						searchInfo = this.searchInfo;
					this.$store.dispatch('setMonthList', {
						page, rows, finaDayClearId, compactId, startTime, endTime, searchInfo
					})
				},
				handleBlur(tar) {
					const input = tar.getElementsByTagName('input')[0];
					if (input.value == '') {
						const holder = tar.getElementsByClassName('holder')[0];
						const searchBtn = tar.getElementsByClassName('search_btn')[0];
						const searchRecord = tar.getElementsByClassName('search-record')[0];
						const cancle = tar.getElementsByClassName('cancle')[0];
						searchBtn.style.display = "none";
						searchRecord.style.display = "none";
						cancle.style.display = "none";
						holder.style.display = "block";
						this.placeholder = '';
						this.isNav = true;
						this.isList = true;
					}
				},
		}
	}
</script>
