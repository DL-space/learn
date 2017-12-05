const state={
  openid: '',
  appid:'',
  tip: {
    isTip: false,
    txt: '',
    loading: false,
    time: 0,
    cb: null
  },
  confirm:{
    isConfirm:false,
    txt:'',
    confirmCallBack:null,
    cancelCallBack:()=>{
      state.confirm.txt='';
      state.confirm.isConfirm=!state.confirm.isConfirm;
    }
  },
  loadFinish: {
    txt: '',
    isShowButton: false
  },
  orderList: [],
  disabled: false,
  clientList: {1:{list:[],isMore:false,tatal:''},2:{list:[],isMore:false,total:''}},
  searchClient: {total:0,list:[],isMore:false},
  clientName: '',
  clientInfo: {}, //选择的客户信息
  clientChoose: [], //选择客户
  monthStateList: {
    compactStartTime:'',
    compactEndTime:'',
    compactClearTime:'',
    finaDayClearMapList:[]
  }, //月结运费列表
  pageFlag: 0, //获取的分页条目
  saveInfo: {
    goodNameFir: '配件',
    goodNumFir: '1',
    goodNameSec: '',
    goodNumSec: '',
    recieveMoney: '',
    orderMoney: '',
    colorFlag: 0
  }, //保存新建发货单填写的信息
  monthList:{infoList:[]},   //运费月结列表
  receivedInfo:{},//统计
  repeatFlag: true, //避免重复提交的标志
  lnglat:{},
  postApplyState:{status:null,orgId:null,content:null},
  clerkPermission:{}, //业务员权限
  allCompanyList:[],
  allStation:{},
  homePermission:{tabs:[],userInfo:{}},
  orderPickList:{isMore:false,list:[],totalAmount:'',orderIds:[]},
  accountRecordList:{isMore:false,list:[]},
  accountBank:{}
}

export default state
