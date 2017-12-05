<template>
	<el-row class="tac">
		<el-col :span="24">
			<div class="over_top">
				<el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
  					<el-breadcrumb-item :to="{ path: '/' }">智能分析</el-breadcrumb-item>
  					<el-breadcrumb-item>关键字查询</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-col>
		<!--<el-col :span="24" class="timeBt clearfix">
			<router-link :to="{name:'BuildSelect',params:{queryObj:{}}}">3423</router-link>
		</el-col>-->
		<el-col :span="24" class="selectField">
			<el-col :span="24" class="timeBt clearfix">
				<span class="fl changeFontSize nameTip">开始时间</span>
				<el-date-picker class="fl" v-model="pickerStart" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
				<span class="fl changeFontSize nameTip">结束时间</span>
				<el-date-picker class="fl" v-model="pickerEnd" type="date" placeholder="选择日期" :picker-options="pickerOptions1"></el-date-picker>
				<el-checkbox v-model="comChecked" class="fl com">对比</el-checkbox>
				<div class="clearfix" v-if="comChecked">
					<span class="fl changeFontSize nameTip">开始时间</span>
					<el-date-picker class="fl" v-model="pickerComStart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
					<span class="fl changeFontSize nameTip">结束时间</span>
					<el-date-picker class="fl" v-model="pickerComEnd" type="date" placeholder="选择日期" :picker-options="pickerOptions3"></el-date-picker>
				</div>
			</el-col>
			<el-col :span="24" class="timeBt clearfix dimensionFild">
				<span class="fl changeFontSize nameTip">时间维度</span>
  				<search-select :changeList="changeListTime" :items="dimensionList" v-model="dimensionList.chosen" :commonFlag="true" :flagValue="true"></search-select>
			</el-col>
			<el-col :span="24" class="timeBt clearfix dimensionFild">
				<span class="fl changeFontSize nameTip">筛选条件</span>
				<div class="fl"> 
					<div class="clearfix selectFor replaceClass" v-for="(items,index) in allConLists">
	  					<search-select :changeList="changeListSele" :items="items.firCon" :seleIndex="index" v-model="items.firCon.chosen" :commonFlag="false" :flagValue="true" v-on:changeThird="thirSeleObj"></search-select>
	  					<search-select :changeList="changeListSele" :items="items.seconCon" :seleIndex="index" v-model="items.seconCon.chosen" :commonFlag="false" :flagValue="false" style="margin-left: 10px;"></search-select>
	  					<muli-select :changeList="changeListSele" v-if="items.thirdCon.selectFlag && (items.seconCon.chosen!='bh') && (items.seconCon.chosen!='nobh')" :allFlag="items.seconCon.chosen == 'all'" :items="items.thirdCon" v-model="items.thirdCon.transArr"></muli-select>
	  					<el-input v-else class="dimensionsClass relation fl" v-model="items.thirdCon.outInput" v-bind:disabled="items.seconCon.chosen == 'all'" v-bind:placeholder="'请输入' + idToValue(items.seconCon.chosen) + '的值'"></el-input>
	  					<el-button type="danger fl deleBtn" @click="deleCon(index)">删除</el-button>
	  					<el-button type="success fl addBtn" @click="addCon()">新增</el-button>
					</div>
				</div>
			</el-col>
			<el-col :span="24" class="timeBt clearfix dimensionFild">
				<span class="fl changeFontSize nameTip">筛选指标</span>
				<check-select :changeList="changeListChe" :items="checkSelectObj" v-model="checkSelectObj.transArr"></check-select>
			</el-col>
			<el-col :span="24" class="operator">
				<el-button type="success" @click="queryTb">查询</el-button>
				<el-button type="danger" class="opeBtn">重置</el-button>
				<el-button type="primary" class="opeBtn" @click="handleDownload" :loading="downloadLoading">导出</el-button>
			</el-col>	
			<el-col :span="24" class="tableCol">
				<el-table :data="tableData" border style="width: 100%" max-height="150" :default-sort = "{prop: 'date', order: 'descending'}">
    				<el-table-column v-bind:prop="th.type" v-bind:label="th.name" v-for="th in tableTh" sortable></el-table-column>
  				</el-table>
			</el-col>	
		</el-col>
	</el-row>
</template>

<script>
  	import Vue from 'vue';
  	import ElementUI from 'element-ui';
	import {mapState} from 'vuex';
  	import Clickoutside from './utils/clickoutside';
  	import SearchSelect from './common/select';
  	import MuliSelect from './common/SelectMul';
  	import CheckSelect from './common/SelectCheck';

  export default {
    name: 'keySelect',
    data () {
      return {
       	pickerStart:new Date(),    //开始时间
       	pickerEnd:new Date(),    //结束时间
       	pickerComStart:new Date(),    //对比开始时间
       	pickerComEnd:new Date(),    //对比结束时间
       	pickerOptions0: {              //日期默认值
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerOptions1: {              //日期默认值
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerOptions2: {              //日期默认值
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerOptions3: {              //日期默认值
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        comChecked:false,          //查询中的对比CheckBox
        dimensions:'hour',             //时间维度
        dimensionList:{},           //时间维度对象
        conditions:'channel',       //条件
        conList:[],                  //条件数组
        compareCon:'eq',            //比较关系
        compList:[],                //比较关系数组
        conResult:'',               //关系结果
        resultList:[],               //关系结果数组
        selectList:[],               //筛选指标数组
        selectRe:'',                 //筛选指标
        allConLists:[],              //所有条件合起来的数组
        cloneArr:{},                  //用于克隆的对象
        seleInput:'',                 //筛选条件的输入框
        cloneList:{},                 //克隆的对象
        checkSelectObj:{},
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
        nowDropIndex:0,                 //筛选条件组当前下拉框的值
        cloneSelect:[],                //筛选条件中当前下拉的克隆数组
        seconSele:'eq',                     //筛选条件的第二个下拉框的选中值
        downloadLoading:false,             //导出按钮加载中展示标识
        changeListTime:false,                  //ajax请求时候需要设置成true
        changeListSele:false,                  //同上
        changeListChe:false,                  //同上
        lastObj:{}                           //图表页面传递过来的对象
      }
    },
    components:{
		SearchSelect,MuliSelect,CheckSelect
	},
    directives: { Clickoutside },
    mounted: function () {
      this.$nextTick(res => {
          this.getTables();
      });
    },
    created() {
    	//如果传递对象为空，则说明是从导航栏进入页面的，如果不为空则是图表页面进入
    	if(!this.isEmptyObject(this.$route.params.queryObj)){
	    	this.lastObj = JSON.parse(this.$route.params.queryObj);
    		if(this.lastObj.dateType == 2){
    			this.pickerStart = this.lastObj.startDate;
    			this.pickerEnd = this.lastObj.endDate;
    		}else{//近三十天
    			this.pickerStart = this.lastObj.almostDate;
    			this.pickerEnd = this.formatData(new Date());	
    		}
    		this.comChecked = this.lastObj.compare;
    		if(this.comChecked){
    			//如果选择了对比
    			let deffDay = this.DateDiff(this.pickerStart,this.pickerEnd);
    			this.pickerComStart = this.lastObj.cStartDate;
    			if(this.pickerComStart){
    				this.pickerComStart = new Date(Date.parse(this.pickerComStart.replace(/-/g, "/")));
    				this.pickerComEnd = new Date(this.pickerComStart);
    				this.pickerComEnd.setDate(this.pickerComEnd.getDate() + deffDay);
    			}else{
    				this.pickerComEnd = "";
    			}
    		}else{
    			this.pickerComStart = new Date();
    			this.pickerComStart.setDate(this.pickerComStart.getDate() - 1);
    			this.pickerComEnd = new Date(this.pickerComStart);
    		}
    		//图表页面跳转进入，根据传入值进行遍历对象的添加
    	}else{
    		//从导航页进入，手动添加属性
    	}
    	//告诉子组件，这个时候发起请求了，所以要重新给组件内的克隆数组赋值，除非发起新的请求，不然不会改变克隆数组的长度
      	//发起请求====================================
//    	this.changeListSele = true;
      	
	     //请求结束后把标记设置成false
	     /*setTimeout(function(){
	     	this.changeListFir = false;
	     },1000);*/
	    //请求结束=======================================
	    this.dimensionList = {       //不用进行请求，写死的，只需要知道索引值
	        	chosen: 'day',      
				chosenValue:'日',     
				inputValue:'',       
	      		data:[{
		          itemCode: 'hour',
		          itemName: '小时'
		        }, {
		          itemCode: 'day',
		          itemName: '日'
		        }, {
		          itemCode: 'sum',
		          itemName: '合计'
		        }]
	        };
    	this.checkSelectObj = {      //可以全选的多选框，需要进行请求，然后根据跳转传递的参数进行组装
	        	selectChosen:['小时'],     //展示的字符串
	        	autoModel:'',              //留着这个字段，不用处理
	        	transArr:[{
		          itemCode: 'hour',
		          itemName: '小时',
		          flag: true
		        }],               //
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
		        }]
	        };
    },
    computed: {
    	...mapState({
			thirdObj: state => state.thirdObj,     //筛选条件的第三个下拉框的内容
			nowSeleIndex: state => state.nowSeleIndex,     //当前点击的筛选条件的索引
			seconKey: state => state.seconKey,
			turnObj: state => state.turnObj,            //从图表页面传递过来的数据
			isDefault: state => state.isDefault      //进入本页面是否有默认值
		})
    },
    methods: {
    	//渲染数据源
      getTables() {
//        this.$http.get('', {}).then(res=> {
//          res.body.
//        });	
		if(!this.isEmptyObject(this.$route.params.queryObj)){
			
		}else{
			this.pickerStart = new Date();
			this.pickerStart.setDate(this.pickerStart.getDate() - 1);
	       	this.pickerEnd = new Date(this.pickerStart);
	       	this.pickerComStart = new Date(this.pickerStart);
	       	this.pickerComEnd = new Date(this.pickerStart);
		}
        this.allConLists = [{
			firCon: {
				chosen: 'channel',      //选中关键字，只有一个，跟第三个不一样，可以直接传递给后台
				chosenValue:'渠道',     //手写下拉，需要增加，无法跟select一样控件同步，是展示框展示的
				dropShow:false,        //需要默认不展示下拉列表，因为有多个手写下拉，所以需要各自的标志
				inputValue:'',        //搜索框默认展示的，为了区分多组输入
				inputOrSelect:true,    //-----------待讨论，是在这儿加标识还是在第三个条件处加
				data: [{
					itemCode: 'channel',
					itemName: '渠道'
				}, {
					itemCode: 'day',
					itemName: '账号'
				}, {
					itemCode: 'account',
					itemName: '城市'
				}, {
					itemCode: 'plan',
					itemName: '计划'
				}, {
					itemCode: 'union',
					itemName: '单元'
				}, {
					itemCode: 'keyWord',
					itemName: '关键词'
				}]
			},
			seconCon: {
				chosen: 'eq',
				chosenValue:'等于',
				dropShow:false,
				inputValue:'', 
				data: [{
					itemCode: 'eq',
					itemName: '等于'
				}, {
					itemCode: 'noeq',
					itemName: '不等于'
				}, {
					itemCode: 'bh',
					itemName: '包含'
				}, {
					itemCode: 'nobh',
					itemName: '不包含'
				}, {
					itemCode: 'all',
					itemName: '全部'
				}]
			},
			thirdCon: {   //多选
				selectFlag:true,                    //true表示是下拉框，false标识展示input框
				dropShow:false,
				chosen: '',
				chosenValue:'百度',
				transArr:[{
					itemCode: 'bt',
					itemName: '百度',
          			flag: true
				}], //---------------------------考虑：用来同步多选选择的，点击查询后可以直接获取到并传递给后台（需要的呢）
				inputValue:'',                      //下拉列表中的input绑定值
				outInput:'',                        //没有下拉框时候展示的input绑定值
				data: [{
					itemCode: 'bt',
					itemName: '百度',
          			flag: true
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
			}
		}];
        this.cloneList = {
			firCon: {
				chosen: 'channel',      //选中关键字，只有一个，跟第三个不一样，可以直接传递给后台
				chosenValue:'渠道',     //手写下拉，需要增加，无法跟select一样控件同步，是展示框展示的
				dropShow:false,        //需要默认不展示下拉列表，因为有多个手写下拉，所以需要各自的标志
				inputValue:'',        //搜索框默认展示的，为了区分多组输入
				inputOrSelect:true,    //-----------待讨论，是在这儿加标识还是在第三个条件处加
				data: [{
					itemCode: 'channel',
					itemName: '渠道'
				}, {
					itemCode: 'day',
					itemName: '账号'
				}, {
					itemCode: 'account',
					itemName: '城市'
				}, {
					itemCode: 'plan',
					itemName: '计划'
				}, {
					itemCode: 'union',
					itemName: '单元'
				}, {
					itemCode: 'keyWord',
					itemName: '关键词'
				}]
			},
			seconCon: {
				chosen: 'eq',
				chosenValue:'等于',
				dropShow:false,
				inputValue:'', 
				data: [{
					itemCode: 'eq',
					itemName: '等于'
				}, {
					itemCode: 'noeq',
					itemName: '不等于'
				}, {
					itemCode: 'bh',
					itemName: '包含'
				}, {
					itemCode: 'nobh',
					itemName: '不包含'
				}, {
					itemCode: 'all',
					itemName: '全部'
				}]
			},
			thirdCon: {   //多选
				selectFlag:true,                    //true表示是下拉框，false标识展示input框
				dropShow:false,
				chosen: '',
				chosenValue:'百度',
				transArr:[{
					itemCode: 'bt',
					itemName: '百度',
          			flag: true
				}], //---------------------------考虑：用来同步多选选择的，点击查询后可以直接获取到并传递给后台（需要的呢）
				inputValue:'',                      //下拉列表中的input绑定值
				outInput:'',                        //没有下拉框时候展示的input绑定值
				data: [{
					itemCode: 'bt',
					itemName: '百度',
          			flag: true
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
			}
		};
		
     },
	//新增筛选条件
	addCon() {
		//克隆一份条件对象
		let newPara = this.deepClone(this.cloneList);
		//添加到筛选条件数组中
		this.allConLists.push(newPara);
	},
	//删除筛选条件组中的某一项
	deleCon(paraIndex) {
		//第一项永远是不能被删除
		if(this.allConLists.length > 1){
			this.allConLists.splice(paraIndex,1);
		}
	},
	//导出Excel表格
	handleDownload() {
		this.downloadLoading = true;
        //导出请求
        this.downloadLoading = false;
	},
	//点击第一个下拉框，动态切换第三个下拉框的内容
	thirSeleObj(para) {
//		console.log(para);
	},
	//查询
	queryTb() {
		console.log(this.allConLists);
		console.log('时间维度：'+ this.dimensionList.chosen);
		console.log('筛选指标：');
		console.log(this.checkSelectObj.transArr);
		console.log(this.formatData(this.pickerStart),this.formatData(this.pickerEnd),this.formatData(this.pickerComStart),this.formatData(this.pickerComEnd));
	},
	//将数组转换成字符串
	arrToStr(para) {
		if(Object.prototype.toString.call(para) == '[object Array]'){
			if(para.length == 0){
				return '请选择';
			}else{
				return para.join(",");
			}
		}else{
			return '请选择';
		}
	},
	//取消冒泡事件
	stopBubble(e) {
		//一般用在鼠标或键盘事件上
		if(e && e.stopPropagation){
			//W3C取消冒泡事件
			e.stopPropagation();
		}else{
			//IE取消冒泡事件
			window.event.cancelBubble = true;
		}
	},
	//筛选条件最后的input框中的文字转化
	idToValue(para) {
		let changedWord = '等于';
		switch(para){
			case 'eq': changedWord = '等于';
			break;
			case 'noeq': changedWord = '不等于';
			break;
			case 'bh': changedWord = '包含';
			break;
			case 'nobh': changedWord = '不包含';
			break;
			default: changedWord = '全部'
		}
		return changedWord;
	},
	//时间格式化
	formatData(para) {
		let reValue = '';
			if(para != ''){
				let d = new Date(para);
//      		let reValue = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();				
				reValue = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			}else{
				reValue = ''
			}
	    return reValue;
	},
	//计算两个日期相差的天数
	DateDiff(sDate1,sDate2){    //sDate1和sDate2是2006-12-18格式  
       var aDate,oDate1,oDate2,iDays;
       aDate = sDate1.split("-");
       oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为12-18-2006格式  
       aDate = sDate2.split("-"); 
       oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
       iDays = parseInt(Math.abs(oDate1 - oDate2)/1000/60/60/24);//把相差的毫秒数转换为天数  
       return iDays;
   	},
   	//判断对象是否为空
   	isEmptyObject(obj) {   
	　　for (var key in obj){
	　　　　return false;//返回false，不为空对象
	　　}　　
	　　return true;//返回true，为空对象
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
	},
	watch:{
		//监听第三个下拉框的内容变化，如果发生变化则传递给父组件
		thirdObj:{
	        handler:function(val,oldval){
	        	this.allConLists[this.nowSeleIndex].thirdCon = val;
	        },
		    deep:true
		},
		seconKey:{
	        handler:function(val,oldval){
	        	if(this.seconKey){
					//选中项数组清空
					this.allConLists[this.nowSeleIndex].thirdCon.transArr = [];
					//展示div内容也要清空
					this.allConLists[this.nowSeleIndex].thirdCon.chosenValue = '请选择';
					for(let i = 0;i < this.allConLists[this.nowSeleIndex].thirdCon.data.length;i++){
						this.allConLists[this.nowSeleIndex].thirdCon.data[i].flag = false;
					}
					this.allConLists[this.nowSeleIndex].thirdCon.outInput = '';
	        	}
	        },
		    deep:true
		}
	}
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
	}
	.selectField .timeBt{
		text-align: left;
	}
	.selectField .nameTip{
		font-size: 14px;
		font-weight: 700;
		color: #333;
		margin: 7px 30px 0 40px;
	}
	.selectField .timeBt .el-date-editor{
		height: 30px;
		width: 110px;
	}
	.selectField .timeBt .el-input__inner{
		height: 36px;
		width: 100px;
		font-size: 13px;
		line-height: 30px;
		padding-right: 20px;
	}
	.selectField .timeBt .el-input__icon{
		width: 45px;
	}
	.selectField .nameTip:last-of-type{
		margin-left: 40px;
	}
	.selectField .timeBt .com{
		margin: 6px 60px 0 20px;
	}
	.selectField .timeBt .com .el-checkbox__inner{
		width: 15px;
		height: 15px;
	}
	.selectField .dimensionFild{
		margin-top: 30px;
	}
	.selectField .dimensionFild .selectFor{
		margin-top: 15px;
	}
	.selectField .dimensionFild .selectFor:first-of-type{
		margin-top: 0;
	}
	.dimensionsClass .el-input{
		width: 220px;
	}
	.replaceClass .el-input{
		width: 220px;
	}
	.dimensionsClass .el-input__inner{
		width: 220px !important;
	}
	.selectField .relation{
		margin-left: 10px;
	}
	.selectField .muti .el-input{
		height: 36px;
	}
	.selectField .muti .el-input__inner{
		height: 36px !important;
	}
	.selectField .muti .el-select__tags{
		height: 36px;
	}
	.selectField .muti .el-select__tags > span{
		height: 36px !important;
		overflow: hidden;
		display: flex;
  		justify-content: flex-start;
		padding: 3px 0;
	}
	.selectField .deleBtn{
		height: 32px;
		margin-left: 30px;
		padding: 8px 15px;
		margin-top: 2px;
	}
	.selectField .addBtn{
		height: 32px;
		margin-left: 15px;
		padding: 8px 15px;
		margin-top: 2px;
	}
	.mySelectCon{
		width: 220px;
		height: 36px;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 5px;
		box-sizing: border-box;
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
    	-webkit-font-smoothing: antialiased;
    	-moz-osx-font-smoothing: grayscale;
    	text-align: center;
    	color: #2c3e50;
    	position: relative;
	}
	.seconSelect{
		margin-left: 10px;
	}
	.mySelectCon .my_input{
		height: 100%;
		width: 100%;
		font-size: 14px;
		position: relative;
		box-sizing: border-box;
		text-align: left;
	}
	.mySelectCon .disableClass{
		background-color: #E4E8F1;
		cursor:not-allowed;
		position: relative;
		top: -34px;
		left: 0;
		color: #aaa;
	}
	.mySelectCon .my_input .selectChosen{
		font-size: 13px;
		margin: 10px 0 0 10px;
		width: 180px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.mySelectCon > .my_input{
		display: block;
	}
	.mySelectCon .my_input .my_i{
		width: 45px;
		color: #bfcbd9;
		font-size: 12px;
		transition: transform .3s;
	    -ms-transform: translateY(-50%) rotate(180deg);
	    transform: translateY(-50%) rotateZ(180deg);
	    line-height: 16px;
	    cursor: pointer;
	    position: absolute;
	    height: 100%;
	    top: 50%;
	    right: 0;
	    text-align: center;
	}
	.mySelectCon .my_input .my_i:before{
		content: "\E607";
	}
	.mySelectCon .my_input .my_i:after{
		content: '';
	    height: 100%;
	    width: 0;
	    display: inline-block;
	    vertical-align: middle;
	}
	.mySelectCon .myInput{
		width: 200px;
		height: 36px;
    	font-size: 13px;
    	line-height: 30px;
    	padding-right: 20px;
    	cursor: pointer;
    	background-color: #fff;
	    background-image: none;
	    border-radius: 4px;
	    border: 1px solid #bfcbd9;
	    box-sizing: border-box;
	    color: #1f2d3d;
	    outline: 0;
    	padding: 3px 10px;
    	transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    	display: inline-block;
    	-webkit-tap-highlight-color: rgba(255,0,0,0);
    	margin: 10px 5px;
	}
	.mySelectCon .showSelectBox{
		border: 1px solid #d1dbe5;
    	border-radius: 2px;
    	background-color: #fff;
    	box-shadow: 0 2px 4px rgba(0,0,0,.12),0 0 6px rgba(0,0,0,.04);
    	box-sizing: border-box;
    	margin: 5px 0;
		min-width: 220px;
		transform-origin: center bottom 0px;
		z-index: 2008;
		position: absolute;
		top: 35px;
		left: 0;
	}
	.mySelectCon .showSelectBox .box_scroll{
		position: relative;
		overflow: hidden;
	}
	.mySelectCon .showSelectBox .box_scroll .dropDown_wrap{
		overflow: scroll;
		max-height: 274px;
		margin-bottom: -17px;
    	margin-right: -17px;
	}
	.mySelectCon .showSelectBox .box_scroll .dropDown_wrap .scroll_ul{
		list-style: none;
    	padding: 6px 0;
    	margin: 0;
    	box-sizing: border-box;
    	vertical-align: middle;
    	display: block;
	    position: relative;
	    text-align: left;
	}
	.mySelectCon .showSelectBox .box_scroll .dropDown_wrap .scroll_ul .scroll_li{
		font-size: 14px;
	    padding: 8px 15px;
	    position: relative;
	    white-space: nowrap;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    color: #48576a;
	    height: 36px;
	    line-height: 1.5;
	    box-sizing: border-box;
	    cursor: pointer;
	    list-style: none;
    	vertical-align: middle;
    	display: list-item;
    	text-align: -webkit-match-parent;
	}
	.mySelectCon .showSelectBox .box_scroll .dropDown_wrap .scroll_ul .iChosen{
		color: #1C8DE0;
		margin-top: 2px;
	}
	.mySelectCon .showSelectBox .box_scroll .dropDown_wrap .scroll_ul .scroll_li:hover{
		background-color: #e4e8f1;
	}
	.mySelectCon .showSelectBox .box_scroll .dropDown_wrap .scroll_ul .selected{
		color: #fff;
    	background-color: #1C8DE0;
	}
	.mySelectCon .showSelectBox .box_scroll .dropDown_wrap .scroll_ul .selected:hover{
		color: #fff;
    	background-color: #1C8DE0;
	}
	.mySelectCon .showSelectBox .box_scroll .dropDown_wrap .scroll_ul .noLi{
		font-size: 14px;
		color: #999;
		padding: 5px 0;
		text-align: center;
		font-family: 'hiraginosansgb w3','Helvetica Neue',Helvetica,'microsoft yahei',Arial,sans-serif;
	}
	.operator{
		margin-top: 10px;
	}
	.operator .opeBtn{
		margin-left: 40px;
	}
	.tableCol{
		margin-top: 30px;
	}
</style>