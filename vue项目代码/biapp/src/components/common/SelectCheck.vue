<template>
	<div class="mySelectCon" v-clickoutside="handleClose">
		<input type="text" :value="value" style="display:none;">
		<div class="my_input" @click="showMyBox">
			<span class="selectChosen fl">{{arrToStr(selectChosen)}}</span>
			<i class="my_i el-icon-caret-top"></i>
		</div>
		<div class="my_input disableClass buid" v-if="allFlag">
			<span class="selectChosen fl">楼盘UV，直接留电量</span>
			<i class="my_i el-icon-caret-top"></i>
		</div>
			<div class="showSelectBox" x-placement="top-start" v-if="dropShow">
			<input autocomplete="off" placeholder="请输入" icon="caret-top" type="text" rows="2" class="myInput" v-model="autoModel" />
			<el-button type="primary" plain style="width: 88px;" @click="checkedAllOrNone('all')">全选</el-button>
			<el-button type="primary" plain style="width: 88px;" @click="checkedAllOrNone('none')">取消全选</el-button>
			<div class="box_scroll">
				<div class="dropDown_wrap">
					<ul class="scroll_ul" v-if="autoList.length != 0">
						<li class="scroll_li" v-for="(lists,index) in autoList" @click="chosenLi(index,lists)" index="index + ''"><span class="fl">{{lists.itemName}}</span><i v-if="lists.flag" class="el-icon-check fr iChosen"></i></li>
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
export default {
	data () {
		return {
			dropShow:false,         //标识下拉框默认是收起下拉
			selectArry:[],            //下拉框的默认展示或者是选中项的id，相当于父组件中定义的v-model的值
			cloneSelect:[],         //当前下拉的克隆数组
			selectChosen:'',        //下拉框上面的div数据，即选中项的字符串
			autoModel:'',           //下拉框中的input框内容
			autoList:[],            //下拉框内容数组
			checkedList:[]          //选中的筛选条件	
		}
	},
	props:{
		//遍历的对象
		items:{
			type: Object,
			required: true,
			default: {}
		},
		//v-model绑定的值
		value:{
			type: Array,
			default: function () {
		        return []
		    }
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
		//渲染时候就将当前下拉框的内容克隆下拉，以便模糊搜索时候对比
		this.cloneSelect = this.deepClone(this.items.data);
		this.$nextTick(res => {
          this.getTables();
      });
	},
	directives: { Clickoutside },
	methods:{
		//渲染时候绑定数据
		getTables() {
			this.selectArry = this.deepClone(this.items.transArr);
			this.selectChosen = this.items.selectChosen;
			this.autoModel = this.items.autoModel;
			this.autoList = this.items.data;
			if(this.items.transArr.length != 0){
				for(let i = 0;i < this.items.transArr.length;i++){
					this.checkedList.push(this.items.transArr[i]);
				}
			}else{
				this.checkedList = [];
			}
		},
		//点击下拉框上面的div，收起和展示下拉
		showMyBox(para) {
			this.dropShow = !this.dropShow;
			//清空input框，使下拉框全部展示
			this.autoModel = "";
		},
		//自定义的失去焦点事件
		handleClose() {
			this.dropShow = false;
		},
		//点击下拉框选中项事件
		chosenLi(paraIndex,para) {
			//给选择做上标记
			this.autoList[paraIndex].flag = !this.autoList[paraIndex].flag;
			//需要同步到基本数组里面
			for(let i = 0;i < this.cloneSelect.length;i++){
				if(this.cloneSelect[i].itemCode == this.autoList[paraIndex].itemCode){
					this.cloneSelect[i].flag = !this.cloneSelect[i].flag;
				}
			}
			//根据是否打钩来添加到筛选框，将选中的项添加到显示div中
			if(this.autoList[paraIndex].flag){
				this.checkedList.push(this.autoList[paraIndex]);
			}else{
				let deleIndex = 0;
				for(let j = 0;j < this.checkedList.length;j++){
					if(this.checkedList[j].itemCode == para.itemCode){
						deleIndex = j;
					}
				}
				this.checkedList.splice(deleIndex,1);
			}
			//将选中数组的值拼接成字符串
			if(this.checkedList.length > 0){
				this.selectChosen = [];
				for(let j = 0;j < this.checkedList.length;j++){
					this.selectChosen.push(this.checkedList[j].itemName);
				}
			}else{
				this.selectChosen = '请选择';
			}
			//赋值给v-model
			this.selectArry = [];
			this.selectArry = this.checkedList;
			//改变这个传入的对象
			this.items.transArr = this.selectArry;
		},
		checkedAllOrNone(para) {
			if(para == 'all'){
				for(let i = 0;i < this.autoList.length;i++){
					this.autoList[i].flag = true;
					//判断选中项中是否已经加入
					let pushFlag = true;
					for(let t = 0;t < this.checkedList.length;t++){
						if(this.checkedList[t].itemCode == this.autoList[i].itemCode){
							pushFlag = false;
							break;
						}
					}
					//如果选中项中没有目前选中的，则添加到选中项中，如果已经有，则不进行操作
					if(pushFlag){
						//将选中项都加入到选中数组里面
						this.checkedList.push(this.autoList[i]);
					}
					//循环原来数组，找出跟当前搜索出来的数组相同的项，同步起来
					for(let j = 0;j < this.cloneSelect.length;j++){
						if(this.autoList[i].itemCode == this.cloneSelect[j].itemCode){
							this.cloneSelect[j].flag = true;
						}
					}
				}
			}else{
				for(let i = 0;i < this.autoList.length;i++){
					this.autoList[i].flag = false;
					//循环选中数组，将当前搜索项的所有项都从选中数组中删除
					for(let j = 0;j < this.checkedList.length;j++){
						if(this.checkedList[j].itemCode == this.autoList[i].itemCode){
							this.checkedList.splice(j,1);
						}
					}
					//循环原来数组，将搜索的所有项都同步给原来数组
					for(let j = 0;j < this.cloneSelect.length;j++){
						if(this.autoList[i].itemCode == this.cloneSelect[j].itemCode){
							this.cloneSelect[j].flag = false;
						}
					}
				}
			}
			//将选中数组的值拼接成字符串
			if(this.checkedList.length > 0){
				this.selectChosen = [];
				for(let j = 0;j < this.checkedList.length;j++){
					this.selectChosen.push(this.checkedList[j].itemName);
				}
			}else{
				this.selectChosen = '请选择';
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
		//手写下拉框的input绑定，模糊查询
	    autoModel:{
	        handler:function(val,oldval){
	        if(!(this.cloneSelect instanceof Array)){
		        return ;
		    }
		    let len = this.cloneSelect.length;
		    let reg = new RegExp(this.autoModel);
		    let newArr = [];
		    //判断是否有匹配的项
		    for(let i = 0;i < len;i++){
		        //如果字符串中不包含目标字符会返回-1
		        if(this.cloneSelect[i].itemName.match(reg) != null){
		        	newArr.push(this.cloneSelect[i]);
		        }
		    }
		    //匹配成功，展示匹配成功的新数组
		    if(newArr.length > 0){
		    	this.autoList = [];
		    	this.autoList = this.deepClone(newArr);
		    }else{
		    	this.autoList = [];
		    }
		        },
		        deep:true
		},
		changeList:{
	        handler:function(val,oldval){
	        	console.log(val);
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