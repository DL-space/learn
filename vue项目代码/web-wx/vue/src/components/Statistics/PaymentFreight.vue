<!--title 统计-我付的运费    lxm-->
<template>
	<div class="order_wrap">
		<div class="bord" v-show="bordBox"></div>
		<div class="order">
			<div class="top">
				<search-client ref="search" :searchTxt="searchTxt" :record="record" :placeholder="placeholder" @handleFocus="handleFocus" @handleCancel="handleCancel" @handleInput="handleInput" @handleSearch="handleSearch"></search-client>
			</div>
			<div class="select_date" style="padding-top: 0.8rem;">
				<span>统计</span>
				<div class="fr select_cur"><i>{{currVal}}</i><img @click="TimeScreen()" src="../../../static/images/client/icon06.png" /></div>
				<div class="cb"></div>
			</div>
			<div class="amount_payment">
				<p>支付单数量：<i>{{receivedInfo.orderTotalCnt}}</i></p>
				<p>支付运费总额：<b>￥{{receivedInfo.orderTotalcCarriageMoney}}.00</b></p>
			</div>
			<div class="order_list" style="padding: 0;">
				<order-item v-if="orderList.length>0" v-for="(item,index) of orderList" :data="item" :key="index" @jumpDetail="jumpDetail"></order-item>
				<div v-if="orderList.length==0" style="padding-top:.2rem;text-align:center;background:#fff;color:#666">暂无数据</div>
			</div>
			<button-client :loadFinish="loadFinish" :disabled="disabled" :data="button" @listenButtonEvent="handleMore"></button-client>
			<div class="data_box" v-show="dataSel">
				<ul>
					<li v-on:click="ScreenBtn(optiontxts,$index)" v-for="(optiontxts,$index) in options" v-bind:class="{'curr':optiontxts.IsCurr}">{{optiontxts.text}}</li>
				</ul>
			</div>
		</div>
	</div>

	</div>
</template>
<script>
	import {ButtonClient}from '@/components/Common/Form'
	import Vue from 'vue'
	import {SearchClient} from '@/components/Common/Search'
	import OrderItem from '@/components/Client/OrderItem'
	import {mapState} from 'vuex'
	import {Ajax} from '@/assets/Util'
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
				currVal: "本月", //当前筛选的月份
				dataVal: "1",
				dataSel: false, //筛选时间弹出框
				bordBox: false, //遮罩层
				ballShow: false, //初始化订单列表的隐藏
				options: [ //筛选时间文本
					{
						text: '本月',
						value: '1'
					}, {
						text: '近两个月',
						value: '2'
					}, {
						text: '近三个月',
						value: '3'
					}, {
						text: '半年内',
						value: '4'
					}, {
						text: '今年内',
						value: '5'
					}, {
						text: '全部',
						value: '6'
					}
				],
				isActive: false, //旋转的css3效果
				OpenShow: false, //展开的css3效果
				IsCurr: false, //筛选月份的选中效果
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
				rows: 20
			}
		},
		created() {
			//请求接口，得到我付的运费
			const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
			this.$store.dispatch('setMypayFreight',{openId,page,rows,condition,startEndType});
		},
		computed: mapState({
			openid: state => state.openid,
			loadFinish: state => state.loadFinish,
			disabled: state => state.disabled,
			receivedInfo:state=>state.receivedInfo,
			orderList:state=>state.orderList
		}),
		methods: {

			//李雪敏 按月筛选
			//点击时间图标，弹出遮罩层与时间筛选框
			TimeScreen() {
				this.bordBox = true;
				this.dataSel = true;
			},
			//查询时间
			ScreenBtn(optiontxts, index) {
				this.page=1;
				this.$store.dispatch('clear_obj','receivedInfo');//清除叠加的列表
				this.$store.dispatch('clear_arr','orderList');//清除叠加的列表
				//点击时间，选中后高亮
				this.options.forEach(function(optiontxts) {
					Vue.set(optiontxts, 'IsCurr', false);　　　　　　　　
				});　　　　　　　　
				Vue.set(optiontxts, 'IsCurr', true);
				this.currVal = optiontxts.text;
				this.dataVal = optiontxts.value;
				//请求接口，得到我付的运费
				const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
				this.$store.dispatch('setMypayFreight',{openId,page,rows,condition,startEndType});
				this.bordBox = false;
				this.dataSel = false;
			},
			//分页请求
			handleMore() {
				this.page+=1;
				//分页请求接口，得到我付的运费
				const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
				this.$store.dispatch('setMypayFreight',{openId,page,rows,condition,startEndType});
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
				console.log(e.target.value)
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
					this.placeholder = '输入单号／发货方名称／电话';
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
				//请求接口，得到我付的运费
				const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
				this.$store.dispatch('setMypayFreight',{openId,page,rows,condition,startEndType});
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
				//请求接口，得到代收货款总额与未收到代收货款
				this.$store.dispatch('clear_obj','receivedInfo');//清除叠加的列表
				this.$store.dispatch('clear_arr','orderList');//清除叠加的列表
				const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
				this.$store.dispatch('setMypayFreight',{openId,page,rows,condition,startEndType});
			}
		}
	}
</script>
