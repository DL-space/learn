<template>
  <div class="clerk">
    <button class="color-panel">
       <div><span style="background:#4392ff;" class="map-color"></span> <span>{{type==1?'别人的客户':'别人创建的客户'}}</span></div>
       <span style="background:#e75fec;" class="map-color"></span> <span>{{type==1?'我的客户':'我创建的客户'}}</span>
    </button>

    <div class="position" ref="position" id="position"></div>
    <div id="panel">

    </div>
      <button class="adress-show" v-if="!$route.query.canEdit==0">
        {{add}}
        <input class="address-inp" placeholder="填写详细地址" v-model="addDetail">
        <button class="address-btn" @click="addOk">确认</button>
      </button>
  </div>
</template>
<script>

  import {LoadScript,GetDistance,Axios} from '@/assets/Util';
  import loading from '@/components/Common/loading';

  import { mapState,mapActions,mapGetters } from 'vuex';
  import { Toast } from 'mint-ui';
  import config from '../../../conf'
  export default{
    data(){
      return {
         add:'',
         addDetail:'',
         data2:{},
         map:{},
         markets:[],
         clickMarkets:[],
         mls:[],
         geoPosition:'',
         distance:500,
         locked:true,
         type:'',
         canEdit:''
      }
    },
    computed:{
      ...mapGetters([
        'clientInfo',
        'openid'
      ])
   },
    created(){
        const {canEdit,type}=this.$route.query;
        this.type=type;
        this.canEdit=canEdit;


        window.init=()=>{
          this.init();
        }
       if(this.clientInfo.areaInfo){
         this.addDetail=this.clientInfo.areaInfo;
     }
    },
    methods:{
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


      createMarket(SimpleMarker,list,my){

          if(this.markets.length){
            this.map.remove(this.markets);
            this.markets=null;
            this.markets=[];
            this.map.clearInfoWindow();
          }
          let iconStyles = SimpleMarker.getBuiltInIconStyles(),
          cls=[require('../../../static/images/clerk/icon/icon_map_market_blue.svg'),require('../../../static/images/clerk/icon/icon_map_market_pick.svg'),require('../../../static/images/clerk/icon/icon_map_market_green.svg'),require('../../../static/images/clerk/icon/icon_map_market_red.svg')]

          let infoWindow = new AMap.InfoWindow({
            offset:new AMap.Pixel(-6, -10)
          });
          window.jumpDetail=(id,isMy)=>{
            this.$router.push({name: 'detailClient', query: {id,canEdit:isMy}})
          }



          let markerClick = (e,i,isMy)=>{
              let [j,c]=this.clickMarkets;
              if(this.clickMarkets[0]!=i){
                infoWindow.setContent(e.target.content);
                infoWindow.open(this.map, e.target.getPosition());
                if(this.clickMarkets.length) {
                  this.markets[j].setIconStyle({
                    src:cls[c],
                    style:{width:'.4rem',}
                  });
                  this.clickMarkets.splice(0,1)
                }

                this.markets[i].setIconStyle({
                   src:cls[2],
                   style:{width:'.4rem',}
                });
                this.clickMarkets=[i,isMy];
              }
              else{
                infoWindow.close();
                if(this.clickMarkets.length) this.markets[j].setIconStyle({
                   src:cls[c],
                   style:{width:'.4rem',}
                });
                this.clickMarkets=[];
                
              }
          }

          list.forEach((v,i)=>{
            var add = v.longitudeLatitude?v.longitudeLatitude.split(','):null;
            var mk = new SimpleMarker({
                  iconStyle:{
                    src:cls[v.isMy],
                    style:{width:'.4rem',}
                  },
                  map: this.map,
                  position: add,
                  offset:new AMap.Pixel(-25,-40),
                  animation:'AMAP_ANIMATION_DROP'
              })



            let winMsg=this.type==1?'<div class="model-msg"><p>客户名称:<a style="color:#4392ff;" onclick="jumpDetail('+v.id+','+v.isMy+')">'+v.orgName+'</a></p><p>创建时间:'+v.createTime+'</p><p>地址:'+v.address+'</p></div>':'<div class="model-msg"><p>客户名称:'+v.orgName+'</p><p>地址:'+v.address+'</p></div>'

            mk.content=winMsg;
            mk.on('click', (e)=>markerClick(e,i,v.isMy));
            this.markets.push(mk);
          })


          if(this.canEdit==0 && this.locked){
            this.locked=false;
            this.map.on('zoomchange',()=>{
               console.log(this.map.getZoom())

               let lnglat = new AMap.LngLat(this.geoPosition.lng,this.geoPosition.lat);
               let dis=lnglat.distance(this.map.getBounds().getSouthWest());

               if(dis>this.distance){
                 this.getMoreMarker(dis/1000)
                 this.distance=dis;
               }

            })
          }

      },
      addOk(){
        if(!this.addDetail) return Toast('请输入详细地址');
        this.data2={...this.clientInfo,...this.data2};
        this.data2.areaInfo=this.addDetail;
        this.data2.mtId=this.clientInfo.mtId;
        this.data2.orgName=this.clientInfo.orgName;
        this.data2.mtUrl=this.clientInfo.mtUrl;

        this.$store.dispatch('setClientInfo',this.data2);
        this.$router.back();
      },
      getMoreMarker(scope){
        let {lng,lat}=this.geoPosition;

        this.getMapClient({openId:this.openid,longitude:lng,latitude:lat,scope,type:3}).then(dt=>{
           console.log(dt)

           AMapUI.loadUI(['overlay/SimpleMarker'],market=>this.createMarket(market,dt,this.geoPosition));

        })
      },
      init(){
        loading.open('定位中');
        const {canEdit}=this.$route.query;
        let position=this.$refs['position'],id=this.$route.query.id;
        var geolocation;
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
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation,'complete',(data)=>{
            map.setZoomAndCenter(15,[data.position.lng, data.position.lat]);
            let data2=this.clientInfo;
            let {lng,lat}=data.position;
            this.geoPosition=data.position;

            if(canEdit==1){
              var circle = new AMap.Circle({
                center: [lng,lat],
                radius: 500,
                fillOpacity:0.2,
                strokeWeight:1
              })


              circle.setMap(map);
            }



            LoadScript('//webapi.amap.com/ui/1.0/main.js',()=>{
              AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'],(DistrictExplorer, $)=>{
              //创建一个实例
                var districtExplorer = new DistrictExplorer({
                  map: map
                });
              districtExplorer.locatePosition([data.position.lng, data.position.lat],(err,features)=>{
                if (err) {
                  console.error(err);
                  return;
                }
                var i, len = features.length;
                if (!len) {
                  //$node.html(lngLat.toString() + '：未知区域');
                  return;
                }
                var routes = [];
                for (i = 0; i < len; i++) {
                  routes.push(features[i].properties.adcode);
                }
                const code=routes[routes.length-1];
                this.data2.areaId=code;
                this.data2.provinceId=code.toString().substring(0,2)+'0000';
                this.data2.cityId=code.toString().substring(0,4)+'00';
                },{
                  levelLimit: 4
                });
              });

              this.getMoreMarker(0.5);
              // this.getMapClient({openId:this.openid,longitude:lng,latitude:lat,scope:0.5,type:3}).then(dt=>{
              //    console.log(dt)
              //
              //    AMapUI.loadUI(['overlay/SimpleMarker'],market=>this.createMarket(market,dt,data.position));
              //
              // })

             if(canEdit==1){
               AMapUI.loadUI(['misc/PositionPicker'],PositionPicker=> {
                 var positionPicker = new PositionPicker({
                   mode: 'dragMap',
                   map: map,
                   iconStyle: { //自定义外观
                      url:require('../../../static/images/clerk/icon/icon_map_market_red.svg'),
                      ancher:[24,40],
                      size:[48,48]
                   }
                 });
                 // console.log(positionPicker)
                 let record={};
                 positionPicker.on('success', positionResult=> {
                   const position=positionResult.position,address=positionResult.address;
                   let d=Math.abs(GetDistance(data.position.lat,data.position.lng,position.lat,position.lng))
                   if(d>500){
                     positionPicker.start([record.lng,record.lat]);
                     Toast('您已超出范围')
                   }else{
                     record={lng:position.lng,lat:position.lat,address};
                     this.data2.longitudeLatitude=record.lng+','+record.lat;
                     this.data2.address=record.address;
                     this.add=record.address;
                     // this.addDetail='';
                     // this.data2=data2;

                     // this.$store.dispatch('setClientInfo',data2);
                   }
                 });
                 positionPicker.on('fail',positionResult=>{});
                 let p=this.clientInfo.longitudeLatitude;

                 // console.log(p);
                 positionPicker.start();

                 if(id){
                   p && positionPicker.start(p.split(','));
                 }else{
                   p && positionPicker.start(p.split(','))
                 }



                //  map.panBy(0, 1);

               });
             }

            })
          })
          AMap.event.addListener(geolocation, 'error', (err)=>{
            console.log(err);
            loading.close();
            if(err.message=='Geolocation permission denied.') return alert('请在手机设置里开启微信的定位功能')
            Toast('定位失败')
          });
        })
      }
    },
    mounted(){

      LoadScript('http://webapi.amap.com/maps?v=1.3&key='+config.map_key+'&callback=init',()=>{

      })
    }
  }

</script>
<style>
  .clerk{position:relative}
  .position{width:100%;height:100vh}
  #panel {
    z-index: 999;
    position: absolute;
    background-color: white;
    max-height: 30%;
    overflow-y: auto;
    bottom: 0;
    width: 100%;
  }
  .adress-show{
    position: fixed;
    bottom:0;
    z-index: 1000;
    width: 100%;
    left:50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);


    background: rgba(255, 255, 255, 1);
    /*height:.6rem;*/
    border: none;
    text-align: left;
    padding: .2rem .6rem .2rem .1rem;
  }
  .model-msg{
    /*font-size*/
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
 .address-inp{
    height: .4rem;
    border-bottom: 1px solid #ccc;
    width: 100%;
    border-radius: 0;
    font-size: .14rem;
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
