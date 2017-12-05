<template>
	<div class="detail" ref="detail">
		<div class="boxTabs" style="border-bottom: none;">
			<div class="box" style="display:block;border-bottom:.01rem solid #ebecef;">
				<div class="main-info" style="padding: 0;">
					<div class="row first-row firstRow">
						<div class="firstRowLeft">
							<span style="width: 20%;">发货单号：</span>
							<span style="font-size: 0.13rem;width: 80%;">{{infos.orderSn}}</span>
						</div>
						<span class="firstRowRight">{{infos.orderStatusStr}}</span>
					</div>
					<div class="row first-row secRow">
						<span class="orderName">货号：</span>
						<span class="orderCode">{{infos.goodsSn}}</span>
					</div>
				</div>
				<div class="person-info" style="border-bottom:.01rem solid #ebecef">
					<div class="directive from">收</div>
					<div class="row">
						<span class="rowLeft rowLeftUpdate">收货方：{{infos.receName}}</span>
						<span class="blodRight rowRightUpdate">客户编号：{{infos.receCode}}</span>
					</div>
					<div class="row second-row">
						电话：{{infos.receTel}}
						<div class="count">
							<a :href="'tel:'+infos.receTel" class="phone"></a>
						</div>
					</div>
					<div class="row" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						地址：{{infos.receAdress}}
					</div>
				</div>
				<div class="person-info" style="border-bottom:.01rem solid #ebecef">
					<div class="directive to" style="background-color: #4e7dd8;">发</div>
					<div class="row">
						<span class="rowLeft rowLeftUpdate">发货方：{{infos.sendName}}</span>
						<span class="blodRight rowRightUpdate">客户编号：{{infos.sendCode}}</span>
					</div>
					<div class="row second-row">
						电话：{{infos.sendTel}}
						<div class="count">
							<a :href="'tel:'+infos.sendTel" class="phone"></a>
						</div>
					</div>
					<div class="row" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
						地址：{{infos.sendAdress}}
					</div>
				</div>
				<div class="first-row secRow">
					备注：{{infos.remark}}
				</div>
				<div class="goods-info" style="margin-top:.1rem;">
					<div class="table bg-grey">
						<table width="100%">
							<thead>
								<tr style="color: #666;">
									<th width="30%" style="font-weight: normal;">代收货款(￥)</th>
									<th width="30%" style="font-weight: normal;">运费(￥)</th>
									<th width="30%" style="font-weight: normal;">合计</th>
								</tr>
							</thead>
							<tbody id="orderItemPoList">
								<tr>
									<td width="30%">
										{{infos.collectionMoney}}
									</td>
									<td width="30%">
										{{infos.carriageMoney}}
									</td>
									<td width="30%">
										{{infos.shouldGetMoney}}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="first-row secRow" style="color: #e64933;height: 0.6rem;" v-if="confirmedTip">
					确认成功，请到提货员处交款签名后提走货物，谢谢！
				</div>
			</div>
		</div>
		<button-client :data="submitBtn" @listenButtonEvent="comfirmSub" v-if="infos.affirmFlag"></button-client>
	</div>
</template>
<script>
	import {
		ButtonClient
	}
	from '@/components/Common/Form'
	import {
		ConfirmComponent
	}
	from '@/components/Common/Tip'
	import {
		Ajax,AjaxApi
	}
	from '@/assets/Util'
	import {
		mapState
	}
	from 'vuex'
	export default {
		components: {
			ConfirmComponent, ButtonClient
		},
		data() {
			return {
				submitBtn: {
					txt: '确认',
					style: {
						marginTop: '0.3rem',
						backgroundColor: '#e64933',
						position: 'fixed',
						bottom: '0'
					}
				},
				type: this.$route.query.type ? this.$route.query.type : '',
				orderSn: '',
				isConfirm: false,
				confirm: {
					txt: '是否取消改笔订单？'
				},
				infos: {},
				menus: [{
					name: '发货单详情',
					focus: 1
				}, {
					name: '查看物流'
				}],
				orderLogs: [],
				lbsMap: {},
				confirmed:true,   //确认按钮的显示与隐藏
				confirmedTip:false,  //确认的友情提示
				id:this.$route.query.id.match(/^(\d+)/)[1]  //请求id
			}
		},
		created() {
			AjaxApi('/logistics/pda/order/query', {
				orderId: this.id,
				type:2
			}, (data) => {
				if (data.result) {
					this.infos = data.data;
				}
			});
		},
		computed: mapState({
			openid: state => state.openid
		}),
		methods: {
			//点击确认按钮
			comfirmSub: function() {
				AjaxApi('/logistics/pda/wechat/scanned/confirm', {
					orderId: this.infos.orderId
				}, (data) => {
					if (data.code == 0) {
						this.$store.dispatch('changeTip', {
							isTip: true,
							txt: '已确认！',
							time:1000
						});
						this.confirmed = false;
						this.confirmedTip = true;
					}else{
						this.$store.dispatch('changeTip', {
							isTip: true,
							txt: '确认失败！',
							time:1000
						})
					}
				})
			}
		}
	}
</script>
