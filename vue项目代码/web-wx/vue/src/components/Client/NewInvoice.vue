<template>
	<div class="order_wrap">
		<div class="order">
			<div class="recivePartner">
				<!--收货信息-->
				<h3 class="topTip">收货方信息</h3>
				<input type="text" name="" id="" value="" v-model="clientInfo.id" style="display: none;" />
				<input type="text" name="" id="" value="" v-model="clientInfo.receUserId" style="display: none;" />
				<div class="topTipInfoCus">
					<div class="customer letterCus">
						<span>收货方:</span>
						<p class="cusName">{{clientInfo.orgName}}</p>
						<router-link to="/client/choose" replace><img src="../../../static/images/client/tianjia.png" class="addCusImg" @click="saveInfos" /></router-link>
					</div>
					<!--<img src="" />-->
				</div>
				<div class="topTipInfoCus">
					<div class="customer letter">
						<span>联系电话:</span>
						<p class="cusName">{{clientInfo.phone}}</p>
					</div>
				</div>
				<div class="topTipInfoCus">
					<div class="customer letter">
						<span>联系地址:</span>
						<p class="cusName changeLength">{{clientInfo.address}}</p>
					</div>
				</div>
			</div>
			<!--发货方信息-->
			<div class="recivePartner">
				<h3 class="topTip">发货方信息</h3>
				<input type="text" name="" id="" v-model="shipper.id" style="display: none;" />
				<div class="topTipInfoCus">
					<div class="customer letterCus">
						<span>发货方:</span>
						<p class="cusName">{{shipper.memberOrgName}}</p>
					</div>
					<img src="" />
				</div>
				<div class="topTipInfoCus">
					<div class="customer letter">
						<span>联系电话:</span>
						<p class="cusName">{{shipper.memberTel}}</p>
					</div>
				</div>
				<div class="topTipInfoCus">
					<div class="customer letter">
						<span>联系地址:</span>
						<p class="cusName changeLength">{{shipper.address}}</p>
					</div>
				</div>
			</div>
			<!--货品信息-->
			<div class="recivePartner">
				<h3 class="topTip">货品信息</h3>
				<div class="goodsTable">
					<div class="tableTh">
						<span class="spanName">商品名称</span>
						<span class="spanNum">数量</span>
					</div>
					<div class="tableTh">
						<span class="spanTdName">
      				<input type="text" value="" v-model="saveInfo.goodNameFir"/>
      			</span>
						<span class="spanTdNum">
      				<input type="text" value="" v-model="saveInfo.goodNumFir"/>
      			</span>
					</div>
					<div class="tableTh">
						<span class="spanTdName">
      				<input type="text" value="" v-model="saveInfo.goodNameSec"/>
      			</span>
						<span class="spanTdNum">
      				<input type="text" value="" v-model="saveInfo.goodNumSec"/>
      			</span>
					</div>
				</div>
			</div>
			<!--应收款信息-->
			<div class="recivePartner">
				<h3 class="topTip">应收款信息</h3>
				<div class="topTipInfoCus">
					<div class="customer letter">
						<span>代收货款:</span>
						<input type="text" class="recieveInfo" v-model="saveInfo.recieveMoney" />
					</div>
				</div>
				<div class="topTipInfoCus">
					<div class="customer letter changeLetter">
						<span>运费付款方</span>
						<p class="cusName pCusName">
							<span v-bind:class="{ 'changeFirSpan': redToRed, 'changeSecSpan': redToGray }" v-on:click="changeToFir" style="margin-right: 0.2rem;">收货方</span>
							<!-- <span v-bind:class="{ 'changeFirSpan': gayToRed, 'changeSecSpan': gayToGray }" v-on:click="changeToSec">发货方</span> -->
						</p>
					</div>
				</div>
				<div class="topTipInfoCus">
					<div class="customer letter changeLetter">
						<span>发件方式</span>
						<p class="cusName pCusName">
							<span  style="margin-right:.2rem;" v-for="(v,i) in getGoods" @click="selectGet(v)" :class="v.type==getGood?'changeFirSpan':'changeSecSpan'">{{v.name}}</span>

						</p>
					</div>
				</div>
				<div class="topTipInfoCus">
					<div class="customer letter">
						<span>运费总计:</span>
						<p class="freight">由服务站人员根据货品确认金额</p>
					</div>
				</div>
				<div class="topTipInfoCus">
					<div class="customer letter">
						<span class="tips">备注:</span>
						<input type="text" class="recieveInfo" v-model="saveInfo.orderMoney" />
					</div>
				</div>
			</div>
			<div class="recivePartner">
				<button class="invoiceSub" v-on:click="invoiceSub">提交</button>
				<!--<button-client :data="submitBtn"></button-client>-->
			</div>
		</div>

	</div>
</template>
<script>
	import {
		ButtonClient, InputClient
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
		data() {
				return {
					submitBtn: {
						txt: '登录',
						style: {
							marginTop: '0.3rem'
						}
					},
					shipper: {}, //自动渲染发货方
					goodNameFir: '配件', //货品第一行名称
					goodNumFir: "", //货品第一行数量
					goodNameSec: "", //货品第二行名称
					goodNumSec: "", //货品第二行数量
					recieveMoney: "", //代收货款
					redToRed: true, //按钮变红
					redToGray: false,
					gayToRed: false,
					gayToGray: true,
					orderMoney: '', //备注
					colorFlag: 0, //保存改变的颜色
					str: '', //友情提示
					strs:'',
					getGoods:[
						{type:0,name:'送至站点'},
						{type:1,name:'司机上门'},
					],
					getGood:0
				}
			},
			watch: {
				'repeatFlag': {
					handler: function(newVal) {
						//					console.log(newVal);
					},
					deep: true
				},
        openid(newVal,oldVal){
          this.$store.dispatch('setRepeatFlag', true);
          if (this.saveInfo) {
            switch (this.saveInfo.colorFlag) {
              case 0:
                this.changeToFir();
                break;
              case 1:
                this.changeToSec();
                break;
            }
          }
          this.$store.dispatch('changeTip', {
            isTip: true,
            txt: '加载中...',
            loading: true
          });
          //默认请求当前发货方信息
          Ajax('/wechat/order/store/select', {openid: newVal},(data) => {
            if (data.code == 0) {
              this.shipper = data.data;
              setTimeout(() => {
                this.$store.dispatch('changeTip', {
                  isTip: false,
                  txt: ''
                });
              }, 200)
            } else if (data.code == 1) {
              this.$store.dispatch('changeTip', {
                isTip: true,
                txt: data.message,
                time:2000
              })
            } else {
              this.$store.dispatch('changeTip', {
                isTip: true,
                txt: data.message,
                time:2000
              })
            }
          })
        }
			},
			created() {
				this.$store.dispatch('setRepeatFlag', true);
				if (this.saveInfo) {
					switch (this.saveInfo.colorFlag) {
						case 0:
							this.changeToFir();
							break;
						case 1:
							this.changeToSec();
							break;
					}
				}
				this.$store.dispatch('changeTip', {
					isTip: true,
					txt: '加载中...',
					loading: true
				});
				//默认请求当前发货方信息
				Ajax('/wechat/order/store/select', {openid: this.openid},(data) => {
					if (data.code == 0) {
						this.shipper = data.data;
						setTimeout(() => {
							this.$store.dispatch('changeTip', {
								isTip: false,
								txt: ''
							});
						}, 200)
					} else if (data.code == 1) {
//						this.$store.dispatch('changeTip', {
//							isTip: true,
//							txt: data.message,
//              time:2000
//						})
					} else {
//						this.$store.dispatch('changeTip', {
//							isTip: true,
//							txt: data.message,
//              time:2000
//						})
					}
				})
			},
			computed: mapState({
				openid: state => state.openid,
				clientInfo: state => state.clientInfo,
				saveInfo: state => state.saveInfo,
				repeatFlag: state => state.repeatFlag
			}),
			methods: {
				selectGet(i){
					this.getGood=i.type;
				},
				isNull: function(str) {
					if (typeof str == "undefined") {
						return true;
					} else if (str == null) {
						return true;
					} else if (typeof str == "string" && (str === "" || str === "undefined" || str === "null")) {
						return true;
					} else if (typeof str == "object" && $.isArray(str) && str.length == 0) {
						return true;
					} else if (typeof str == "object" && $.isEmptyObject(str)) {
						return true;
					} else {
						return false;
					}
				},
				com: function(a, b, c, d) {
					var bk = false;
					if (a.length > 0) {
						if (b.length > 0) {
							bk = false;
						} else {
							if (b.length > 0) {
								bk = false;
							} else {
								bk = true;
								this.str = "请填写数量";
							}
						}
					} else {
						if (b.length <= 0) {
							bk = true;
							this.str = "请填写名称";
						} else {
							bk = true;
							this.str = "请填写名称";
						}
					}
					if (bk) {
						//说明第一行为空
						if (!this.isNull(c)) {
							if (!this.isNull(d)) {
								bk = false;
							} else {
								if (this.isNull(d)) {
									bk = true;
								} else {
									bk = false;
								}
							}
						} else {
							if (this.isNull(d)) {
								bk = true;
							} else {
								bk = true;
							}
						}
					}
					if (bk) {}
					if (!bk) {
						return true;
					} else {
						return false;
					}
				},
				comAgain:function(x,y,z,t){
					/*if(!this.isNull(a) && !this.isNull(b) && !this.isNull(a) && !this.isNull(b)){
						return true;
					}else if(!this.isNull(a) && !this.isNull(b) && this.isNull(c) && this.isNull(d)){
						return true;
					}else if(this.isNull(a) && this.isNull(b) && !this.isNull(c) && !this.isNull(d)){
						return true;
					}else if(this.isNull(a) || this.isNull(b)){
						this.strs = '请填写名称 ！'
						return false;
					}else if(this.isNull(c) || this.isNull(d)){
						this.strs = '请填写数量 ！'
						return false;
					}else{
						return false;
					}*/
					var ss ='';
					function firstRow(a,b){
						var bk = false;

					if (a.length > 0) {
						if (b.length > 0) {
							bk = false;
						} else {
							if (b.length > 0) {
								bk = false;
							} else {
								bk = true;
								ss = "请填写数量";
							}
						}
					} else {
						if (b.length <= 0) {
							bk = true;
							ss = "请填写名称";
						} else {
							bk = true;
							ss = "请填写名称";
						}
					}
					if (!bk) {
						return true;
					} else {
						return false;
					}
					}
					if(firstRow(x,y) && firstRow(z,t)){
						return true;
					}else if(firstRow(x,y) && this.isNull(z) && this.isNull(t)){
						return true;
					}else if(firstRow(z,t) && this.isNull(x) && this.isNull(y)){
						return true;
					}else if(!this.isNull(x) && this.isNull(y) && this.isNull(z) && this.isNull(t)){
						this.strs = '请填写数量！';
						return false;
					}else{
						this.strs = ss;
						return false;
					}
				},
				//点击改变付费方，方法太笨!
				changeToFir: function() {
					this.redToRed = true;
					this.redToGray = false;
					this.gayToRed = false;
					this.gayToGray = true;
					this.colorFlag = 0; //0为红色
				},
				changeToSec: function() {
					this.gayToRed = true;
					this.gayToGray = false;
					this.redToRed = false;
					this.redToGray = true;
					this.colorFlag = 1; //0为灰色
				},
				//判断数量
				compare: function(num1, num2) {
					var reg = /^[1-9]\d*$/;
					/*if (!this.isNull(num1) && !this.isNull(num2) && !this.isNull(cont1)) {
						if (reg.test(num1)) {
							return true;
						} else {
							return false;
						}
					} else if (!this.isNull(num1) && !this.isNull(num2) && !this.isNull(cont2)) {
						if (reg.test(num2)) {
							return true;
						} else {
							return false;
						}
					} else if (!this.isNull(num1) && !this.isNull(num2) && !this.isNull(cont2) && !this.isNull(cont2)) {
						if (reg.test(num2) && reg.test(num1)) {
							return true;
						} else {
							return false;
						}
					} else if (!this.isNull(num1) && this.isNull(num2)) {
						if (reg.test(num1)) {
							return true;
						} else {
							return false;
						}
					} else if (this.isNull(num1) && !this.isNull(num2)) {
						if (reg.test(num2)) {
							return true;
						} else {
							return false;
						}
					}*/
					if (!this.isNull(num1) && !this.isNull(num2)) {
						if (reg.test(num1) && reg.test(num2)) {
							return true;
						} else {
							return false;
						}
					}else if(!this.isNull(num1) && this.isNull(num2)){
						if (reg.test(num1)) {
							return true;
						} else {
							return false;
						}
					}else if(!this.isNull(num2) && this.isNull(num1)){
						if (reg.test(num2)) {
							return true;
						} else {
							return false;
						}
					}
				},
				//提交新建的发货单
				invoiceSub: function() {
					if (this.repeatFlag) {
						this.$store.dispatch('setRepeatFlag', false);
						var reciveOrNot = 2;
						var collectionMoney = 0;
						if (this.isNull(this.clientInfo.orgName)) {
							this.$store.dispatch('changeTip', {
								isTip: true,
								txt: '请填写收货方'
							})
							setTimeout(() => {
								this.$store.dispatch('changeTip', {
									isTip: false,
									txt: ''
								});
							}, 2000);
							this.$store.dispatch('setRepeatFlag', true);
						} else if (!this.comAgain(this.saveInfo.goodNameFir, this.saveInfo.goodNumFir, this.saveInfo.goodNameSec, this.saveInfo.goodNumSec)) {
							this.$store.dispatch('changeTip', {
								isTip: true,
								txt: this.strs
							})
							setTimeout(() => {
								this.$store.dispatch('changeTip', {
									isTip: false,
									txt: ''
								});
							}, 2000);
							this.$store.dispatch('setRepeatFlag', true);
						} else if (!this.isNull(this.clientInfo.orgName) && this.comAgain(this.saveInfo.goodNameFir, this.saveInfo.goodNumFir, this.saveInfo.goodNameSec, this.saveInfo.goodNumSec)) {

							//验证正整数
							if (this.compare(this.saveInfo.goodNumFir, this.saveInfo.goodNumSec)) {
								//若代收货款为填写时，传0
								if (this.isNull(this.saveInfo.recieveMoney)) {
									this.saveInfo.recieveMoney = 0;
								}
								var reg = /^[0-9]\d*$/;
								if (reg.test(this.saveInfo.recieveMoney)) {
									//判断发货方还是收货方
									if (this.redToRed == true && this.redToGray == false) {
										reciveOrNot = 2;
									} else {
										reciveOrNot = 1;
									}
									Ajax('/wechat/order/default/add', {
										openid: this.openid,
										pickupWay:this.getGood,
										sendUserId: this.shipper.receUserId,
										receUserId: this.clientInfo.receUserId,
										goodsItem: JSON.stringify([{
											quantity: this.saveInfo.goodNumFir,
											goodsName: this.saveInfo.goodNameFir
										}, {
											quantity: this.saveInfo.goodNumSec,
											goodsName: this.saveInfo.goodNameSec
										}]),
										collectionMoney: this.saveInfo.recieveMoney,
										carriagePayType: reciveOrNot,
										orderMoney: this.saveInfo.orderMoney
									}, (data) => {
										if (data.code == 0) {
											var txt = '提交成功，请尽快把货品送往站点，以免耽误您的配送时效！'
											if(this.getGood) txt = '提交成功，请等待司机上门取货！'
											// this.$store.dispatch('changeTip', {
											// 	isTip: true,
											// 	txt: txt+','+data.message,
                      //   time:20000,
                      //   cb:()=>{
                      //     //清空保存信息，防止重复提交
                      //     this.$store.dispatch('clear_arr', 'clientInfo');
                      //     this.$store.dispatch('clearSaveInfo', 'saveInfo');
                      //     this.$router.push({
                      //       name: 'orderDetail',
                      //       query: {
                      //         sn: data.data.orderSn
                      //       }
                      //     });
                      //   }
											// })

											let _this = this;
								       this.$Alert({
								         title:'重要提示',
								         content:txt+data.message,
								         buttons:[
								           {name:'知道了',type:'0',fn(){
								               _this.$Alert(1);
															 _this.$router.push({
				                             name: 'orderDetail',
				                             query: {
				                               sn: data.data.orderSn
				                             }
				                        });
								           }},

								         ]
								       });
										} else if (data.code == 1) {
											this.$store.dispatch('setRepeatFlag', true);
											this.$store.dispatch('changeTip', {
												isTip: true,
												txt: data.message,
                        time:2000
											})
											this.recieveMoney = '';
										} else {
											this.$store.dispatch('setRepeatFlag', true);
											this.$store.dispatch('changeTip', {
												isTip: true,
												txt: data.message,
                        time:2000
											});
											this.recieveMoney = '';
										}
									})
								} else {
									this.$store.dispatch('setRepeatFlag', true);
									this.$store.dispatch('changeTip', {
										isTip: true,
										txt: '代收货款必须是正整数！',
										time: '1000'
									});
								}
							} else {
								this.$store.dispatch('setRepeatFlag', true);
								this.$store.dispatch('changeTip', {
									isTip: true,
									txt: '商品数量必须是正整数！'
								});
								setTimeout(() => {
									this.$store.dispatch('changeTip', {
										isTip: false,
										txt: ''
									});
								}, 1000)
							}
						}
					}
				},
				//保存信息
				saveInfos: function() {
					const obj = {
						goodNameFir: this.saveInfo.goodNameFir,
						goodNumFir: this.saveInfo.goodNumFir,
						goodNameSec: this.saveInfo.goodNameSec,
						goodNumSec: this.saveInfo.goodNumSec,
						recieveMoney: this.saveInfo.recieveMoney,
						orderMoney: this.saveInfo.orderMoney,
						colorFlag: this.colorFlag
					};
					this.$store.dispatch('setSaveInfo', obj)
				}
			},
			components: {
				ButtonClient
			}
	}
</script>
