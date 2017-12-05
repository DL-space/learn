<template>
  <div class="clerk search-create">
    <div class="top" style="position:fixed;width:100%;top:0;z-index:2;">
      <search-client :searchText="searchText" :placeholder="placeholder" @handleFocus="handleFocus" @handleCancel="handleCancel" @handleInput="handleInput" @handleSearch="handleSearch"></search-client>
      <div class="search-client-num">
        <span class="num-left">创建数量：{{searchClient.total}}</span>
        <span class="num-right"><span @click="selectDate(0)" class="right-start">{{!startTime?'开始时间':startTime}}<span class="right-rili"></span></span><span class="right-start" @click="selectDate(1)">{{!endTime?'结束时间':endTime}}<span class="right-rili"></span></span></span>
      </div>
      <tab-client :data="menus" @handleTab="handleTab"></tab-client>
    </div>

    <div class="client-list">
      <div class="list-content" v-show="type==1">
         <!-- <template v-if="searchClient.list.length"> -->
            <list :isMore="searchClient.isMore" :load="loadData" :downRefresh="()=>{return loadData(1);}">
              <Search-item v-for="(v,i) of searchClient.list" @handleClick="jumpDetail(v.id,type)" :type="type" :index="i" :data="v" :key="i" v-if="searchClient.list.length"/>
            </list>
         <!-- </template> -->
         <!-- <div class="list-no-item" v-else>
            没有相关记录
         </div> -->
      </div>


      <div class="create-map-pos" ref="mapWrap" v-show="type==2">
        <button class="color-panel">
           <div><span style="background:#4392ff;" class="map-color"></span> <span>别人创建的客户</span></div>
           <span style="background:#e75fec;" class="map-color"></span> <span>我创建的客户</span>
        </button>
      </div>

    </div>
    <!-- <div style="padding:.1rem;">
      <button class="btn" @click="handleMore" v-show="searchClient.isMore && type==1" >获取更多</button>
    </div> -->
    <!-- <mt-datetime-picker
      ref="datePicker"
      @confirm="handleConfirm"
      v-model="nowDate"
      type="date"
      :startDate="initDate"
      :endDate="endInitDate"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日" /> -->
     <!-- <yd-datetime type="date" v-model="nowDate" ref="datetimeStart" v-show="false" :startDate="initDate" :endDate="endInitDate" @pickerConfirm="handleConfirm"></yd-datetime>

     <yd-datetime type="date" v-model="nowEndDate" ref="datetimeEnd" v-show="false" :startDate="initDate" :endDate="endInitDate" @pickerConfirm="handleConfirm"></yd-datetime> -->

     <date-picker :value="nowDate" :startDate="initDate" :endDate="endInitDate" :isShow="openDatepickerStart" @update:isShow="val => openDatepickerStart = val" @change="handleConfirm"/>

     <date-picker :value="nowEndDate" :startDate="initDate" :endDate="endInitDate" :isShow="openDatepickerEnd" @update:isShow="val => openDatepickerEnd = val" @change="handleConfirm"/>
  </div>
</template>
<script>
  import {SearchClient} from '@/components/Common/Search'
  import {TabClient} from '@/components/Common/Tab'
  import loading from '@/components/Common/loading';
  import list from '@/components/Common/Tab/list';

  import {ButtonClient} from '@/components/Common/Form'
  import SearchItem from '@/components/Clerk/SearchItem'
  import {Ajax,LoadScript,Axios} from '@/assets/Util'
  import { DatetimePicker,Toast } from 'mint-ui';
  import { mapState,mapActions,mapMutations,mapGetters } from 'vuex'
  import datePicker from '@/components/Common/Picker/datepicker';
  import config from '../../../conf'

  // import {DateTime} from 'vue-ydui/dist/lib.rem/datetime';

  // console.log(DateTime)
  // import 'vue-ydui/dist/ydui.base.css';

  // Vue.component(DateTime.name, DateTime);
  const time=1000;


  export default {
    components:{SearchClient,TabClient,SearchItem,ButtonClient,datePicker,list},
    data(){
      return {
        button:{
          txt:'获取更多',
          style:{marginTop:'.1rem',borderRadius:'0'}
        },
        menus:[{name: '我创建的客户',focus: 1}, {name: '地图定位分布'}],
        searchText:'',
        placeholder:'',
        page:1,
        rows:10,
        type:1,
        nowDate:this.fomatTime(new Date),
        nowEndDate:this.fomatTime(new Date),

        startTime:'',
        endTime:'',
        tmpStart:'',
        tmpEnd:'',
        nowTime:this.fomatTime(new Date),
        startTimeDate:this.fomatTime(new Date),
        endTimeDate:this.fomatTime(new Date),
        timeType:2,
        initDate:'2014-01-01',
        endInitDate:this.fomatTime(new Date),
        map:null,
        geolocation:null,
        marker:null,
        markerClient:[],
        mapActive:0,
        marketList:[],
        clickMarkets:[],
        geoPosition:'',
        distance:500,
        cls:[require('../../../static/images/clerk/icon/icon_map_market_blue.svg'),require('../../../static/images/clerk/icon/icon_map_market_pick.svg'),require('../../../static/images/clerk/icon/icon_map_market_green.svg'),require('../../../static/images/clerk/icon/icon_map_market_red.svg')],
        first:false,
        mls:[],
        openDatepickerStart:false,
        openDatepickerEnd:false
      }
    },
    computed:{
      ...mapGetters([
        'loadFinish',
        'openid',
        'searchClient'
      ]),
    },
    created(){
      window.createMap=()=>{
        const mapWrap=this.$refs.mapWrap;
        this.map = new AMap.Map(mapWrap, {
          resizeEnable: true
        });
        this.getGeolocation();
      }

      this.setClientInfo({});

      if(this.searchClient.list.length) return;

      this.loadData(1);
    },
    mounted(){

    },
    methods:{
      ...mapActions([
        'setCreateClientList',
        'changeLoadFinish',
        'changeTip',
        'clear_obj',
        'setClientInfo'
      ]),
      getGeolocation(){
        loading.open('定位中');
        this.map.plugin('AMap.Geolocation', ()=>{
          this.geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,  //是否使用高精度定位，默认:true
            timeout: 10000,            //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB',
            panToLocation: false,
            showButton: false
          });
          this.map.addControl(this.geolocation);
          this.geolocation.getCurrentPosition();
          AMap.event.addListener(this.geolocation,'complete',(data3)=>{
            loading.close();
            let {lng,lat}=data3.position;
            this.map.setZoomAndCenter(14,[lng,lat]);
            this.geoPosition=data3.position;
            this.marker=new AMap.Marker({
              position:[lng,lat] ,
              offset: new AMap.Pixel(-7,-19), //相对于基点的偏移位置
              draggable: false,  //是否可拖动
              content: '<div class="marker-red-icon"></div>'
            });
            this.marker.setMap(this.map);


            this.getMaps(0.5);

            // this.map.setFitView();

            // this.getMaps();
          })

          AMap.event.addListener(this.geolocation, 'error', (err)=>{
            loading.close();
            console.log(err);
            if(err.message=='Geolocation permission denied.') return Toast('请在手机设置里开启微信的定位功能')
            Toast('定位失败')
          });

        })
      },
      getMapClient(data){
        return new Promise((resolve,reject)=>{
          Axios('/api/saler/customer/location/list',data).then(dt=>{
             if(!dt.result || dt.code){
               Toast(dt.message);
               return reject(dt.message);
             }
             else resolve(dt.data);

          })

        })
      },
      getMaps(scope){
        this.mapActive=0;
        let {lng,lat}=this.geoPosition;


        this.getMapClient({openId:this.openid,longitude:lng,latitude:lat,scope,type:3,queryFlag:1}).then(dt=>{
          this.marketList=dt;
          console.log(dt,9999)
          LoadScript('//webapi.amap.com/ui/1.0/main.js',()=>{
              this.createMarkets();
          });
        })



      },
      createMarkets(){
        // this.map.clearMap();
        if(this.mls.length){
          this.map.remove(this.mls);
          this.mls=[];
          this.map.clearInfoWindow();
        }

        let _this=this;
        let mapList=this.marketList;
        let list=mapList.map((v,i)=>{
           let {createTime,address,orgName,id,longitudeLatitude} = v,
                 position='';
           longitudeLatitude && (position=longitudeLatitude.split(','))

           return {createTime,address,orgName,id,position,isMy:v.isMy};
        });

        if(!list.length) return;
        let cls =this.cls;
        let vm = this;

        window.jump = function(id){
           vm.$router.push({path:'addTmpClient',query:{id,canEdit:0}})
        }
        AMapUI.loadUI(['misc/MarkerList', 'overlay/SimpleMarker'], (MarkerList,SimpleMarker)=>{
              if(!MarkerList) return;
              var markerList = new MarkerList({
              map: this.map, //关联的map对象
              // listContainer: 'my-list', //列表的dom容器的节点或者id
              getDataId: function(dataItem, index) {
                  //返回数据项的Id
                  return dataItem.id;
              },
              getPosition: function(dataItem) {
                  //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
                  return dataItem.position;
              },
              getMarker: function(dataItem, context, recycledMarker) {
                  var content = '标注: ' + (context.index + 1) + '',
                      label = {
                          offset: new AMap.Pixel(16, 18),
                          content: content
                      };
                  if (recycledMarker){
                      //存在可回收利用的marker,直接setLabel返回
                      // recycledMarker.setLabel(label);
                      return recycledMarker;
                  }
                  //返回一个新的Marker
                  let m=new SimpleMarker({
                          iconStyle:{
                            src:cls[dataItem.isMy],
                            style:{width:'.4rem',}
                          },
                          animation:'AMAP_ANIMATION_DROP'
                        });
                  _this.mls.push(m);
                  return m;
              },
              getInfoWindow: function(dataItem, context, recycledInfoWindow) {
                  var tpl = '<div><p>客户名称:<a style="color:#4392ff;" onclick="jump('+dataItem.id+')">'+dataItem.orgName+'</a></p><p>创建时间:'+dataItem.createTime+'</p><p>地址:'+dataItem.address+'</p></div>';
                  //MarkerList.utils.template支持underscore语法的模板
                  var content = MarkerList.utils.template(tpl, {
                      dataItem: dataItem,
                      dataIndex: context.index
                  });
                  if (recycledInfoWindow) {
                      //存在可回收利用的infoWindow, 直接setContent返回
                      recycledInfoWindow.setContent(content);
                      return recycledInfoWindow;
                  }
                  //返回一个新的InfoWindow
                  return new AMap.InfoWindow({
                      offset: new AMap.Pixel(0, -23),
                      content: content
                  });
              },
          });

          // this.mls.push(markerList);

          //监听选中改变
          markerList.on('selectedChanged', function(event, info) {

          });

          //监听Marker和ListElement上的点击，详见markerEvents，listElementEvents
          markerList.on('markerClick listElementClick', (event, record)=>{
            // console.log(record)
            if(this.clickMarkets.length){
              this.clickMarkets[2].setIconStyle({
                src:this.cls[this.clickMarkets[1]],
                style:{width:'.4rem',}
              })
            }
            record.marker.setIconStyle({
                src:this.cls[2],
                style:{width:'.4rem',}
            })
            this.clickMarkets=[record.index,record.data.isMy,record.marker];

          });



          //绘制数据源，Let's go!
          markerList.render(list);


          this.map.setFitView();

          this.map.on('zoomchange',()=>{

             let lnglat = new AMap.LngLat(this.geoPosition.lng,this.geoPosition.lat);
             let dis=lnglat.distance(this.map.getBounds().getSouthWest());

             if(dis>this.distance){
               this.getMaps(dis/1000);
               this.distance=dis;
             }

          })



      });
      },
      // distace
      jumpDetail(id,type){
        let canEdit=type==1?1:0;
        this.clear_obj('clientInfo');
        // this.$router.push({name: 'detailClient', query: {id,canEdit}})
        this.$router.push({name: 'addTmpClient', query: {id,canEdit:0}})
      },
      handleInput(e){
        this.searchText= e.target.value;
      },
      handleFocus(tar){
        const input=tar.getElementsByTagName('input')[0];
        if(input.value==''){
          const holder=tar.getElementsByClassName('holder')[0];
          const searchBtn=tar.getElementsByClassName('search_btn')[0];
          const searchRecord=tar.getElementsByClassName('search-record')[0];
          const cancle=tar.getElementsByClassName('cancle')[0];
          searchBtn.style.display = "block";
          //searchRecord.style.display="block";
          cancle.style.display = "block";
          holder.style.display = "none";
          input.focus();
          this.placeholder='手机号／店名／老板姓名';
        }
      },
      handleCancel(tar){
        const input=tar.getElementsByTagName('input')[0],page=1,rows=this.rows,openId=this.openid;
        const holder=tar.getElementsByClassName('holder')[0];
        const searchBtn=tar.getElementsByClassName('search_btn')[0];
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        const cancle=tar.getElementsByClassName('cancle')[0];
        searchRecord.style.display="none";
        searchBtn.style.display = "none";
        cancle.style.display = "none";
        holder.style.display = "block";
        this.placeholder='';
        this.searchText='';
        this.loadData(1);
      },
      handleSearch(tar){
        const input=tar.getElementsByTagName('input')[0],page=1,rows=this.rows,searchText=this.searchText,openId=this.openid;
        if(input.value==''){
          this.$store.dispatch('changeTip',{isTip:true,txt:'搜索信息不能为空',time:1000});
          input.focus();
          return;
        }
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        searchRecord.style.display="none";
        this.loadData(1);
      },
      // loadData(data){
      //   // let {startTime='',endTime='',searchText=''}=this;
      //   // // this.changeTip({isTip:true,txt:'加载中...',loading:true});
      //   // this.setCreateClientList({page:this.page,rows:this.rows,startTime:startTime,endTime:endTime,searchText,openId:this.openid,queryFlag:1})
      // },
      loadData(type){
        return new Promise((resolve,reject)=>{
          let {startTime='',endTime='',searchText='',page,rows,openid}=this;

          if(type) this.page=1;
          else this.page++;


          this.setCreateClientList({page:this.page,rows,startTime:startTime,endTime:endTime,searchText,openId:openid,queryFlag:1}).then(dt=>{
             resolve();
          })
        })

      },
      handleTab(obj){
        this.changeLoadFinish({txt:''});
        this.menus.forEach((v)=>{
          if(v.name==obj.name){
            v.focus=1;
          }else{
            v.focus=0;
          }
        })
        this.page=1;
        const page=this.page,rows=this.rows,searchText=this.searchText;
        if(obj.name=='地图定位分布'){
          this.type=2;

          if(!this.map)LoadScript('http://webapi.amap.com/maps?v=1.3&key='+config.map_key+'&callback=createMap',()=>{})


        }else{
          this.type=1;
          if(this.searchClient.list.length) return;
          this.loadData(1);
        }
      },
      handleMore(){
        if(!this.searchClient.isMore) return;
        this.page++;
        this.loadData();
      },
      selectDate(i){
        this.timeType=i;

        //
        let name=i?'End':'Start';

        this['openDatepicker'+name]=true;

        //
        // this.$refs[name].open();
      },
      typeUpdate(n){
        let type=this.timeType?'end':'start';
        return type+n;
      },
      handleConfirm(value){

        if(this.timeType==2) return;
        let type=this.timeType?'End':'Start';
        // let t=this.fomatTime(value);
        //
        this[this.typeUpdate('TimeDate')]=value;
        this[this.typeUpdate('Time')]=value;


        let {startTime,endTime}=this;

        if(startTime && endTime){
           console.log(startTime,endTime)
           let st=startTime.split('-'),et=endTime.split('-');
           for(let i=0;i<st.length;i++){
             console.log(st[i],et[i])

              if(st[i]>et[i]){
                Toast('结束时间不能小于开始时间');
                this[this.typeUpdate('Time')]='';
                return setTimeout(()=>this['openDatepicker'+type]=true,0);
              }
              else if(st[i]<et[i]) break;
           }
          this.loadData(1);
        }
      },
      addZero(a){

        return a>9?a:'0'+a.toString()
      },
      fomatTime(d){
        let y=d.getFullYear(),m=this.addZero(d.getMonth()+1),dd=this.addZero(d.getDate());

        return y+'-'+m+'-'+dd;
      }
    },
  }
</script>
<style scoped>

  .search-create{
    padding-top: 1.6rem;
  }

  .search-client-num{
    height: .5rem;
    line-height: .5rem;
    font-size: .14rem;
    padding: 0 .2rem;
    color:#666;
    position: relative;
    background: #f5f5f5;
    z-index: 2;
  }
  .amap-marker .marker-active-icon{
    color:#1296fb;
  }
  .num-right{

    position: absolute;
    right: .2rem;

  }
  .right-start{
    margin-left: .05rem;
  }
  .right-rili{
    width: .26rem;
    height: .26rem;
    vertical-align: -.08rem;
    display: inline-block;
    margin-left: .04rem;
    background: url(../../../static/images/clerk/icon/icon-rili.png) 50% 50% / contain no-repeat;
  }
  .create-map-pos{
    height:calc(100vh - 1.6rem);
  }

  .adress-show{
    position: fixed;
    bottom:0;
    z-index: 1000;
    width: 100%;
    left:50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);

    height: 1.02rem;
    overflow: auto;
    /*-webkit-overflow-scrolling: touch;*/
    background: rgba(255, 255, 255, .95);
    /*height:.6rem;*/
    border: none;
    text-align: left;
    padding: .02rem 0;
  }
 .address-btn{
    background: #1296fb;
    padding: .05rem .08rem;
    border: none;
    font-size: .13rem;
    color:#fff;
    position: absolute;
    right: .1rem;
    top:50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);

 }
 .add-item{
    font-size: .14rem;
    border-bottom: 1px solid #f1f1f1;
    padding: .05rem .6rem .06rem .2rem;
    color:#333;
    /*line-height: .24rem;*/
 }
 .add-item.active{
    color:#1296fb;
 }
 .list-content{
   margin-top: .1rem;
 }
 .map-color{
   width: .1rem;
   height: .04rem;
   display: inline-block;
   vertical-align: middle;
   margin-right: .02rem;
 }
 .color-panel{
   background: rgba(255, 255, 255, 0.8);
   border: 1px solid #f5f5f5;
   position: absolute;
   z-index: 100;
   font-size: .12rem;
   padding: .1rem;
   text-align: left;
   color:#666;
 }
</style>
