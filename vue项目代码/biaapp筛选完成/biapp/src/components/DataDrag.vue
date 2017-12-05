<!--拖拽生成报表页面-->
<template>
	<el-row class="tac">
		<el-col :span="4">
			<el-menu mode="vertical" default-active="null" class="el-menu-vertical-demo">
				<div class="changeTable">
					<p class="changeTableTop">工作表</p>
					<div>
						<p class="fl nowTb">yw_order</p>
						<el-button type="text" class="addReport fr nowTbChange" @click="dialogFormVisible = true">更改</el-button>
					</div>
				</div>
				<p class="changeTableTfield">字段</p>
				<draggable class="dragClass" element="ul" v-model="tableDragList" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
					<transition-group type="transition" :name="'flip-list'">
						<el-menu-item class="dragItem" v-for="(item, index) in tableDragList" :key="item.id" :index="index + ''"><img v-bind:src="item.imageUrl" class="imgDrag" />{{item.name}}</el-menu-item>
					</transition-group>
				</draggable>
			</el-menu>
		</el-col>
		<el-col :span="17">
			<el-row class="backgroundColor paddChange">
				<el-col :span="24">
					<div class="xyzClass">
						<p class="xyzClassTitle fl">类别（X轴）</p>
						<draggable element="div" v-model="tableDragedListX" :options="dragedOptions" :move="onMove" class="dragClone"> 
							<transition-group name="no" class="list-group dragHover dragHeight" tag="ul" style="height: 35px;">
  							<div style="position: relative;" class="DragText fl" v-for="(drag, index) in tableDragListX" key="drag.id" index="index + ''">
  								<div @click="UlClick($event)">
  									<span>{{drag.name}}<span v-if="drag.children">({{change(drag.choseActive)}})</span><i class="el-icon-circle-cross deleteDrag" @click="deleteDragX(index)"></i></span>
  								</div>
  								<ul v-if="drag.children" style="transform-origin: center top 0px; z-index: 2001; position: absolute; top: 26px; left: 15px;display: none;" x-placement="bottom-end" class="el-dropdown-menu dragUl">
  									<li v-for="(downItem, index) in drag.children" @click="chooseLi(drag,downItem.id,$event)" :class="{'active myLi':drag.choseActive==downItem.id,'unactive myLi':!(drag.choseActive==downItem.id)}" v-bind:id="downItem.id">{{downItem.name}}</li>
  								</ul>
  							</div>
    					</transition-group>
      			</draggable>
					</div>
				</el-col>
				<el-col :span="24">
					<div class="xyzClass">
						<p class="xyzClassTitle fl">数值（Y轴）</p>
						<draggable element="div" v-model="tableDragedListY" :options="dragedOptions" :move="onMove" class="dragClone">
							<transition-group name="no" class="list-group dragHover dragHeight" tag="ul" style="height: 35px;">
  							<div style="position: relative;" class="DragText fl" v-for="(drag, index) in tableDragListY" key="drag.id" index="index + ''">
  								<div @click="UlClick($event)">
  									<span>{{drag.name}}<span v-if="drag.children">({{change(drag.choseActive)}})</span><i class="el-icon-circle-cross deleteDrag" @click="deleteDragY(index)"></i></span>
  								</div>
  								<ul v-if="drag.children" style="transform-origin: center top 0px; z-index: 2001; position: absolute; top: 26px; left: 15px;display: none;" x-placement="bottom-end" class="el-dropdown-menu dragUl">
  									<li v-for="(downItem, index) in drag.children" @click="chooseLi(drag,downItem.id,$event)" :class="{'active myLi':drag.choseActive==downItem.id,'unactive myLi':!(drag.choseActive==downItem.id)}" v-bind:id="downItem.id">{{downItem.name}}</li>
  								</ul>
  							</div>
    					</transition-group>
      			</draggable>
					</div>
				</el-col>
				<el-col :span="24">
					<div class="xyzClass">
						<p class="xyzClassTitle fl">系列（图例）</p>
						<draggable element="div" v-model="tableDragedListS" :options="dragedOptions" :move="onMove" class="dragClone"> 
							<transition-group name="no" class="list-group dragHover dragHeight" tag="ul" style="height: 35px;">
  							<div style="position: relative;" class="DragText fl" v-for="(drag, index) in tableDragListS" key="drag.id" index="index + ''">
  								<div @click="UlClick($event)">
  									<span>{{drag.name}}<span v-if="drag.children">({{change(drag.choseActive)}})</span><i class="el-icon-circle-cross deleteDrag" @click="deleteDragS(index)"></i></span>
  								</div>
  								<ul v-if="drag.children" style="transform-origin: center top 0px; z-index: 2001; position: absolute; top: 26px; left: 15px;display: none;" x-placement="bottom-end" class="el-dropdown-menu dragUl">
  									<li v-for="(downItem, index) in drag.children" @click="chooseLi(drag,downItem.id,$event)" :class="{'active myLi':drag.choseActive==downItem.id,'unactive myLi':!(drag.choseActive==downItem.id)}" v-bind:id="downItem.id">{{downItem.name}}</li>
  								</ul>
  							</div>
    					</transition-group>
      			</draggable>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="selectFiled clearfix">
						<span class="fl selectTop">筛选器</span>
						<draggable element="div" v-model="tableDragedListC" :options="dragOptions" :move="onMove"> 
							<transition-group name="no" class="list-group dragHover dragHeight" tag="ul" style="height: 405px;">
  							<div class="forList clearfix" v-for="(item, indexs) in tableDragedListC" key="item.id" index="indexs + ''" @click="updateCon(indexs,item.classify,item)">
  								<span class="fl forTip">{{item.name}}</span>
  								<span class="fl manyCon" v-if="item.conditions?item.conditions.length>1:0">满足条件之一：</span>
  								<span class="fl manyCon" v-if="item.classify == 'dateTime'">全部时间</span>
  								<ul class="fl conUl" v-if="item.classify != 'dateTime'">
    								<li v-for="(condition, index) in item.conditions" index="index + ''" class="conLis">
    									<span>{{change(condition.conName)}}</span>
    									<span style="margin-left: 8px;">{{condition.conFirstValue}}</span>
    									<span style="margin-left: 5px;">{{condition.conSeconValue}}</span>
    								</li>
    							</ul>
    							<ul class="fl conUl" v-else>
    								<li v-for="(condition, index) in item.children" @click="dateTimeClick(condition,$event,indexs)" :class="{'conLi hoverLi':item.choseActive==condition.id,'unconLi hoverLi':!(item.choseActive==condition.id)}">{{condition.name}}</li>
    							</ul>
  							</div>
    			</transition-group>
      		</draggable>
					</div>
				</el-col>
				<el-col :span="20">
					<div class="showFiled">
						<div class="showReport">

						</div>
					</div>
				</el-col>
			</el-row>
		</el-col>
		<el-col :span="3">
			<div style="height: 540px;border-left: 1px solid #CCCCCC;" class="backgroundColor"></div>
		</el-col>
		<!--选择更换表弹出框-----start-->
		<el-dialog title="" :visible.sync="dialogFormVisible" style="width: 40%;margin: 0 auto;" :show-close="false" :close-on-press-escape="true">
			<p class="folderP">选择工作表</p>
			<el-menu style="background-color: transparent;text-align: left;" default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :unique-opened="true">
				<el-submenu v-for="(item, index) in dashTableList" :index="index + ''">
					<template slot="title"><img class="folderOpen" src="../../static/images/folderClose.png" />{{item.folderName}}</template>
					<el-radio-group v-model="item.chooseItem" class="turnWhite widthAll" @change="radioChange">
						<el-radio v-for="(radios,index) in item.folderChidren" :label="radios.tableId" class="folderRadio">{{radios.tableName}}</el-radio>
					</el-radio-group>
				</el-submenu>
			</el-menu>
			<div slot="footer" class="dialog-footer">
				<p class="dialogTip" v-if="dialogTip">请先选择工作表</p>
				<el-button @click="dialogFormVisible = false" class="dialogBtn">取 消</el-button>
				<el-button type="primary" @click="comfirmTable" class="dialogBtn">确 定</el-button>
			</div>
		</el-dialog>
		<!--选择更换表弹出框-----end-->
		<!--筛选弹出框-----start-->
							<el-dialog class="selectClass" title="" :visible.sync="selectVisible" style="width: 70%;margin: 0 auto;" :show-close="true" :close-on-press-escape="true">
								<p class="selectP">筛选条件</p>
								<div class="clearfix">
									<span class="selectTip">{{tablePapObjC.name}}</span>
									<div class="selsetCon">
										<el-select class="mySelect" v-model="tablePapObjC.choseActive" placeholder="" @change="selectChange">
    									<el-option v-for="item in tablePapObjC.children" :key="item.id" :label="item.name" :value="item.id"></el-option>
  									</el-select>
  									<input v-if="tablePapObjC.choseActive!='bt'" class="selectInput" v-model="tablePapObjC.firstChosen" placeholder="请输入数值" @keydown="putIn($event,tablePapObjC.firstChosen,tablePapObjC.classify)"/>
  									<div class="bettwenSelect" v-else>
  										<input class="firstInput" v-model="tablePapObjC.firstChosen" placeholder="请输入数值" @keydown="putIn($event,tablePapObjC.firstChosen,tablePapObjC.classify)"/>
  										<span class="fl bettwenSpan">~</span>
  										<input class="firstInput" v-model="tablePapObjC.seconChosen" placeholder="请输入数值" @keydown="putIn($event,tablePapObjC.seconChosen,tablePapObjC.classify)"/>
  									</div>
									</div>
									<!--添加的筛选条件数组遍历-->
									<div class="selsetCon">
										<div class="selsetConInner" v-for="(addSelects,index) in tablePapListC">
										<el-select class="mySelect" v-model="addSelects.choseActive" placeholder="">
    									<el-option v-for="item in addSelects.children" :key="item.id" :label="item.name" :value="item.id"></el-option>
  									</el-select>
  									<input v-if="addSelects.choseActive!='bt'" class="selectInput" v-model="addSelects.firstChosen" placeholder="请输入数值" @keydown="putIn($event,addSelects.firstChosen,addSelects.classify)"/>
  									<div class="bettwenSelect" v-else>
  										<input class="firstInput" v-model="addSelects.firstChosen" placeholder="请输入数值" @keydown="putIn($event,addSelects.firstChosen,addSelects.classify)"/>
  										<span class="fl bettwenSpan">~</span>
  										<input class="firstInput" v-model="addSelects.seconChosen" placeholder="请输入数值" @keydown="putIn($event,addSelects.seconChosen,addSelects.classify)"/>
  									</div>
  									<span class="removeCon fr" @click="removeCon(index)">移除</span>
									</div>
									</div>
								</div>
								<span class="addCon" @click="addConditions(tablePapObjC)">+ 筛选条件</span>
								<div slot="footer" class="dialog-footer">
									<p class="dialogConTip" v-if="dialogConTip">请输入正确的数字</p>
									<el-button @click="closeSelect" class="dialogBtn">取 消</el-button>
									<el-button type="primary" @click="saveConditions(tablePapObjC.classify)" class="dialogBtn">保 存</el-button>
								</div>
							</el-dialog>
							<!--筛选弹出框-----end-->
	</el-row>
</template>

<script>
	import Vue from 'vue'
	import ElementUI from 'element-ui'
	import draggable from 'vuedraggable'

	export default {
		name: 'DataDrag',
		components: {
			draggable,
		},
		data() {
			return {
				value:"",
				dragListAll:[],  //保存当前所有表字段
				tableDragList: [], //可拖拽的表字段
				tableDragedListX:[],   //已被拖拽到展示区的表字段X轴
				tableDragedListY:[],   //已被拖拽到展示区的表字段Y轴
				tableDragedListS:[],   //已被拖拽到展示区的表字段S轴
				tableDragedListC:[],   //已被拖拽到展示区的表字段筛选区域
				tableDragListX:[],   //已被拖拽到展示区的表字段X轴的深度clone数组
				tableDragListY:[],   //已被拖拽到展示区的表字段Y轴的深度clone数组
				tableDragListS:[],   //已被拖拽到展示区的表字段S轴的深度clone数组
				tableDragListC:[],  //已被拖拽到展示区的表字段筛选区域的深度clone数组
				tablePapListC:[],   //存放每一次弹出框的筛选条件
				tablePapObjC:{},   //筛选弹出框展示对象
				dialogTableVisible: false,
				dialogFormVisible: false,
				//
				dashTableList: [], //弹出框中文件夹表格的选择数组
				radio2: 3, //选中radio的默认值（需要加逻辑判断）
				dialogTip: false, //弹出框的提示
				//
				editable: true,
				isDragging: false,
				delayedDragging: false,
				downChose:'',    //默认选中样式
				dropDown:false,      //拖拽后的下拉标识(boolen)
				selectVisible:false,    //筛选弹出框
				inputShow:true,    //筛选条件为介于时候单独input框的展示
				dialogConTip:false,   //筛选框的验证小提示
				popIndex:0,      //弹出框包含的拖拽index
				listFlag:'all',     //标识那个list往外拖拽了，表字段为默认为all，三个轴为top，筛选为bottom
				flags:'null'    
			}
		},
		mounted: function() {
			this.$nextTick(res => {
				this.getTables();
			});
		},
		methods: {
			//选择要编辑的表
			radioChange(value) {
				//获取到选择的表的索引

			},
			handleOpen(key, keyPath) {
				//打开之前把别的文件夹里的选中项去掉
				for(var i = 0; i < this.dashTableList.length; i++) {
					if(key != i) {
						this.dashTableList[i].chooseItem = null;
					}
				}
				//切换文件夹图片的开和关
				document.getElementsByClassName("folderOpen")[key].src = "../../static/images/folderOpen.png";
			},
			handleClose(key, keyPath) {
				document.getElementsByClassName("folderOpen")[key].src = "../../static/images/folderClose.png";
			},
			//点击弹出框的确定按钮
			comfirmTable() {
				let radioFlag = false;
				let radioChoose = ''; //工作表的选择索引
				let chooseName = ''; //最后选中的工作表的名字
				for(var i = 0; i < this.dashTableList.length; i++) {
					if(this.dashTableList[i].chooseItem != null) {
						radioFlag = true;
						radioChoose = this.dashTableList[i].chooseItem;
						chooseName = this.dashTableList[i].folderChidren.tableName;
						break;
					}
				}
				if(radioFlag) {
					//验证通过，弹出框关闭
					this.dialogFormVisible = false;
					//跳转到报表编辑页面
					this.$router.push({
						name: 'dataDrag',
						query: {
							"radioChoose": radioChoose,
							"chooseName": chooseName
						}
					});
				} else {
					this.dialogTip = true;
				}
			},
			//渲染数据源
			getTables() {
				//假数据
				this.tableDragList = [{
					name: "id",
					id: "001",
					imageUrl: "../../static/images/folderOpen.png",
					flag:'text'   
				}, {
					name: "datatime",
					id: "002",
					imageUrl: "../../static/images/folderClose.png",
					classify:'dateTime',    //这个字段的类型
					flag:'date',     			//用于展示默认选项，比如默认展示按日
					choseActive:'date',
					children:[{          //有的话就有children这个字段，没有就没有这个字段
						name:"按年",
						id:'year'
					},
					{
						name:"按季",
						id:'season'
					},
					{
						name:"按月",
						id:'month'
					},{
						name:"按周",
						id:'week'
					},{
						name:"按日",
						id:'date'
					}]
				}, {
					name: "线索量",
					id: "0010",
					imageUrl: "../../static/images/number.png",
					classify:'number',    //这个字段的类型
					flag:'date',     			//用于展示默认选项，比如默认展示按日
					choseActive:'eq',
					children:[{          //有的话就有children这个字段，没有就没有这个字段
						name:"等于",
						id:'eq'
					},
					{
						name:"不等于",
						id:'noeq'
					},
					{
						name:"大于",
						id:'gt'
					},{
						name:"小于",
						id:'lt'
					},{
						name:"大于等于",
						id:'gteq'
					},{
						name:"小于等于",
						id:'lteq'
					},{
						name:"介于",
						id:'bt'
					}]
				}, {
					name: "城市",
					id: "0011",
					imageUrl: "../../static/images/text.png",
					classify:'text',    //这个字段的类型
					flag:'date',     			//用于展示默认选项，比如默认展示按日
					choseActive:'dy',
					children:[{          //有的话就有children这个字段，没有就没有这个字段
						name:"等于",
						id:'dy'
					},
					{
						name:"不等于",
						id:'nody'
					},
					{
						name:"包含",
						id:'bh'
					},{
						name:"不包含",
						id:'nobh'
					},{
						name:"结尾包含",
						id:'ebh'
					},{
						name:"头部包含",
						id:'fbh'
					}]
				}, {
					name: "ceator",
					id: "003",
					imageUrl: "../../static/images/datetime.png",
					flag:'number'
				}, {
					name: "source",
					id: "004",
					imageUrl: "../../static/images/text.png",
					flag:'datetime'
				}, {
					name: "user_id",
					id: "005",
					imageUrl: "../../static/images/number.png",
					flag:'datetime'
				}, {
					name: "userdata_id",
					id: "006",
					imageUrl: "../../static/images/folderClose.png",
					flag:'text'
				}, {
					name: "serise_id",
					id: "007",
					imageUrl: "../../static/images/folderOpen.png",
					flag:'text'
				}];
				//深拷贝一份当前表格的表字段，防止拖拽之后字段消失
				this.dragListAll = this.deepClone(this.tableDragList);
				this.dashTableList = [{
					folderName: 'dwd',
					folderId: '001',
					chooseItem: '001001',
					folderChidren: [{
						tableName: 'yw_order',
						tableId: '001001',
						parentId: '001'
					}, {
						tableName: 'yw_master',
						tableId: '001002',
						parentId: '001'
					}, {
						tableName: 'yw_father',
						tableId: '001003',
						parentId: '001'
					}]
				}, {
					folderName: 'dim',
					folderId: '002',
					chooseItem: 'null',
					folderChidren: [{
						tableName: 'yw_killer',
						tableId: '002001',
						parentId: '002'
					}]
				}];
			},
			onMove({
				relatedContext,
				draggedContext
			}) {
				const relatedElement = relatedContext.element;
				const draggedElement = draggedContext.element;
				return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
			},
   		//删除已经拖拽的表字段
   		deleteDragX(indexPara,e) {
   			this.stopBubble(e);
   			this.tableDragedListX.splice(indexPara,1);
   		},
   		deleteDragY(indexPara,e) {
   			this.stopBubble(e);
   			this.tableDragedListY.splice(indexPara,1);
   		},
   		deleteDragS(indexPara,e) {
   			this.stopBubble(e);
   			this.tableDragedListS.splice(indexPara,1);
   		},
   		UlClick(e) {
				//点击进行显示与隐藏的来回切换
				var displayUl = e.currentTarget.parentNode.getElementsByClassName("dragUl")[0];
				var displayCss = '';
				if(displayUl){
					displayCss = displayUl.style.display;
					if(displayCss == "none"){
						e.currentTarget.parentNode.getElementsByClassName("dragUl")[0].style.display = 'block';
					}else{
						e.currentTarget.parentNode.getElementsByClassName("dragUl")[0].style.display = 'none';
					}
				}else{
					return;
				} 
			},
   		//点击每一个下拉列表项
   		chooseLi(para,liId,e) {
   			//将选中项的id同步到显示上面
   			para.flag = liId;
   			e.currentTarget.parentNode.style.display = 'none';
   			para.choseActive = liId;
   			//用于操作数组之后保存给拖拽数组，使拖拽数组与拖拽展示数组相同
   			this.tableDragedListX = this.tableDragListX;
   			this.tableDragedListY = this.tableDragListY;
   			this.tableDragedListS = this.tableDragListS;
   		},
   		//添加筛选条件
   		addConditions(para) {
   			let newSelect = this.deepClone(para);
   			//此处判断需要跟莹莹商量，是否等于的关键字是同一个，都是eq，清空新添加的筛选条件
   			if(newSelect.classify == 'number'){
   				newSelect.choseActive = 'eq';
   				newSelect.firstChosen = '';
   				newSelect.seconChosen = '';
   			}else if(newSelect.classify == 'text'){
   				newSelect.choseActive = 'eq';
   				newSelect.firstChosen = '';
   				newSelect.seconChosen = '';
   			}
   			this.tablePapListC.push(newSelect);
   		},
   		//改变下拉框的值时改变填写条件
   		selectChange(selected) {
				return selected;
   		},
   		//删除筛选条件
   		removeCon(para) {
   			this.tablePapListC.splice(para,1);
   		},
   		//筛选条件的保存========================有时间封装一下哦
   		saveConditions(para){
   			let addDeCons = {};
   			let addAdCons = {};
   			let deFlag = true;
   			let addFlag = true;
   			//先判断弹框默认就有的筛选条件 ====================莹莹“介于”的关键字
   			if(this.tablePapObjC.choseActive!='bt' && this.tablePapObjC.firstChosen != "" && this.decimalPoint(this.tablePapObjC.firstChosen,this.tablePapObjC.classify)){
   				//未选择“介于”，也就是只需要验证一个input框
   				deFlag = true;
   			}else if(this.tablePapObjC.choseActive!='bt' && this.tablePapObjC.firstChosen == ""){
   				//未选择“介于”，也就是只需要验证一个input框
   				deFlag = true;
   			}else if(this.tablePapObjC.choseActive=='bt'){
   				//选择“介于”
   				if(this.tablePapObjC.firstChosen != "" && this.tablePapObjC.seconChosen != "" && this.decimalPoint(this.tablePapObjC.firstChosen,this.tablePapObjC.classify) && this.decimalPoint(this.tablePapObjC.seconChosen,this.tablePapObjC.classify)){
   					//选择“介于”同时都不为空
   					deFlag = true;
   				}else if(this.tablePapObjC.firstChosen != "" && this.tablePapObjC.seconChosen == "" && this.decimalPoint(this.tablePapObjC.firstChosen,this.tablePapObjC.classify)){
   					//选择“介于”第一个不为空
   					deFlag = true;
   				}else if(this.tablePapObjC.firstChosen == "" && this.tablePapObjC.seconChosen != "" && this.decimalPoint(this.tablePapObjC.seconChosen,this.tablePapObjC.classify)){
   					//选择“介于”第二个不为空
   					deFlag = true;
   				}else if(this.tablePapObjC.firstChosen == "" && this.tablePapObjC.seconChosen == ""){
   					//选择“介于”两个都为空
   					deFlag = true;
   				}else{
   					deFlag = false;
   				}
   			}else{
   				deFlag = false;
   			}
   			//先判断弹框默认就有的筛选条件 ====================莹莹“介于”的关键字
   			for(var j = 0;j < this.tablePapListC.length;j++){
   				if(this.tablePapListC[j].choseActive!='bt' && this.tablePapListC[j].firstChosen != "" && this.decimalPoint(this.tablePapListC[j].firstChosen,this.tablePapListC[j].classify)){
   					addFlag = true;
   				}else if(this.tablePapListC[j].choseActive!='bt' && this.tablePapListC[j].firstChosen == ""){
   					addFlag = true;
   				}else if(this.tablePapListC[j].choseActive=='bt'){
   					if(this.tablePapListC[j].firstChosen != "" && this.tablePapListC[j].seconChosen != "" && this.decimalPoint(this.tablePapListC[j].firstChosen,this.tablePapListC[j].classify) && this.decimalPoint(this.tablePapListC[j].seconChosen,this.tablePapListC[j].classify)){
   						addFlag = true;
   					}else if(this.tablePapListC[j].firstChosen != "" && this.tablePapListC[j].seconChosen == "" && this.decimalPoint(this.tablePapListC[j].firstChosen,this.tablePapListC[j].classify)){
   						addFlag = true;
   					}else if(this.tablePapListC[j].firstChosen == "" && this.tablePapListC[j].seconChosen != "" && this.decimalPoint(this.tablePapListC[j].seconChosen,this.tablePapListC[j].classify)){
   						addFlag = true;
   					}else if(this.tablePapListC[j].firstChosen == "" && this.tablePapListC[j].seconChosen == ""){
   						addFlag = true;
   					}else{
   						addFlag = false;
   					}
   				}else{
   					addFlag = false;
   				}
   				if(addFlag == false){
   					break;
   				}
   			}
   			if(deFlag == true && addFlag == true){
   				//将另外添加的筛选条件组清空
   				this.tablePapObjC.conditions = [];
   				//添加默认的和另外增加的条件到属性里面
   				addDeCons = {
   					conName:this.tablePapObjC.choseActive,
   					conFirstValue:this.tablePapObjC.firstChosen,
   					conSeconValue:this.tablePapObjC.seconChosen
   				};
   				if(this.tablePapObjC.saved){
   					//不再添加，而是修改
   					this.tablePapObjC.conditions[0] = addDeCons;
   				}else{
   					this.tablePapObjC.conditions.push(addDeCons);
   				}
   				//添加另外的
   				for(var i = 0;i < this.tablePapListC.length;i++){
   					addAdCons = {
   						conName:this.tablePapListC[i].choseActive,
   						conFirstValue:this.tablePapListC[i].firstChosen,
   						conSeconValue:this.tablePapListC[i].seconChosen
   					};
   					this.tablePapObjC.conditions.push(addAdCons);
   				}
   				//将所有改变的都赋值给筛选区域，分为第一次拖拽弹框和修改弹框
   				if(this.tablePapObjC.saved){
   					this.tableDragedListC[this.popIndex] = this.tablePapObjC;
   				}else{
   					this.tableDragedListC[this.flags] = this.tablePapObjC;
   				}
   				this.tablePapObjC.saved = true;
   				//恢复拖拽到区域的索引值
   				this.flags = 'null'
   				this.selectVisible = false;
   				//如果是修改弹框的话，需要得到修改的index=============================
   			}else{
   				//出现小提示
   				this.dialogConTip = true;
   			}
   		},
   		//点击筛选区域已经选择好的筛选条件
			updateCon(paraIndex,classify,para) {
				let tablePapObjCopy = {};
				if(classify != 'dateTime'){
					this.tablePapObjC = {};
					this.tablePapListC = [];
					this.tablePapObjC = this.deepClone(this.tableDragedListC[paraIndex]);
					//跟添加筛选条件为导向思维，需要根据已经合并的筛选条件而反向添加已经填写完毕的对象
					for(var i = 1;i < this.tablePapObjC.conditions.length;i++){
						tablePapObjCopy = this.deepClone(this.tablePapObjC);
						tablePapObjCopy.choseActive = this.tablePapObjC.conditions[i].conName;
						tablePapObjCopy.firstChosen = this.tablePapObjC.conditions[i].conFirstValue;
						tablePapObjCopy.seconChosen = this.tablePapObjC.conditions[i].conSeconValue;
						this.tablePapListC.push(tablePapObjCopy);
					}
					this.selectVisible = true;
					this.popIndex = paraIndex;
				}else{
					
				}
			},
   		//关闭筛选框
			closeSelect() {
				this.selectVisible = false;
				//如果保存过，则不删除拖拽区域对应的数组内容
				if(this.tablePapObjC.saved){
					//如果是已经保存之后的修改筛选框，可以在点击修改按钮之后先保存一份原来的
				}else{
					this.tableDragedListC.splice(this.flags,1);
				}
				this.tablePapObjC = {};
				this.dialogConTip = false;
			},
			//验证筛选框中数字只能是小数点和数字
			putIn(e,para,classify){
				//如果是数值类型则需要验证，反之不需要，等调接口时候改
				if(classify == 'number'){
					let keyCode = e.keyCode;
					if(keyCode >= 48 && keyCode <= 57 || keyCode === 190 || keyCode === 8 || keyCode >= 96 && keyCode <= 105) {
						//不做操作，有一个bug，获取不了第一个输入的值，目前通过保存按钮来控制是否是数字
					} else {
						let num = (para + "" + e.key);
						if(/^[0-9]+(.[0-9])?$/.test(num)) {
						} else {
							if(e.keyCode === 8) {
								return;
							}
							e.preventDefault();
						}
					}
				}else{}
			},
			//筛选区域为日期型时候的点击事件切换样式
			dateTimeClick(para,e,paraIndex) {
				this.tableDragedListC[paraIndex].choseActive = para.id;
			},
			//确定数值时候小数点只能是一个或者没有
			decimalPoint(para,classify) {
				//判断类型
				if(classify == 'number'){
					//不是小数
					if(para.indexOf('.') < 0){
						return true;
					}else{
						//只填写了一个小数点
						if(para.length == 1){
							return false;
						}else if(para.split('.').length > 2){
							//有多个小数点
							return false;
						}else if(para.indexOf('.') == (para.length - 1)){
							//数字最后一个是小数点
							return false;
						}else if(para.indexOf('.') == 0){
							//数字第一个是小数点
							return false;
						}else{
							return true;
						}
					}
				}else{
					return true;
				}
				
			},
			//深拷贝
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
   		change(arr) {
   			var ss="";
   			switch(arr){
					case 'date':ss = '按日';
					break;
					case 'month':ss = '按月';
					break;
					case 'season':ss = '按季';
					break;
					case 'year':ss = '按年';
					break;
					case 'week':ss = '按周';
					break;
					case 'eq':ss = '等于';
					break;
					case 'lt':ss = '小于';
					break;
					default:ss = '待转换';
   		}
   			return ss;
   		},
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
		},
		computed: {
			//对拖拽区域的设置
			dragOptions() {
				return {
					animation: 0,
					group: 'description',
					disabled: !this.editable,
					ghostClass: 'ghost',
        	sort:false        //阻止在内部拖拽
				};
			},
			//可以更换拖拽后的顺序
			dragedOptions() {
				return {
					animation: 0,
					group: 'description',
					disabled: !this.editable,
					ghostClass: 'ghost',
					sort:true
				};
			}
		},
		watch: {
			isDragging(newValue) {
				if(newValue) {
					this.delayedDragging = true
					return
				}
				this.$nextTick(() => {
					this.delayedDragging = false;
				})
			},
			tableDragList(newValue,oldValue){
				this.tableDragList = this.dragListAll;
				this.listFlag = 'all';
			},
			tableDragedListX(newValue,oldValue){
				if(newValue < oldValue){
					this.listFlag = 'top';
				}
				//不允许筛选区域的字段拖拽到三个轴字段
				if(this.listFlag != 'bottom'){
					this.tableDragListX = this.deepClone(newValue);
				}else{}
			},
			tableDragedListY(newValue,oldValue){
				if(newValue < oldValue){
					this.listFlag = 'top';
				}
				if(this.listFlag != 'bottom'){
					this.tableDragListY = this.deepClone(newValue);
				}else{}
			},
			tableDragedListS(newValue,oldValue){
				if(newValue < oldValue){
					this.listFlag = 'top';
				}
				if(this.listFlag != 'bottom'){
					this.tableDragListS = this.deepClone(newValue);
				}else{}
			},
			tableDragedListC(newValue,oldValue){
				//先确定拖拽到数组的索引值，this.flags
				if(newValue > oldValue){
					for(var i = 0;i < oldValue.length;i++){
						if(newValue[i].id != oldValue[i].id){
							this.flags = i;
							break;
						}else{}
					}
					if(this.flags == 'null'){
						this.flags = newValue.length - 1;
					}
				}
				let repeatFlag = true;
				this.tablePapObjC = {};
				if(newValue.length > oldValue.length){
					//这个拖拽区域比较特殊，在此处需要对listFlag赋值一遍
					if(this.listFlag != 'top'){
						this.listFlag = 'bottom';
						//检查是否已经是拖拽过的表字段
						for(var k = 0;k < oldValue.length;k++){
							if(newValue[this.flags].id == oldValue[k].id){
								repeatFlag = false;
								break;
							}
						}
						//没有重复字段
						if(repeatFlag){
							//根据拖拽的字段类型不同，弹框或者直接展示
							if(newValue[this.flags].classify != 'dateTime'){
								//因为是按顺序进入这个数组，所以可以获取刚进入到数组的筛选条件对象，其实是在数组的最前面
								this.tablePapObjC = this.deepClone(newValue[this.flags]);
								this.selectVisible = true;
								this.tablePapObjC.firstChosen = '';   //筛选数值型选择介于时候的两个input框
								this.tablePapObjC.seconChosen = '';
								this.tablePapObjC.saved = false;     //用于标识这个筛选条件是否被保存，在点击保存按钮之后，这个标识会变成true
								this.tablePapObjC.conditions = [];  //用于存放保存的筛选条件
								//清除增加的筛选条件数组的原本内容
								this.tablePapListC = [];
							}else{
								//不做操作
								this.flags = 'null';
							}
						}else{
							this.tableDragedListC.splice(this.flags,1);
						}
					}else{
						this.tableDragedListC.splice(this.flags,1);
					}
				}else{
					this.listFlag = 'bottom';
				}
			},
			//监听增加的筛选条件
			tablePapListC(newValue,oldValue){
//				console.log(newValue.length);
			},
			//监听弹出框对象，防止拖拽还原之后出错
			tablePapObjC(newValue,oldValue){
				if(newValue == undefined){
					this.tablePapObjC = {};
				}
			}
		}
	}
</script>

<style>
	.flip-list-move {
  	transition: transform 0.5s;
	}
	.backgroundColor {
		background: rgba(128, 133, 144, .06);
	}
	.paddChange {
		padding: 0 8px 8px 8px;
	}
	.dragClass {
		text-align: left;
		margin-left: 10px;
		padding-bottom: 20px;
	}
	.imgDrag {
		margin-right: 10px;
	}
	.changeTable {
		border-bottom: 1px solid #ccc;
		height: 80px;
		margin-top: 20px;
	}
	.changeTableTop {
		color: #999;
		text-align: left;
		margin: 20px 0 20px 30px;
	}
	.changeTableTfield {
		color: #999;
		text-align: left;
		margin: 20px 0 0 30px;
	}
	.nowTb {
		margin-left: 30px;
		font-size: 15px;
	}
	.nowTbChange {
		margin-right: 30px;
		margin-top: -6px;
	}
	/*选择工作表样式*/
	.dialogTip {
		color: red;
		float: left;
		width: 100px;
		text-align: left;
		font-size: 13px;
		line-height: 30px;
	}
	.folderUl {
		margin-top: 10px;
		text-align: left;
	}
	.folderOpen {
		float: left;
		vertical-align: bottom;
		margin-right: 8px;
		margin-left: -20px;
		margin-top: 20px;
	}
	.folderP {
		margin-top: -30px;
		text-align: left;
		border-bottom: 1px solid #ccc;
		color: #999;
		height: 25px;
	}
	.folderRadio {
		display: block;
		margin-top: 8px;
	}
	.folderRadio:first-of-type {
		margin-left: 15px;
	}
	.dialogBtn {
		width: 50px;
		height: 32px;
		font-size: 12px;
		padding-left: 11px;
	}
	/*拖拽区域的样式*/
	.xyzClass {
		height: 40px;
		border-bottom: 1px solid #CCCCCC;
	}
	.xyzClass .xyzClassTitle {
		font-size: 14px;
		color: #aaa;
		line-height: 40px;
		text-align: left;
		height: 30px;
	}
	.xyzClass .DragText {
		font-size: 12px;
		color: #fff;
		line-height: 26px;
		text-align: left;
		background-color: #4392FF;
		height: 26px;
		cursor: pointer;
		margin: 10px 10px 0 0;
		border-radius: 10px;
		padding: 0 10px;
	}
	.selectFiled {
		border-right: 1px solid #CCCCCC;
		height: 405px;
	}
	.showFiled {
		height: 405px;
		padding: 8px 0 8px 8px;
		box-sizing: border-box;
	}
	.showFiled .showReport {
		background-color: #fff;
		height: 100%;
		width: 100%;
	}
	.dragItem{
		height: 40px;
		cursor: move;
	}
	.dragClone{
		width: 100%;
		height: 35px;
		text-align: left;
		line-height: 40px;
	}
	.dragHeight{
		height: 35px;
	}
	.dragHover:hover .deleteDrag{
		visibility: visible;
	}
	.deleteDrag{
		margin-left: 6px;
		visibility: hidden;
	}
	.deleteDrag:hover{
		opacity: 0.8;
	}
	.downClass{
		font-size: 12px;
	}
	/*自己的下拉框*/
	.myLi{
		color: #000;
		text-indent: 10px;
	}
	.myLi:hover{
		background-color: #F6F6F6;
	}
	/*根据点击动态切换类名*/
	.active{
		color: #4392FF;
	}
	.unactive{
		color: #000;
	}
	/*筛选弹出框*/
	.selectP{
		margin-top: -55px;
		text-align: left;
		color: #999;
		height: 25px;
		font-size: 13px;
	}
	/*------------------------改了内部样式，可能会影响别的*/
	.selectClass .el-dialog__headerbtn{
		font-size: 12px;
		height: 20px;
	}
	.mySelect{
		margin-right: 30px;
		width: 40px;
		float: left;
		margin-left: 30px;
		font-size: 13px;
	}
	.mySelect .el-input{
		height: 25px;
		padding-top: 10px;
		box-sizing: border-box;
	}
	.mySelect .el-input__inner{
		width: 60px;
		border: none;
		border-bottom: 1px solid #4392FF;
		border-radius: 0;
		height: 20px;
		padding: 0;
		float: left;
		height: 20px;
		line-height: 20px;
		font-size: 12px;
	}
	.mySelect .el-input__icon{
		width: 10px;
		height: 10px;
		left: 95%;
		float: right;
		margin: 10px 0 0 15px;
	}
	.selectInput{
		float: left;
		width: 180px;
		height:30px;
		margin-left: 30px;
		border: none;
		border-bottom: 1px solid #4392FF;
		border-radius: 0;
		line-height: 40px;
		font-size: 12px;
	}
	.addCon{
		font-size: 12px;
		color: #4392FF;
		cursor: pointer;
	}
	.selsetCon{
		overflow: hidden;
		margin-top: 10px;
		float: left;
		width: 85%;
	}
	.selectTip{
		font-size: 13px;
		float: left;
		width: 15%;
		margin-top: 10px;
	}
	.mySelect .el-select-dropdown__item{
		font-size: 12px !important;
	}
	.removeCon{
		font-size: 12px;
		color: #4392FF;
		cursor: pointer;
		margin-right: 10px;
	}
	.selsetConInner{
		overflow: hidden;
		margin-top: 10px;
		float: left;
		width: 100%;
	}
	.bettwenSelect{
		float: left;
		width: 180px;
		height:30px;
		margin-left: 30px;
		line-height: 40px;
		font-size: 12px;
	}
	.firstInput{
		float: left;
		width: 60px;
		height:30px;
		border: none;
		border-bottom: 1px solid #4392FF;
		border-radius: 0;
		line-height: 40px;
		font-size: 12px;
	}
	.bettwenSpan{
		margin: 0 10px;
		font-weight: bold;
		font-size: 14px;
		color: #999;
	}
	.dialogConTip{
		color: red;
		float: left;
		width: 120px;
		text-align: left;
		font-size: 13px;
		line-height: 30px;
	}
	/*筛选区域的样式*/
	.selectTop{
		width: 100%;
		color: #aaa;
		font-size: 14px;
		text-align: left;
		height: 40px;
		line-height: 40px;
	}
	.forList{
		width: 96%;
		margin-bottom: 15px;
	}
	.forTip{
		height: 30px;
		background-color: #ccc;
		display: block;
		width: 100%;
		padding: 0 8px;
		box-sizing: border-box;
		font-size: 12px;
		color: #fff;
		line-height: 30px;
	}
	.manyCon{
		height: 30px;
		line-height: 30px;
		width: 100%;
		font-size: 12px;
		padding-left: 8px;
		background-color: #fff;
	}
	.conUl{
		font-size: 12px;
		background-color: #fff;
		width: 100%;
	}
	.conLi{
		height: 30px;
		line-height: 30px;
		text-indent: 8px;
		color: #4392FF;
	}
	.conLis{
		height: 30px;
		line-height: 30px;
		text-indent: 8px;
		color: #000;
	}
	.unconLi{
		height: 30px;
		line-height: 30px;
		text-indent: 8px;
		color: #000;
	}
	.hoverLi{
		cursor: pointer;
	}
		
</style>