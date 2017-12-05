<template>
	<h1>aaaasafdfjefjoik</h1>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex';

export default {
    name: 'VuexTest',
    data () {
      return {}
    },
    computed: {
    	...mapState({
    		testIndex: state => state.testIndex
    	})
    },
    mounted: function () {
      this.$store.dispatch("setTestIndex",this.testIndex);
      let [a,b,c] = [1,2,3];
      alert(b);
    },
    methods: {
    },
	watch:{}
}
</script>

<style>
</style>
