<template>
  <el-row class="tac">
    <el-col :span="24">
      <!--style="background-image: url(../assets/logo.png);"-->
      <img src="../assets/logo.png" style="width: 25%; position: absolute; margin-left: -38%; margin-top: 2%;"/>
      <div style="color: #0599d9; font-size: 3.9vw; margin-top: 80px;">居理·IDSP</div>
      <div style="color: #cccccc; font-size: 1.3vw; text-align: center; line-height: 80px;">客户第一 认知升级 协作共赢 开心正向 追求更好</div>
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
          _this.router.push('/');
        }).then(function(res) {
//        console.log(res);
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
    margin-top: 3%;
    margin-left: 40%;
  }
</style>
