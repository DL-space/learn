const state={
	thirdObj:{},     //第三个下拉框的内容
	nowSeleIndex:0,      //标记当前切换的是哪一行的筛选条件(筛选条件可能是多行)
	changeFlag:false,     //标记第三个下拉框是否是重新请求的下拉内容
	seconKey:false,        //筛选条件的第二个下拉框切换值
	saveForm:{             //埋点表单
		eventVal:'',
		fromPageVal:'',
		fromModuleVal:'',
		fromItemVal:'',
		fromItemIndexVal:'',
		toPageVal:'',
		toModuleVal:''
	},
	turnObj:{                 //传递给查询页面的数据
		cityId:'',
    	dateType:1,
    	startDate:new Date(),
    	endDate:new Date(),
    	almostDate:new Date(),
    	compare:false,
    	cStartDate:new Date(),
    	queryType:1
	},
	isDefault:false,            //进入查询页面是否是从图表也进入的
	testIndex:0
}

export default state
