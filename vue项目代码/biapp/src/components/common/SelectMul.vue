<template>
	<div class="mySelectCon dimensionsClass relation fl muti" v-clickoutside="handleThirdClose">
		<!--对外暴露的是选中项的标识，如果是单选，则是一个字符串，如果是多选则是一个数组-->
		<input type="text" :value="value" style="display:none;">
		<div class="my_input" @click="showThirdBox(items)">
			<span class="selectChosen fl">{{items.chosenValue}}</span>
			<i class="my_i el-icon-caret-top"></i>
		</div>
		<div class="my_input disableClass" v-if="allFlag">
			<span class="selectChosen fl">请选择</span>
			<i class="my_i el-icon-caret-top"></i>
		</div>
		<div class="showSelectBox" x-placement="top-start" v-if="dropShow">
			<input autocomplete="off" v-on:input="aotuSearch(items.inputValue,items)" placeholder="请输入" icon="caret-top" type="text" rows="2" class="myInput" v-model="items.inputValue" />
			<div class="box_scroll">
				<div class="dropDown_wrap">
					<ul class="scroll_ul" v-if="items.data.length != 0">
						<li class="scroll_li" v-for="(item,index) in items.data" label="item.itemName" @click="selectThirdLi(index,item,items)">
							<span class="fl">{{item.itemName}}</span>
							<i v-if="item.flag" class="el-icon-check fr iChosen"></i>
						</li>
					</ul>
					<ul class="scroll_ul" v-else>
						<li class="noLi">无匹配数据</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Clickoutside from '@/components/utils/clickoutside';
import {mapState} from 'vuex';
export default {
	data () {
		return {
			dropShow:false,         //标识下拉框默认是收起下拉
			selectArry:[],            //下拉框的默认展示或者是选中项的id，相当于父组件中定义的v-model的值
			cloneSelect:[]         //当前下拉的克隆数组
		}
	},
	props:{
		//遍历的对象
		items:{
			type: Object,
			default: {}
		},
		//v-model绑定的值
		value:{
			type: Array,
			default: []
		},
		//第二个筛选框如果是all，则第三个筛选框需要禁用，这个是禁用标志
		allFlag:{
			type: Boolean,
			default: false
		},
		//由于克隆的关系，需要标记是否改变传入进来的数组，克隆的数组只在第一次赋值，在父组件中设置
		changeList:{
			type: Boolean,
			default: false
		}
	},
	mounted() {
		//页面渲染的时候就信息value和selectId的同步
		if (this.value) {
		  	this.selectArry = this.value;
		};
		this.$nextTick(res => {
          	//渲染时候就将当前下拉框的内容克隆下拉，以便模糊搜索时候对比
			this.cloneSelect = this.deepClone(this.items.data);
      	});
	},
	computed: mapState({
			thirdObj: state => state.thirdObj,
			nowSeleIndex: state => state.nowSeleIndex,
			changeFlag: state => state.changeFlag,
			seconKey: state => state.seconKey
	}),
	directives: { Clickoutside },
	methods:{
		//点击下拉框上面的div，收起和展示下拉
		showThirdBox(para) {
			this.dropShow = !this.dropShow;
			//每一个新下拉框都会克隆一遍，当前永远只有一个下拉框开着
			for(let j = 0;j < this.cloneSelect.length;j++){
				for(let i = 0;i < para.transArr.length;i++){
					if(this.cloneSelect[j].itemCode == para.transArr[i].itemCode){
						this.cloneSelect[j].flag = para.transArr[i].flag;
					}
				}
			}
			para.data = this.deepClone(this.cloneSelect);
			para.inputValue = '';
		},
		//自定义的失去焦点事件
		handleThirdClose() {
			this.dropShow = false;
		},
		//点击下拉框选中项事件
		selectThirdLi(paraIndex,para,parentPara) {
			//隐藏和展示选择号
			if(para.flag){
				//取消选择
				para.flag = false;
				//删除原本已经选中的项，从当前的筛选条件中
				for(let i = 0;i < parentPara.transArr.length;i++){
					if(para.itemCode == parentPara.transArr[i].itemCode){
						parentPara.transArr.splice(i,1);
					}
				}
				//需要同步到当前下拉克隆数组里面
				for(let i = 0;i < this.cloneSelect.length;i++){
					if(this.cloneSelect[i].itemCode == para.itemCode){
						this.cloneSelect[i].flag = false;
					}
				}
			}else{
				para.flag = true;
				parentPara.transArr.push(para);
				//需要同步到当前下拉克隆数组里面
				for(let i = 0;i < this.cloneSelect.length;i++){
					//如果标志相同
					if(this.cloneSelect[i].itemCode == para.itemCode){
						this.cloneSelect[i].flag = true;
					}
				}
			}
			//将选中项放入div展示框中
			let tempArr = [];
			for(let i = 0;i < parentPara.transArr.length;i++){
				tempArr.push(parentPara.transArr[i].itemName);
			}
			parentPara.chosenValue = this.arrToStr(tempArr);
			this.selectArry = this.deepClone(parentPara.transArr);
			//发起请求，修改第三个下拉框的下拉值，需要注意的是，这个三个下拉框是相互关联的，是不是需要用到vuex
		},
		//下拉的模糊匹配搜索
		aotuSearch(inputValue,para) {
			let reg = new RegExp(inputValue);
			let newArr = [];
		    //判断是否有匹配的项
		    for(let i = 0;i < this.cloneSelect.length;i++){
		        //如果字符串中不包含目标字符会返回-1
		        if(this.cloneSelect[i].itemName.match(reg) != null){
		        	newArr.push(this.cloneSelect[i]);
		        }
		    }
		    //匹配成功，展示匹配成功的新数组
		    if(newArr.length > 0){
		    	para.data = [];
		    	para.data = this.deepClone(newArr);
		    }else{
		    	para.data = [];
		    }
		    //跟v-model同步
		    
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
	},
	watch:{
		//监听value值，接受父组件传递回来的值，相当于暴露给父组件的值，因为是v-model，所以名字不能变化
	    value:{
	        handler:function(val,oldval){
	        	this.selectArry = val;
	        },
		    deep:true
		},
		//============应该是有问题的，数组的监听
		selectArry:{
	        handler:function(val,oldval){
	        	this.$emit('input', val);
	        },
		    deep:true
		},
		items:{
			handler:function(val,oldval){
				if(this.changeFlag){
					this.cloneSelect = this.deepClone(this.items.data);
				}
				//叫允许克隆的标志改为不允许
				this.$store.dispatch("setChangeFlag",false);
	        },
		    deep:true
		},
		seconKey:{
			handler:function(val,oldval){
				if(this.seconKey){
					this.cloneSelect = this.deepClone(this.items.data);
				}
	        },
		    deep:true
		},
		changeList:{
	        handler:function(val,oldval){
	        	if(val == true){
	        		this.cloneSelect = this.items.data;
	        	}
	        },
		    deep:true
		}
	}
}	
</script>

<style>
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
	.dimensionsClass .el-input{
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
	.mySelectCon .my_input{
		height: 100%;
		width: 100%;
		font-size: 14px;
		position: relative;
		box-sizing: border-box;
		text-align: left;
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
	.mySelectCon .disableClass{
		background-color: #E4E8F1;
		cursor:not-allowed;
		position: relative;
		top: -34px;
		left: 0;
		color: #aaa;
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
</style>