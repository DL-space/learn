<template>
	<el-row class="tac">
		<el-col :span="24">
			<div class="over_top">
				<el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
  					<el-breadcrumb-item :to="{ path: '/CanvasTest' }">学习绘制Canvas</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-col>
		<el-col :span="24">
			<ul @click="turnTo">
				<li class="liTest">afdfd</li>
				<li class="liTest">afdfd</li>
				<li class="liTest">afdfd</li>
			</ul>
		</el-col>
	</el-row>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';

export default {
    name: 'CanvasTest',
    data () {
      return {}
    },
    computed: {
    	...mapState({
    		testIndex: state => state.testIndex
    	})
    },
    mounted: function () {
      	alert(this.testIndex);
    },
    methods: {
    	turnTo() {
    		this.$store.dispatch("setTestIndex",'4');
    		this.$router.push({name:'VuexTest',params:{}});
    	}
    },
	watch:{}
}
</script>

<style>
	.over_top{
		background-color: #f5f5f5;
		width: 100%;
		height: 50px;
		padding-left: 50px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		border-top: 1px solid #ccc;
	}
	.over_top .bread{
		font-size: 13px;
		margin-right: 30px;
	}
</style>