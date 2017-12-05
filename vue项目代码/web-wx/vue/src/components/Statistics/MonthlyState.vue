<template>
	<div class="order_wrap">
		<div class="order">
			<div class="top">
				<div class="topBtns">
					<input type="button" value="当前合同" v-bind:class="{ 'btnRedTop': redToRed, 'btnGrayTop': redToGray }" v-on:click="changeToFir" style="margin-right: 0.2rem;" />
					<input type="button" value="全部" v-bind:class="{ 'btnRedTop': gayToRed, 'btnGrayTop': gayToGray }" v-on:click="changeToSec" />
				</div>
				<div class="topInfos" v-show="rangeShow">
					<p class="cycle">
						<span>合同周期：</span>
						<span class="cycleInfo">{{monthStateList.compactClearTime}} </span>至
						<span class="cycleInfo">{{monthStateList.compactEndTime}}</span>
					</p>
					<p class="cycle">
						<span>结算日：</span>
						<span class="cycleInfo">{{monthStateList.compactClearTime}}</span>
					</p>
				</div>
			</div>
			<div style="padding-top:1.32rem" class="changePadding">
			<div class="freightDiv" v-for="monthInfo in monthStateList.finaDayClearMapList" @click="turnInfo($event)">
				<div class="freight">
					<div class="freightLeft">
						<p class="finaDayClearId" style="display: none;">{{monthInfo.finaDayClearId}}</p>
						<p class="compactId" style="display: none;">{{monthInfo.compactId}}</p>
						<div class="leftInfo">
							<span class="infoLeft fontChange settlementStartDate">{{monthInfo.settlementStartDate}} </span>
							<span class="infoMiddle">至</span>
							<span class="infoLeft fontChange settlementDate">{{monthInfo.settlementDate}}</span>
							<span class="infoRight fontRed">{{monthInfo.clearingStatusStr}}</span>
						</div>
						<div class="leftInfo">
							<p class="infoLeft changeLeft">
								<span>发货单数：</span>
								<span class="infoLeftRes fontChange">{{monthInfo.orderCount}}</span>
							</p>
							<p class="infoRight">
								<span>件数：</span>
								<span class="infoLeftRes fontChange">{{monthInfo.goodsTotalCnt}}</span>
							</p>
						</div>
						<div class="leftInfo">
							<p class="infoLeft" style="width:auto">
								<span>金额：</span>
								<span class="infoLeftRes fontChange">￥{{monthInfo.carriageTotalMoney+monthInfo.returnFreight}}</span>
							</p>
						</div>
						<div class="leftInfo recievedOrNo" v-if="monthInfo.factFreight">
							<p class="infoLeft pStyle">
								<span>实付金额：</span>
								<span class="infoLeftRes fontChange">￥{{monthInfo.factFreight}}</span>
							</p>
						</div>
					</div>
					<img class="freightRight" src="../../../static/images/client/you.png" />
				</div>
			</div>
			</div>
			<button-client :loadFinish="loadFinish" :disabled="disabled" :data="button" @listenButtonEvent="handleMore" style="margin-top: 0.48rem;"></button-client>

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
	import {
		mapState
	}
	from 'vuex'
	export default {
		components: {
			ButtonClient
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
				redToRed: true, //按钮变红
				redToGray: false,
				gayToRed: false,
				gayToGray: true,
				rangeShow: true, //控制显示合同日期和结算日
				/*monthStateList: {
					contractStartTime: '2017-4-19',
					contractEndTime: '2017-7-19',
					clearTime: '没有31日',
					contractMonthlyPayList: [{
						monthlyPayStartTime: '2017-4-10',
						monthlyPayEndTime: '2017-9-1',
						monthlyPayClearStatus: '未结算',
						orderTotalCnt: '30',
						goodsTotalCnt: '4',
						carriageTotaltMoney: '10',
						actualcarriageTotaltMoney: '100'
					}, {
						monthlyPayStartTime: '2017-4-10',
						monthlyPayEndTime: '2017-9-1',
						monthlyPayClearStatus: '已结算',
						orderTotalCnt: '30',
						goodsTotalCnt: '4',
						carriageTotaltMoney: '10',
						actualcarriageTotaltMoney: '100'
					}]
				},*/ //返回的结算单
				page: 1,
				rows: 10,
			}
		},
		created() {
			this.$store.dispatch('changeTip', {
				isTip: true,
				txt: '加载中...',
				loading: true
			})
			this.$store.dispatch('clear_obj', 'monthStateList');
			this.showMonthly(0);
		},
		computed: mapState({
			loadFinish: state => state.loadFinish,
			disabled: state => state.disabled,
			openid: state => state.openid,
			pageFlag: state => state.pageFlag,
			monthStateList: state => state.monthStateList
		}),
		methods: {
			//点击改变付费方，方法太笨!
			changeToFir: function() {
				this.$store.dispatch('clear_obj', 'monthStateList');
				this.$store.dispatch('changeTip', {
					txt: '加载中...',
					isTip: true
				});
				//切换按钮的css类
				this.redToRed = true;
				this.redToGray = false;
				this.gayToRed = false;
				this.gayToGray = true;
				//展示合同和结算日
				this.rangeShow = true;
				document.getElementsByClassName("changePadding")[0].style.paddingTop = '1.32rem';
				this.showMonthly(0);
			},
			changeToSec: function() {
				this.$store.dispatch('clear_obj', 'monthStateList');
				this.$store.dispatch('changeTip', {
					txt: '加载中...',
					isTip: true
				});
				//展示合同和结算日
				this.rangeShow = false;
				//切换按钮的css类
				this.gayToRed = true;
				this.gayToGray = false;
				this.redToRed = false;
				this.redToGray = true;
				document.getElementsByClassName("changePadding")[0].style.paddingTop = '0.6rem';
				this.showMonthly(1);
			},
			//展示月结算单
			showMonthly: function(flagParam) {
				/*Ajax('/wechat/fina/stat/monthlypay/carriage/list', {
					openId: this.openid,
					monthFlag: flagParam,
					page: 1,
					rows: 10
				}, (data) => {
					//this.monthlyInfos = data;
					setTimeout(() => {
						this.$store.dispatch('changeTip', {
							isTip: false,
							txt: ''
						});
					}, 200)
				})*/
				const page = 1,
					rows = this.rows,
					monthFlag = flagParam;
				this.$store.dispatch('setMonthState', {
					page, rows, monthFlag, openId: this.openid
				});
			},
			handleMore: function(flagParam) {
				this.page += 1;
				this.$store.dispatch('changeTip', {
					txt: '加载中...',
					isTip: true
				});
				const page = this.page,
					rows = this.rows,
					monthFlag = this.flagParam;
				this.$store.dispatch('setMonthState', {
					page, rows, monthFlag, openId: this.openid
				});
			},
			//跳转
			turnInfo: function(e) {
				var finaDayClearId = e.currentTarget.getElementsByClassName("finaDayClearId")[0].innerHTML;
				var compactId = e.currentTarget.getElementsByClassName("compactId")[0].innerHTML;
				var settlementStartDate =e.currentTarget.getElementsByClassName("settlementStartDate")[0].innerHTML;
				var settlementDate =e.currentTarget.getElementsByClassName("settlementDate")[0].innerHTML;
				var stateFlag = 0;
				/*switch(flagState){
					case '已结算':stateFlag = 1;
					break;
					case '未结算':stateFlag = 2;
					break;
				}*/
				//进行路由跳转
				this.$router.push({
					name: 'nosettlement',
					query: {
						finaDayClearId:finaDayClearId,
						compactId:compactId,
						startTime:settlementStartDate,
						endTime:settlementDate
					}
				})
			}
		}
	}
</script>
