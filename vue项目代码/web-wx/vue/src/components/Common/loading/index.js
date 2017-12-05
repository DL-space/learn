
import Vue from 'vue'

import router from '../../../router'

let loading = Vue.extend(require('./loading'));

let tmp=null,states=[];

function createLoading(){
  if(document.getElementById('loading') && tmp) return tmp;
  let div = document.createElement('div');
  div.id = 'loading';

  document.body.appendChild(div);

  tmp = new loading({
     el:'#loading',
     router
  });
  return tmp;
}



function deleteLoading(){
  let div = document.getElementById('loading');
  if(!div) return;
  document.removeChild(div);
  tmp.$destroy();
}
loading.prototype.open=function(text){
    this.text=text || '请稍候...';
    states.push(1);
    if(this.isShow) return;
    this.isShow=true;
}

loading.prototype.close=function(){
    states.pop();
    if(states.length) return;
    this.isShow=false;

    deleteLoading();
}

export default createLoading();
