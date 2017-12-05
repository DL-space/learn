<template>
  <el-row class="tac">
    <el-col :span="4">
      <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
        <el-submenu v-for="(item, idx_f) in tableList" :index="idx_f + ''">
          <template slot="title">
            <i class="el-icon-message"></i>{{item.folderName}}
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(table, idx_t) in item.tables" :index="idx_f + '-' + idx_t">{{table.tableName}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue'
  import ElementUI from 'element-ui'

  export default {
    name: 'Default',
    data () {
      return {
        tableList: [],
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted: function () {
      this.$nextTick(res => {
          this.getTables();
      });
    },
    methods: {
      getTables() {
//        this.$http.get('', {}).then(res=> {
//          res.body.
//        });
        this.tableList = [{
          folderName: '导航一',
          tables: [
            { tableName: '选项1' },
            { tableName: '选项2' },
            { tableName: '选项3' },
          ]
        }];
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
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
