<template>
	<el-row class="tac">
		<el-col :span="24">
			<div class="over_top">
				<el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
  					<el-breadcrumb-item :to="{ path: '/' }">智能分析</el-breadcrumb-item>
  					<el-breadcrumb-item>活动管理</el-breadcrumb-item>
				</el-breadcrumb>
				<span class="cityTip">城市：</span>
				<el-select v-model="chooseCity" placeholder="请选择" class="citySelect" @change="loadInfo">
    				<el-option v-for="(item,index) in overCities" :key="item.id" :label="item.name" :value="item.id"></el-option>
  				</el-select>
			</div>
		</el-col>
		<el-col :span="24" style="background-color: #ececec;padding: 30px 50px;">
			<div class="backColor todayData">
				<el-col :span="5" class="todayTip">今日数据</el-col>
				<el-col :span="19">
					<ul class="topUl">
						<li class="topLi" v-for="(item,index) in topLi_overView">{{item.name}}</li>
					</ul>
					<ul class="topUl">
						<li class="topLi bottomLi" v-for="(item,index) in bottomLi">{{item.name}}</li>
					</ul>
				</el-col>
			</div>
			<div class="changeDate">
				<el-button class="fl" type="primary" plain :autofocus="true" @click="closeChoose">近三十天</el-button>
				<el-button class="fl" type="primary" plain @click="chooseDate">选择日期查询</el-button>
				<div class="showChoose fl" v-if="dateTodate">
					<el-date-picker v-model="pickerStart" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
					<span class="el-icon-minus changeIcon"></span>
					<el-date-picker v-model="pickerEnd" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
					<el-button type="primary" class="dateBtn" @click="getDataByDateType">查询</el-button>
				</div>
			</div>
			<div style="" class="showCharts">
				<!--需要循环遍历，会有多个echarts，所以class是动态的------start-->
				<div class="backColor fl chartDiv">
					<div class="chartHeader">
						<div class="clearfix topFirst">
							<h1 class="headerTip fl">总览图</h1>
							<el-checkbox v-model="tipChecked" class="fl chartCheck">对比</el-checkbox>
							<div class="fr" v-if="tipChecked">
								<span class="startTime">开始时间</span>
								<el-date-picker v-model="pickerChart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
								<el-button type="primary" class="chartBtn" @click="compareTQuery(1)">查询</el-button>
							</div>
						</div>
						<div class="changeKey">
							<ul class="fl">
								<li :class="{'fl chosenLi':item.flag,'fl unchosenLi':!(item.flag)}" v-for="(item,index) in topLi_overView" @click="keyClick(index,topLi_overView,'overView')">{{item.name}}</li>
							</ul>
							<i class="el-icon-arrow-right fr toDetail" @click="gotoPage(1)"></i>
						</div>
						<div class="checkFild">
							<span class="nameClass">名称：</span>
							<!--<el-radio v-model="chooseRadio" label="all" @change="changeChannel('oChannelSelect',1)">全选</el-radio>
  							<el-radio v-model="chooseRadio" label="noOne" @click="changeChannel('oChannelSelect',2)">全不选</el-radio>-->
  							<label class="radioClass"><input class="radioClassInput" type="radio" v-model="chooseRadio" value="all" @click="changeChannel('oChannelSelect',1)"/>全选</label>  
    						<label class="radioClass"><input class="radioClassInput" type="radio" v-model="chooseRadio" value="noOne" @click="changeChannel('oChannelSelect',2)"/>全不选</label>
						</div>
					</div>
					<div class="myChart" id="chart_overview" :style="{width: '590px', height: '390px'}"></div>
				</div>
				<!--需要循环遍历，会有多个echarts，所以class是动态的------end-->
				<!--城市图-->
				<div class="backColor fl chartDiv" style="width: 49%;height: 500px;" v-if="!chooseCity">
					<div class="chartHeader">
						<div class="clearfix topFirst">
							<h1 class="headerTip fl">城市图</h1>
							<el-checkbox v-model="cityChecked" class="fl chartCheck">对比</el-checkbox>
							<div class="fr" v-if="cityChecked">
								<span class="startTime">开始时间</span>
								<el-date-picker v-model="cityPickerChart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
								<el-button type="primary" class="chartBtn" @click="compareTQuery(7)">查询</el-button>
							</div>
						</div>
						<div class="changeKey">
							<ul class="fl">
								<li :class="{'fl chosenLi':item.flag,'fl unchosenLi':!(item.flag)}" v-for="(item,index) in topLi_city" @click="keyClick(index,topLi_city,'city')">{{item.name}}</li>
							</ul>
							<i class="el-icon-arrow-right fr toDetail" @click="gotoPage(7)"></i>
						</div>
						<div class="checkFild">
							<span class="nameClass">名称：</span>
  							<label class="radioClass"><input class="radioClassInput" type="radio" v-model="cityChooseRadio" value="all" @click="changeChannel('cityChannelSelect',1)"/>全选</label>  
    						<label class="radioClass"><input class="radioClassInput" type="radio" v-model="cityChooseRadio" value="noOne" @click="changeChannel('cityChannelSelect',2)"/>全不选</label>
						</div>
					</div>
					<div class="myChart" id="chart_city" :style="{width: '590px', height: '390px'}"></div>
				</div>
				<!--媒体图-->
				<div class="backColor fl chartDiv" style="width: 49%;height: 500px;">
					<div class="chartHeader">
						<div class="clearfix topFirst">
							<h1 class="headerTip fl">媒体图</h1>
							<el-checkbox v-model="mediaChecked" class="fl chartCheck">对比</el-checkbox>
							<div class="fr" v-if="mediaChecked">
								<span class="startTime">开始时间</span>
								<el-date-picker v-model="mediaPickerChart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
								<el-button type="primary" class="chartBtn" @click="compareTQuery(8)">查询</el-button>
							</div>
						</div>
						<div class="changeKey">
							<ul class="fl">
								<li :class="{'fl chosenLi':item.flag,'fl unchosenLi':!(item.flag)}" v-for="(item,index) in topLi_media" @click="keyClick(index,topLi_media,'media')">{{item.name}}</li>
							</ul>
							<i class="el-icon-arrow-right fr toDetail" @click="gotoPage(8)"></i>
						</div>
						<div class="checkFild">
							<span class="nameClass">名称：</span>
  							<label class="radioClass"><input class="radioClassInput" type="radio" v-model="mediaChooeRadio" value="all" @click="changeChannel('mChannelSelect',1)"/>全选</label>  
    						<label class="radioClass"><input class="radioClassInput" type="radio" v-model="mediaChooeRadio" value="noOne" @click="changeChannel('mChannelSelect',2)"/>全不选</label>
						</div>
					</div>
					<div class="myChart" id="chart_media" :style="{width: '590px', height: '390px'}"></div>
				</div>
				<!--趋势图-->
				<div class="backColor fl chartDiv" id="trend" style="width: 49%;height: 500px;" v-if="chooseCity">
					<div class="chartHeader">
						<div class="clearfix topFirst">
							<h1 class="headerTip fl">趋势图</h1>
							<el-checkbox v-model="trendChecked" class="fl chartCheck">对比</el-checkbox>
							<div class="fr" v-if="trendChecked">
								<span class="startTime">开始时间</span>
								<el-date-picker v-model="trendpickerChart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
								<el-button type="primary" class="chartBtn" @click="compareTQuery(6)">查询</el-button>
							</div>
						</div>
						<div class="changeKey">
							<ul class="fl">
								<li :class="{'fl chosenLi':item.flag,'fl unchosenLi':!(item.flag)}" v-for="(item,index) in topLi_trend" @click="keyClick(index,topLi_trend,'trend')">{{item.name}}</li>
							</ul>
							<i class="el-icon-arrow-right fr toDetail" @click="gotoPage(6)"></i>
						</div>
						<div class="checkFild">
							<span class="nameClass">名称：</span>
  							<label class="radioClass"><input class="radioClassInput" type="radio" v-model="trendchooseRadio" value="all" @click="changeChannel('tChannelSelect',1)"/>全选</label>  
    						<label class="radioClass"><input class="radioClassInput" type="radio" v-model="trendchooseRadio" value="noOne" @click="changeChannel('tChannelSelect',2)"/>全不选</label>
						</div>
					</div>
					<div class="myChart" id="chart_trend" :style="{width: '590px', height: '390px'}"></div>
				</div>
				<!--线索类型-->
				<div class="backColor fl chartDiv" style="width: 49%;height: 500px;">
					<div class="chartHeader">
						<div class="clearfix topFirst">
							<h1 class="headerTip fl">线索类型</h1>
							<el-checkbox v-model="lineChecked" class="fl chartCheck">对比</el-checkbox>
							<div class="fr" v-if="lineChecked">
								<span class="startTime">开始时间</span>
								<el-date-picker v-model="linePickerChart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
								<el-button type="primary" class="chartBtn" @click="compareTQuery(2)">查询</el-button>
							</div>
						</div>
						<div class="changeKey">
							<ul class="fl">
								<li :class="{'fl chosenLi':item.flag,'fl unchosenLi':!(item.flag)}" v-for="(item,index) in lineLi" @click="keyClick(index,lineLi,'line')">{{item.name}}</li>
							</ul>
							<i class="el-icon-arrow-right fr toDetail" @click="gotoPage(2)"></i>
						</div>
						<div class="checkFild">
							<span class="nameClass">名称：</span>
  							<label class="radioClass"><input class="radioClassInput" type="radio" v-model="lineChooseRadio" value="all" @click="changeChannel('cChannelSelect',1)"/>全选</label>  
    						<label class="radioClass"><input class="radioClassInput" type="radio" v-model="lineChooseRadio" value="noOne" @click="changeChannel('cChannelSelect',2)"/>全不选</label>
						</div>
					</div>
					<div class="myChart" id="chart_line" :style="{width: '590px', height: '390px'}"></div>
				</div>
				<!--楼盘类型-->
				<div class="backColor fl chartDiv" style="width: 49%;height: 500px;">
					<div class="chartHeader">
						<div class="clearfix topFirst">
							<h1 class="headerTip fl">楼盘类型</h1>
							<el-checkbox v-model="buildingChecked" class="fl chartCheck">对比</el-checkbox>
							<div class="fr" v-if="buildingChecked">
								<span class="startTime">开始时间</span>
								<el-date-picker v-model="buildingPickerChart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
								<el-button type="primary" class="chartBtn" @click="compareTQuery(3)">查询</el-button>
							</div>
						</div>
						<div class="changeKey">
							<ul class="fl">
								<li :class="{'fl chosenLi':item.flag,'fl unchosenLi':!(item.flag)}" v-for="(item,index) in buildingLi" @click="keyClick(index,buildingLi,'building')">{{item.name}}</li>
							</ul>
							<i class="el-icon-arrow-right fr toDetail" @click="gotoPage(3)"></i>
						</div>
						<div class="checkFild">
							<span class="nameClass">名称：</span>
  							<label class="radioClass"><input class="radioClassInput" type="radio" v-model="buildingChooseRadio" value="all" @click="changeChannel('htChannelSelect',1)"/>全选</label>  
    						<label class="radioClass"><input class="radioClassInput" type="radio" v-model="buildingChooseRadio" value="noOne" @click="changeChannel('htChannelSelect',2)"/>全不选</label>
						</div>
					</div>
					<div class="myChart" id="chart_building" :style="{width: '590px', height: '390px'}"></div>
				</div>
				<!--楼盘主推-->
				<div class="backColor fl chartDiv" style="width: 49%;height: 500px;">
					<div class="chartHeader">
						<div class="clearfix topFirst">
							<h1 class="headerTip fl">主推楼盘TOP10</h1>
							<el-checkbox v-model="buildPreChecked" class="fl chartCheck">对比</el-checkbox>
							<div class="fr" v-if="buildPreChecked">
								<span class="startTime">开始时间</span>
								<el-date-picker v-model="buildPrePickerChart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
								<el-button type="primary" class="chartBtn" @click="compareTQuery(4)">查询</el-button>
							</div>
						</div>
						<div class="changeKey">
							<ul class="fl">
								<li :class="{'fl chosenLi':item.flag,'fl unchosenLi':!(item.flag)}" v-for="(item,index) in buildPreLi" @click="keyClick(index,buildPreLi,'buildPre')">{{item.name}}</li>
							</ul>
							<i class="el-icon-arrow-right fr toDetail" @click="gotoPage(4)"></i>
						</div>
						<div class="checkFild">
							<span class="nameClass">名称：</span>
  							<label class="radioClass"><input class="radioClassInput" type="radio" v-model="buildPreChooseRadio" value="all" @click="changeChannel('hChannelSelect',1)"/>全选</label>  
    						<label class="radioClass"><input class="radioClassInput" type="radio" v-model="buildPreChooseRadio" value="noOne" @click="changeChannel('hChannelSelect',2)"/>全不选</label>
						</div>
					</div>
					<div class="myChart" id="chart_buildPre" :style="{width: '590px', height: '390px'}"></div>
				</div>
				<!--账号情况-->
				<div class="backColor fl chartDiv" style="width: 49%;height: 500px;">
					<div class="chartHeader">
						<div class="clearfix topFirst">
							<h1 class="headerTip fl">账号情况</h1>
							<el-checkbox v-model="accountChecked" class="fl chartCheck">对比</el-checkbox>
							<div class="fr" v-if="accountChecked">
								<span class="startTime">开始时间</span>
								<el-date-picker v-model="accountPickerChart" type="date" placeholder="选择日期" :picker-options="pickerOptions2"></el-date-picker>
								<el-button type="primary" class="chartBtn" @click="compareTQuery(5)">查询</el-button>
							</div>
						</div>
						<div class="changeKey">
							<ul class="fl">
								<li :class="{'fl chosenLi':item.flag,'fl unchosenLi':!(item.flag)}" v-for="(item,index) in accountLi" @click="keyClick(index,accountLi,'account')">{{item.name}}</li>
							</ul>
						</div>
						<div class="checkFild">
							<span class="nameClass">名称：</span>
  							<label class="radioClass"><input class="radioClassInput" type="radio" v-model="accountChooseRadio" value="all" @click="changeChannel('acChannelSelect',1)"/>全选</label>  
    						<label class="radioClass"><input class="radioClassInput" type="radio" v-model="accountChooseRadio" value="noOne" @click="changeChannel('acChannelSelect',2)"/>全不选</label>
						</div>
					</div>
					<div class="myChart" id="chart_account" :style="{width: '590px', height: '390px'}"></div>
				</div>
			</div>
			
		</el-col>
	</el-row>
</template>

<script>
	// 引入基本模板
	let echarts = require('echarts/lib/echarts');
	// 引入柱状图组件
	require('echarts/lib/chart/bar');
	// 引入提示框和title组件
	require('echarts/lib/component/tooltip');
	require('echarts/lib/component/title');
  	import Vue from 'vue';
  	import ElementUI from 'element-ui';
  	import {mapState} from 'vuex';

  export default {
    name: 'overView',
    data () {
      return {
      	overTest:{"flag":true,"data":{"timeList":["2017/10/17","2017/10/18","2017/10/19","2017/10/20","2017/10/21","2017/10/22","2017/10/23","2017/10/24","2017/10/25","2017/10/26","2017/10/27","2017/10/28","2017/10/29","2017/10/30","2017/10/31","2017/11/01","2017/11/02","2017/11/03","2017/11/04","2017/11/05","2017/11/06","2017/11/07","2017/11/08","2017/11/09","2017/11/10","2017/11/11","2017/11/12","2017/11/13","2017/11/14","2017/11/15"],"dataMap":{"全部":[41841,49803,50509,49727,42421,39272,50284,47088,49188,48708,55016,46831,45245,53891,47983,41199,48906,46466,46479,41079,49737,48220,50124,50269,47889,43200,43211,53832,45251,51240]},"nameList":["全部"]}},
       	overCity:{"flag":true,"data":{"timeList":["2017/10/20","2017/10/21","2017/10/22","2017/10/23","2017/10/24","2017/10/25","2017/10/26","2017/10/27","2017/10/28","2017/10/29","2017/10/30","2017/10/31","2017/11/01","2017/11/02","2017/11/03","2017/11/04","2017/11/05","2017/11/06","2017/11/07","2017/11/08","2017/11/09","2017/11/10","2017/11/11","2017/11/12","2017/11/13","2017/11/14","2017/11/15","2017/11/16","2017/11/17","2017/11/18"],"dataMap":{"上海":[15291,14445,15246,15786,14993,14777,14960,15552,14242,15000,14795,13665,10676,14181,13651,12808,13351,13878,14654,13987,13642,13083,10802,13383,14016,12680,13822,13831,14589,12317],"北京":[6756,5387,5101,6691,6324,6171,6222,6643,6858,7640,8800,7280,7381,6371,6398,5458,5784,6500,6437,6793,5988,5687,4806,5432,7571,7014,8094,9001,8465,8025],"天津":[3943,3061,3444,4420,2682,4422,5211,5898,4580,2792,5095,5160,4523,4422,4484,4446,5179,6348,5504,5534,5272,5718,4724,4732,5623,5027,5211,5360,6190,6043],"广州":[12539,9768,6935,13214,10850,11186,9395,12475,9637,8705,11022,11087,9811,12103,9149,11755,7234,13047,12865,12696,11682,11178,10617,7213,9953,7597,10927,11346,10823,4653],"成都":[1283,1357,1400,1921,1774,830,1790,3021,1182,1159,3189,1713,631,2684,2938,2299,351,2022,995,1370,2010,669,2159,2073,3270,2058,1203,3114,3635,2119],"杭州":[2048,638,634,1413,1917,1900,1839,1810,1223,1244,1637,1314,1301,2139,2886,1903,1721,1775,1854,1422,3159,2952,2602,2456,3061,1695,1822,2474,3375,1914],"苏州":[6735,6667,5783,6275,7405,8896,8181,8200,8223,8070,8272,6836,5811,5787,5804,6681,6256,5314,5401,7263,7441,7512,6631,6998,9191,8050,8341,9227,9183,8715],"重庆":[1132,1098,729,564,1143,1006,1110,1417,886,635,1081,928,1065,1219,1156,1129,1203,853,510,1059,1075,1090,859,924,1147,1130,1820,1567,1236,1151]},"nameList":["上海","北京","天津","广州","成都","杭州","苏州","重庆"]}},
       	overCities:[],     //所有城市，不写死在页面，以后可以添加
       	chooseCity:'',    //页面渲染的默认城市
       	topLi_overView:[{
      		name:'点击量',
      		id:'01',
      		flag:true
      	},{
      		name:'CPC',
      		id:'02',
      		flag:false
      	},{
      		name:'线索量',
      		id:'03',
      		flag:false
      	},{
      		name:'线索成本',
      		id:'04',
      		flag:false
      	},{
      		name:'上户量',
      		id:'05',
      		flag:false
      	}],
      	topLi_media:[{
      		name:'点击量',
      		id:'01',
      		flag:true
      	},{
      		name:'CPC',
      		id:'02',
      		flag:false
      	},{
      		name:'线索量',
      		id:'03',
      		flag:false
      	},{
      		name:'线索成本',
      		id:'04',
      		flag:false
      	},{
      		name:'上户量',
      		id:'05',
      		flag:false
      	}],
      	topLi_city:[{
      		name:'点击量',
      		id:'01',
      		flag:true
      	},{
      		name:'CPC',
      		id:'02',
      		flag:false
      	},{
      		name:'线索量',
      		id:'03',
      		flag:false
      	},{
      		name:'线索成本',
      		id:'04',
      		flag:false
      	},{
      		name:'上户量',
      		id:'05',
      		flag:false
      	}],
      	topLi_trend:[{
      		name:'点击量',
      		id:'01',
      		flag:true
      	},{
      		name:'CPC',
      		id:'02',
      		flag:false
      	},{
      		name:'线索量',
      		id:'03',
      		flag:false
      	},{
      		name:'线索成本',
      		id:'04',
      		flag:false
      	},{
      		name:'上户量',
      		id:'05',
      		flag:false
      	}],
       	overLi:[{            //总览图、城市图、媒体图
      		name:'点击量',
      		id:'01',
      		flag:true
      	},{
      		name:'CPC',
      		id:'02',
      		flag:false
      	},{
      		name:'线索量',
      		id:'03',
      		flag:false
      	},{
      		name:'线索成本',
      		id:'04',
      		flag:false
      	},{
      		name:'上户量',
      		id:'05',
      		flag:false
      	}],   
      	lineLi:[{             //线索类型
      		name:'线索量',
      		id:'01',
      		flag:true
      	},{
      		name:'上户量',
      		id:'02',
      		flag:false
      	}],
      	buildingLi:[{            //楼盘类型、主推楼盘TOP10
      		name:'UV',
      		id:'01',
      		flag:true
      	},{
      		name:'直接留点量',
      		id:'02',
      		flag:false
      	},{
      		name:'直接留点量/UV',
      		id:'03',
      		flag:false
      	}],
      	buildPreLi:[{            //楼盘类型、主推楼盘TOP10
      		name:'UV',
      		id:'01',
      		flag:true
      	},{
      		name:'直接留点量',
      		id:'02',
      		flag:false
      	},{
      		name:'直接留点量/UV',
      		id:'03',
      		flag:false
      	}],
      	accountLi:[{            //账号情况
      		name:'有点击关键词占比',
      		id:'01',
      		flag:true
      	},{
      		name:'有展示关键词占比',
      		id:'02',
      		flag:false
      	}],
       	bottomLi: [],        //今日数据的结果
       	pickerOptions0: {              //日期默认值
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        pickerStart:"",       //开始日期
        pickerEnd:"",          //结束日期
        pickerChart:'',        //图表里面的日期
        trendpickerChart:"",   //同上的趋势图
        cityPickerChart:'',    //同上的城市图
        mediaPickerChart:'',
        linePickerChart:'',
        buildingPickerChart:'',
        buildPrePickerChart:'',
        accountPickerChart:'',
        tipChecked:false,      //图表里面是否对比
        trendChecked:false,    //同上的趋势图
        cityChecked:false,     //同上的城市图
        mediaChecked:false,    //同上的媒体图
        lineChecked:false,
        buildingChecked:false,
        buildPreChecked:false,
        accountChecked:false,
        chooseRadio:'all',    //总览图表选择
        trendchooseRadio:'all',  //趋势图选择
        cityChooseRadio:'all',   //城市图选择
        mediaChooeRadio:'all',   //媒体图选择
        lineChooseRadio:'all',
        buildingChooseRadio:'all',
        buildPreChooseRadio:'all',
        accountChooseRadio:'all',
        dateType:1,           //默认表示查询近三十天的图表内容
        dateTodate:false,       //是否选择开始和结束时间查询标志
        overViewEchart:{},      //总览图对象
        cityEchart:{},      //城市图对象
        mediaEchart:{},      //媒体图对象
        lineEchart:{},      //线索图对象
        buildingEchart:{},      //楼盘图对象
        buildPreEchart:{},      //楼盘主推图对象
        accoutEchart:{},      //账号图对象
        tendencyEchart:{},      //趋势图（选择单个城市查看时会出现，同时城市图小时
        overViewIndex:0,      //总览图选中查询类型
        cityIndex:0,      //城市图选中查询类型
        mediaIndex:0,      //媒体图选中查询类型
        lineIndex:0,      //线索图选中查询类型
        buildingIndex:0,      //楼盘图选中查询类型
        buildPreIndex:0,      //楼盘主推图选中查询类型
        accountIndex:0,      //账号图选中查询类型
        trendIndex:0         //趋势图选中查询类型
      }
    },
    computed: {
    	...mapState({
			saveForm: state => state.saveForm,
			turnObj: state => state.turnObj,
			isDefault: state => state.isDefault
		})
    },
    mounted: function () {
      this.$nextTick(res => {
          this.getTables();
          this.drawLine();
      });
    },
    methods: {
    	drawLine() {
    		//进行请求，分七次请求，注意城市图和趋势图的切换
//  		this.getOverviewEcharts();
    		// 基于准备好的dom，初始化echarts实例
      		this.overViewEchart = echarts.init(document.getElementById("chart_overview"));
      		this.mediaEchart = echarts.init(document.getElementById("chart_media"));
      		this.lineEchart = echarts.init(document.getElementById("chart_line"));
      		this.buildingEchart = echarts.init(document.getElementById("chart_building"));
      		this.buildPreEchart = echarts.init(document.getElementById("chart_buildPre"));
      		this.accoutEchart = echarts.init(document.getElementById("chart_account"));
 			//给图表赋值
      		this.showChart(this.overViewEchart,this.overTest.data,0);
      		this.showChart(this.mediaEchart,this.overTest.data,0);
      		this.showChart(this.lineEchart,this.overTest.data,0);
      		this.showChart(this.buildingEchart,this.overTest.data,0);
      		this.showChart(this.buildPreEchart,this.overTest.data,0);
      		this.showChart(this.accoutEchart,this.overTest.data,0);
      		//第一次页面加载的时候如果没有触发watch----------------------------
      		if(!this.chooseCity){
      			this.cityEchart = echarts.init(document.getElementById("chart_city"));	
	        	this.showChart(this.cityEchart,this.overCity.data,0);
      		}/*else{
      			this.tendencyEchart = echarts.init(document.getElementById("chart_trend"));
	        	this.showChart(this.tendencyEchart,this.overCity.data,0);
      		}*/
    	},
    	//渲染数据源
      getTables() {
      	this.overCities = [{
      		name:'全部',
      		id:''
      	},{
      		name:'北京',
      		id:'2'
      	},{
      		name:'上海',
      		id:'20000001'
      	},{
      		name:'天津',
      		id:'20000019'
      	},{
      		name:'广州',
      		id:'20000037'
      	},{
      		name:'重庆',
      		id:'20000050'
      	},{
      		name:'苏州',
      		id:'20000061'
      	},{
      		name:'杭州',
      		id:'20000074'
      	},{
      		name:'成都',
      		id:'20000086'
      	}];
      	this.bottomLi = [{
      		name:'34234'
      	},{
      		name:'4656'
      	},{
      		name:'46455'
      	},{
      		name:'6868'
      	},{
      		name:'2433'
      	}];
		
      },
      //点击选择日期按钮，弹出选择div
      chooseDate() {
      	this.dateTodate = true;
      	//修改要查询的图表范围为选择日期范围
      	this.dateType = 2;
      	this.loadData(2);
      },
      //关闭选择日期div
      closeChoose() {
      	this.dateTodate = false;
      	//修改要查询的图表范围，1表示近三十天
      	this.dateType = 1; 
      	this.loadData(1);
      },
    //根据起始日期查询图表
	getDataByDateType() {
	    //1.获取总览图
	    if(!this.getOverviewEcharts()){
	        return;
	    }
	    //2.获取联系图
	    this.getContactEcharts();
	    //3.获取楼盘类型数据
	    this.getHousesTypeEcharts();
	    //4.获取楼盘信息
	    this.getHousesEcharts();
	    //5.获取账号点击关键词信息
	    this.getAccountClickEcharts();
	},
	//跳转页面
	gotoPage(type) {
	    //埋点
	    this.toSavePoint(2,type);
	    //传递相应数据到相应查询页面
	    let queryObj = {};
	    var cityId = this.chooseCity;    //如果有城市，则筛选条件有城市
	    var dateType = this.dateType;    //近三十天，自己计算展示哪个日期，或者是开始和结束时间
	    var startDate= new Date();
	    var endDate= new Date();
	    let almostDate = new Date();
	    var queryType,compareId;
	    var cStartDate = new Date();
	    var compare =false;
	    var gradingType = 2;    //按天查询
	    if(this.dateType == 2){
	    	//传开始和结束时间
	    	startDate = this.pickerStart;
	    	endDate = this.pickerEnd;
	    }else{
	    	//近三十天，要自己计算
	    	almostDate.setDate(almostDate.getDate() - 29);
	    }
	    if(type == 1){//总览图
	        compareId = this.tipChecked;
	        cStartDate = this.pickerChart;
	        queryType = this.forSearch(this.topLi_overView);
	    }else{
	        if(type==2){//线索类型
	            compareId=this.lineChecked;
	            cStartDate = this.linePickerChart;
	            queryType = this.forSearch(this.lineLi);
	        }else if(type==3){//楼盘类型
	            compareId=this.buildingChecked;
	            cStartDate = this.buildingPickerChart;
	            queryType = this.forSearch(this.buildingLi);
	        }else if(type==4){//楼盘
	            compareId=this.buildPreChecked;
	            cStartDate = this.buildPrePickerChart;
	            queryType = this.forSearch(this.buildPreLi);
	        }else if(type==6){
	            compareId=this.trendChecked;
	            cStartDate = this.trendpickerChart;
	            queryType = this.forSearch(this.topLi_trend);
	        }else if(type==7){
	            compareId=this.cityChecked;
	            cStartDate = this.cityPickerChart;
	            queryType = this.forSearch(this.topLi_city);
	        }else if(type==8){
	            compareId=this.mediaChecked;
	            cStartDate = this.mediaPickerChart;
	            queryType = this.forSearch(this.topLi_media);
	        }
	        //账号情况不跳转
	    }
	    if(compareId) {
	    	//页面跳转之后显示对比
	        compare=true;
	    }
	    queryObj = {
	    	cityId:cityId,
	    	dateType:dateType,
	    	startDate:this.formatData(startDate),
	    	endDate:this.formatData(endDate),
	    	almostDate:this.formatData(almostDate),
	    	compare:compare,
	    	cStartDate:this.formatData(cStartDate),
	    	queryType:queryType
	    };
	    //保存跳转页面需要的数据
	    this.$store.dispatch("setTurnObj",queryObj);
	    this.$store.dispatch("setIsDefault",true);
	    //路由跳转，跳转到关键词查询和楼盘查询
	    if(type == 3 || type == 4){
	    	//跳转到楼盘页面
	    	this.$router.push({name:'BuildSelect',params:{queryObj:JSON.stringify(queryObj)}});
	    }else{
	    	//跳转到关键词查询页面
	    	this.$router.push({name:'keyWord',params:{queryObj:JSON.stringify(queryObj)}});
	    }
	},
	//获取转换时间数据
	loadData(type) {
	    //埋点
	    this.toSavePoint(1,type);
	    var id;
	    if(type == 1){
	        id = "today";
	    }else{
	        id = "byday";
	    }
	    this.dateType = type;
	    //1.是否显示时间
	    this.ifShowQueryTime(type);
	    //选择今天，则重新计算两张图
	    if(type == 1){
	        this.getDataByDateType();
	    }
	},
	//是否显示查询时间
	ifShowQueryTime(type) {
	    if(type == 1){
	        this.dateTodate = false;
	    }else{
	        this.dateTodate = true;
	    }
	},
	toSavePoint(code,type) {
	    var eventVal="";
	    var fromPage="";
	    var fromModule="";
	    var fromItem="";
	    var fromItemIndex="-1";
	    var toPage="";
	    var toModule="";
	    if(code==1){//筛选时间
	        if(type==1){//进30天
	            eventVal="e_click_last 30 days";
	            fromPage="p_analyse_companyview";
	            fromItem="i_last 30 days";
	            toPage="p_analyse_companyview";
	        }else if(type=2){//时间范围筛选
	            eventVal="e_click_query_date";
	            fromPage="p_analyse_companyview";
	            fromItem="i_query_date";
	            toPage="p_analyse_companyview";
	        }
	    }else if(code==2){//跳转
	        eventVal="e_click_skip";
	        fromPage="p_analyse_companyview";
	        fromItem="i_skip";
	        if(type==1){//总览图
	            fromModule="m_trend_map"
	            toPage="p_analyse_intelligentsearch";
	        }else if(type==2){// 线索类型
	            fromModule="m_clue_type"
	            toPage="p_analyse_intelligentsearch";
	        }else if(type==3){
	            fromModule="m_project_type"
	            toPage="p_analyse_buildingsearch";
	        }else if(type==4){
	            fromModule="m_project"
	            toPage="p_analyse_buildingsearch";
	        }
	    }
	    //提交埋点信息
	    let formInfo = {             //埋点表单
			eventVal:eventVal,
			fromPageVal:fromPage,
			fromModuleVal:fromModule,
			fromItemVal:fromItem,
			fromItemIndexVal:fromItemIndex,
			toPageVal:toPage,
			toModuleVal:toModule
		}
	    this.$store.dispatch("setSaveForm",formInfo);
	},
	/**
	 * 渠道全选/全不选显示
	 */
	changeChannel(name,value) {
	    var myChart;
	    if(name == 'oChannelSelect'){
	        myChart = this.overViewEchart;   //总览
	    }else if(name=='cChannelSelect'){
	        myChart = this.lineEchart;      //线索
	    }else if(name=='htChannelSelect'){
	        myChart = this.buildingEchart;    //楼盘类型
	    }else if(name=='hChannelSelect'){
	        myChart = this.buildPreEchart;    //主推楼盘
	    }else if(name=='acChannelSelect'){
	        myChart = this.accoutEchart;     //账号
	    }else if(name=='tChannelSelect'){
	        myChart = this.tendencyEchart;//趋势图
	    }else if(name=='cityChannelSelect'){
	        myChart = this.cityEchart;//城市图
	    }else if(name=='mChannelSelect'){
	        myChart = this.mediaEchart;//媒体图
	    }
	    var option = myChart.getOption();
	    var selectArr = option.legend[0].data;
	    var val;
	    if(value === '1'){
	         val = true;
	    }else{
	         val = false;
	    }
	    var obj = {};
	    for(var key in selectArr){
	        obj[selectArr[key]] = val;
	    }
	    option.legend[0].selected = obj;
	    myChart.setOption(option);
	},
	//转换城市
	loadInfo(changePara) {
	    //埋点
	    let formInfo = {             //埋点表单
			eventVal:"e_click_city",
			fromPageVal:"p_analyse_companyview",
			fromModuleVal:"",
			fromItemVal:"i_city",
			fromItemIndexVal:"-1",
			toPageVal:"p_analyse_companyview",
			toModuleVal:""
		}
	    this.$store.dispatch("setSaveForm",formInfo);
	    var cityId = this.chooseCity;
	    //0.获取今日数据
//	    this.getTodayData();
	    //1.获取总览图
	    this.getOverviewEcharts();
	    //2.获取联系图
	    this.getContactEcharts();
	    //3.楼盘类型图
	    this.getHousesTypeEcharts();
	    //4.楼盘图
	    this.getHousesEcharts();
	    //5.账号情况
	    this.getAccountClickEcharts();
	    // 媒体图
		this.getMediaEcharts();
	},
      //改变图表的关键字
      keyClick(paraIndex,para,echarType) {
      	let changFlag = false;
      	//根据当前点击的图表来分别请求不同的数据
      	if(echarType == 'overView'){
      		this.overViewIndex = paraIndex;
	        changFlag = this.getOverviewEcharts();
	    }else if(echarType == 'line'){
	    	this.lineIndex = paraIndex;
	        changFlag = this.getContactEcharts();
	    }else if(echarType == 'building'){
	    	this.buildingIndex = paraIndex;
	        changFlag = this.getHousesTypeEcharts();
	    }else if(echarType == 'buildPre'){
	    	this.buildPreIndex = paraIndex;
	        changFlag = this.getHousesEcharts();
	    }else if(echarType == 'account'){
	    	this.accountIndex = paraIndex;
	        changFlag = this.getAccountClickEcharts();
	    }else if(echarType == 'city'){
	    	this.cityIndex = paraIndex;
	        changFlag = this.getCityEcharts();
	    }else if(echarType == 'media'){
	    	this.mediaIndex = paraIndex;
	        changFlag = this.getMediaEcharts();
	    }else if(echarType == 'trend'){
	    	this.trendIndex = paraIndex;
	        changFlag = this.getTendencyEcharts();
	    }
	    if(changFlag){
	    	//切换选中与未选中的样式
	      	for(var i = 0;i < para.length;i++){
	      		if(paraIndex != i){
	      			para[i].flag = false;
	      		}else{
	      			para[i].flag = true;
	      		}
	      	}
	    }
      },
      //总览图查询
      getOverviewEcharts() {
      	var startDate;
	    var endDate;
	    //查询范围：近三十天--1，根据日期---2
	    if(this.dateType==2){
	        if(!this.checkInfo()){
	            return false;
	        }
	        startDate = this.formatData(this.pickerStart);
	        endDate = this.formatData(this.pickerEnd);
	    }
	    //城市选择
		var cityId = this.chooseCity;
	    //没有小时数据先只查天的
		var gradingType = 2;
	    var cStartDate;
	    var compare;
	    if(this.tipChecked) {
	        compare=true;
	        var cStartDate = this.formatData(this.pickerChart);
	        if(cStartDate == null || cStartDate == ""){
	            alert("请选择对比开始时间.");
	            return ;
	        }
	    }
	    var queryType = parseInt(this.overViewIndex) + 1;
	    var existInstance = echarts.getInstanceByDom(document.getElementById('chart_overview'));
	    if(existInstance){
	    	//先释放图表
	        echarts.dispose(existInstance);
	    }
	    this.overViewEchart = echarts.init(document.getElementById('chart_overview'));
	    this.overViewEchart.showLoading();
	    let transPara = {
            "cityId": cityId,
            "gradingType": gradingType,
            "dateType": this.dateType,
            "startDate": startDate,
            "endDate": endDate,
            "queryType": queryType,
            "cStartDate": cStartDate,
            "compare": compare
	    };
	    console.log(transPara);
	    this.axios.post('http://123.57.173.13:8811/IDSP/analyse/getOverviewChartData',transPara).then(data => {
			if (data == null) {
                alert('查询总览图数据失败.')
            } else if (data.flag) {
                if(compare){
                    this.showChartCompare(this.overViewEchart, data.data, 0);
                }else{
                    this.showChart(this.overViewEchart, data.data, 0);
                }
            } else {
                this.overViewEchart.hideLoading();
                alert(data.msg);
            }
        }).catch(res => {
        	alert('查询总览图数据失败.');
        });
	    return true;
      },
      //线索类型图表
      getContactEcharts() {
      	var startDate;
	    var endDate;
	    //查询范围：近三十天--1，根据日期---2
	    if(this.dateType==2){
	        if(!this.checkInfo()){
	            return false;
	        }
	        startDate = this.formatData(this.pickerStart);
	        endDate = this.formatData(this.pickerEnd);
	    }
	    //城市选择
		var cityId = this.chooseCity;
	    //没有小时数据先只查天的
		var gradingType = 2;
	    var cStartDate;
	    var compare;
	    if(this.lineChecked) {
	        compare=true;
	        var cStartDate = this.formatData(this.linePickerChart);
	        if(cStartDate == null || cStartDate == ""){
	            alert("请选择对比开始时间.");
	            return ;
	        }
	    }
	    var queryType = parseInt(this.lineIndex) + 1;
	    var existInstance = echarts.getInstanceByDom(document.getElementById('chart_line'));
	    if(existInstance){
	    	//先释放图表
	        echarts.dispose(existInstance);
	    }
	    this.lineEchart = echarts.init(document.getElementById('chart_line'));
	    this.lineEchart.showLoading();
	    let transPara = {
            "cityId": cityId,
            "gradingType": gradingType,
            "dateType": this.dateType,
            "startDate": startDate,
            "endDate": endDate,
            "queryType": queryType,
            "cStartDate": cStartDate,
            "compare": compare
	    };
	    console.log(transPara);
	    this.axios.post('http://123.57.173.13:8811/IDSP/analyse/getCityChartData',transPara).then(data => {
			if (data == null) {
                alert('查询线索图数据失败.')
            } else if (data.flag) {
                if(compare){
                    this.showChartCompare(this.lineEchart, data.data, 0);
                }else{
                    this.showChart(this.lineEchart, data.data, 0);
                }
            } else {
                this.lineEchart.hideLoading();
                alert(data.msg);
            }
        }).catch(res => {
        	alert('查询线索图数据失败.');
        });
	    return true;
      },
      //楼盘类型
      getHousesTypeEcharts() {
      	var startDate;
	    var endDate;
	    if(this.dateType==2){
	        if(!this.checkInfo()){
	            return false;
	        }
	        startDate = this.formatData(this.pickerStart);
	        endDate = this.formatData(this.pickerEnd);
	    }
	    //城市选择
		var cityId = this.chooseCity;
	    //没有小时数据先只查天的
		var gradingType = 2;
	    var cStartDate;
	    var compare;
	    if(this.buildingChecked) {
	        compare=true;
	        var cStartDate = this.formatData(this.buildingPickerChart);
	        if(cStartDate == null || cStartDate == ""){
	            alert("请选择对比开始时间.");
	            return ;
	        }
	    }
	    var queryType = parseInt(this.buildingIndex) + 1;
	    var existInstance = echarts.getInstanceByDom(document.getElementById('chart_building'));
	    if(existInstance){
	    	//先释放图表
	        echarts.dispose(existInstance);
	    }
	    this.buildingEchart = echarts.init(document.getElementById('chart_building'));
	    this.buildingEchart.showLoading();
	    let transPara = {
            "cityId": cityId,
            "gradingType": gradingType,
            "dateType": this.dateType,
            "startDate": startDate,
            "endDate": endDate,
            "queryType": queryType,
            "cStartDate": cStartDate,
            "compare": compare
	    };
	    console.log(transPara);
	    this.axios.post('http://123.57.173.13:8811/IDSP/analyse/getCityChartData',transPara).then(data => {
			if (data == null) {
                alert('查询楼盘类型图数据失败.')
            } else if (data.flag) {
                if(compare){
                    this.showChartCompare(this.buildingEchart, data.data, 0);
                }else{
                    this.showChart(this.buildingEchart, data.data, 0);
                }
            } else {
                this.buildingEchart.hideLoading();
                alert(data.msg);
            }
        }).catch(res => {
        	alert('查询楼盘类型图数据失败.');
        });
	    return true;
      },
      //主推楼盘
      getHousesEcharts() {
      	var startDate;
	    var endDate;
	    if(this.dateType==2){
	        if(!this.checkInfo()){
	            return false;
	        }
	        startDate = this.formatData(this.pickerStart);
	        endDate = this.formatData(this.pickerEnd);
	    }
	    //城市选择
		var cityId = this.chooseCity;
	    //没有小时数据先只查天的
		var gradingType = 2;
	    var cStartDate;
	    var compare;
	    if(this.buildPreChecked) {
	        compare=true;
	        var cStartDate = this.formatData(this.buildPrePickerChart);
	        if(cStartDate == null || cStartDate == ""){
	            alert("请选择对比开始时间.");
	            return ;
	        }
	    }
	    var queryType = parseInt(this.buildPreIndex) + 1;
	    var existInstance = echarts.getInstanceByDom(document.getElementById('chart_buildPre'));
	    if(existInstance){
	    	//先释放图表
	        echarts.dispose(existInstance);
	    }
	    this.buildPreEchart = echarts.init(document.getElementById('chart_buildPre'));
	    this.buildPreEchart.showLoading();
	    let transPara = {
            "cityId": cityId,
            "gradingType": gradingType,
            "dateType": this.dateType,
            "startDate": startDate,
            "endDate": endDate,
            "queryType": queryType,
            "cStartDate": cStartDate,
            "compare": compare
	    };
	    console.log(transPara);
	    this.axios.post('http://123.57.173.13:8811/IDSP/analyse/getCityChartData',transPara).then(data => {
			if (data == null) {
                alert('查询楼盘主图图数据失败.')
            } else if (data.flag) {
                if(compare){
                    this.showChartCompare(this.buildPreEchart, data.data, 0);
                }else{
                    this.showChart(this.buildPreEchart, data.data, 0);
                }
            } else {
                this.buildPreEchart.hideLoading();
                alert(data.msg);
            }
        }).catch(res => {
        	alert('查询楼盘主推图数据失败.');
        });
	    return true;
      },
      //账号情况
      getAccountClickEcharts() {
      	var startDate;
	    var endDate;
	    if(this.dateType==2){
	        if(!this.checkInfo()){
	            return false;
	        }
	        startDate = this.formatData(this.pickerStart);
	        endDate = this.formatData(this.pickerEnd);
	    }
	    //城市选择
		var cityId = this.chooseCity;
	    //没有小时数据先只查天的
		var gradingType = 2;
	    var cStartDate;
	    var compare;
	    if(this.accountChecked) {
	        compare=true;
	        var cStartDate = this.formatData(this.accountPickerChart);
	        if(cStartDate == null || cStartDate == ""){
	            alert("请选择对比开始时间.");
	            return ;
	        }
	    }
	    var queryType = parseInt(this.accountIndex) + 1;
	    var existInstance = echarts.getInstanceByDom(document.getElementById('chart_account'));
	    if(existInstance){
	    	//先释放图表
	        echarts.dispose(existInstance);
	    }
	    this.accoutEchart = echarts.init(document.getElementById('chart_account'));
	    this.accoutEchart.showLoading();
	    let transPara = {
            "cityId": cityId,
            "gradingType": gradingType,
            "dateType": this.dateType,
            "startDate": startDate,
            "endDate": endDate,
            "queryType": queryType,
            "cStartDate": cStartDate,
            "compare": compare
	    };
	    console.log(transPara);
	    this.axios.post('http://123.57.173.13:8811/IDSP/analyse/getCityChartData',transPara).then(data => {
			if (data == null) {
                alert('查询账号情况图数据失败.')
            } else if (data.flag) {
                if(compare){
                    this.showChartCompare(this.accoutEchart, data.data, 0);
                }else{
                    this.showChart(this.accoutEchart, data.data, 0);
                }
            } else {
                this.accoutEchart.hideLoading();
                alert(data.msg);
            }
        }).catch(res => {
        	alert('查询账号情况图数据失败.');
        });
	    return true;
      },
      //城市图
      getCityEcharts() {
      	var startDate;
	    var endDate;
	    //查询范围：近三十天--1，根据日期---2
	    if(this.dateType==2){
	        if(!this.checkInfo()){
	            return false;
	        }
	        startDate = this.formatData(this.pickerStart);
	        endDate = this.formatData(this.pickerEnd);
	    }
	    //城市选择
		var cityId = this.chooseCity;
	    //没有小时数据先只查天的
		var gradingType = 2;
	    var cStartDate;
	    var compare;
	    if(this.cityChecked) {
	        compare=true;
	        var cStartDate = this.formatData(this.cityPickerChart);
	        if(cStartDate == null || cStartDate == ""){
	            alert("请选择对比开始时间.");
	            return ;
	        }
	    }
	    var queryType = parseInt(this.cityIndex) + 1;
	    var existInstance = echarts.getInstanceByDom(document.getElementById('chart_city'));
	    if(existInstance){
	    	//先释放图表
	        echarts.dispose(existInstance);
	    }
	    this.cityEchart = echarts.init(document.getElementById('chart_city'));
	    this.cityEchart.showLoading();
	    let transPara = {
            "cityId": cityId,
            "gradingType": gradingType,
            "dateType": this.dateType,
            "startDate": startDate,
            "endDate": endDate,
            "queryType": queryType,
            "cStartDate": cStartDate,
            "compare": compare
	    };
	    console.log(transPara);
	    this.axios.post('http://123.57.173.13:8811/IDSP/analyse/getCityChartData',transPara).then(data => {
			if (data == null) {
                alert('查询城市图数据失败.')
            } else if (data.flag) {
                if(compare){
                    this.showChartCompare(this.cityEchart, data.data, 0);
                }else{
                    this.showChart(this.cityEchart, data.data, 0);
                }
            } else {
                this.cityEchart.hideLoading();
                alert(data.msg);
            }
        }).catch(res => {
        	alert('查询城市图数据失败.');
        });
	    return true;
      },
      //媒体图
      getMediaEcharts() {
      	var startDate;
	    var endDate;
	    if(this.dateType==2){
	        if(!this.checkInfo()){
	            return false;
	        }
	        startDate = this.formatData(this.pickerStart);
	        endDate = this.formatData(this.pickerEnd);
	    }
	    //城市选择
		var cityId = this.chooseCity;
	    //没有小时数据先只查天的
		var gradingType = 2;
	    var cStartDate;
	    var compare;
	    if(this.mediaChecked) {
	        compare=true;
	        var cStartDate = this.formatData(this.mediaPickerChart);
	        if(cStartDate == null || cStartDate == ""){
	            alert("请选择对比开始时间.");
	            return ;
	        }
	    }
	    var queryType = parseInt(this.mediaIndex) + 1;
	    var existInstance = echarts.getInstanceByDom(document.getElementById('chart_media'));
	    if(existInstance){
	    	//先释放图表
	        echarts.dispose(existInstance);
	    }
	    this.mediaEchart = echarts.init(document.getElementById('chart_media'));
	    this.mediaEchart.showLoading();
	    let transPara = {
            "cityId": cityId,
            "gradingType": gradingType,
            "dateType": this.dateType,
            "startDate": startDate,
            "endDate": endDate,
            "queryType": queryType,
            "cStartDate": cStartDate,
            "compare": compare
	    };
	    console.log(transPara);
	    this.axios.post('http://123.57.173.13:8811/IDSP/analyse/getCityChartData',transPara).then(data => {
			if (data == null) {
                alert('查询媒体图数据失败.')
            } else if (data.flag) {
                if(compare){
                    this.showChartCompare(this.mediaEchart, data.data, 0);
                }else{
                    this.showChart(this.mediaEchart, data.data, 0);
                }
            } else {
                this.mediaEchart.hideLoading();
                alert(data.msg);
            }
        }).catch(res => {
        	alert('查询媒体图数据失败.');
        });
	    return true;
      },
      //趋势图
      getTendencyEcharts() {
      	var startDate;
	    var endDate;
	    if(this.dateType==2){
	        if(!this.checkInfo()){
	            return false;
	        }
	        startDate = this.formatData(this.pickerStart);
	        endDate = this.formatData(this.pickerEnd);
	    }
	    //城市选择
		var cityId = this.chooseCity;
	    //没有小时数据先只查天的
		var gradingType = 2;
	    var cStartDate;
	    var compare;
	    if(this.trendChecked) {
	        compare=true;
	        var cStartDate = this.formatData(this.trendPickerChart);
	        if(cStartDate == null || cStartDate == ""){
	            alert("请选择对比开始时间.");
	            return ;
	        }
	    }
	    var queryType = parseInt(this.trendIndex) + 1;
	    var existInstance = echarts.getInstanceByDom(document.getElementById('chart_trend'));
	    if(existInstance){
	    	//先释放图表
	        echarts.dispose(existInstance);
	    }
	    this.tendencyEchart = echarts.init(document.getElementById('chart_trend'));
	    this.tendencyEchart.showLoading();
	    let transPara = {
            "cityId": cityId,
            "gradingType": gradingType,
            "dateType": this.dateType,
            "startDate": startDate,
            "endDate": endDate,
            "queryType": queryType,
            "cStartDate": cStartDate,
            "compare": compare
	    };
	    console.log(transPara);
	    this.axios.post('http://123.57.173.13:8811/IDSP/analyse/getCityChartData',transPara).then(data => {
			if (data == null) {
                alert('查询趋势图数据失败.')
            } else if (data.flag) {
                if(compare){
                    this.showChartCompare(this.tendencyEchart, data.data, 0);
                }else{
                    this.showChart(this.tendencyEchart, data.data, 0);
                }
            } else {
                this.tendencyEchart.hideLoading();
                alert(data.msg);
            }
        }).catch(res => {
        	alert('查询趋势图数据失败.');
        });
	    return true;
      },
      //检查对比开始时间
	checkCStartDate(cStartDate) {
	    if(cStartDate == null || cStartDate == ""){
	        alert("请选择对比开始时间.");
	        return false;
	    }
	    return true;
	},
  	//总览图对比功能查询数据,1总览图对比功能 2，联系方式对比功能
	compareTQuery(type) {
	    var cStartDate;
	    var channelSelect;
	     if(type == 1){
	         channelSelect = "oChannelSelect";
	         cStartDate= this.formatData(this.pickerChart);
	        if(this.checkCStartDate(cStartDate)){
	            this.getOverviewEcharts();
	            //系列全选
	    		this.chooseRadio = 'all';
	        }
	     }else if(type==2){
	         channelSelect = "cChannelSelect";
	         cStartDate= this.formatData(this.pickerChart);
	         if(checkCStartDate(cStartDate)){
	             getContactEcharts();
	         }
	     }else if(type==3){
	         channelSelect = "htChannelSelect";
	         cStartDate= this.formatData(this.pickerChart);
	         if(checkCStartDate(cStartDate)){
	             getHousesTypeEcharts();
	         }
	     }else if(type==4){
	         channelSelect = "hChannelSelect";
	         cStartDate= this.formatData(this.pickerChart);
	         if(checkCStartDate(cStartDate)){
	             getHousesEcharts();
	         }
	     }else if(type==5){
	         channelSelect = "acChannelSelect";
	         cStartDate= this.formatData(this.pickerChart);
	         if(checkCStartDate(cStartDate)){
	             getAccountClickEcharts();
	         }
	     }else if(type==6){
	         channelSelect = "tChannelSelect";
	         cStartDate= this.formatData(this.pickerChart);
	         if(checkCStartDate(cStartDate)){
	             getTendencyEcharts();
	         }
	     }else if(type==7){
	         channelSelect = "cityChannelSelect";
	         cStartDate= this.formatData(this.pickerChart);
	         if(checkCStartDate(cStartDate)){
	             getCityEcharts();
	         }
	     }else if(type==8){
	         channelSelect = "mChannelSelect";
	         cStartDate= this.formatData(this.pickerChart);
	         if(checkCStartDate(cStartDate)){
	             getMediaEcharts();
	         }
	     }
	},
	/**
	 * 检查时间
	 */
	checkInfo() {
        var startDate = this.formatData(this.pickerStart);
        var endDate = this.formatData(this.pickerEnd);
        if(startDate == null || startDate == ''){
            alert("请选择查询开始时间.");
            return false;
        }
        if(endDate == null || endDate == ''){
            alert("请选择查询结束时间.");
            return false;
        }
        if(!this.compareDate(startDate,endDate)){
        	return false;
        }
    	return true;
	},
	//比较日前大小  
	compareDate(checkStartDate, checkEndDate) {      
	    var arys1= new Array();      
	    var arys2= new Array();      
		if(checkStartDate != null && checkEndDate != null) {      
		    arys1=checkStartDate.split('-');      
		    var sdate=new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);      
		    arys2=checkEndDate.split('-');      
		    var edate=new Date(arys2[0],parseInt(arys2[1]-1),arys2[2]);      
			if(sdate > edate) {      
			    alert("日期开始时间大于结束时间");         
			    return false;         
			}  else {     
			    return true;      
		    }   
	    }      
	}, 
      showChart(myChart,data,type) {
		    var series = this.getSeries(data.dataMap,1);
		    myChart.hideLoading();
		    window.onresize = myChart.resize;
		    myChart.setOption ({
		        tooltip: {
		            trigger: 'axis',
		            formatter: function (params) {
		                params.sort(function(a,b){
		                    return b.data-a.data;
		                });
		                var res='<div><p>时间：'+params[0].name+'</p></div>';
		                for(var i=0;i<params.length;i++){
		                    if(params[i].data!=0){
		                    	var temp = type === 1 ? " %" : "";
		                        res+="<p ><span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:" + params[i].color + "'></span>"+params[i].seriesName+":"+ params[i].data + temp +"</p>";
		                    }
		                }
		                return res;
		            }
		        },
		        legend: {
		            data:data.nameList,
		            type:'scroll',
		            bottom:'7.3%',
		        },
		        grid: {
		            top:'12%',
		            left: '3%',
		            right: '4%',
		            containLabel: true
		        },
		        xAxis: {
		            type: 'category',
		            boundaryGap: false,
		            data: data.timeList
		        },
		        yAxis: {
		            type: 'value',
					axisLabel: {
						formatter: type === 1 ? '{value} %' : '{value}'
					}
		        },
		        dataZoom: [
		           {   // 这个dataZoom组件，默认控制x轴。
		                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
		                start: 0,      // 左边在 10% 的位置。
		                end: 100,      // 右边在 60% 的位置。
		                bottom:'1%'
		            }
		        ],
		        series:  series
		    },true);
		
		},
		//显示对比图
		showChartCompare(myChart,data,type) {
		    myChart.hideLoading();
		    var nameList = this.getNameList(data.nameList);
		    var series = this.getSeries(data.dataMap,2);
		    var colors = ['#5793f3', '#d14a61', '#675bba'];
		    option = {
		        tooltip: {
		            trigger: 'axis',
		            formatter: function (params) {
		                params.sort(function(a,b){
		                    return b.data-a.data});
		                var res='<div><p>时间：'+params[0].name+'</p></div>'
		                for(var i=0;i<params.length;i++){
		                    if(params[i].data!=0){
								var temp = type === 1 ? " %" : "";
		                        res+="<p ><span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:" + params[i].color + "'></span>"+params[i].seriesName+':'+params[i].data+ temp +'</p>'
		                    }
		                }
		                return res;
		            }
		        },
		        legend: {
		            data:nameList,
		            type:'scroll',
		            bottom:'8%',
		        },
		        grid: {
		            top:'12%',
		            left: '3%',
		            right: '4%',
		            containLabel: true
		        },
		        xAxis: [
		            {
		                type: 'category',
		                axisTick: {
		                    alignWithLabel: true
		                },
		                axisLine: {
		                    onZero: false,
		                    lineStyle: {
		                        color: colors[1]
		                    }
		                },
		                data: data.timeList
		            },
		            {
		                type: 'category',
		                axisTick: {
		                    alignWithLabel: true
		                },
		                axisLine: {
		                    onZero: false,
		                    lineStyle: {
		                        color: colors[0]
		                    }
		                },
		                data:data.tTimeList
		            }
		        ],
		        yAxis: [
		            {
		                type: 'value',
						axisLabel: {
							formatter: type === 1 ? '{value} %' : '{value}'
						}
		            }
		        ],
		        dataZoom: [
		            {   // 这个dataZoom组件，默认控制x轴。
		                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
		                xAxisIndex: [0],
		                start: 0,      // 左边在 0% 的位置。
		                end: 100,        // 右边在 100% 的位置。
		                bottom:'1%'
		            },
		            {
		                type: 'slider',
		                xAxisIndex: [1],
		                top: '2%',
		                start: 0,      // 左边在 0% 的位置。
		                end: 100         // 右边在 100% 的位置。
		            }
		        ],
		        series: series
		    };
		    window.onresize = myChart.resize;
		    myChart.setOption(option);
		},
		getSeries(map,type) {
		    var serie = [];
		    for(var key in map){
		        if(type==1){
			        var item = {
			            name:key,
			            type: 'line',
			            data: map[key],
			        }
		        }else{
		            var nameArr = key.split(",");
		            var name = nameArr[0];
		            if(nameArr[1]=='0'){
		                name =name+"-原"
		            }else{
		                name =name+"-对比"
		            }
		            var item = {
		                name:name,
		                type: 'line',
		                xAxisIndex: nameArr[1],
		                data: map[key]
		            }
		        }
		        serie.push(item );
		    }
		    return serie;
		},
		//对比获取name
		getNameList(nameList) {
		    var result= new Array();
		    for(let i = 0;i < nameList.length;i++){
		    	var nameArr =nameList[i].split(",");
		        var name = nameArr[0];
		        if(nameArr[1]=='0'){
		            name = name + "-原";
		        }else{
		            name = name + "-对比";
		        }
		        result.push(name);
		    }
		    return result;
		},
		//时间格式化
		formatData(para) {
			let reValue = '';
			if(para != ''){
				let d = new Date(para);
				reValue = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
			}else{
				reValue = ''
			}
	        return reValue;
		},
		//循环找出每个图中的搜索条件
		forSearch(paraList) {
			let queryResult;
			for(let i = 0;i < paraList.length;i++){
				if(paraList[i].flag){
					queryResult = paraList[i];
					break;
				}
			}
			return queryResult;
		}
    },
    watch:{
    	//监听趋势图和城市图的互换
    	chooseCity:{
	        handler:function(val,oldval){
	        	if(val){
	        		this.tendencyEchart = echarts.init(document.getElementById("chart_trend"));
	        		this.showChart(this.tendencyEchart,this.overCity.data,0);
	        	}else{
	        		this.cityEchart = echarts.init(document.getElementById("chart_city"));	
	        		this.showChart(this.cityEchart,this.overCity.data,0);
	        	}
	        },
		    deep:true
		},
    }
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
	.over_top .cityTip{
		font-size: 13px;
		font-weight: bold;
	}
	.over_top .citySelect{
		font-size: 12px;
		width: 110px;
		margin-left: 8px;
	}
	.backColor{
		background-color: #fff;
	}
	.todayData{
		height: 80px;
		width: 100%;
	}
	.changeDate{
		height: 40px;
		margin-top: 20px;
		width: 100%;
		text-align: left;
	}
	.showCharts{
		overflow: hidden;
		margin-top: 20px;
		/*display: flex;
		flex-direction: row;
		justify-content:space-between;*/
	}
	.todayData .todayTip{
		font-size: 17px;
		font-weight: 700;
		color: #5b5d61;
		line-height: 80px;
		border-right: 1px solid #eee;
	}
	.todayData .topUl{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.todayData .topUl .topLi{
		height: 40px;
		width: 20%;
		line-height: 50px;
		text-align: center;	
		font-size: 10px;
		font-weight: bold;
		color: #666;
	}
	.todayData .topUl .bottomLi{
		height: 30px;
		line-height: 20px;
		color: #000;
		font-size: 18px;
		border-left: 1px solid #eee;
		margin-top: 10px;
	}
	.todayData .topUl .bottomLi:first-of-type{
		border: none;
	}
	.showChoose{
		height: 50px;
		text-align: left;
		margin-left: 50px;
		/*transition: height 1s;
		-moz-transition: height 1s; 
		-webkit-transition: height 1s; 
		-o-transition: height 1s;*/ 
	}
	.changeIcon{
		font-size: 12px;
		margin: 0 5px;
	}
	.dateBtn{
		padding: 8px 15px;
		margin-left: 20px;
	}
	.chartDiv{
		width: 49%;
		height: 500px;
		padding: 20px;
		box-sizing: border-box;
		margin-top: 20px;
		margin-right: 22px;
	}
	.chartDiv:nth-of-type(even){
		margin-right: 0;
	}
	.chartDiv:nth-of-type(1){
		margin-top: 0;
	}
	.chartDiv:nth-of-type(2){
		margin-top: 0;
	}
	.chartDiv .chartHeader{
		width: 100%;
		overflow: hidden;
	}
	.chartDiv .chartHeader .headerTip{
		color: #333;
		font-size: 17px;
		font-weight: bold;
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, SimSun, sans-serif;
	}
	.chartDiv .chartHeader .el-checkbox__inner{
		height: 15px;
		width: 15px;
		text-align: center;
		line-height: 15px;
	}
	.chartDiv .chartHeader .topFirst{
		height: 30px;
	}
	.chartDiv .chartHeader .chartCheck{
		margin:5px 0 0 65px;
	}
	.chartDiv .chartHeader .el-input{
		width: 140px;
		height: 28px;
	}
	.chartDiv .chartHeader .el-input__inner{
		width: 130px;
		height: 28px;
		font-size: 12px;
	}
	.chartDiv .chartHeader .startTime{
		font-size: 14px;
	}
	.chartDiv .chartHeader .chartBtn{
		padding: 6px 12px;
		margin-left: 10px;
	}
	.chartDiv .chartHeader .changeKey{
		overflow: hidden;
		font-size: 13px;
		margin-top: 10px;
	}
	.chartDiv .chartHeader .changeKey .toDetail{
		color: #4392FF;
		font-weight: bolder;
		margin-top: 7px;
		cursor: pointer;
	}
	.chartDiv .chartHeader .changeKey .chosenLi{
		border: 1px solid #eee;
		text-align: center;
		padding: 4px 8px;
		background-color: #4392FF;
		border-collapse: collapse;
		color: #fff;
		cursor: pointer;
		border-color: #4392FF;
	}
	.chartDiv .chartHeader .changeKey .unchosenLi{
		border: 1px solid #eee;
		text-align: center;
		padding: 4px 10px;
		border-collapse: collapse;
		cursor: pointer;
	}
	.chartDiv .chartHeader .checkFild{
		overflow: hidden;
		margin-top: 10px;
		text-align: right;
		padding-right: 10px;
	}
	.chartDiv .chartHeader .checkFild .el-radio__input{
		width: 15px;
		height: 15px;
	}
	.chartDiv .chartHeader .checkFild .el-radio__inner{
		width: 15px;
		height: 15px;
		text-align: center;
	}
	.chartDiv .chartHeader .checkFild .el-radio__label{
		font-size: 13px;
	}
	.nameClass{
		font-size: 13px;
	}
	.radioClass{
		font-size: 13px;
		margin-right: 5px;
	}
	.radioClassInput{
		margin-left: 5px;
	}
</style>