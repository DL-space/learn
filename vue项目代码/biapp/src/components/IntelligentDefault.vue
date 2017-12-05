<template>
  <div id="app">
    <el-menu :default-active="activeIndex" class="horizontal el-menu-demo" mode="horizontal">
      <div style="width: 130px; margin-top: 6px; display: block;float: left;">
        <img class="nav_logo" src="../assets/logo.png"/>
        <span style="font-size: 18px; display: block; padding-top: 11px; color: #767979;">IDSP系统</span>
      </div>
      <div v-for="(item, index) in navMenuList">
        <el-menu-item v-if="!item.subMenu[0]" :index="index+''" @click="navClick(item)">{{item.menuName}}</el-menu-item>
        <el-submenu v-else :index="index+''">
          <template slot="title" class="el-submenu__icon-arrow el-icon-arrow-down">{{item.menuName}}</template>
          <el-menu-item v-for="(subitem, subindex) in item.subMenu" :index="index+'-'+subindex"
                        @click="navClick(subitem)">{{subitem.menuName}}
          </el-menu-item>
        </el-submenu>
      </div>
      <el-menu-item v-for="(item, index) in manageMenuList" :index="(size + index) + ''" :title="item.menuName"
                    style="float:right;" @click="action(item)">{{item.menuName}}
      </el-menu-item>
    </el-menu>
    <div class="line"></div>
    <!--<router-link :to="'index'"></router-link>-->
    <router-view class="center" :name="route"/>
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
        activeIndex: '0',
        navMenuList: [],
        manageMenuList: [
          {menuName: '退出登录', click: 'logout'},
          {menuName: '系统设置', click: 'setting'},
          {menuName: '报警消息', click: 'warning'},
          {menuName: '账号设置', click: 'account'}
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
        this.axios.post(this.ctx + '/menu').then(res => {
          this.navMenuList = res.data;
        this.size = this.navMenuList.length;
      }).then(res => {
//        console.log(res);
      });
      },
      navClick: function (item) {
        this.router.push(item.viewRoute);
      },
      action: function (item) {
        if (item.click == 'logout') {
          this.axios.get(this.ctx + '/logout').then(res => {
            this.router.push('/login');
          }).then(res => {
            console.log(res);
          });
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

  .horizontal {
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, .12), 0 10px 12px 0 rgba(170, 182, 206, .2), inset 0 -1px 0 0 rgba(255, 255, 255, .3);
    z-index: 999;
  }

  .center {
    z-index: 1;
  }

  .el-icon-caret-bottom:before {
    content: "\E600";
  }
</style>
