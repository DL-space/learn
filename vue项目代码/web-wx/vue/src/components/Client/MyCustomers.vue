<template>
	<div class="order_wrap">
		<div class="serTop">
			<div class="clientSearch">
				<div class="searchLeft">
					<input type="text" placeholder="输入单号/客户名称/收货方名称" class="inputOrder" v-model="searchInput" />
					<i class="clearSearch" v-on:click="clearSearch">X</i>
				</div>
				<button  class="inputBtn" v-on:click="searBtn">搜索</button>
			</div>
		</div>
		<div class="searchRes">
			<div v-for="myClient in clientChoose">
				<div class="idTip" style="display: none;">{{myClient.id}}</div>
				<div class="resTop">
					<p class="topDis" style="display: none;">{{myClient.id}}</p>
					<img src="../../../static/images/client/xiulichang.png" class="topImg" />
					<p class="topP">{{myClient.memberOrgName}}</p>
					<button  class="topBtn" @click="chooseClient($event)">发货</button>
				</div>
				<div class="invoice_list invoice_list_Update">
					<div class="info_bar"><span>客户编号:</span>
						<p class="topDisId" style="display: none;">{{myClient.receUserId}}</p>
						<p>{{myClient.clientCode}}</p>
						<!--<img class="resImg" src="../../../static/images/client/bohao.png" />-->
					</div>
					<div class="info_bar"><span>联系人:</span>
						<p>{{myClient.memberName}}</p>
					</div>
					<div class="info_bar"><span>电话:</span>
						<p class="topPhone">{{myClient.memberTel}}</p>
					</div>
					<div class="info_bar2">

						<p class="topAddr topAddr2"><span>地址: </span><span class="addtext">{{myClient.address}}</span></p>
						<div class="deleBtn-box">
							<button class="deleBtn" @click="deleClient($event)">删除</button>
						</div>
					</div>
					<!-- <div class="info_bar">
						<div class="leftFloat">

							<p class="topAddr"><span>地址:</span>{{myClient.address}}</p>
						</div>
						<button  class="deleBtn" @click="deleClient($event)">删除</button>
					</div> -->
				</div>
			</div>
			<div class="showHide" style="height: 0.38rem;background-color: #fff;"></div>
		</div>
		<div class="resClass  resClassAgain" v-if="clientChoose.length==0">
			<img src="../../../static/images/client/sousuo.png" alt="" />
			<p class="tipP">无搜索结果!</p>
		</div>
		<button-client :loadFinish="loadFinish" :disabled="disabled" :data="button" @listenButtonEvent="handleMoreClient" style="margin-bottom: 0.4rem;"></button-client>
		<router-link to="/client/customer">
			<div style="padding:0 .1rem;position:fixed;bottom:.1rem;width:100%;">
				 <button class="btn" style="background:#ff4444">添加客户</button>
			</div>
		</router-link>

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
					}
				},
				page: 0,
				rows: 10,
				searchInput: '',
				/*clientChoose: [{
						id: '123',
						orgName: '老孙修理厂',
						clientCode: '10001',
						contacts: '孙老板',
						contactsTel: '11111111',
						address: 'sssssss'
					}, {
						id: '234',
						orgName: '老32孙修理厂',
						clientCode: '10001',
						contacts: '孙3r老f板',
						contactsTel: '222222',
						address: 'ddddddd'
					}]*/ //返回的我的客户列表
			}
		},
		watch: {
			//监听分页按钮是否出现，确定样式
			'loadFinish.isShowButton': {
				handler: function(newVal) {
					if (newVal) {
						document.getElementsByClassName("showHide")[0].style.height = 0;
					} else {
						document.getElementsByClassName("showHide")[0].style.height = "0.38rem";
					}
				},
				deep: true
			}
		},
		created() {
			this.$store.dispatch('changeTip', {
				isTip: true,
				txt: '加载中...',
				loading: true
			})
			this.handleMoreClient();
		},
		computed: mapState({
			loadFinish: state => state.loadFinish,
			disabled: state => state.disabled,
			openid: state => state.openid,
			clientChoose: state => state.clientChoose
		}),
		methods: {
			//搜索按钮点击事件
			searBtn: function() {
				if (this.searchInput != '') {
					this.$store.dispatch('changeTip', {
						txt: '加载中...',
						isTip: true
					});
					const page = this.page,
						rows = this.rows,
						condition = this.searchInput;
					this.$store.dispatch('setClientChoose', {
						page, rows, condition, status: 0, openid: this.openid
					})
				} else {
					this.$store.dispatch('clear_arr', 'clientChoose');
				}
			},
			handleMoreClient() {
				this.page += 1;
				this.$store.dispatch('changeTip', {
					txt: '加载中...',
					isTip: true
				});
				const page = this.page,
					rows = this.rows,
					condition = this.searchInput;
				this.$store.dispatch('setClientChoose', {
					page, rows, condition, status: 0, openid: this.openid
				});
			},
			//从我的客户选择收货方
			chooseClient: function(e) {
				var infoArr = e.currentTarget.parentNode.parentNode;
				console.log(infoArr);
				//进行跳转
				this.$router.push({
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
			//删除客户
			deleClient: function(e) {
				var deleArr = e.currentTarget.parentNode.parentNode.parentNode.getElementsByClassName("topDisId")[0];
				Ajax('/wechat/order/relation/delete', {
					openid: this.openid,
					receUserId: deleArr.innerHTML
				}, (data) => {
					if (data.code == 0) {
						console.log("删除成功");
						//重新加载
						const page = this.page,
							rows = this.rows,
							condition = this.searchInput;
						this.$store.dispatch('setClientChoose', {
							page, rows, condition, status: 0, openid: this.openid
						});
					} else if (data.code == 1) {
						this.$store.dispatch('changeTip', {
							isTip: true,
							txt: data.message
						})
						setTimeout(() => {
							this.$store.dispatch('changeTip', {
								isTip: false,
								txt: ''
							});
						}, 2000)
					} else {
						this.$store.dispatch('changeTip', {
							isTip: true,
							txt: data.message
						})
						setTimeout(() => {
							this.$store.dispatch('changeTip', {
								isTip: false,
								txt: ''
							});
						}, 2000)
					}
				})
			},
			//清除搜索框
			clearSearch: function() {
				this.searchInput = '';
			}
		}
	}
</script>
