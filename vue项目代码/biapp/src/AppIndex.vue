<template>
  <div id="app">
    <el-menu mode="horizontal">
      <div style="width: 125px; margin-top: 6px; display: block;float: left;">
        <img class="nav_logo" src="./assets/logo.png"/>
        <span style="font-size: 35px; display: block; padding-top: 3px; color: #767979;">BDP</span>
      </div>
      <el-menu-item v-for="(item, index) in navMenuList" :index="index + ''" @click="navClick(item)">{{item.menuName}}</el-menu-item>
      <el-menu-item v-for="(item, index) in manageMenuList" :index="(size + index) + ''" :title="item.menuName" style="float:right;">{{item.menuName}}</el-menu-item>
    </el-menu>
    <div class="line"></div>
    <router-view :name="route"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import ElementUI from 'element-ui'

  export default {
    name: 'app',
    data() {
      return {
        route: 'default',
        size: 0,
        navMenuList: [],
        manageMenuList: [
          { menuName: '退出登录', click: 'logout' },
          { menuName: '系统设置', click: 'setting' },
          { menuName: '报警消息', click: 'warning' },
          { menuName: '账号设置', click: 'account' }
        ]
      };
    },
    mounted: function () {
      this.$nextTick(function () {
        this.getNavMenu();
      });
    },
    methods: {
      getNavMenu: function () {
        this.navMenuList = [{
          menuName: '仪表盘'
        }, {
          menuName: '工作表'
        }, {
          menuName: '数据源'
        }, {
          menuName: '账号权限'
        }, {
          menuName: '模板分发'
        }, {
          menuName: '机器学习'
        }];
        this.size = this.navMenuList.length;
      },
      navClick: function (item) {
        if (item.menuName == '仪表盘') {
          this.route = 'default';
        } else {
          this.route = 'navLeft';
        }
      }
    }
  }
</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .nav_logo {
    width: 47px;
    display: block;
    float: left;
  }

</style>
