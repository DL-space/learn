<template>
	<el-row class="tac">
		<el-col :span="24">
			<div class="over_top">
				<el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
  					<el-breadcrumb-item :to="{ path: '/warning' }">预警&监控</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-col>
		<el-col :span="24" class="selectField">
			<el-col :span="24" class="timeWarn clearfix">
				<div>
					<span class="fl changeFontSize nameSpan">城市：</span>
					<search-select class="cityDrop" :items="cityList" v-model="cityList.chosen" :commonFlag="true"></search-select>
				</div>
				<div>
					<span class="fl changeFontSize nameSpan">渠道：</span>
					<search-select class="cityDrop" :items="channelList" v-model="channelList.chosen" :commonFlag="true"></search-select>
				</div>
				<div>
					<span class="fl changeFontSize nameSpan">账号：</span>
					<muli-select class="cityDrop accoutDrop" :changeList="changeListSele" :items="accountList" v-model="accountList.transArr" :commonFlag="true"></muli-select>
				</div>
				<div>
					<span class="fl changeFontSize nameSpan">时间维度：</span>
					<search-select class="cityDrop" :items="timeList" v-model="timeList.chosen" :commonFlag="true"></search-select>
				</div>
			</el-col>
			<el-col :span="24" class="timeWarn clearfix timeBtSecon">
				<div>
					<span class="fl changeFontSize nameSpan">状态：</span>
					<search-select class="cityDrop" :items="stateList" v-model="stateList.chosen" :commonFlag="true"></search-select>
				</div>
				<div class="creTiClass">
					<span class="fl changeFontSize nameSpan">创建时间：</span>
					<el-date-picker class="pickerStart" v-model="timeStart" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
					至
					<el-date-picker class="pickerStart" v-model="timeEnd" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
				</div>
			</el-col>
			<el-col :span="24" class="operator">
				<el-button type="success" @click="doSearch">搜索</el-button>
				<el-button type="danger" class="opeBtn" @click="resetClick">重置</el-button>
				<el-button type="primary" class="opeBtn" @click="createWarn">新建</el-button>
			</el-col>
			<el-col :span="24" class="operator">
				<el-col :span="24" style="text-align: left;margin-bottom: 10px;font-weight: bold;">
					<span>查询结果：</span>
				</el-col>	
				<el-table :data="tableData" border style="width: 100%;" max-height="150">
					<el-table-column v-bind:prop="th.type" v-bind:label="th.name" v-for="th in tableTh"></el-table-column>
				</el-table>
			</el-col>
		</el-col>
	</el-row>
</template>

<script>
  	import Vue from 'vue';
  	import ElementUI from 'element-ui';
  	import SearchSelect from './common/select';
  	import MuliSelect from './common/SelectMul';
  	import {mapState} from 'vuex';

  export default {
    name: 'warning',
    data () {
      return {
      	cityList:{          //城市下拉框
        	chosen: '',      
			chosenValue:'全部',     
			inputValue:'',       
      		data:[{
	          itemCode: '',
	          itemName: '全部'
	        }, {
	          itemCode: '2',
	          itemName: '北京'
	        }, {
	          itemCode: '20000001',
	          itemName: '上海'
	        },{
	          itemCode: '20000019',
	          itemName: '天津'
	        }, {
	          itemCode: '20000037',
	          itemName: '广州'
	        },{
	      		itemCode:'20000050',
	      		itemName:'重庆'
	      	},{
	      		itemCode:'20000061',
	      		itemName:'苏州'
	      	},{
	      		itemCode:'20000074',
	      		itemName:'杭州'
	      	},{
	      		itemCode:'20000086',
	      		itemName:'成都'
	      	}]
        },   
        channelList: {                 //渠道下拉框
			chosen: 'all',
			chosenValue:'全部',
			inputValue:'',  
			data: [{
				itemCode: 'all',
				itemName: '全部',
      			flag: false
			},{
				itemCode: 'bt',
				itemName: '百度',
      			flag: false
			}, {
				itemCode: '360',
				itemName: '360',
      			flag: false
			}, {
				itemCode: 'sougou',
				itemName: '搜狗',
      			flag: false
			}, {
				itemCode: 'now',
				itemName: '信息',
      			flag: false
			},{
				itemCode: 'bt1',
				itemName: '腾讯',
      			flag: false
			}, {
				itemCode: '3601',
				itemName: '3601',
      			flag: false
			}, {
				itemCode: 'sougou1',
				itemName: '12345',
      			flag: false
			}, {
				itemCode: 'now1',
				itemName: '虎嗅',
      			flag: false
			}]
		},
		accountList:{                 //账号下拉框
			chosen: '',
			chosenValue:'bj-tongzhou',
			inputValue:'bj-tongzhou',
			transArr:[{
				itemCode: 'bj-tongzhou',
				itemName: 'bj-tongzhou',
      			flag: true
			}],
			data: [{
				itemCode: 'bj-tongzhou',
				itemName: 'bj-tongzhou',
				textName: '百度',
      			flag: true
			},{
				itemCode: 'bt',
				itemName: '百度',
      			flag: false
			}, {
				itemCode: '360',
				itemName: '360',
      			flag: false
			}, {
				itemCode: 'sougou',
				itemName: '搜狗',
      			flag: false
			}, {
				itemCode: 'now',
				itemName: '信息',
      			flag: false
			},{
				itemCode: 'bt1',
				itemName: '腾讯',
      			flag: false
			}, {
				itemCode: '3601',
				itemName: '3601',
      			flag: false
			}, {
				itemCode: 'sougou1',
				itemName: '12345',
      			flag: false
			}, {
				itemCode: 'now1',
				itemName: '虎嗅',
      			flag: false
			}]
		},
		stateList:{                 //状态下拉框
			chosen: 'all',
			chosenValue:'全部',
			inputValue:'',  
			data: [{
				itemCode: 'all',
				itemName: '全部',
      			flag: false
			},{
				itemCode: 'zc',
				itemName: '正常',
      			flag: false
			}, {
				itemCode: 'yc',
				itemName: '异常',
      			flag: false
			}]
		},
		timeList:{                 //时间维度下拉框
			chosen: 'all',
			chosenValue:'全部',
			inputValue:'',  
			data: [{
				itemCode: 'all',
				itemName: '全部',
      			flag: false
			},{
				itemCode: 'hour',
				itemName: '小时',
      			flag: false
			}, {
				itemCode: 'day',
				itemName: '日',
      			flag: false
			}, {
				itemCode: 'daySum',
				itemName: '当日累计',
      			flag: false
			}]
		},
       	timeStart:Date.now(),    //开始时间
       	timeEnd:Date.now(),    //结束时间
       	pickerOptions0: {              //日期默认值
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        tableData: [{
          "date" : "2016-05-02",
          "name" : "王小虎",
          "address" : "上海市普陀区金沙江路 1518 弄"
        }, {
          "date" : "2016-05-04",
          "name" : "血小虎",
          "address" : "上海市普陀区金沙江路 1517 弄"
        }, {
          "date" : "2016-05-01",
          "name" : "王小虎",
          "address" : "上海市普陀区金沙江路 1519 弄"
        }, {
          "date" : "2016-05-03",
          "name" : "王小虎",
          "address" : "上海市普陀区金沙江路 1516 弄"
        }],
        tableTh:[{
        	name:'日期',
     		type:'date'
        },{
        	name:'姓名',
     		type:'name'
        },{
        	name:'地址',
     		type:'address'
        }],
        changeListSele:false
      }
    },
    computed: {
    	...mapState({
			saveForm: state => state.saveForm
		})
    },
    components:{
		SearchSelect,MuliSelect
	},
    mounted: function () {
      this.$nextTick(res => {
          this.getTables();
      });
    },
    methods: {
	    //渲染数据源
		getTables() {},
		//搜索事件
		doSearch() {
		  	//埋点
		    let formInfo = {             //埋点表单
				eventVal:"e_click_search",
				fromPageVal:"p_warning_index",
				fromModuleVal:"",
				fromItemVal:"i_search",
				fromItemIndexVal:"-1",
				toPageVal:"p_warning_index",
				toModuleVal:""
			}
		    this.$store.dispatch("setSaveForm",formInfo);
		  	console.log(this.cityList.chosen,this.channelList.chosen);
		  	console.log(this.accountList.transArr);
		  	console.log(this.timeList.chosen,this.stateList.chosen,this.formatData(this.timeStart),this.formatData(this.timeEnd));
		},
		//重置
		resetClick() {
		  	this.cityList.chosenValue = '全部';
		  	this.channelList.chosenValue = '全部';
		 	this.changeListSele = true;
      		this.changeListSele = true;
      		this.accountList.transArr = [];
      		this.accountList.data = this.deepClone(this.clearChosen(this.accountList.data));
		     //请求结束后把标记设置成false
		     setTimeout(function(){
		     	this.changeListFir = false;
		     },1000);
		  	this.accountList.chosenValue = '请选择';
		  	this.timeList.chosenValue = '全部';
		  	this.stateList.chosenValue = '全部';
		  	this.timeStart = new Date();
		  	this.timeEnd = new Date();
		},
		//新建
		createWarn() {
			//跳转到新建预警页面
	    	this.$router.push({name:'WarningToNew'});
		},
		//清楚选中
		clearChosen(paraList) {
		  	for(let i = 0;i < paraList.length;i++){
		  		paraList[i].flag = false;
		  	}
		  	return paraList;
		},
		deepClone(data) {
			function getType(obj){
	       		//tostring会返回对应不同的标签的构造函数
	       		var toString = Object.prototype.toString;
	       		var map = {
		          	'[object Boolean]'  : 'boolean', 
		          	'[object Number]'   : 'number', 
		          	'[object String]'   : 'string', 
		          	'[object Function]' : 'function', 
		          	'[object Array]'    : 'array', 
		          	'[object Date]'     : 'date', 
		          	'[object RegExp]'   : 'regExp', 
		          	'[object Undefined]': 'undefined',
		          	'[object Null]'     : 'null', 
		          	'[object Object]'   : 'object'
	      		};
	      		if(obj instanceof Element) {
	           		return 'element';
	      		}
	      			return map[toString.call(obj)];
	   			}
	       	var type = getType(data);
	       	var obj;
	       	if(type === 'array'){
	           	obj = [];
	       	} else if(type === 'object'){
	           	obj = {};
	       	} else {
	           	//不再具有下一层次
	           	return data;
	       	}
	       	if(type === 'array'){
	           	for(var i = 0, len = data.length; i < len; i++){
	               	obj.push(this.deepClone(data[i]));
	           	}
	       	} else if(type === 'object'){
	           	for(var key in data){
	               	obj[key] = this.deepClone(data[key]);
	           	}
	       	}
	       	return obj;
	   	},
		//时间格式化
		formatData(para) {
			let reValue = '';
			if(para != ''){
				let d = new Date(para);
				reValue = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			}else{
				reValue = ''
			}
	        return reValue;
		}
  	},
	watch:{}
}
</script>

<style>
	.over_top{
		background-color: #f5f5f5;
		width: 100%;
		height: 50px;
		padding-left: 50px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		border-top: 1px solid #ccc;
	}
	.over_top .bread{
		font-size: 13px;
		margin-right: 30px;
	}
	.selectField{
		padding: 25px 100px;
		box-sizing: border-box;
		margin-left: 40px;
	}
	.selectField .timeBt{
		text-align: left;
	}
	.selectField .timeWarn{
		width: 90%;
		padding: 0 50px;
		display: flex;
		display: -webkit-flex;
		justify-content:space-between;
		margin-left: 10px;
		text-align: left;
	}
	.selectField .timeBtSecon{
		width: 61%;
		margin-top: 40px;
		display: flex;
		display: -webkit-flex;
		justify-content:space-between;
	}
	.selectField .timeBtSecon .creTiClass .pickerStart{
		width: 120px;
	}
	.nameSpan{
		margin-top: 10px;
		font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    	font-size: 14px;
    	font-weight: bold;
	}
	.cityDrop{
		width: 140px !important;
	}
	.cityDrop .selectChosen{
		width: 140px !important;
	}
	.cityDrop .showSelectBox{
		min-width: 140px !important;
	}
	.cityDrop .box_scroll{
		width: 140px !important;
	}
	.cityDrop .myInput{
		width: 120px !important;
	}
	.operator{
		width: 90%;
		margin-top: 20px;
	}
	.operator .opeBtn{
		margin-left: 40px;
	}
	.tableCol{
		margin-top: 30px;
	}
	.accoutDrop .selectChosen{
		width: 105px !important;
	}
</style>