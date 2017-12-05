import { LoadScript,Ajax,Axios } from '../assets/Util'
import hjcAlert from '@/components/Common/Tip/alert'
import { Toast } from 'mint-ui';

let common = {};

common.install = (Vue,options) => {

  Vue.prototype.$isWx=()=>{
    var uAgent=window.navigator.userAgent;
    return uAgent.match(/MicroMessenger/i);
  }

  Vue.prototype.$Alert=(buttons)=>{

    buttons==1?hjcAlert.close():hjcAlert.open(buttons)
  }

  Vue.prototype.$isAndroid=()=>{
    var uAgent=window.navigator.userAgent;
    return !uAgent.match(/Android/i);
  }

  Vue.prototype.$wxConfig = (() => {
     let wxlocked=true;
     let err = null;
     return data => {
        if(!Vue.prototype.$isWx()) return;
        var url=encodeURIComponent(location.href.split('#')[0]);
        return new Promise((resolve,reject)=>{

          if(wxlocked){
              LoadScript('http://res.wx.qq.com/open/js/jweixin-1.2.0.js',()=>{
                Axios('/wechat/camera/config',{url},{load:0,method:'get'}).then(dt=>{
                  console.log(dt);

                   if(!dt.result && dt.code) return reject();
                   const data = dt.data;
                   wx.config({
                          debug: 0,
                          beta:true,
                          appId: data.appid,
                          timestamp: data.timestamp.toString(),
                          nonceStr: data.noncestr.toString(),
                          signature: data.signature.toString(),
                          jsApiList: [
                              "chooseImage",//选择图片
                              "uploadImage",//上传图片
                              "openWXDeviceLib",//初始化设备库（只支持蓝牙设备）
                              "closeWXDeviceLib",//关闭设备库（只支持蓝牙设备）
                              "getWXDeviceInfos",//获取设备信息（获取当前用户已绑定的蓝牙设备列表）
                              "sendDataToWXDevice",//发送数据给设备
                              "startScanWXDevice",//扫描设备（获取周围所有的设备列表，无论绑定还是未被绑定的设备都会扫描到）
                              "stopScanWXDevice",//停止扫描设备
                              "connectWXDevice",//连接设备
                              "disconnectWXDevice",//断开设备连接
                              "getWXDeviceTicket",//获取操作凭证
                              "onWXDeviceBindStateChange",//微信客户端设备绑定状态被改变时触发此事件
                              "onWXDeviceStateChange",//监听连接状态，可以监听连接中、连接上、连接断开
                              "onReceiveDataFromWXDevice",//接收到来自设备的数据时触发
                              "onScanWXDeviceResult",//扫描到某个设备时触发
                              "onWXDeviceBluetoothStateChange",//手机蓝牙打开或关闭时触发
                          ]
                      });
                  wx.error((res)=>{
                     err = JSON.stringify(res);
                     alert(err+'微信jssdk故障');
                     reject();
                  })
                  wx.ready(()=>resolve(wx))

                }).catch(err=>{
                     console.log(err);
                     reject('微信config错误');
                })
              })
          }
          else {
            if(!err) resolve(wx);
            else {
              alert(err)
              reject();
            };
          }
          wxlocked=false;
        })
      }
  })();

  Vue.prototype.$validate=(data)=>{
    const isArr = Array.isArray(data);
    const handle = (v)=>{
      let { require=true,msg,type,value,value2,index,compare,name,regMsg='格式有误'} = v;
      if(!msg) msg = '请输入'+name;
      if(!require) return true;
      const validateRegs = {
        phoneReg:/^[1][0-9]{10}$/,
        code6Reg:/^\d{6}$/,
        pass6_12_a_nReg:'',
        pass6_nReg:/^\d{6}$/
      };

       if(!value) return Toast(msg),false;
       if((index || value2) && compare){
          if(compare == '!='){
            if(index && isArr) {
              console.log(value,data[index].value)
              if(value != data[index].value) return Toast(regMsg),false;
              return true
            }
            if(value != value2) return Toast(regMsg),false;
            return true
          }
       }
       if(!type) return true;
       let treg = validateRegs[type+'Reg'];
       if(!treg) return new Error('no validate type')
       if(!treg.test(value)) return Toast(name+regMsg),false;
       return true;
    }

    if(isArr){
       let result = true;

       for(let i=0,len=data.length;i<len;i++){
         result = handle(data[i]);

         if(!result) break;
       }
       return result;
    }
    else return handle(data);
  }
}


export default common;
