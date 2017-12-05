<template>
  <el-row class="tac">
    <el-col :span="24">
      <div class="login-box">
        <el-row>
          <el-col :span="8">
            <el-input id="name" v-model="acUser.username" @keyup.enter.native="logon" placeholder="请输入帐号">
              <template slot="prepend">帐号</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-input id="password" v-model="acUser.password" type="password" @keyup.enter.native="logon" placeholder="请输入密码">
              <template slot="prepend">密码</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-button id="login" @click="logon" style="width:100%" type="primary">登录</el-button>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue'
  import ElementUI from 'element-ui'

  export default {
    name: 'login',
    data () {
      return {
        acUser: {},
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted: function () {
      this.$nextTick(function () {

      });
    },
    methods: {
      logon() {
        let _this = this;
        this.axios.post(this.ctx + '/logon', this.acUser).then(function(res) {
          _this.router.push('/index');
        }).then(function(res) {
          console.log(res);
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .el-row {
    margin-bottom: 20px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .login-box {
    margin-top: 15%;
    margin-left: 40%;
  }
</style>
