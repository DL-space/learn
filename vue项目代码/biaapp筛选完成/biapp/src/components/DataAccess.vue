<!--数据源接入页面-->
<template>
  <el-row class="tac">
    <el-col :span="4">
    	<el-menu mode="vertical" default-active="0" class="el-menu-vertical-demo">
    		<h4>我的数据源</h4>
      	<el-menu-item-group title="分组一">
        	<el-menu-item v-for="(item, index) in tableList" :index="index + ''" @click="menuClick(item)">{{item.menuName}}</el-menu-item>
      	</el-menu-item-group>
    	</el-menu>
    </el-col>
    <el-col :span="20">
      <div style="margin-left: 30px; margin-top: 40px;">
				<el-table :data="tableData" style="width: 80%">
      		<el-table-column prop="name" label="工作表名称" style="width: 100%;"></el-table-column>
    		</el-table>
			</div>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue'
  import ElementUI from 'element-ui'

  export default {
    name: 'DataAccess',
    data () {
      return {
        tableList: [],
        tableData: [{
            name: 'db_adjust_name'
         }, {
            name: 'db_adjust_name'
         }, {
            name: 'db_adjust_name'
         }, {
            name: 'db_adjust_name'
          }]
      }
    },
    mounted: function () {
      this.$nextTick(res => {
          this.getTables();
      });
    },
    methods: {
    	//点击左侧数据源
    	menuClick(para) {
    		//将点击的数据源参数传给路由器
    		console.log(para.menuId);
    	},
    	//渲染数据源
      getTables() {
//        this.$http.get('', {}).then(res=> {
//          res.body.
//        });
				//需要发起请求-----------------
        this.tableList = [{
          menuName: '导航一',
          menuId: 1
        },{
          menuName: '导航二',
          menuId: 2
        },{
          menuName: '导航三',
          menuId: 3
        }];
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-submenu__title {
    padding-left: 20px;
    height: 32px;
    line-height: 32px;
  }
  .el-menu-item-group__title {
    display: none;
  }
  .el-submenu .el-menu-item {
    height: 32px;
    line-height: 32px;
  }
</style>
