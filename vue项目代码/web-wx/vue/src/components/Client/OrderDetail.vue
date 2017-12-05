<style lang="css" scoped>
	.get-cash-btn{
		text-align: center;
		position: fixed;
		width: 100%;
		bottom:.1rem;
		padding: 0 .1rem;
	}
	.cash-btn{
		width: 100%;
		height: .4rem;
		background: #3caaff;
		border: none;
		color:#fff;
		border-radius: .04rem;
	}
	.up-send-btn{
		padding: .02rem .1rem;
		background: #3caaff;
		border-radius: .04rem;
		border: none;
		color:#fff;
		font-size: 14px;
		margin-left: .1rem;
	}

</style>

<template>
	<div class="detail" ref="detail" :style="{'padding-bottom':isCash?'.6rem':''}">
		<div class="top">
			<tab-client :data="menus" @handleTab="handleTab"></tab-client>
		</div>
		<div class="boxTabs">
			<div class="box" style="display:block" v-if="infos.mainInfo">
				<div class="main-info">
					<div class="row first-row">
						<div :class="'status status'+infos.mainInfo.status" v-if="infos.mainInfo.status!=10">{{infos.mainInfo.statusName}}</div>
						发货单号：{{infos.mainInfo.orderNo}}
					</div>
					<div class="row first-row">
						发货日期：{{infos.mainInfo.orderDate}}
            <div :class="'status status'+infos.mainInfo.status" v-if="infos.mainInfo.status==10" @click="cancelSn(infos.mainInfo.orderNo)">
              取消
            </div>
					</div>
          <template v-if="infos.mainInfo.status!=10">
            <div class="row">
              线路：{{infos.mainInfo.line}}
            </div>
            <div class="row">
              班次：{{infos.mainInfo.classes}}
            </div>
          </template>
					<div class="row" v-if="infos.mainInfo.vehicleDispatchDate">
						派车时间：{{infos.mainInfo.vehicleDispatchDate}}
					</div>
					<div v-if="infos.mainInfo.driver" class="row second-row">
						配送员：{{infos.mainInfo.driver}}
						<span class="blue">{{infos.mainInfo.phone}}</span>
						<div class="count">
							<a :href="'tel:'+infos.mainInfo.phone" class="phone"></a>
						</div>
					</div>
					<!-- <div class="row" >
						配送方式：{{infos.mainInfo.vehicleDispatchDate}}<button class="up-send-btn" @click="applyHouse">申请上门</button>
					</div> -->
				</div>
				<div class="person-info" style="margin-top:.1rem">
					<div class="directive from">发</div>
					<div class="row">
						发货方：{{infos.personInfo.from.client}}
					</div>
					<div class="row second-row">
						电话：{{infos.personInfo.from.phone}}
						<div class="count">
							<a :href="'tel:'+infos.personInfo.from.phone" class="phone"></a>
						</div>
					</div>
					<div class="row">
						地址：{{infos.personInfo.from.address}}
					</div>
				</div>
				<div class="person-info" style="border-top:.01rem solid #ebecef">
					<div class="directive to">收</div>
					<div class="row">
						收货方：{{infos.personInfo.to.client}}
					</div>
					<div class="row second-row">
						电话：{{infos.personInfo.to.phone}}
						<div class="count">
							<a :href="'tel:'+infos.personInfo.to.phone" class="phone"></a>
						</div>
					</div>
					<div class="row">
						地址：{{infos.personInfo.to.address}}
					</div>
				</div>
				<div class="goods-info" style="margin-top:.1rem">
					<div class="title">商品信息</div>
					<div class="table bg-grey">
						<table width="100%">
							<thead>
								<tr>
									<th width="30%">序号</th>
									<th width="50%" style="text-align:left">商品名称</th>
									<th width="20%">数量</th>
								</tr>
							</thead>
							<tbody id="orderItemPoList">
								<tr v-for="(v,i) of infos.goodsInfo.goods" :key="i">
									<td>
										{{i + 1}}
									</td>
									<td style="text-align:left">
										{{v.goodsName}}
									</td>
									<td>
										{{v.quantity}}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="table">
						<div class="row">
							<span>代收货款：¥{{infos.goodsInfo.collectionDelivery}}</span>&#12288;&#12288;
              <span v-if="type==''||(type==2&&infos.goodsInfo.freightPayer=='发货方')||(type==1&&infos.goodsInfo.freightPayer=='收货方')">运费：¥{{infos.goodsInfo.freightCharge}}</span>
						</div>
						<div class="row">
							运费付款方：{{infos.goodsInfo.freightPayer}}
						</div>
						<!-- <div class="row">
							发件方式：{{infos.goodsInfo.freightPayer}} <button class="up-send-btn" @click="upSendBtn">修改</button>
						</div> -->
						<div v-if="infos.goodsInfo.remark" class="row">
							配送备注：{{infos.goodsInfo.remark}}
						</div>
					</div>
				</div>
				<div v-if="infos.accountInfo.length>0" class="account-info" style="margin-top:.1rem">
					<div class="title">
						平账信息
					</div>
					<div v-for="(v,i) of infos.accountInfo" :key="i">
						<div class="table bg-grey">
							<div class="row">
								平账金额：¥{{v.bmoney}}
							</div>
							<div class="row">
								平账类型：{{v.btype == 2 ? '代收款多收' : '代收款少收'}}
							</div>
							<div class="row">
								备注：{{v.balancingRemark}}
							</div>
							<div class="row">
								时间：{{v.createTime}}
							</div>
						</div>
						<div class="money">
							代收货款：
							<span class="red">¥{{infos.goodsInfo.collectionDelivery + v.money}}</span>
						</div>
					</div>
				</div>
				<div class="station-info" style="border-top:.01rem solid #ebecef">
					<div class="row">
						服务站地址：{{infos.stationInfo.address}}
					</div>
					<div v-if="infos.stationInfo.phone" className="row">
						服务站电话：{{infos.stationInfo.phone}}
					</div>
				</div>
			</div>
			<div class="box">
				<map-component  :data="lbsMap"></map-component>
				<div class="log-wrap">
					<div class="log-title">
						本数据由<span class="blue">车服物流</span>提供
					</div>
					<div class="log-list-wrap">
						<div class="log-list">
							<div v-for="(v,i) of orderLogs" :style="i==0?'border:none':''" :class="i==0?'item blue':'item'" :key="i">
								{{v.content}}
								<br /> {{v.createTime}}
								<div :class="i==0?'mark focus':'mark'"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="get-cash-btn" v-if="isCash">
				<button class="cash-btn" @click="getCash({amount:$route.query.cash})">立即提现</button>
				<get-cash-model ref="getCashMedel" :isShow="isPassWord" :cash="nowCash" :fee="fee" :orderIds="getCashOrderCodes" :phone="bankPhone" :closeFn="()=>{isPassWord=false}" :buttons="getCashBtns" />
			</div>

			<!-- <button class="openDevice">打开设备</button> -->
		</div>
    <confirm-component :data="confirm" v-if="isConfirm" @handleCancel="handleCancel" @handleConfirm="handleConfirm"></confirm-component>
	</div>
</template>
<script>
	import {
		TabClient
	}
	from '@/components/Common/Tab'
	import MapComponent from '@/components/Common/MapComponent'
	import getCashModel from '@/components/Common/Tip/alert/getCashModel'

  import {ConfirmComponent} from '@/components/Common/Tip'
	import {
		Ajax,Axios
	}
	from '@/assets/Util'
	import {
		mapState,
		mapGetters
	}
	from 'vuex'
	import { Toast } from 'mint-ui'
	export default {
		components: {
			TabClient, MapComponent,ConfirmComponent,getCashModel
		},
		data() {
			let that = this;
			return {
        type:this.$route.query.type?this.$route.query.type:'',
        orderSn:'',
        isConfirm:false,
        confirm:{
          txt:'是否取消该笔订单？'
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
				isCash:this.$route.query.c?true:false,
				isPassWord:false,
				fee:'',
				bankPhone:'',
				nowCash:'',
				getCashOrderCodes:[],
				getCashBtns:[
	        {name:'取消',type:'1',fn(){
	            that.isPassWord=false
	        }},
	        {name:'确认提现',type:'2',fn(){

	            that.$refs.getCashMedel.getCash()
	        }}
	      ],
			}
		},
		computed:{
			...mapGetters([
				'openid'
			])
		},
		created() {
      // console.log(111111)
			// let _this = this;
			//
			// this.$wxConfig().then(wx=>{
			// 	wx.ready(function(){
			// 		wx.invoke('openWXDeviceLib',{brandUserName:'gh_4d74376e7bfc'},function(res){
			// 	    console.log(res);
			//
			// 			if(res.bluetoothState=='off'){
			// 	       _this.$Alert({
			// 	         title:'温馨提示',
			// 	         content:'请打开手机蓝牙'
			// 	       });
			// 			}
			// 			else if(res.bluetoothState=='on'){
			// 				if(res.err_msg=='openWXDeviceLib:fail') return Toast('未知原因，微信设备初始化失败');
			//
			// 				wx.invoke('getWXDeviceInfos', {}, function(res) {
			// 				    console.log('getWXDeviceInfos',res);
			// 				});
			// 			}
		  //     });
			// 	})
			//
			//
			//
			// }).catch(err=>{
			// 	console.log(err);
			// })
			Ajax('/wechat/getDispatchBillInfo', {
				sn: this.$route.query.sn
			}, (data) => {
				if (data.result) {
					let money = 0,
						orderInfos = data.data.dispatchBillVo,
						goodsInfos = data.data.orderItemPoList,
						dispatchInfos = data.data.vehicleDispatchInfoPo,
						accountInfo = data.data.balancingPos,
						arr = orderInfos.frequencyAndroute ? orderInfos.frequencyAndroute.split('-') : [],
            end=arr.pop();
					accountInfo.map(v => {
						money += v.bmoney;
						v.money = money;
					});
					this.infos = {
						mainInfo: {
							orderNo: orderInfos.numbers,
							orderDate: orderInfos.createTime,
							vehicleDispatchDate: dispatchInfos.departureTime,
							line: arr.join('-'),
							classes: end,
							driver: dispatchInfos.driverName,
							phone: dispatchInfos.phone,
							status: orderInfos.receivingStatus,
							statusName: orderInfos.receivingStatusName
						},
						personInfo: {
							to: {
								client: orderInfos.toClientName,
								phone: orderInfos.toContactNumber,
								address: orderInfos.toContactAddress
							},
							from: {
								client: orderInfos.fromClientName,
								phone: orderInfos.fromContactNumber,
								address: orderInfos.fromContactAddress
							}
						},
						goodsInfo: {
							goods: goodsInfos,
							remark: orderInfos.remark,
							collectionDelivery: orderInfos.collectionDelivery,
							freightCharge: orderInfos.freightCharge,
							freightPayer: orderInfos.freightPayer == 1 ? '发货方' : '收货方'
						},
						accountInfo: accountInfo,
						stationInfo: {
							address: data.data.stationAddress,
							phone: data.data.stationTel
						}
					};
				}
			});
			Ajax('/wechat/orderInfoLog', {
				sn: this.$route.query.sn
			}, (data) => {
				if (data.result) {
					this.orderLogs = data.data.orderExpressLogs;
					this.lbsMap = data.data.lbsMap;
				}
			});
		},
		methods: {
			applyHouse(){
				let _this = this;
				 this.$Alert({
					 title:'申请上门',
					 content:'需增加运费：5元',
					 buttons:[
						 {name:'取消',type:'1',fn(){
								 _this.$Alert(1)
						 }},
						 {name:'确定',type:'2',fn(){
								_this.$Alert(1);

						 }}
					 ]
				 });
			},
			upSendBtn(){
				let _this = this;
				 this.$Alert({
					 title:'修改发件方式',
					 buttons:[
						 {name:'送至站点',type:'1',fn(){
								 _this.$Alert(1)
						 }},
						 {name:'司机上门',type:'2',fn(){
								_this.$Alert(1);

						 }}
					 ]
				 });
			},
			getCash(){
				const {cash,orderCode} = this.$route.query;
				// if(!v) this.getCashOrderCodes = this.orderIds;
	      this.getCashOrderCodes[0] = orderCode;
	      Axios('/account/accountapp/getAssetInfo',{openId:this.openid},{api:1}).then(dt=>{
	        if(!dt.result || !dt.code==0) return Toast('查询账户信息出错,请稍后再试');

	        if(dt.data.state==-1) return Toast(dt.data.message)
	        this.bankPhone = dt.data.phoneNumber;
	        this.fee = dt.data.fee;


	        let _this = this;
	         this.$Alert({
	           title:'确认提现',
	           content:'注：每笔运单提现收取手续费'+dt.data.fee+'元',
	           buttons:[
	             {name:'取消',type:'1',fn(){
	                 _this.$Alert(1)
	             }},
	             {name:'确认',type:'2',fn(){
	                _this.$Alert(1);
	                _this.nowCash=cash

	                _this.isPassWord=true;
	             }}
	           ]
	         });
	      }).catch(err=>Toast('提现信息获取失败，请稍后再试'))
	    },
			handleTab(obj) {
        const txt = obj.name;
        this.menus.map((v, i) => {
          if (v.name == txt) {
            v.focus = 1;
            const box = document.querySelectorAll('.box');
            for (let i = 0; i < box.length; i++) {
              box[i].style.display = "none";
            }
            box[i].style.display = "block";
          } else {
            v.focus = 0;
          }
        })
      },
      //取消发货单
      cancelSn(orderId){
        this.orderSn=orderId;
        this.isConfirm=true;
      },
      handleConfirm(){
        //默认请求当前发货方信息
        Ajax('/wechat/order/cancel', {
          orderId: this.orderSn,
          openid: this.openid
        }, (data) => {
          if (data.code == 0) {
          //变化状态
            this.$store.dispatch('changeTip', {
                isTip: true,
                txt: '已取消',
                time:2000,
                cb:()=>{
                  window.history.go(-1);
                }
            })
          }else if (data.code == 1) {
            this.$store.dispatch('changeTip', {
              isTip: true,
              txt: data.message,
              time:2000,
              cb:()=>{
                this.isConfirm=false;
              }
            })
          } else {
            this.$store.dispatch('changeTip', {
              isTip: true,
              txt: data.message,
              time:2000,
              cb:()=>{
                this.isConfirm=false;
              }
            })
          }
        })
      },
      handleCancel(){
        this.isConfirm=false;
      },
		}
	}
</script>
