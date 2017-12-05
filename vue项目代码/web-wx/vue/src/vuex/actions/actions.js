import {Ajax,Axios}from '@/assets/Util';
import loading from '@/components/Common/loading'
import { Toast } from 'mint-ui'


const actions={
  initStore({
    commit
    }, data) {
    commit('INIT_STORE', data)
  },
  setAccountInfo({
    commit
    }, data) {
    commit('SET_ACCOUNT_INFO', data)
  },
  changeLoadFinish({
    commit
    }, obj) {
    commit('CHANGE_LOAD_FINISH', obj);
  },
  changeTip({
    commit
    }, tip) {
    commit('CHANGE_TIP', tip);
  },
  setConfirm({commit},confirm){
    commit('SET_CONFIRM',confirm)
  },
  setOpenid({
    commit
    }, openid) {
    commit('SET_OPENID', openid);
  },
  setOrderList({
    commit
    }, data) {
    commit('SET_ORDER_LIST', data);
  },
  setMyClientList({
    commit
    }, data) {
    commit('SET_MY_CLIENT_LIST', data);
  },
  setCreateClientList({commit},data){
    // commit
    // }, data) {
    // commit('SET_CREATE_ClIENT', data);
    return new Promise((resolve,reject)=>{
      // if(state.homePermission.tabs.length) return resolve(state.homePermission);

      Axios('/api/saler/customer/myself/query',data).then(dt=>{
         if(!dt.result || dt.code) return Toast(dt.message);
         dt.data.page = data.page;
         commit('SET_CREATE_ClIENT',dt.data);
         resolve(dt.data);
      }).catch(err=>{
         reject(err);
      })
    })
  },
  setCityClientList({
    commit
    }, data) {
    commit('SET_CITY_CLIENT_LIST', data);
  },
  setClientName({
    commit
    }, clientName) {
    commit('SET_CLIENT_NAME', clientName);
  },
  setClientInfo({
    commit
    }, data) {
    commit('SET_CLIENT_INFO', data);
  },
  setClientChoose({
    commit
    }, data) {
    commit('SET_CLIENT_CHOOSE', data);
  },
  setMonthState({
    commit
    }, data) {
    commit('SET_MONTH_STATE', data);
  },
  clear_obj({
    commit
    }, data) {
    commit('CLEAR_OBJ', data);
  },
  clear_arr({
    commit
    }, data) {
    commit('CLEAR_ARRAY', data);
  },
  setSaveInfo({
    commit
    }, data) {
    commit('SAVE_INFO', data);

  },
  setMonthList({
    commit
    }, data) {
    commit('SET_MONTH_LIST', data);
  },
   setReceivedInfo({
    commit
    }, data) {
    commit('SET_RECEIVED_LIST', data);
  },
  setReceivedsInfo({
    commit
    }, data) {
    commit('SET_RECEIVEDS_LIST', data);
  },
  setMypayGoods({
    commit
    }, data) {
    commit('SET_MYPAYGOODS_LIST', data);
  },
   setMypayFreight({
    commit
    }, data) {
    commit('SET_MYPAYFREIGHT_LIST', data);
  },
   setRepeatFlag({
    commit
    }, data) {
    commit('SET_REPEAT_FLAG', data);
  },
   clearSaveInfo({
    commit
    }, data) {
    commit('CLEAR_SAVE_INFO', data);
  },
  setLngLat({commit},data){
    commit('SET_LNGLAT', data);
  },
  setPostApplyState({commit},data){
    return new Promise((resolve,reject)=>{
      Ajax('/api/saler/customer/stage/queryApplyStatus',data,res=>{
         if(res.result){
           commit('SET_POST_APPLY_STATE', res);
           resolve(res);
         }
         else {
           reject();
         }
      })
  })
 },
  setClerkPermission({commit},data){
    commit('SET_CLERK_PERMISSION', data);
  },
  getCommon({commit},{data,url}){
    return new Promise((resolve,reject)=>{
      Axios(url,data).then(data=>{
         resolve(data);
      }).catch(err=>{
         reject(err);
      })
    })

  },
  getAllCompanyList({commit,state},openId){
    return new Promise((resolve,reject)=>{
      if(state.allCompanyList.length) return resolve(state.allCompanyList);
      Axios('/api/saler/customer/salerCompanyInfo/query',{openId}).then(data=>{

         if(!data.result || data.code) return reject();



         let ls = data.data.map((v,i)=>({orgName:v.orgName,id:v.id,i}));
         commit('setAllCompanyList',ls);
         resolve(ls);
      }).catch(err=>{
         reject(err);

      })
    })

  },
  getAllStation({commit,state},id){
    return new Promise((resolve,reject)=>{
      if(state.allStation[id]) return resolve({list:state.allStation[id],id});

      Axios('/wechat/getStationByCompanyId',{id}).then(data=>{
         if(!data.result || data.code) return Toast(data.message);
         data.data.unshift({orgName:'待定',id:''})

         let ls = data.data.map((v,i)=>({orgName:v.orgName,id:v.id,i}));

         commit('setAllStation',{list:ls,id});
         resolve({list:ls,id});
      }).catch(err=>{
         reject(err);
      })
    })

  },
  getHomePermission({commit,state},openId){
    return new Promise((resolve,reject)=>{
      if(state.homePermission.tabs.length) return resolve(state.homePermission);

      Axios('/api/saler/customer/saler/permission',{openId}).then(data=>{
         if(!data.result || data.code) return Toast(data.message);
         commit('setHomePermission',data.data);
         resolve(data.data);
      }).catch(err=>{
         reject(err);
      })
    })

  },
  getOrderPickList({commit,state},data){

    return new Promise((resolve,reject)=>{
       Axios(data.url,data.body,{api:1}).then(dt=>{
          if(!dt.result || dt.code) return Toast(dt.message);
          commit('setOrderPickList',{total:dt.data.totalCount,list:dt.data.drawDetailList,page:data.body.page,totalAmount:dt.data.totalAmount,orderIds:dt.data.orderIds});
          resolve(dt.data.drawDetailList);

       }).catch(err=>{
         reject(err)
         console.log(err)
       })
    })
  },
  getAccountRecordList({commit},data){
    return new Promise((resolve,reject)=>{
      Axios(data.url,data.body).then(dt=>{
         if(!dt.result || dt.code) return Toast(dt.message);
         commit('setAccountRecordList',{total:dt.data.total,list:dt.data.transactionList,page:data.body.page});
         resolve(dt.data);

      }).catch(err=>{
        console.log(err)
        reject(err)
      })
    })
  },
  getAccountBank({commit,state},data){
    return new Promise((resolve,reject)=>{
      if(state.accountBank.bankCode) return resolve(state.accountBank)
      Axios('/account/accountapp/getBankInfo',{openId:state.openid},{api:1}).then(dt=>{
         if(!dt.result || dt.code) return Toast(dt.message);
         commit('setAccountBank',dt.data);
         resolve(dt.data);

      }).catch(err=>{
        console.log(err)
        reject(err)
      })
    })
  }
}
export default actions
