<template>
  <div id="app">
  	<form action="http://123.57.173.13:8811/IDSP/backend/savePoint" method="post" id="commonForm" target="rfFrame" style="display: none;">
		  <input type="text" class="formInfo" name="fname" v-bind:value="saveForm.eventVal"/>
		  <input type="text" name="lname" v-bind:value="saveForm.fromPageVal"/>
		  <input type="text" name="lname" v-bind:value="saveForm.fromModuleVal"/>
		  <input type="text" name="lname" v-bind:value="saveForm.fromItemVal"/>
		  <input type="text" name="lname" v-bind:value="saveForm.fromItemIndexVal"/>
		  <input type="text" name="lname" v-bind:value="saveForm.toPageVal"/>
		  <input type="text" name="lname" v-bind:value="saveForm.toModuleVal"/>
		  <input type="submit" value="Submit" />
		</form>
		<iframe id="rfFrame" name="rfFrame" src="about:blank" style="display:none;"></iframe> 
    <router-view :name="route"/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import ElementUI from 'element-ui';
  import {mapState} from 'vuex';

  export default {
    name: 'app',
    data() {
      return {
        route: 'default'
      };
    },
    computed: {
	    	...mapState({
				saveForm: state => state.saveForm
			})
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
  .changeFontSize{
  	font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, SimSun, sans-serif;
  }
  @import '../static/css/base.css';
</style>
