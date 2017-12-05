/**
 * Created by zachary on 17/1/26.
 */
import config from '../../conf.js';
import axios from 'axios';
import {stringify} from 'qs'
import loading from '@/components/Common/loading';

const Ajax=(api,data,success,fail,type)=>{
  var type=type?type:'post',url=config.api_url;
  CommonAjax(url,api,data,success,fail,type);
};

const AjaxApi=(api,data,success,fail,type,isUploadImg,file)=> {
  var type = type ? type : 'post',url = config.api_api_url,needVerify=true;
  CommonAjax(url,api,data,success,fail,type,needVerify,isUploadImg,file);
};
const CommonAjax= (url,api,data,success,fail,type,needVerify=false,isUploadImg=false,file=null)=>{
  let xmlHttp = null;
  if (XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  }else{
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if(isUploadImg){
    var postdata = new FormData();
    postdata.append("file",file);
  }else{
    let params=[];
    var postdata='';
    for(let key in data){
      params.push(key + '=' + data[key]);
    }
    postdata = params.join('&');
  }
  if (type.toUpperCase() === 'POST'){
    xmlHttp.open(type, url + api, true);
    if(!isUploadImg){
      xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    }
    //xmlHttp.setRequestHeader('Content-Type', isUploadImg?"multipart/form-data":'application/x-www-form-urlencoded;charset=utf-8');
    if(needVerify&&Cookie.getCookie('openid')){
      xmlHttp.setRequestHeader('token',Cookie.getCookie('openid'));
    }
    xmlHttp.send(postdata);
  }else if(type.toUpperCase() === 'GET'){
    xmlHttp.open(type, url + api + '?' + postdata, true);
    xmlHttp.send(null);
  }

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      success && success(JSON.parse(xmlHttp.responseText));
    } else {
      fail && fail(xmlHttp.responseText);
    }
  }
};
const Cookie={
  setCookie:(key,val)=>{
    let cdata = key + "=" + val;
    let d = new Date();
    d.setHours(d.getHours() + 1000000);
    cdata += "; expires=" + d.toGMTString();
    document.cookie = cdata;
  },
  getCookie:(key)=>{
    let arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  },
  delCookie:(key)=>{
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval=Cookie.getCookie(key);
    if(cval!=null)
      document.cookie= key + "="+cval+";expires="+exp.toGMTString();
  }
};
const LoadScript=(url, callback)=>{
  let script = document.createElement("script")
  script.type = "text/javascript";
  if (script.readyState){ //IE
    script.onreadystatechange = function(){
      if (script.readyState == "loaded" ||
        script.readyState == "complete"){
        script.onreadystatechange = null;
        if(callback)
          callback();
      }
    };
  } else { //Others: Firefox, Safari, Chrome, and Opera
    script.onload = function(){
      if(callback)
        callback();
    };
  }
  script.src = url;
  document.body.appendChild(script);
};
//改变json Key 的顺序，按照arr的顺序
const ChangeObj=(obj,arr)=>{
  let tmp={};
  arr.forEach((v)=>{
    tmp[v]=obj[v]
  })
  return tmp;
};

//判断一个值是否在数组中
const Contains=(item,arr)=>{
  let i = arr.length;
  while (i--) {
    if (arr[i] === item) {
      return true;
    }
  }
  return false;
};

const rad=(d)=>{
  return d * Math.PI / 180.0;
};
const GetDistance=(lat1,lng1,lat2,lng2)=>{
  var EARTH_RADIUS = 6378.137;
  var radLat1 = rad(lat1),radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);

  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
      Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s * EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s*1000;
}


// const instance = axios.create({
//   timeout: 3000,
//   headers:{
//     post:{
//       // 'Content-Type':'application/x-www-form-urlencoded'
//     }
//   }
// });
// axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.withCredentials=true;

const Axios =(url,data,options={}) => {
  return new Promise((resolve,reject)=>{
    let {method='post',load=1,api=0} = options;
    axios.defaults.baseURL=api?config.api_api_url:config.api_url;
    // axios.defaults.timeout=12000;
    load && loading.open();
    let postdata='',params={};
    if(data){
      let p=[]
      for(let key in data){
        p.push(key + '=' + data[key]);
      }
      postdata = p.join('&');
    }
    if(method=='get') {

      params = {method,url:url+'?'+postdata}
    }
    else if(method='post') params = {method,url,data:postdata}

    return axios(params).then(dt=>{
       load && loading.close();
       resolve(dt.data);
    }).catch(err=>{
       load && loading.close();
       console.log(err);
      //  for(var i in err){
      //    console.log(err[i])
      //  }
       reject(err);
       alert('服务出错,请稍后再试');
    })
  })

}

export {
  Ajax,
  AjaxApi,
  Cookie,
  LoadScript,
  ChangeObj,
  Contains,
  GetDistance,
  Axios
};
