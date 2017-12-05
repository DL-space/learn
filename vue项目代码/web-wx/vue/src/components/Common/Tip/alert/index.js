
import Vue from 'vue'

import router from '../../../../router'

let hjcAlert = Vue.extend(require('./alert'));

let tmp=null;

function createAlert(){
  if(document.getElementById('hjc-alert') && tmp) return tmp;
  let div = document.createElement('div');
  div.id = 'hjc-alert';

  document.body.appendChild(div);

  tmp = new hjcAlert({
     el:'#hjc-alert',
     router
  });
  return tmp;
}



function deleteAlert(){
  let div = document.getElementById('hjc-alert');
  if(!div) return;
  document.removeChild(div);
  tmp.$destroy();
}
hjcAlert.prototype.open=function(d){
    d.title && (this.title=d.title);
    d.content && (this.content=d.content);
    d.buttons && (this.buttons=d.buttons);
    if(this.isShow) return;
    this.isShow=true;
}

hjcAlert.prototype.close=function(){
    this.isShow=false;
    deleteAlert();
}

export default createAlert();
