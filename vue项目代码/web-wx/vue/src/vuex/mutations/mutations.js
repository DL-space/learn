import {Ajax}from '@/assets/Util';
import {Toast} from 'mint-ui'
const mutations={
  //初始化 state
  INIT_STORE(state, data={}) {
    var loadFinish={txt:'',isShowButton:false};
    state.loadFinish=data.loadFinish?data.loadFinish:loadFinish;
    state.orderList = data.orderList?data.orderList:[];
    state.disabled=data.disabled?data.disabled:false;
  },
  //账户信息
  SET_ACCOUNT_INFO(state, data) {
    state.accountInfo = data;
  },
  //改变加载完成按钮文字
  CHANGE_LOAD_FINISH(state, obj) {
    state.loadFinish = obj;
  },
  SETAPPID(state,id){
    state.appid=id;
  },
  //改变提示信息
  CHANGE_TIP(state, tip) {
    state.tip = tip;
    if (tip.time && tip.time > 0) {
      state.disabled = true;
      setTimeout(() => {
        state.disabled = false;
        state.tip = {
          isTip: false,
          txt: '',
          loading: false,
          time: 0
        };
        if (tip.cb) tip.cb();
      }, tip.time)
    }
    state.tip = tip;
  },
  //设置确认框
  SET_CONFIRM(state,confirm){
    state.confirm = confirm;
  },
  //写入openid
  SET_OPENID(state, openid) {
    state.openid = openid;
  },
  /**
   获取统计发货单数据列表
   data obj
   openid	String	标识
   type	int	1获取为收货方的 2获取为发货放的
   status	int	订单状态 （非必填）
   search	String	查询字段 （非必填）
   **/
  SET_ORDER_LIST(state, data) {
    const page = data.page,rows=data.rows;
    state.disabled = true;
    state.loadFinish.isShowButton=false;
    state.tip = {
      txt: '加载中...',
      isTip: true,
      loading: true
    };
    Ajax('/wechat/getWeChatOrderList', data, function(data) {
      state.disabled = false;
      if (data.result) {
        state.tip = {
          isTip: false,
          txt: '',
          loading: true,
          time: 0
        };
        if (page > 1) {
          state.orderList = state.orderList.concat(data.data.list);
        } else {
          state.orderList = data.data.list;
        }
        if(data.data.list.length==rows){
          state.loadFinish = {
            txt: '加载更多',
            isShowButton: true
          };
        }
        if (data.data.totalCount <= state.orderList.length) {
          state.loadFinish = {
            txt: '没有了',
            isShowButton: false
          };
          state.disabled = true;
        }
      }
    })
  },


		/**
		 获取统计未收到代收货款
		 data obj
		 openid	String	标识
		 type	int	1获取为收货方的 2获取为发货放的
		 status	int	订单状态 （非必填）
		 search	String	查询字段 （非必填）
		 **/
		SET_RECEIVED_LIST(state, data) {
			const page = data.page;
			state.disabled = true;
			state.loadFinish = {
				txt: '',
				isShowButton: true
			};
			state.tip = {
				txt: '加载中...',
				isTip: true,
				loading: true
			};
			Ajax('/wechat/fina/stat/noreceived/goods/payment/list', data, function(data) {
				state.disabled = false;
				if (data.result) {
					state.tip = {
						isTip: false,
						txt: '',
						loading: true,
						time: 0
					};
					state.receivedInfo = data.data;
					if (page > 1) {
						state.orderList = state.orderList.concat(data.data.noPayOrderList);
					} else {
						state.orderList = data.data.noPayOrderList;
					}
					if (data.data.total <= state.orderList.length) {
						state.loadFinish = {
							txt: '没有了',
							isShowButton: false
						};
						state.disabled = true;
					}
				}
			})
		},

		/**
		获取统计我付的货款
		data obj
		openid	String	标识
		type	int	1获取为收货方的 2获取为发货放的
		status	int	订单状态 （非必填）
		search	String	查询字段 （非必填）
		**/
		SET_MYPAYGOODS_LIST(state, data) {
			const page = data.page;
			state.disabled = true;
			state.loadFinish = {
				txt: '',
				isShowButton: true
			};
			state.tip = {
				txt: '加载中...',
				isTip: true,
				loading: true
			};
			Ajax('/wechat/fina/stat/mypay/goods/payment/list', data, function(data) {
				state.disabled = false;
				if (data.result) {
					state.tip = {
						isTip: false,
						txt: '',
						loading: true,
						time: 0
					};
					state.receivedInfo = data.data;
					if (page > 1) {
						state.orderList = state.orderList.concat(data.data.orderList);
					} else {
						state.orderList = data.data.orderList;
					}
					if (data.data.total <= state.orderList.length) {
						state.loadFinish = {
							txt: '没有了',
							isShowButton: false
						};
						state.disabled = true;
					}
				}
			})
		},
		/**
		 获取统计我付的运费
		 data obj
		 openid	String	标识
		 type	int	1获取为收货方的 2获取为发货放的
		 status	int	订单状态 （非必填）
		 search	String	查询字段 （非必填）
		 **/
		SET_MYPAYFREIGHT_LIST(state, data) {
			const page = data.page;
			state.disabled = true;
			state.loadFinish = {
				txt: '',
				isShowButton: true
			};
			state.tip = {
				txt: '加载中...',
				isTip: true,
				loading: true
			};
			Ajax('/wechat/fina/stat/mypay/carriage/payment/list', data, function(data) {
				state.disabled = false;
				if (data.result) {
					state.tip = {
						isTip: false,
						txt: '',
						loading: true,
						time: 0
					};
					state.receivedInfo = data.data;
					if (page > 1) {
						state.orderList = state.orderList.concat(data.data.orderList);
					} else {
						state.orderList = data.data.orderList;
					}
					if (data.data.total <= state.orderList.length) {
						state.loadFinish = {
							txt: '没有了',
							isShowButton: false
						};
						state.disabled = true;
					}
				}
			})
		},


		/**
		 获取已收到代收货款列表
		 data obj
		 openid	String	标识
		 type	int	1获取为收货方的 2获取为发货放的
		 status	int	订单状态 （非必填）
		 search	String	查询字段 （非必填）
		 **/
		SET_RECEIVEDS_LIST(state, data) {
			const page = data.page;
			state.disabled = true;
			state.loadFinish = {
				txt: '',
				isShowButton: true
			};
			state.tip = {
				txt: '加载中...',
				isTip: true,
				loading: true
			};
			Ajax('/wechat/fina/stat/received/goods/payment/list', data, function(data) {
				state.disabled = false;
				if (data.result) {
					state.tip = {
						isTip: false,
						txt: '',
						loading: true,
						time: 0
					};
					state.receivedInfo = data.data;
					if (page > 1) {
						state.orderList = state.orderList.concat(data.data.paymentList);
					} else {
						state.orderList = data.data.paymentList;
					}
					console.log(state.orderList);
					if (data.data.total <= state.orderList.length) {
						state.loadFinish = {
							txt: '没有了',
							isShowButton: false
						};
						state.disabled = true;
					}
				}
			})
		},



		/**
		 获取业务员下面的我的客户客户列表
		 data
		 searchText 搜索关键字 （非必填）
		 page (必填)
		 rows （必填）
		 **/
		SET_MY_CLIENT_LIST(state, data) {
			const {page,type} = data;
			state.disabled = true;

			Ajax('/api/saler/customer/myself/query', data, function(data) {
				state.disabled = false;
				if (data.result) {
					state.tip = {
						isTip: false,
						txt: '',
						loading: false,
						time: 0
					};

          state.clientList[type].total=data.data.total;
					if (page > 1) {
						state.clientList[type].list = state.clientList[type].list.concat(data.data.list);
					} else {
						state.clientList[type].list = data.data.list;
					}
          if(state.clientList[type].list.length < data.data.total){
            state.clientList[type].isMore = true;
          }
          else {
            state.clientList[type].isMore = false;
          }
				}
        else {

        }
			})
		},
		/*
		 *获取客户列表
		 * */
		SET_CLIENT_CHOOSE(state, data) {
			const rows = data.rows,
				page = data.page;
			state.disabled = true;
			state.loadFinish = {
				txt: '',
				isShowButton: true
			};
			Ajax('/wechat/order/customer/select/list', data, function(data) {
				state.disabled = false;
				if (data.result) {
					state.disabled = false;
					state.tip = {
						isTip: false,
						txt: '',
						loading: false,
						time: 0
					};
					if (page > 1) {
						state.clientChoose = state.clientChoose.concat(data.data.list);
					} else {
						state.clientChoose = data.data.list;
					}
					if (data.data.total <= state.clientChoose.length) {
						state.loadFinish = {
							txt: '没有了',
							isShowButton: false
						};
						state.disabled = true;
					}
				}
			})
		},
    // 获取我创建的客户列表
    SET_CREATE_ClIENT(state,{page,list,total}){

      // console.log(data)
      state.searchClient.total=total;
      if(page==1){
         state.searchClient.list = list;
      }
      else {
        state.searchClient.list=state.searchClient.list.concat(list);

      }

      if(state.searchClient.list.length < total){
        state.searchClient.isMore = true;
      }
      else {
        state.searchClient.isMore = false;
      }
      // let page=data.page;
      // Ajax('/api/saler/customer/myself/query',data,data=>{
      //     // console.log(data)
      //     state.tip = {
      //       isTip: false,
      //       txt: '',
      //       loading: false,
      //     };
      //     if(data.result){
      //
      //       let d=data.data;
      //       state.searchClient.total=d.total;
      //       if (page > 1) {
      //         state.searchClient.list = state.searchClient.list.concat(d.list);
      //
  		// 			} else {
  		// 				state.searchClient.list = d.list;
  		// 			}
      //       if(state.searchClient.list.length < d.total){
      //         state.searchClient.isMore = true;
      //       }
      //       else {
      //         state.searchClient.isMore = false;
      //       }
      //     }
      //     else {
      //       // state.tip = {
      //       //   isTip: true,
      //       //   txt: data.message,
      //       //   loading: false,
      //       //   time: 1
      //       // };
      //     }
      // },(err)=>{
      //     // console.log(err)
      //     state.tip = {
      //       isTip: false,
      //       txt: '',
      //       loading: false,
      //     };
      //     // Toast('服务故障，请稍后重试')
      // })
    },
		/*清除对象*/
		CLEAR_OBJ(state, key) {
			state[key] = {};
		},
		/*清除数组*/
		CLEAR_ARRAY(state, key) {
			state[key] = [];
		},
		/**
		 获取业务员下面的我的客户客户列表
		 data
		 searchText 搜索关键字 （非必填）
		 page (必填)
		 rows （必填）
		 **/
		SET_CITY_CLIENT_LIST(state, data) {
			const {page,type} = data;
			state.disabled = true;
			state.loadFinish = {
				txt: '',
				isShowButton: false
			};
			Ajax('/api/saler/customer/other/query', data, function(data) {
				state.disabled = false;
				if (data.result) {
					state.disabled = false;
					state.tip = {
						isTip: false,
						txt: '',
						loading: true,
						time: 0
					};

          state.clientList[type].total=data.data.total;
					if (page > 1) {
						state.clientList[type].list = state.clientList[type].list.concat(data.data.list);
					} else {
						state.clientList[type].list = data.data.list;
					}
          if(state.clientList[type].list.length < data.data.total){
            state.clientList[type].isMore = true;
          }
          else {
            state.clientList[type].isMore = false;
          }
				}
			})
		},
		/*设置客户名称*／
		 用于业务员操作客户使用
		 */
		SET_CLIENT_NAME(state, clientName) {
			state.clientName = clientName;
		},
		//初始化 clientInfo
		SET_CLIENT_INFO(state, data) {
			state.clientInfo = data || {};
		},
		/*统计----月结运费*/
		SET_MONTH_STATE(state, data) {
			const rows = data.rows,
				page = data.page;
			state.disabled = true;
			Ajax('/wechat/fina/stat/monthlypay/carriage/list', data, function(data) {
				state.disabled = false;
				if (data.result) {
					//设置外层对象
					state.monthStateList.compactStartTime = data.data.compactStartTime;
					state.monthStateList.compactEndTime = data.data.compactEndTime;
					state.monthStateList.compactClearTime = data.data.compactClearTime;
					state.disabled = false;
					state.tip = {
						isTip: false,
						txt: '',
						loading: true,
						time: 0
					};
					if (page > 1) {
						state.monthStateList.finaDayClearMapList = state.monthStateList.finaDayClearMapList.concat(data.data.finaDayClearMapList);

					} else {
						state.monthStateList.finaDayClearMapList = data.data.finaDayClearMapList;
					}
					if (data.data.totalCount <= state.monthStateList.finaDayClearMapList.length) {
						state.loadFinish = {
							txt: '没有了',
							isShowButton: false
						};
						state.disabled = true;
					}
				}
			})
		},
		/*判断分页条目pageFlag*/
		PAGE_FLAG(state, data) {
			const rows = data.rows,
				page = data.page;
			state.disabled = true;
			Ajax('/wechat/fina/stat/monthlypay/carriage/list', data, function(data) {
				console.log(data);
				state.disabled = false;
				if (data.result) {
					state.disabled = false;
					state.tip = {
						isTip: false,
						txt: '',
						loading: true,
						time: 0
					};
					if (page <= 1) {
						state.pageFlag = data.data.finaDayClearMapList.length;

					}
				}
			})
		},
		/*保存新建发货单的信息*/
		SAVE_INFO(state, data) {
			state.saveInfo = data;

		},
		SET_MONTH_LIST(state, data) {
			//	state.monthList = data;
			const page = data.page;
			state.disabled = true;
			state.loadFinish = {
				txt: '',
				isShowButton: true
			};
			Ajax('/wechat/fina/stat/monthlypay/carriage/payorno/list', data, function(data) {
				state.disabled = false;
				if (data.result) {
					state.disabled = false;
					state.tip = {
						isTip: false,
						txt: '',
						loading: true,
						time: 0
					};
					state.monthList = data.data.statistics;
					if (page > 1) {
						state.monthList.infoList = state.monthList.infoList.concat(data.data.orderInfo.orderList);
					} else {
						state.monthList.infoList = data.data.orderInfo.orderList;
					}
					if (data.data.orderInfo.totalCount <= state.monthList.infoList.length) {
						state.loadFinish = {
							txt: '没有了',
							isShowButton: false
						};
						state.disabled = true;
					}
				}
			})
		},
		//设置防止重复提交新建发货单的标志
		SET_REPEAT_FLAG(state, repeatFlag) {
			state.repeatFlag = repeatFlag;
		},

	/*清除部分新建发货单的信息*/
	CLEAR_SAVE_INFO(state, key) {
		state[key].recieveMoney = '';
		state[key].orderMoney = '';
		state[key].goodNameFir = '配件';
		state[key].goodNumFir = '1';
		state[key].colorFlag = 0;
		state[key].goodNameSec = '';
		state[key].goodNumSec = '';
	},
  SET_LNGLAT(state,lnglat){
    state.lnglat=lnglat;
    if(lnglat.cb)lnglat.cb();
  },
  // 获取驿站申请状态
  SET_POST_APPLY_STATE(state,{data}){

            state.postApplyState.status=data.status;
            state.postApplyState.content=data.content;
            state.postApplyState.orgId=data.orgId;

  },
  //设置业务员权限
  SET_CLERK_PERMISSION(state,clerkPermission){
    state.clerkPermission=clerkPermission;
  },
  setAllCompanyList(state,data){
    state.allCompanyList=data;

  },
  setAllStation(state,data){

    state.allStation[data.id]=data.list

  },
  setHomePermission(state,data){
    let tabs=[
      {
        icon:"icon-add",
        name:"新增客户",
        path:"addTmpClient",
        key:'customerAdd',
      },
      {
        icon:"icon-my",
        name:"我的客户",
        path:"listClient",
        key:'customerMine'
      },
      {
        icon:"icon-search-client",
        name:"创建客户查询",
        path:"searchClient",
        key:'customerQuery'
      }
    ];

    let getPer=(obj,k)=>{
       if(obj[k] && obj[k].view) return true;
    };
    let home = data.permissionMap;

    state.homePermission.tabs=tabs.filter((v,i)=>getPer(home,v.key));
    state.homePermission.userInfo=data.userInfo;
  },
  setOrderPickList(state,{total,list,page,totalAmount,orderIds}){

    if(page==1) state.orderPickList.list = list
    else state.orderPickList.list=state.orderPickList.list.concat(list)
    state.orderPickList.totalAmount=totalAmount
    state.orderPickList.orderIds=orderIds
    if(state.orderPickList.list.length < total) state.orderPickList.isMore = true;
    else state.orderPickList.isMore = false;
  },
  setAccountRecordList(state,{total,list,page}){
    if(page==1) state.accountRecordList.list = list;
    else state.accountRecordList.list=state.accountRecordList.list.concat(list);
    if(state.accountRecordList.list.length < total)state.accountRecordList.isMore = true;
    else state.accountRecordList.isMore = false;
  },
  setAccountBank(state,data){
    let {bankNum,reservedTel} = data;
    if(bankNum) data.bankNum = getSubstring(bankNum,bankNum.length-4,bankNum.length);
    if(reservedTel) data.reservedTel = getSubstring(reservedTel,reservedTel.length-4,reservedTel.length);

    state.accountBank=data;
  }
};


function getSubstring(v,s,e){
  if(!v && typeof v == 'string') return;
  let ev = v.substring(s,e),
      xin = '';
  for(let i=0;i<s;i++){
     xin+='*';
  }
  return xin+ev
}
export default mutations;
