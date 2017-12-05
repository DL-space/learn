<template>
  <div class="map-box">
    <button class="color-panel">
       <div><span style="background:#4392ff;" class="map-color"></span> <span>服务站</span></div>
       <span style="background:#e75fec;" class="map-color"></span> <span>驿站</span>
    </button>
    <div class="position" ref="position" id="position"></div>
  </div>

</template>
<script>

  import {LoadScript,Axios} from '@/assets/Util';
  import loading from '@/components/Common/loading';
  import { mapState,mapActions,mapMutations,mapGetters } from 'vuex'

  import { Toast } from 'mint-ui';
  import config from '../../../conf'

  export default{
    data(){
      return {
         map:{},
         marketList:[],
         clickMarkets:[],
         geoPosition:'',
         mls:[],
         distance:500,
         cls:[require('../../../static/images/clerk/icon/icon_map_market_blue.svg'),require('../../../static/images/clerk/icon/icon_map_market_pick.svg'),require('../../../static/images/clerk/icon/icon_map_market_green.svg'),require('../../../static/images/clerk/icon/icon_map_market_red.svg'),require('../../../static/images/client/icon-post-map.svg'),require('../../../static/images/client/icon-station-map.svg')],
         stationType:{2:0,21:1}
      }
    },
    props:{
      markList:{
        type:Array,
        default(){
          return []
        }
      },
      isMarkList:{
        type:Boolean,
        default:false
      },
      isZoomChange:{
        type:Boolean,
        default:false
      },
      mListUrl:{
        type:String,
        default:'/api/saler/customer/location/list'
      },
      mListArgs:{
        type:Object
      }
    },
    computed:{

   },
    created(){
        window.init=()=>{
          this.init();
        }
    },
    computed:{
      ...mapGetters([
        'openid',
      ]),
    },
    methods:{
      getMapClient(data){
        return new Promise((resolve,reject)=>{
          Axios(this.mListUrl,data).then(dt=>{
             if(!dt.result || dt.code){
               Toast(dt.message);
               return reject(dt.message);
             }
             else resolve(dt.data);

          })

        })
      },
      init(){
        loading.open('定位中');
        let position=this.$refs['position'],geolocation;
        //加载地图，调用浏览器定位服务
        let map=this.map = new AMap.Map(position, {
          resizeEnable: true
        });

        map.plugin('AMap.Geolocation', ()=>{
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,  //是否使用高精度定位，默认:true
            timeout: 10000,            //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB',
            panToLocation: false,
            showButton: false,
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true

            showCircle: true
        });

          geolocation.getCurrentPosition();


          AMap.event.addListener(geolocation,'complete',(data)=>{
            loading.close();
            map.setZoomAndCenter(15,[data.position.lng, data.position.lat]);
            let {lng,lat}=data.position;
            this.geoPosition=data.position;
            this.$emit('getMap',map,{lng,lat});

            if(this.isMarkList) this.getList(0.5);


          })
          map.addControl(geolocation);

          AMap.event.addListener(geolocation, 'error', (err)=>{
            console.log(err);
            loading.close();
            if(err.message=='Geolocation permission denied.') return alert('请在手机设置里开启微信的定位功能')
            Toast('定位失败')
          });
        })
      },
      getList(scope){
        // this.mapActive=0;
        let {lng,lat}=this.geoPosition;

        // {openId:this.openid,longitude:lng,latitude:lat,scope,type:3,queryFlag:1}
        this.getMapClient(this.mListArgs).then(dt=>{
          this.marketList=dt;
          // console.log(dt,9999)
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

           return {createTime,address,orgName,id,position,orgType:this.stationType[v.orgType]};
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
                            // src:cls[dataItem.isMy],
                            src:cls[dataItem.orgType],
                            style:{width:'.4rem',}
                          },
                          animation:'AMAP_ANIMATION_DROP'
                        });
                  _this.mls.push(m);
                  return m;
              },
              getInfoWindow: function(dataItem, context, recycledInfoWindow) {
                  var name = !dataItem.orgType?'服务站':'驿站';
                  var tpl = '<div><p>'+name+'名称:<a style="color:#4392ff;">'+dataItem.orgName+'</a></p><p>创建时间:'+dataItem.createTime+'</p><p>地址:'+dataItem.address+'</p></div>';
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
            this.clickMarkets=[record.index,record.data.orgType,record.marker];

          });



          //绘制数据源，Let's go!
          markerList.render(list);


          this.map.setFitView();


          if(this.isZoomChange){
            this.map.on('zoomchange',()=>{

               let lnglat = new AMap.LngLat(this.geoPosition.lng,this.geoPosition.lat);
               let dis=lnglat.distance(this.map.getBounds().getSouthWest());

               if(dis>this.distance){
                 this.getList(dis/1000);
                 this.distance=dis;
               }

            })
          }




      });
      },
    },
    mounted(){

      this.getMapClient(this.mListArgs)

      LoadScript('http://webapi.amap.com/maps?v=1.3&key='+config.map_key+'&callback=init',()=>{

      })
    }
  }

</script>
<style scoped>
  .position{width:100%;height:100%}
  .map-box{
    width:100%;height:100%
  }
</style>
