<template>
	<div class="order_wrap">
		<div class="serTop">
			<div class="clientSearch">
				<div class="searchLeft">
					<input type="text" placeholder="输入单号/客户名称/收货方名称" class="inputOrder" v-model="searchCondi" @keyup="searchChooseKeyUp(searchCondi)" />
					<i class="clearSearch" @click="clearText">X</i>
				</div>
				<input type="button" value="搜索" class="inputBtn" @click="searchButton" />
			</div>
		</div>

		<div class="searchRes">
			<div v-on:click="chooseClient($event)" v-for="clients in clientChoose">
				<div class="resTop">
					<p class="topDis" style="display: none;">{{clients.id}}</p>
					<img src="../../../static/images/client/xiulichang.png" class="topImg" />
					<p class="topP">{{clients.memberOrgName}}</p>
				</div>
				<div class="invoice_list">
					<div class="info_bar">
						<span>客户编号: </span>
						<p class="topDisId" style="display: none;">{{clients.receUserId}}</p>
						<p>{{clients.clientCode}}</p>
						<!--<img class="resImg"  src="../../../static/images/client/bohao.png"/>-->
					</div>
					<div class="info_bar">
						<span>联系人: </span>
						<p>{{clients.memberName}}</p>
					</div>
					<div class="info_bar">
						<span>电话: </span>
						<p class="topPhone">{{clients.memberTel}}</p>
					</div>
					<div class="info_bar2">

						<p class="topAddr topAddr2"><span>地址: </span><span class="addtext">{{clients.address}}</span></p>
					</div>
				</div>
			</div>
		</div>
		<div class="resClass resClassAgain" v-if="clientChoose.length==0" style="padding: 0;">
			<img src="../../../static/images/client/sousuo.png" alt="" />
			<p class="tipP">无搜索结果!</p>
		</div>
		<button-client :loadFinish="loadFinish" :disabled="disabled" :data="button" @listenButtonEvent="handleMore" style="margin-bottom: 0.4rem;"></button-client>
		<router-link to="/client/customer">
			<button-client :data="submitBtn"></button-client>
		</router-link>
		<!-- <span class="addSpan">+</span> -->
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
				submitBtn: {
					txt: '添加客户',
					style: {
						marginTop: '0.3rem',
						backgroundColor: '#e64933',
						position: 'fixed',
						bottom: '0'
					}
				}, //按钮
				//				clientChoose: [], //返回的可选择的收货方信息
				searchCondi: '', //搜索input信息
				page: 0,
				rows: 10,
			}
		},
		created() {
			this.$store.dispatch('changeTip', {
					isTip: true,
					txt: '加载中...',
					loading: true
				})
				//默认请求所有有关系的客户信息
			this.handleMore();
			setTimeout(() => {
				this.$store.dispatch('changeTip', {
					isTip: false,
					txt: ''
				});
			}, 3000)
		},
		computed: mapState({
			loadFinish: state => state.loadFinish,
			disabled: state => state.disabled,
			openid: state => state.openid,
			clientChoose: state => state.clientChoose
		}),
		methods: {
			//选择收货方
			chooseClient: function(e) {
				var infoArr = e.currentTarget;
				//进行跳转
				this.$router.replace({
					name: 'invoice',
					params: {}
				});
				//将选中的客户信息传入公共变量里面，有时间改一下
				this.$store.dispatch('setClientInfo', {
					id: infoArr.getElementsByClassName("topDis")[0].innerHTML,
					receUserId: infoArr.getElementsByClassName("topDisId")[0].innerHTML,
					orgName: infoArr.getElementsByClassName("topP")[0].innerHTML,
					phone: infoArr.getElementsByClassName("topPhone")[0].innerHTML,
					address: infoArr.getElementsByClassName("addtext")[0].innerHTML
				});
			},
			handleMore() {
				this.page += 1;
				this.$store.dispatch('changeTip', {
					txt: '加载中...',
					isTip: true
				});
				const page = this.page,
					rows = this.rows,
					condition = this.searchCondi;
				this.$store.dispatch('setClientChoose', {
					page, rows, condition, openid: this.openid, status: 0
				})
			},
			//搜索按钮
			searchButton: function() {
				if (this.searchCondi != '') {
					this.$store.dispatch('changeTip', {
						txt: '加载中...',
						isTip: true
					});
					const page = this.page,
						rows = this.rows,
						condition = this.searchCondi;
					this.$store.dispatch('setClientChoose', {
						page, rows, condition, openid: this.openid, status: 0
					})
					setTimeout(() => {
						this.$store.dispatch('changeTip', {
							isTip: false,
							txt: ''
						});
					}, 3000)
				}else{
					this.$store.dispatch('clear_arr', 'clientChoose');
				}
			},
			//监听input事件
			searchChooseKeyUp: function(e) {
				//				this.handleMore();
			},
			//清空搜索框
			clearText: function() {
				this.searchCondi = "";
			}
		}
	}
</script>
