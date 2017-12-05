<template>
	<div style="margin-left: 30px; margin-top: 40px;">
		<el-table :data="tableData" style="width: 80%">
      		<el-table-column prop="name" label="工作表名称" style="width: 100%;"></el-table-column>
    	</el-table>
	</div>
</template>

<script>
	import Vue from 'vue'
  import ElementUI from 'element-ui'

  export default {
    name: 'DataAccess',
    data () {
      return {
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
      console.log(this.$route.query.menuId);
    },
    methods: {}
  }
</script>

<style>
</style>