import config from '../../conf.js';
import axios from 'axios';

const Ajax=(api,data,success,fail,type)=>{
  var type=type?type:'post',url=config.api_url;
  CommonAjax(url,api,data,success,fail,type);
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


export {
  Ajax,
  Cookie,
  LoadScript
};
