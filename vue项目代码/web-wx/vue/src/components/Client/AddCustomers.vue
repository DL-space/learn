<template>
	<div class="order_wrap">
		<img src="../../../static/images/client/sousuo.png" class="noRes" />
		<div class="serTop">
			<div class="clientSearch">
				<div class="searchLeft">
					<input type="text" placeholder="输入客户编号/客户名称/电话" class="inputOrder" v-model="searchInput" @keyup="searchKeyUp(searchInput)" />
					<i class="clearSearch" v-on:click="clearSearch">X</i>
				</div>
				<input type="button" value="搜索" class="inputBtn" v-on:click="searBtn" />
			</div>
		</div>
		<div class="searchRes">
			<div v-if="clientChoose.length!=0" v-for="searchClient in clientChoose">
				<div style="display: none;" class="idTip">{{searchClient.id}}</div>
				<div class="resTop">
					<img src="../../../static/images/client/xiulichang.png" class="topImg" />
					<p class="topP">{{searchClient.memberOrgName}}</p>
					<button v-bind:class="searchClient.clientClass" value="添加" @click="addClientBtn($event)">{{searchClient.flag}}</button>
					<!-- <input type="button" class="topBtn newBtn" name="" id="" value="添加" @click="addClientBtn($event)" /> -->
				</div>
				<div class="invoice_list">
					<div class="info_bar"><span>客户编号</span>
						<p class="topDisId" style="display: none;">{{searchClient.receUserId}}</p>
						<p>{{searchClient.clientCode}}</p>
						<!--<img class="resImg" src="../../../static/images/client/bohao.png" />-->
					</div>
					<div class="info_bar"><span>联系人:</span>
						<p>{{searchClient.memberName}}</p>
					</div>
					<div class="info_bar"><span>电话:</span>
						<p>{{searchClient.memberTel}}</p>
					</div>
					<div class="info_bar"><span>地址:</span>
						<p>{{searchClient.address}}</p>
					</div>
				</div>
			</div>
			<div class="resClass resClassAgain" v-if="clientChoose.length==0">
				<img src="../../../static/images/client/sousuo.png" alt="" />
				<p class="tipP">请搜索您要添加的客户!</p>
			</div>
			<button-client :loadFinish="loadFinish" :disabled="disabled" :data="button" @listenButtonEvent="handleMoreClient"></button-client>
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
		ButtonClient
	}
	from '@/components/Common/Form'
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
				resExist: '', //搜索结果是否存在
				/*clientChoose: [{
					orgName: '老孙修理厂',
					clientCode: '10001',
					contacts: '孙老板',
					contactsTel: '11111111',
					address: 'sssssss',
					addOrNot: '添加'
				}, {
					orgName: '老32孙修理厂',
					clientCode: '10001',
					contacts: '孙3r老f板',
					contactsTel: '222222',
					address: 'ddddddd',
					addOrNot: '已添加'
				}],*/ //返回的搜索的信息
				searchInput: '', //搜索输入
				page: 1,
				rows: 10,
			}
		},
		watch: {
			'clientChoose': {
				handler: function(newVal) {
					for (var i = 0; i < newVal.length; i++) {
						if (newVal[i].flag == '添加') {
							newVal[i]["clientClass"] = 'topBtn newBtn';
						} else if (newVal[i].flag == '已添加') {
							newVal[i]["clientClass"] = 'topBtn grayBtn';
						}
					}
					if (newVal.length == 0) {
						//隐藏分页按钮
						this.$store.dispatch('changeLoadFinish', {
							txt: '',
							isShowButton: false
						});
					}
				},
				deep: true
			}
		},
		created() {
			//清空对象
			this.$store.dispatch('clear_obj', 'clientChoose');
			this.clientChoose.length = 0;
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
				this.$store.dispatch('clear_arr', 'clientChoose');
				if (this.searchInput != '') {
					this.$store.dispatch('changeTip', {
						txt: '加载中...',
						isTip: true
					});
					const page = this.page,
						rows = this.rows,
						condition = this.searchInput;
					this.$store.dispatch('setClientChoose', {
						page, rows, condition, openid: this.openid, status: 1
					});
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
					page, rows, condition, openid: this.openid, status: 1
				});
			},
			//监听input内容变化
			searchKeyUp: function() {
				//请求搜索结果
				/*Ajax('/wechat/getAllCompany', {}, (data) => {
					//this.clientChoose = data;
				})
				for (var i = 0; i < this.clientChoose.length; i++) {
					if (this.clientChoose[i].addOrNot == '添加') {
						this.clientChoose[i]["clientClass"] = 'topBtn newBtn';
					} else if (this.clientChoose[i].addOrNot == '已添加') {
						this.clientChoose[i]["clientClass"] = 'topBtn grayBtn';
					}
				}*/
			},
			//清除搜索框
			clearSearch: function() {
				this.searchInput = '';
			},
			//input聚焦事件
			/*searchFocus:function(){
				this.searchInput = '';
			}*/
			//添加按钮
			addClientBtn: function(e) {
				var targetBtnPar = e.currentTarget.parentNode.parentNode;
				var targetBtn = e.currentTarget;
				if (targetBtn.value == '添加') {
					//改变按钮样式
					targetBtn.style.backgroundColor = '#c3c3c3';
					targetBtn.style.color = '#fff';
					targetBtn.style.border = '.005rem solid #c3c3c3';
					targetBtn.value = '已添加';
					//进行后台请求
					Ajax('/wechat/order/relation/add', {
						openid: this.openid,
						receUserId: targetBtnPar.getElementsByClassName("topDisId")[0].innerHTML
					}, (data) => {
						if (data.code == 0) {
							this.$store.dispatch('changeTip', {
								isTip: true,
								txt: '添加成功',
								loading: false
							});
							setTimeout(() => {
								this.$store.dispatch('changeTip', {
									isTip: false,
									txt: ''
								});
							}, 3000)
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
				}
			}
		}
	}
</script>
