<template>
  <div v-if="JSON.stringify(data) != '{}'" id="map-wrap" ref="map-wrap" class="map-wrap"></div>
</template>
<script>
  import store from '@/vuex/store';
  import {Tip} from '@/components/Common/Tip';
  import {LoadScript} from '@/assets/Util';
  import config from '../../../conf'
  export default {
    name: 'app',
    props:['data'],
    components: {},
    updated(){
      let mapWrap=this.$refs['map-wrap'];
      if(this.data.returnType==1||this.data.returnType==2||this.data.returnType==3){
        LoadScript('http://webapi.amap.com/maps?v=1.3&key='+config.map_key,()=>{
          var noDriver=false;
          this.data.siteList.forEach((v)=>{
            if(v.type==4&& v.site==''){
              noDriver=true;
            }
          });
          var map, geolocation;
          //加载地图，调用浏览器定位服务
          map = new AMap.Map(mapWrap, this.data.siteList[0].site?{
            resizeEnable: true,
            center: this.data.siteList.length==1||noDriver?this.data.siteList[0].site.split(','):
            [(Number(this.data.siteList[0].site.split(',')[0])+Number(this.data.siteList[1].site.split(',')[0]))/2,
              (Number(this.data.siteList[0].site.split(',')[1])+Number(this.data.siteList[1].site.split(',')[1]))/2],
            zoom:14,
//          zooms:[3-18]
            }:{
            resizeEnable: true,
            zoom:14
            });
          map.plugin('AMap.Geolocation', ()=>{
            geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,//是否使用高精度定位，默认:true
              timeout: 10000,          //超过10秒后停止定位，默认：无穷大
              buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              buttonPosition:'RB',
              panToLocation: false,
              showButton: false
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', (data)=>{
              if(noDriver){
                var marker=new AMap.Marker({
                  position: [data.position.lng,data.position.lat],
                  offset: new AMap.Pixel(-12,-10), //相对于基点的偏移位置
                  draggable: false//是否可拖动
                });
                marker.setMap(map);
              }
              //marker.hide();
              let isZiti=true;
              this.data.siteList.forEach((v)=>{
                if(v.type==4){
                  isZiti=false;
                }
              });
              this.data.siteList.forEach((v)=>{
                switch (v.type){
                  case 1:
                    var marker=new AMap.Marker({
                      position: v.site.split(','),
                      offset: new AMap.Pixel(-12,-10), //相对于基点的偏移位置
                      draggable: false,  //是否可拖动
                      content: this.data.returnType==3?(isZiti?'<div class="marker-marker">已收货</div>':'')+'<div class="marker-red-icon">'+v.name+'</div>':'<div class="marker-marker">已收货</div><div class="marker-route">'+v.name+'</div>'
                    });
                    marker.setMap(map);
                    break;
                  case 2:
                    var marker=new AMap.Marker({
                      position: v.site.split(','),
                      offset: new AMap.Pixel(-12,-10), //相对于基点的偏移位置
                      draggable: false,  //是否可拖动
                      content: '<div class="marker-route">'+v.name+'</div>'
                    });
                    marker.setMap(map);
                    break;
                  case 3:
                    var marker=new AMap.Marker({
                      position: v.site.split(','),
                      offset: new AMap.Pixel(-12,-10), //相对于基点的偏移位置
                      draggable: false,  //是否可拖动
                      content: '<div class="marker-distance" id="marker-distance"></div><div class="marker-red">'+v.name+'</div>'
                    });
                    marker.setMap(map);
                    break;
                  case 4:
                    if(v.site){
                      var marker=new AMap.Marker({
                        position: v.site.split(','),
                        offset: new AMap.Pixel(-12,-15), //相对于基点的偏移位置
                        draggable: false,  //是否可拖动
                        content: '<div class="marker-driver-icon">'+v.name+'</div>'
                      });
                      marker.setMap(map);
                    }else{
                    }
                    break;
                }
              });
              if(this.data.returnType==2){
                LoadScript('http://cache.amap.com/lbs/static/DrivingRender1230.js');
                AMap.plugin('AMap.Driving',()=>{
                  var driving = new AMap.Driving({
                    map: map,
                    hideMarkers:true
                  });
                  var startArr=this.data.siteList[0].site.split(',');
                  var endArr=this.data.siteList[1].site.split(',');
                  driving.search(new AMap.LngLat(Number(startArr[0]),Number(startArr[1])), new AMap.LngLat(Number(endArr[0]),Number(endArr[1])),(status,result)=>{
                    if(status === 'complete' && result.info === 'OK'){
                      (new Lib.AMap.DrivingRender()).autoRender({
                        map: map
                      });
                      document.getElementById('marker-distance').innerHTML='总长：'+result.routes[0].distance/1000+'公里';
                    }else{
                      alert(result);
                    }
                  });
                });
              }
              map.setFitView();
            });
            AMap.event.addListener(geolocation, 'error', (err)=>{console.log(err)});      //返回定位出错信息
          });
        });
      }
    }

  }
</script>
