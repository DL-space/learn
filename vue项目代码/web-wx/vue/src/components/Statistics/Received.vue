<!--title 统计-已收到代收货款   lxm-->
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
				<p>支付单数量：<i>{{receivedInfo.paymentCnt}}</i></p>
				<p>已收到代收款总额：<b>￥{{receivedInfo.paymentMoney}}.00</b></p>
			</div>
			<div class="order_ground" v-if="orderList.length==0" style="text-align:center;background:#fff;color:#666">暂无数据</div>
			<div class="order_ground" v-for="(payList,$index) in orderList" v-else>
				<div class="total_order">
					<div class="ordercd_top" @click="showOther($event)">
						<img src="../../../static/images/client/danhao.png">
						<span>支付单号：{{payList.paymentSn}}</span>
						<img class="opt_icon" src="../../../static/images/clerk/icon/icon-selected.png">
					</div>
					<div class="cb"></div>
					<p>发货单：<i>{{payList.orderCnt}}个</i></p>
					<p>已收到代收款总额：<b>{{payList.paymentMoney}}</b></p>
					<p>支付时间：<i>{{payList.paymentTime}}</i></p>
				</div>
				<div class="order_list none" style="padding-top:0">
					<order-item v-if="payList.orderList.length>0" :type="2" v-for="(item,index) of payList.orderList" :data="item" :key="index" @jumpDetail="jumpDetail"></order-item>
					<div v-if="payList.orderList.length==0" style="text-align:center;background:#fff;color:#666">暂无数据</div>
				</div>
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
	import {
		ButtonClient
	}
	from '@/components/Common/Form'
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
				placeholder: '',
				searchTxt: '',
				record: [],
				status: 0,
				currVal: "本月", //当前筛选的月份
				dataVal: "1",
				dataSel: false, //筛选时间弹出框
				bordBox: false, //遮罩层
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
				rows: 20,
				
			}
		},
		created() {
			//请求接口，得到代收货款总额与未收到代收货款
			const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
			this.$store.dispatch('setReceivedsInfo',{openId,page,rows,condition,startEndType});
		},
		computed: mapState({
			openid: state => state.openid,
			loadFinish: state => state.loadFinish,
			disabled: state => state.disabled,
			receivedInfo:state=>state.receivedInfo,
			orderList:state=>state.orderList
		}),

		methods: {
			//点击订单跳转至详情页面
			jumpDetail(sn) {
				this.$router.push({
					name: 'orderDetail',
					query: {
						sn: sn
					}
				})
			},
			//李雪敏 按月筛选
			//点击时间图标，弹出遮罩层与时间筛选框
			TimeScreen() {
				this.bordBox = true;
				this.dataSel = true;
			},
			//查询时间
			ScreenBtn(optiontxts, index) {
				this.$store.dispatch('clear_obj','receivedInfo');//清除叠加的列表
				this.$store.dispatch('clear_arr','orderList');//清除叠加的列表
				//点击时间，选中后高亮
				this.options.forEach(function(optiontxts) {
					Vue.set(optiontxts, 'IsCurr', false);　　　　　　　　
				});　　　　　　　　
				Vue.set(optiontxts, 'IsCurr', true);
				this.dataVal = optiontxts.value; //当前时间为选择时间
				//请求接口，得到代收货款总额与未收到代收货款
			const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
			this.$store.dispatch('setReceivedsInfo',{openId,page,rows,condition,startEndType});
				this.bordBox = false; //默认隐藏遮罩层
				this.dataSel = false; //默认隐藏时间选择
				this.currVal = optiontxts.text; //当前时间为选择时间
				
			},

			//分页请求
			handleMore() {
				this.page+=1;
				//请求接口，得到代收货款总额与未收到代收货款
				const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
				this.$store.dispatch('setReceivedsInfo',{openId,page,rows,condition,startEndType});
			},

			//点击展开收起订单列表
			showOther(e) {
				var obj = this.deceSpace(e.currentTarget.parentNode);
				var modifyImg = this.deceSpace(obj[0])[2];
				var orderlist = this.deceSpace(e.currentTarget.parentNode.parentNode);
				var orderlistShow = orderlist[1];
				if(modifyImg.className == 'opt_icon acition') {
					modifyImg.className = 'opt_icon';
					orderlistShow.className = 'order_list none'
				} else {
					modifyImg.className = 'opt_icon acition';
					orderlistShow.className = 'order_list'
				}

			},

			//清理文本节点
			deceSpace: function(elem) {
				var elem_child = elem.childNodes;
				for(var i = 0; i < elem_child.length; i++) {
					if(elem_child[i].nodeName == "#text" && !/\s/.test(elem_child.nodeValue)) {
						elem.removeChild(elem_child[i])
					}
				}
				return elem_child;
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
					this.placeholder = '输入单号／收货方名称／电话';
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
				//请求接口，得到代收货款总额与未收到代收货款
				const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
				this.$store.dispatch('setReceivedsInfo',{openId,page,rows,condition,startEndType});

			},
			handleSearch(tar) {
				const input = tar.getElementsByTagName('input')[0];
				if(input.value == '') {
					this.$store.dispatch('changeTip', {
						isTip: true,
						txt: '搜索信息不能为空',
						time:1000
					});
				return
				}
				
			//请求接口，得到代收货款总额与未收到代收货款
			this.$store.dispatch('clear_obj','receivedInfo');//清除叠加的列表
			this.$store.dispatch('clear_arr','orderList');//清除叠加的列表
			const openId=this.openid,page=this.page,rows=this.rows,condition=this.searchTxt,startEndType=this.dataVal;
			this.$store.dispatch('setReceivedsInfo',{openId,page,rows,condition,startEndType});
			

			},

		}
	}
</script>