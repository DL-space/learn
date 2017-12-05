<template>
	<el-row class="tac">
		<el-col :span="24">
			<div class="over_top">
				<el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
  					<el-breadcrumb-item :to="{ path: '/Warning' }">预警&监控</el-breadcrumb-item>
  					<el-breadcrumb-item>新建预警</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-col>
		<el-col :span="24" class="selectField">
			<el-col :span="9" class="timeBt clearfix paddLeft">
				<span class="fl changeFontSize nameNew">提醒人</span>
				<muli-select :changeList="changeListSeleUser" :items="userList" v-model="userList.transArr" :commonFlag="true"></muli-select>
			</el-col>
			<el-col :span="15" class="timeBt clearfix">
				<span class="fl changeFontSize nameNew">预警说明</span>
				<el-input class="margLeft" style="width: 218px;" v-model="warnDescri" placeholder="请输入预警说明"></el-input>
			</el-col>
			<el-col :span="24" class="timeBt clearfix dimensionFild paddLeft">
				<span class="fl changeFontSize nameNew">时间维度</span>
  				<search-select class="margLeft" :items="dimensionList" v-model="dimensionList.chosen" :commonFlag="true"></search-select>
  				<el-input class="margLeft" style="width: 218px;" v-model="watchStep" placeholder="监控步长，默认为1"></el-input>
			</el-col>
			<el-col :span="24" class="timeBt clearfix dimensionFild paddLeft">
				<span class="fl changeFontSize nameNew">预警范围</span>
				<div class="fl">
					<div class="clearfix selectFor replaceClass margLeft" v-for="(items,index) in allConLists">
	  					<search-select :changeList="changeListSele" :items="items.firCon" :seleIndex="index" v-model="items.firCon.chosen" :commonFlag="false" :flagValue="true"></search-select>
	  					<search-select :changeList="changeListSele" :items="items.seconCon" :seleIndex="index" v-model="items.seconCon.chosen" :commonFlag="false" :flagValue="false" style="margin-left: 10px;"></search-select>
	  					<muli-select :changeList="changeListSele" v-if="items.thirdCon.selectFlag && (items.seconCon.chosen!='bh') && (items.seconCon.chosen!='nobh')" :allFlag="items.seconCon.chosen == 'all'" :items="items.thirdCon" v-model="items.thirdCon.transArr"></muli-select>
	  					<el-input v-else class="dimensionsClass relation fl" v-model="items.thirdCon.outInput" v-bind:disabled="items.seconCon.chosen == 'all'" v-bind:placeholder="'请输入' + idToValue(items.seconCon.chosen) + '的值'"></el-input>
	  					<el-button class="margLeft" type="danger fl deleBtn" @click="deleCon(index)">删除</el-button>
	  					<el-button type="success fl addBtn" @click="addCon()">新增</el-button>
					</div>
				</div>
			</el-col>
			<el-col :span="24" class="timeBt clearfix dimensionFild paddLeft">
				<span class="fl changeFontSize nameNew">预警规则</span>
				<div class="fl"  v-for="(items,index) in warningRulesList">
					<search-select class="margLeft" :items="items.ruleInfo" v-model="items.ruleInfo.chosen" :commonFlag="true"></search-select>
					<el-input class="margLeft fl" style="width: 218px;" v-model="items.ruleMin" placeholder="下限"></el-input>
					<el-input class="margLeft fl" style="width: 218px;" v-model="items.ruleMax" placeholder="上限"></el-input>
					<el-button class="margLeft" type="danger fl deleBtn" @click="deleConWarn(index)">删除</el-button>
	  				<el-button type="success fl addBtn" @click="addConWarn()">新增</el-button>
				</div>
			</el-col>
			<el-col :span="24" class="operator marTop">
				<el-button type="primary">发布</el-button>
				<el-button type="warning" class="opeBtn">取消</el-button>
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
	      	warnDescri:'',     //预警说明,
	      	dimensionList:{},   //时间维度下拉框
	      	watchStep:'',       //监控步长
	      	allConLists:[],     //预警范围数组
	      	changeListSeleUser:false,    //提醒人请求标志
	      	changeListSele:false,      //预警范围的第一个下拉框请求标志  
			userList:{                 //账号下拉框
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
			warningRulesList:[]                     //预警规则数组
	      }
	    },
	    computed: {
	    	...mapState({
				saveForm: state => state.saveForm,
				thirdObj: state => state.thirdObj,     //筛选条件的第三个下拉框的内容
				nowSeleIndex: state => state.nowSeleIndex,     //当前点击的筛选条件的索引
				seconKey: state => state.seconKey,
				turnObj: state => state.turnObj            //从图表页面传递过来的数据
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
	    created() {
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
					itemCode: 'daySum',
					itemName: '当日累计'
				}]
	        };
	    },
	    methods: {
		    //渲染数据源
			getTables() {
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
				this.warningRulesList = [{
					ruleInfo:{   
			        	chosen: 'day',      
						chosenValue:'日',     
						inputValue:'',            
			        	data:[{
				          itemCode: 'hour',
				          itemName: '小时',
				          flag: true
				        }, {
				          itemCode: 'day',
				          itemName: '日',
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
			        },
			        ruleMax:'',
			        ruleMin:''
				}];
				//一定要是默认选中项的克隆
				this.warnCloneList = {
					ruleInfo:{   
			        	chosen: 'hour1',      
						chosenValue:'点击量',     
						inputValue:'',            
			        	data:[{
				          itemCode: 'hour',
				          itemName: '小时',
				          flag: true
				        }, {
				          itemCode: 'day',
				          itemName: '日',
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
			        },
			        ruleMax:'',
			        ruleMin:''
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
			//新增筛选条件
			addConWarn() {
				//克隆一份条件对象
				let newPara = this.deepClone(this.warnCloneList);
				//添加到预警规则条件数组中
				this.warningRulesList.push(newPara);
			},
			//删除筛选条件组中的某一项
			deleConWarn(paraIndex) {
				//第一项永远是不能被删除
				if(this.warningRulesList.length > 1){
					this.warningRulesList.splice(paraIndex,1);
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
	.selectField .paddLeft{
		padding-left: 30px;
	}
	.selectField .nameTip{
		font-size: 14px;
		font-weight: 700;
		color: #333;
		margin: 7px 30px 0 40px;
	}
	.nameNew{
		width: 80px;
		font-size: 14px;
		font-weight: 700;
		color: #333;
		margin: 7px 10px 0 40px;
		text-align: right;
	}
	.selectField .dimensionFild{
		margin-top: 30px;
	}
	.margLeft{
		margin-left: 10px;
	}
	.selectField .dimensionFild .selectFor{
		margin-top: 15px;
	}
	.selectField .dimensionFild .selectFor:first-of-type{
		margin-top: 0;
	}
	.replaceClass .el-input{
		width: 220px;
	}
	.dimensionsClass .el-input{
		width: 220px;
	}
	.dimensionsClass .el-input__inner{
		width: 220px !important;
	}
	.selectField .relation{
		margin-left: 10px;
	}
	.operator{
		margin-top: 10px;
	}
	.operator .opeBtn{
		margin-left: 40px;
	}
	.marTop{
		margin-top: 30px;
	}
</style>