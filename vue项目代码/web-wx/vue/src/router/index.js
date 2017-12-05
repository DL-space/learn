import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import main from '@/components/main'
import {Download,PickerDownload} from '@/components/Download'
import {Guid,Login,ModifyPassword,UnbindMyself} from '@/components/Account'
import {Client,OrderList,OrderDetail,NewInvoice,ChooseClient,AddCustomers,MyCustomers,WayBill,myAccount,accountRecord,orderPick,cashDetail,makePassword,makePayPassword,findPassword,accountLogin,TimeRun,accountBank,getCashSuccess} from '@/components/Client'
import {StatMenu,MonthlyState,NoSettlement,Settlemented,Received,PaymentGoods,NrcyReceived,PaymentFreight,MsgFeedback} from '@/components/Statistics'
import {HomePage,AddClient,AddTmpClient,Position,Material,Company,SearchClient,AddBankCard,DetailClient,ListClient,Unbind,Forbidden,PostApply,ShopPhoto} from '@/components/Clerk'

import { feedback,serviceArea,delCookie } from '@/components/about'

Vue.use(Router)
//Vue.use(VueResource)


let router = new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      redirect: 'account/guid/1',
      meta:{ tit:'车服云物流' },
      children: [
        { path: 'account/guid/:type', name: 'guid', component: Guid },
        { path: 'account/login/:type', name: 'login', component: Login,meta:{ tit:'登录' }},
        { path: 'account/modifyPassword', name: 'modifyPassword', component: ModifyPassword,meta:{ tit:'修改密码' } },
        { path: 'account/unbind', name: 'unbind2', component: UnbindMyself},
        { path: 'receive', name: 'receive', component: OrderList,meta:{ tit:'收货订单' } },
        { path: 'send', name: 'send', component: OrderList ,meta:{ tit:'发货订单' }},
        { path: 'detail', name: 'orderDetail', component: OrderDetail,meta:{ tit:'订单详情' }},
        { path: 'clerk', name: 'clerk', component: HomePage ,meta:{ tit:'车服云物流' }}, //业务员首页
        { path: 'clerk/add', name: 'addClient', component: AddClient ,meta:{ tit:'客户详情页'}}, //业务员添加客户页
        { path: 'clerk/addTmpClient', name: 'addTmpClient', component: AddTmpClient ,meta:{ tit:'新建客户' }}, //业务员添加临时客户页
        { path: 'clerk/position', name: 'position', component: Position ,meta:{ tit:'地图分布' }}, //客户定位
        { path: 'clerk/addBankCard', name: 'addBankCard', component: AddBankCard,meta:{ tit:'银行账户信息'}}, //业务员添加客户页
        { path: 'clerk/list', name: 'listClient', component: ListClient,meta:{ tit:'我的客户' }}, //我的客户 && 同城客户
        { path: 'clerk/detail', name: 'detailClient', component: DetailClient,meta:{ tit:'客户详情' }},   //客户详情
        { path: 'clerk/unbind', name: 'unbind', component: Unbind,meta:{ tit:'微信解绑' }}, //微信解绑
        { path: 'clerk/forbidden', name: 'forbidden', component: Forbidden,meta:{ tit:'客户禁用' }}, //客户禁用
        { path: 'clerk/searchClient', name: 'searchClient', component: SearchClient,meta:{ tit:'我创建的客户' }},  //我创建的客户
        { path: 'clerk/material', name: 'material', component: Material,meta:{ tit:'业务资料' }}, //业务资料
        { path: 'clerk/company', name: 'company', component: Company,meta:{ tit:'公司信息' }}, //公司信息
        { path: 'clerk/company/postApply', name: 'postApply', component: PostApply,meta:{ tit:'驿站申请' }}, //驿站申请状态查询
        { path: 'clerk/company/shopPhoto', name: 'shopPhoto', component: ShopPhoto,meta:{ tit:'门店照片' }}, //门店照片
        { path: 'client', name: 'client', component: Client,meta:{ tit:'客户首页' }}, //客户首页
        { path: 'invoice', name: 'invoice', component: NewInvoice,meta:{ tit:'新建发货单' }},    //新建发货单
        { path: 'client/choose', name: 'choose', component: ChooseClient,meta:{ tit:'选择用户' }},      //选择用户
        { path: 'client/customer', name: 'customer', component: AddCustomers,meta:{ tit:'添加客户' }},    //添加客户
        { path: 'client/customers', name: 'customers', component: MyCustomers,meta:{ tit:'我的客户' }},     //我的客户
        { path: 'statistics/monstate', name: 'monstate', component: MonthlyState,meta:{ tit:'运费月结' }},  //运费月结
        { path: 'statistics/nosettlement', name: 'nosettlement', component: NoSettlement,meta:{ tit:'运费月结未结算' }},  //运费月结未结算
      	{ path: 'statistics/settlemented', name: 'settlemented', component: Settlemented,meta:{ tit:'运费月结已结算' }},  //运费月结已结算
      	{ path: 'statistics', name: 'statmenu', component: StatMenu,meta:{ tit:'统计' }}, //统计--菜单首页
        { path: 'statistics/received', name: 'received', component: Received,meta:{ tit:'已提取代收货款' }}, //统计-已收到代收货款
        { path: 'statistics/paymentgoods', name: 'paymentgoods', component: PaymentGoods,meta:{ tit:'我付的货款' }}, //统计-我付的货款
        { path: 'statistics/noreceived', name: 'noreceived', component: NrcyReceived,meta:{ tit:'未提取代收货款' }}, //统计-未收到代收货款
        { path: 'statistics/paymentfreight', name: 'paymentfreight', component: PaymentFreight,meta:{ tit:'我付的运费' }}, //统计-我付的运费
        { path: 'statistics/msgfeedback', name: 'msgfeedback', component: MsgFeedback,meta:{ tit:'信息反馈' }}, //统计-信息反馈
        { path: 'download', name: 'download', component: Download,meta:{ tit:'司机助手App下载' }},//司机助手app下载
        { path: 'pickerDownload', name: 'pickerDownload', component: PickerDownload,meta:{ tit:'驿站提货员App下载' }},//驿站提货员App下载
        { path: 'x', name: 'waybill', component: WayBill,meta:{ tit:'扫码后运单信息' }},   //扫码后运单信息
        { path: 'client/myAccount', name: 'myAccount', component: myAccount,meta:{ tit:'我的账户' } },
        { path: 'client/accountRecord', name: 'accountRecord', component: accountRecord,meta:{ tit:'交易记录' } },
        { path: 'client/orderPick', name: 'orderPick', component: orderPick,meta:{ tit:'运单提现' } },
        { path: 'client/cashDetail', name: 'cashDetail', component: cashDetail,meta:{ tit:'提现明细' } },
        { path: 'client/makePassword', name: 'makePassword', component: makePassword,meta:{ tit:'修改登录密码' } },
        { path: 'client/makePayPassword', name: 'makePayPassword', component: makePayPassword,meta:{ tit:'修改支付密码' } },
        { path: 'client/findPassword', name: 'findPassword', component: findPassword,meta:{ tit:'找回密码' } },
        { path: 'client/accountLogin', name: 'accountLogin', component: accountLogin,meta:{ tit:'登陆我的账户' } },
        { path: 'about/feedback', name: 'feedback', component: feedback,meta:{ tit:'意见反馈' } },
        { path: 'about/serviceArea', name: 'serviceArea', component: serviceArea,meta:{ tit:'服务范围' } },
        { path: 'about/delCookie', name: 'delCookie', component: delCookie,meta:{ tit:'删除cookie' } },
        { path: 'client/timeRun', name: 'timeRun', component: TimeRun,meta:{ tit:'班车时刻表' } },
        { path: 'client/accountBank', name: 'accountBank', component: accountBank,meta:{ tit:'银行账户信息' } },
        { path: 'client/getCashSuccess', name: 'getCashSuccess', component: getCashSuccess,meta:{ tit:'提现详情' } },

      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta){
    //  let edit = to.query.canEdit;
    //  if(edit==0 && to.meta.see){
    //    document.title=to.meta.see;
    //    return next();
    //  }

     document.title=to.meta.tit || '车服云物流'
  }

  next();
})


export default router
