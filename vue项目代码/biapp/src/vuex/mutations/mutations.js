import axios from 'axios';
import {Ajax}from '@/assets/Util';

//请求ip和端口号
const urlIp = 'http://123.57.173.13:8080';
const mutations = {
	//初始化 state
	INIT_STORE(state, data = {}) {},
	//克隆对象
	THIRD_OBJ(state, data) {
		axios.post(urlIp + '/menu').then(res => {
			let obj = {
				selectFlag:true,
				chosen: 'hour',
        		chosenValue:'小时',
				transArr:[{
		          itemCode: 'hour',
		          itemName: '小时',
		          flag: true
		        }],
				inputValue:'',                 
				outInput:'',             
	        	data:[{
		          itemCode: 'hour',
		          itemName: '小时',
		          flag: true
		        }, {
		          itemCode: 'day',
		          itemName: '日x',
		          flag: false
		        }, {
		          itemCode: 'sum',
		          itemName: '合计',
		          flag: false
		         },{
		          itemCode: 'hour1',
		          itemName: '点击量',
		          flag: false
		        }, {
		          itemCode: 'day1',
		          itemName: '点击率',
		          flag: false
		        }, {
		          itemCode: 'sum1',
		          itemName: '展示量',
		          flag: false
		         },{
		          itemCode: 'hour4',
		          itemName: '直接留电成本',
		          flag: false
		        }, {
		          itemCode: 'day3',
		          itemName: '留电量',
		          flag: false
		        }, {
		          itemCode: 'sum3',
		          itemName: '平均点击价格',
		          flag: false
		         },{
		          itemCode: 'hour3',
		          itemName: '现金消费',
		          flag: false
		        }, {
		          itemCode: 'day2',
		          itemName: '账面消费',
		          flag: false
		        }, {
		          itemCode: 'sum2',
		          itemName: '千次展示消费',
		          flag: false
		         }
	        	]
	        };
        	state.thirdObj = obj;
        });
	},
	//切换当前点击的筛选条件索引
	SET_NOWSELE_INDEX(state, data) {
		state.nowSeleIndex = data;
	},
	//标记第三个下拉框是否是重新请求的下拉内容
	SET_CHANGE_FLAG(state, data) {
		state.changeFlag = data;
	},
	//给筛选条件的第二个下拉框进行标记
	SET_SECON_KEY(state, data) {
		state.seconKey = data;
	},
	//提交埋点信息方法
	SET_SAVE_FORM(state, data) {
		state.saveForm.eventVal = data.eventVal;
		state.saveForm.fromPageVal = data.fromPageVal;
		state.saveForm.fromModuleVal = data.fromModuleVal;
		state.saveForm.fromItemVal = data.fromItemVal;
		state.saveForm.fromItemIndexVal = data.fromItemIndexVal;
		state.saveForm.toPageVal = data.toPageVal;
		state.saveForm.toModuleVal = data.toModuleVal;
		let formSub = document.getElementById("commonForm");
		formSub.submit();
	},
	//保存传递给查询页面的数据
	SETTURNOBJ(state, data) {
		state.turnObj.cityId = data.cityId;
		state.turnObj.dateType = data.dateType;
		state.turnObj.startDate = data.startDate;
		state.turnObj.endDate = data.endDate;
		state.turnObj.almostDate = data.almostDate;
		state.turnObj.compare = data.compare;
		state.turnObj.cStartDate = data.cStartDate;
		state.turnObj.queryType = data.queryType;
	},
	//暂时不用
	SETISDEFAULT(state, data) {
		state.isDefault = data;
	},
	SETTESTINDEX(state, data) {
		state.testIndex = data;
	}
}
export default mutations;