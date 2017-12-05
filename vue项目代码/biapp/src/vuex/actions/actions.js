const actions={
  initStore({
    commit
    }, data) {
    commit('INIT_STORE', data)
  },
  //设置第三个下拉框的内容值
  setThirdObj({
    commit
    }, data) {
    commit('THIRD_OBJ', data)
  },
  //改变当前切换的当前筛选条件的索引
  setNowSeleIndex({
    commit
    }, data) {
    commit('SET_NOWSELE_INDEX', data)
  },
  //标记第三个下拉框是否是重新请求的下拉内容
  setChangeFlag({
    commit
    }, data) {
    commit('SET_CHANGE_FLAG', data)
  },
  //给筛选条件的第二个下拉框进行标记
  setSeconKey({
    commit
    }, data) {
    commit('SET_SECON_KEY', data)
  },
  //提交埋点信息
  setSaveForm({
    commit
    }, data) {
    commit('SET_SAVE_FORM', data)
  },
  //传递给查询页面的数据
  setTurnObj({
    commit
    }, data) {
    commit('SETTURNOBJ', data)
  },
  //进入查询页面是否有默认值
  setIsDefault({
    commit
    }, data) {
    commit('SETISDEFAULT', data)
  },
  setTestIndex({
    commit
    }, data) {
    commit('SETTESTINDEX', data)
  }
}
export default actions
