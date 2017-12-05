<template>
	<div class="mySelectCon fl" v-clickoutside="handleFirClose">
		<!--对外暴露的是选中项的标识，如果是单选，则是一个字符串，如果是多选则是一个数组-->
		<input type="text" :value="value" style="display:none;">
		<div class="my_input" @click="showBox(items)">
			<span class="selectChosen fl" key="selectId">{{items.chosenValue}}</span>
			<i class="my_i el-icon-caret-top"></i>
		</div>
		<div class="my_input disableClass buid" v-if="allFlag">
			<span class="selectChosen fl">日</span>
			<i class="my_i el-icon-caret-top"></i>
		</div>
		<div class="showSelectBox" x-placement="top-start" v-if="dropShow">
			<input v-on:input="aotuFirSearch(items.inputValue,items,'first')" autocomplete="off" placeholder="请输入" icon="caret-top" type="text" rows="2" class="myInput" v-model="items.inputValue" />
			<div class="box_scroll">
				<div class="dropDown_wrap">
					<ul class="scroll_ul" v-if="items.data.length != 0">
						<li v-for="(item,index) in items.data" :class="{'scroll_li':!(items.chosenValue==item.itemName),'scroll_li selected':(items.chosenValue==item.itemName)}" label="item.itemName" @click="selectLi(item.itemName,item.itemCode,items,'first')" index="index + ''">
							<span class="fl">{{item.itemName}}</span>
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
			selectId:'',            //下拉框的默认展示或者是选中项的id，相当于父组件中定义的v-model的值
			cloneSelect:[],         //当前下拉的克隆数组
			nowConFlag:''          //当前选中项
		}
	},
	props:{
		items:{
			type: Object,
			required: true,
			default: {}
		},
		value:{
			type: String,
			default: ''
		},
		//是否是连锁下拉框，如果是，则需要进行请求
		flagValue:{
			type: Boolean,
			default: false
		},
		seleIndex:{
			type: Number,
			default: 0
		},
		//是否是正常下拉框，与其他下拉没有关联
		commonFlag:{
			type: Boolean,
			default: false
		},
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
	computed: {
		...mapState({
			thirdObj: state => state.thirdObj,
			nowSeleIndex: state => state.nowSeleIndex,
			changeFlag: state => state.changeFlag,
			seconKey: state => state.seconKey
		})
	},
	created() {
		
	},
	mounted() {
		//页面渲染的时候就信息value和selectId的同步
		if (this.value) {
		  	this.selectId = this.value;
		};
		//赋值当前选中项
		this.nowConFlag = this.items.chosenValue;
		//渲染时候就将当前下拉框的内容克隆下拉，以便模糊搜索时候对比
		this.cloneSelect = this.deepClone(this.items.data);
	},
	directives: { Clickoutside },
	methods:{
		//点击下拉框上面的div，收起和展示下拉
		showBox(para) {
			this.dropShow = !this.dropShow;
			//把下拉的所有值赋值给展示的数组
			para.data = this.deepClone(this.cloneSelect);
			//清空下拉框里面的input值
			para.inputValue = "";
			if(!this.commonFlag){
				//是否切换设置成false
				this.$store.dispatch("setSeconKey",false);
			}
		},
		//自定义的失去焦点事件
		handleFirClose() {
			this.dropShow = false;
		},
		//点击下拉框选中项事件
		selectLi(seleName,seleId,sele) {
			sele.chosenValue = seleName;
			//把选中项传给父组件
			this.selectId = seleId;
			//下拉框消失
			this.dropShow = false;
			//非正常下拉框
			if(!this.commonFlag){
				//如果是关联下拉框，则可以在此处发起请求，修改第三个下拉框的内容
				if(this.flagValue){
					//发起请求，修改第三个下拉框的下拉值，在父组件可以直接通过vuex进行获取
					this.$store.dispatch('setThirdObj', seleId);
					//切换当前点击的索引
					this.$store.dispatch("setNowSeleIndex",this.seleIndex);
					//确定请求改变第三个下拉框克隆标志为true
					this.$store.dispatch("setChangeFlag",true);
				}else{
					//选中项切换
					if(this.nowConFlag != seleName){
						//切换成可以更新
						this.$store.dispatch("setSeconKey",true);
						//切换当前点击的索引
						this.$store.dispatch("setNowSeleIndex",this.seleIndex);
					}
					this.nowConFlag = seleName;
				}
			}else{}
			
		},
		//下拉的模糊匹配搜索
		aotuFirSearch(inputValue,para) {
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
		//监听value值，接受父组件传递回来的值，相当于暴露给父组件的值，因为是v-model，所以名字不能变化
	    value:{
	        handler:function(val,oldval){
	        	this.selectId = val;
	        },
		    deep:true
		},
		//监听选中值得变化，跟value是同步的，然后传递给父组件
		selectId:{
	        handler:function(val,oldval){
	        	this.$emit('input', val);
	        },
		    deep:true
		},
		//监听第三个下拉框的内容变化，如果发生变化则传递给父组件
		thirdObj:{
	        handler:function(val,oldval){
	        	let paraObj = {
	        		seleObj:val,
	        		index:this.seleIndex
	        	}
	        	this.$emit('changeThird', paraObj);
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
	.mySelectCon .disableClass{
		background-color: #E4E8F1;
		cursor:not-allowed;
		position: relative;
		top: -34px;
		left: 0;
		color: #aaa;
	}
	.buid{
		border-radius: 5px;
		background-color: #fff !important;
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