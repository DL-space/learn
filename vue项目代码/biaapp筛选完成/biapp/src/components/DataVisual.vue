<!--仪表盘展示页面-->
<template>
	<el-row class="tac">
		<el-col :span="4">
			<el-menu mode="vertical" default-active="0" class="el-menu-vertical-demo" style="border-right: 4px solid #ccc;height: 100%;">
				<h4>仪表盘</h4>
				<!--<el-menu-item-group title="">
					<el-menu-item v-for="(item, index) in dashboardList" :index="index + ''" @click="changeDash(item)">{{item.menuName}}</el-menu-item>
				</el-menu-item-group>-->
				<el-menu style="background-color: transparent;text-align: left;" default-active="1" class="el-menu-vertical-demo">
					<el-submenu v-for="(item, index) in dashTableList" :index="index + ''">
						<template slot="title"><i class="el-icon-message"></i>{{item.folderName}}</template>
						<el-menu-item-group class="turnWhite">
							<el-menu-item v-for="(tabs, index) in item.folderChidren" :index="index + ''" @click="tableClick(tabs)" class="cancelHover"><i class="el-icon-message"></i>{{tabs.tableName}}</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</el-menu>
		</el-col>
		<el-col :span="20">
			<!--<el-button type="text" class="addReport" @click="addReport"><i class="el-icon-plus"></i> 添加图表</el-button>-->
			<el-button type="text" class="addReport" @click="dialogFormVisible = true"><i class="el-icon-plus"></i> 添加图表</el-button>
			<el-dialog title="" :visible.sync="dialogFormVisible" style="width: 40%;margin: 0 auto;" :show-close="false" :close-on-press-escape="true">
				<p class="folderP">选择工作表</p>
				<!--<ul class="folderUl"><img class="folderOpen" src="../../static/images/folderClose.png" />dim
					<li>
						<el-radio-group v-model="radio2">
							<el-radio :label="3" style="display: block;">备选项</el-radio>
							<el-radio :label="6" style="display: block;">备选项</el-radio>
							<el-radio :label="9" style="display: block;">备选项</el-radio>
						</el-radio-group>
					</li>
				</ul>-->
				<el-menu style="background-color: transparent;text-align: left;" default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :unique-opened="true">
					<el-submenu v-for="(item, index) in dashTableList" :index="index + ''">
						<template slot="title"><img class="folderOpen" src="../../static/images/folderClose.png" />{{item.folderName}}</template>
						<!--<el-menu-item-group class="turnWhite">-->
							<!--<el-menu-item v-for="(tabs, index) in item.folderChidren" :index="index + ''" @click="tableClick(tabs)" class="cancelHover"><i class="el-icon-message"></i>{{tabs.tableName}}</el-menu-item>-->
							<el-radio-group v-model="item.chooseItem" class="turnWhite widthAll" @change="radioChange">
								<el-radio v-for="(radios,index) in item.folderChidren" :label="radios.tableId" class="folderRadio">{{radios.tableName}}</el-radio>
							</el-radio-group>
						<!--</el-menu-item-group>-->
					</el-submenu>
				</el-menu>
				<div slot="footer" class="dialog-footer">
					<p class="dialogTip" v-if="dialogTip">请先选择工作表</p>
					<el-button @click="dialogFormVisible = false" class="dialogBtn">取 消</el-button>
					<el-button type="primary" @click="comfirmTable" class="dialogBtn">确 定</el-button>
				</div>
			</el-dialog>
		</el-col>
	</el-row>
</template>

<script>
	import Vue from 'vue'
	import ElementUI from 'element-ui'

	export default {
		name: 'DataVisual',
		data() {
			return {
				dialogTableVisible: false,
				dialogFormVisible: false,
				dashboardList: [], //仪表盘数组
				dashTableList: [], //弹出框中文件夹表格的选择数组
				radio2: 3,   //选中radio的默认值（需要加逻辑判断）
				dialogTip:false       //弹出框的提示
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
			//切换仪表盘
			changeDash() {

			},
			handleOpen(key, keyPath) {
				//打开之前把别的文件夹里的选中项去掉
				for(var i = 0;i < this.dashTableList.length;i++){
					if(key != i){
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
				let radioChoose = '';   //工作表的选择索引
				let chooseName = '';   //最后选中的工作表的名字
				for(var i = 0;i < this.dashTableList.length;i++){
					if(this.dashTableList[i].chooseItem != null){
						radioFlag = true;
						radioChoose = this.dashTableList[i].chooseItem;
						chooseName = this.dashTableList[i].folderChidren.tableName;
						break;
					}
				}
				if(radioFlag){
					//验证通过，弹出框关闭
					this.dialogFormVisible = false;
					//跳转到报表编辑页面
					this.$router.push({name: 'dataDrag', query: {"radioChoose":radioChoose,"chooseName":chooseName}});
				}else{
					this.dialogTip = true;
				}
			},
			//渲染数据源
			getTables() {
				//假数据
				this.dashboardList = [{
					menuName: '我的仪表盘1',
					menuId: 1
				}, {
					menuName: '我的仪表盘2',
					menuId: 2
				}, {
					menuName: '我的仪表盘3',
					menuId: 3
				}];
				this.dashTableList = [{
					folderName: 'dwd',
					folderId: '001',
					chooseItem:'001001',
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
					chooseItem:'null',
					folderChidren: [{
						tableName: 'yw_killer',
						tableId: '002001',
						parentId: '002'
					}]
				}];
			}
		}
	}
</script>

<style>
	.addReport {
		float: right;
		margin-right: 20px;
	}
	.turnWhite {
		background-color: #fff;
	}
	.cancelHover:hover {
		background-color: #fff !important;
	}
	.widthAll {
		width: 100%;
	}
	/*选择添加的图表的表格样式*/
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
	.folderP{
		margin-top: -30px;
		text-align: left;
		border-bottom: 1px solid #ccc;
		color: #999;
		height: 25px;
	}
	.folderRadio{
		display: block;
		margin-top: 8px;
	}
	.folderRadio:first-of-type{
		margin-left: 15px;
	}
	.dialogBtn{
		width: 50px;
		height: 32px;
		font-size: 12px;
		padding-left: 11px;
	}
	.dialogTip{
		color: red;
		float: left;
		width: 100px;
		text-align: left;
		font-size: 13px;
		line-height: 30px;
	}
</style>