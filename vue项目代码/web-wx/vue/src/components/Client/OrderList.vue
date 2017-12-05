<template>
  <div class="order_wrap">
    <div class="order">
      <div class="top">
        <search-client
          ref="search"
          :searchTxt="searchTxt"
          :record="record"
          :placeholder="placeholder"
          @handleFocus="handleFocus"
          @handleCancel="handleCancel"
          @handleInput="handleInput"
          @handleSearch="handleSearch"
          @handleBlur="handleBlur"
          @handleSearchRecord="handleSearchRecord"
          @handleClearSearchRecord="handleClearSearchRecord"
        >
        </search-client>
        <tab-client v-if="isNav" :data="menus" @handleTab="handleTab"></tab-client>
      </div>
      <div class="order_list" v-if="isList" :style="isNav?'':'padding-top:.7rem'">
        <order-item v-if="orderList.length>0" v-for="(item,index) of orderList" :data="item" :key="index" :type="type" @jumpDetail="jumpDetail"></order-item>
        <div v-if="orderList.length==0" style="padding-top:.2rem;text-align:center;background:#fff;color:#666">暂无数据</div>
        <button-client  v-if="loadFinish.isShowButton" :loadFinish="loadFinish" :disabled="disabled" :data="button" @listenButtonEvent="handleMore"></button-client>
      </div>
    </div>
  </div>
</template>
<script>
  import {SearchClient} from '@/components/Common/Search'
  import {TabClient} from '@/components/Common/Tab'
  import {ButtonClient} from '@/components/Common/Form'
  import OrderItem from '@/components/Client/OrderItem'
  import {Cookie} from '@/assets/Util'
  import { mapState } from 'vuex'
  const time=1000
  export default {
    components: {SearchClient,TabClient,OrderItem,ButtonClient},
    data () {
      return {
        isNav: true,
        placeholder: '',
        searchTxt: '',
        type: this.$route.name == 'receive' ? 1 : 2,
        page:1,
        rows:10,
        menus: [
          {name: '全部', focus: 1, status: 0},
          {name: '已收货', status: 11},
          {name: '配送中', status: 30},
          {name: '已签收', status: 32},
          {name: '拒签', status: 33}
        ],
        record: Cookie.getCookie('record')?Cookie.getCookie('record').split(','):[],
        isList: true,
        status: 0,
        button: {
          txt: '获取更多',
          style: {marginTop: '.1rem', borderRadius: '0'}
        }
      }
    },
    created(){
      const openid=this.openid,page=this.page,rows=this.rows,type=this.type;
      this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
      this.$store.dispatch('setOrderList',{type,openid,page,rows});
    },
    watch:{
      openid(newVal,oldVal){
        const openid=newVal,page=this.page,rows=this.rows,type=this.type;
        this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
        this.$store.dispatch('setOrderList',{type,openid,page,rows});
      }
    },
    computed:mapState({
      openid:state=>state.openid,
      orderList:state=>state.orderList,
      loadFinish:state=>state.loadFinish,
      disabled:state=>state.disabled
    }),
    methods: {
      jumpDetail(sn){
        this.$router.push({name: 'orderDetail', query: {sn: sn,type:this.type}})
      },
      handleTab(obj){
        this.menus.forEach(v=>{
          if(v.name==obj.name){
            v.focus=1
          }else{
            v.focus=0
          }
        });
        this.page=1;
        this.status=obj.status;
        this.$store.dispatch('clear_obj','orderList');
        const openid=this.openid,search=this.searchTxt,status=this.status,page=this.page,rows=this.rows,type=this.type;
        this.$store.dispatch('setOrderList',status!=0?{type,openid,status,search,page,rows}:{type,openid,search,page,rows});
      },
      handleInput(e){
        this.searchTxt= e.target.value;
      },
      handleFocus(tar){
        const input=tar.getElementsByTagName('input')[0];
        const holder=tar.getElementsByClassName('holder')[0];
        const searchBtn=tar.getElementsByClassName('search_btn')[0];
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        const cancle=tar.getElementsByClassName('cancle')[0];
        searchBtn.style.display = "block";
        searchRecord.style.display="block";
        cancle.style.display = "block";
        holder.style.display = "none";
        input.focus();
        this.placeholder=this.type==1?'输入单号／编码／发货方名称':'输入单号／编码／收货方名称';
        this.isNav=false;
        this.isList=false;
      },
      handleCancel(tar){
        const input=tar.getElementsByTagName('input')[0];
        const holder=tar.getElementsByClassName('holder')[0];
        const searchBtn=tar.getElementsByClassName('search_btn')[0];
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        const cancle=tar.getElementsByClassName('cancle')[0];
        searchRecord.style.display="none";
        searchBtn.style.display = "none";
        cancle.style.display = "none";
        holder.style.display = "block";
        this.page=1;
        this.placeholder='';
        this.isNav=true;
        this.isList=true;
        this.searchTxt='';
        const openid=this.openid,status=this.status,search=this.searchTxt,page=this.page,rows=this.rows,type=this.type;
        this.$store.dispatch('setOrderList',status!=0?{status,type,openid,search,page,rows}:{type,openid,search,page,rows});
      },
      handleSearch(tar){
        this.page=1;
        const input=tar.getElementsByTagName('input')[0],openid=this.openid,search=this.searchTxt,status=this.status,page=this.page,rows=this.rows,type=this.type;
        if(input.value==''){
          this.$store.dispatch('changeTip',{isTip:true,txt:'搜索信息不能为空',time});
          input.focus();
          return;
        }
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        searchRecord.style.display="none";
        this.record.unshift(this.searchTxt);
        Cookie.setCookie('record',this.record.join(','));
        this.isNav=false;
        this.isList=true;
        this.$store.dispatch('setOrderList',status!=0?{status,type,openid,search,page,rows}:{type,openid,search,page,rows})
      },
      handleBlur(tar){
        const input=tar.getElementsByTagName('input')[0];
        if(input.value==''){
          const holder=tar.getElementsByClassName('holder')[0];
          const searchBtn=tar.getElementsByClassName('search_btn')[0];
          const searchRecord=tar.getElementsByClassName('search-record')[0];
          const cancle=tar.getElementsByClassName('cancle')[0];
          searchBtn.style.display = "none";
          searchRecord.style.display="none";
          cancle.style.display = "none";
          holder.style.display = "block";
          this.placeholder='';
          this.isNav=true;
          this.isList=true;
        }
      },
      handleMore(){
        this.page+=1;
        const openid=this.openid,status=this.status,search=this.searchTxt,page=this.page,rows=this.rows,type=this.type;
        this.$store.dispatch('setOrderList',status!=0?{status,type,openid,search,page,rows}:{type,openid,search,page,rows});
      },
      handleSearchRecord(txt,tar){
        this.page=1;
        this.isNav=false;
        this.isList=true;
        const input=tar.getElementsByTagName('input')[0],openid=this.openid,search=txt,status=this.status,page=this.page,rows=this.rows,type=this.type;
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        searchRecord.style.display="none";
        this.$store.dispatch('setOrderList',status!=0?{status,type,openid,search,page,rows}:{type,openid,search,page,rows})
      },
      handleClearSearchRecord(){
        this.record=[];
        Cookie.delCookie('record');
      }
    }
  }
</script>
