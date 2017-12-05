<template>
  <div class="clerk">
    <div class="top" style="position:fixed;width:100%;z-index:100;">
      <search-client :searchTxt="searchTxt" :placeholder="placeholder" @handleFocus="handleFocus" @handleCancel="handleCancel" @handleInput="handleInput" @handleSearch="handleSearch"></search-client>
      <div class="search-client-num">
        <span class="num-left">客户数量：{{list.total}}</span>
      </div>
      <tab-client :data="menus" @handleTab="handleTab"></tab-client>
    </div>
    <div class="client-list" style="padding-top:1.6rem">
      <div class="list-no-item" v-if="!list.list.length && !tip.isTip">
         没有相关记录
      </div>
      <template v-else>
         <client-item v-for="(v,i) of list.list" @handleClick="jumpDetail(v.id,type)" :total="list.total" :type="type" :index="i" :data="v" :key="i"></client-item>
      </template>


    </div>
    <div style="padding:0 .1rem;">
      <button class="btn submit" v-show="list.isMore" @click="handleMore">加载更多</button>
    </div>

    <button class="btn" style="position:fixed;bottom:.1rem;right:.1rem;width:1.3rem;height:.4rem;font-size:.14rem;box-shadow:rgba(0, 0, 0, 0.4) 0px 0px 8px 0px;" @click="$router.push({name:'position',query:{canEdit:0,type:1}})" v-show="type==1"><img style="width:.2rem;vertical-align:middle;margin-right:.05rem;" src="../../../static/images/clerk/icon/icon-map.png" alt="">查看地图分布</button>
  </div>
</template>
<script>
  import {SearchClient} from '@/components/Common/Search'
  import {TabClient} from '@/components/Common/Tab'
  import loading from '@/components/Common/loading'

  import {ButtonClient} from '@/components/Common/Form'
  import ClientItem from '@/components/Clerk/ClientItem'
  import { mapState } from 'vuex'
  const time=1000
  export default {
    components:{SearchClient,TabClient,ClientItem,ButtonClient},
    data(){
      return {
        button:{
          txt:'获取更多',
          style:{marginTop:'.1rem',borderRadius:'0'}
        },
        menus:[{name: '我的客户',focus: 1}, {name: '同城客户'}],
        searchTxt:'',
        placeholder:'',
        pages:{
          1:1,
          2:1
        },
        rows:10,
        type:1
      }
    },
    computed:{
    ...mapState({
      loadFinish:state=>state.loadFinish,
      disabled:state=>state.disabled,
      openid:state=>state.openid,
      clientList:state=>state.clientList,
      tip:state=>state.tip
    }),
      list(){
         return this.clientList[this.type]
      },
      page:{
        get(){
            return this.pages[this.type]
        },
        set(v){
           this.pages[this.type]=v;
        }
      }
    },
    created(){
      // this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
      let nav = this.$route.query.nav || 1;

      this.menus.forEach((v,i)=>{
        if((i+1)==nav){
          v.focus=1;
        }else{
          v.focus=0;
        }
      })
      this.type=nav;

      this.loadData();

      // this.$store.dispatch(nav==1?'setMyClientList':'setCityClientList',{openId:this.openid,searchText:this.searchTxt,page:this.page,rows:this.rows,type:this.type})

    },
    methods:{
      jumpDetail(id,type){
        let canEdit=type==1?1:0;
        this.$store.dispatch('clear_obj','clientInfo');
        this.$router.push({name: 'detailClient', query: {id,canEdit}})
      },
      handleInput(e){
        this.searchTxt= e.target.value;
      },
      handleFocus(tar){
        const input=tar.getElementsByTagName('input')[0];
        if(input.value==''){
          const holder=tar.getElementsByClassName('holder')[0];
          const searchBtn=tar.getElementsByClassName('search_btn')[0];
          const searchRecord=tar.getElementsByClassName('search-record')[0];
          const cancle=tar.getElementsByClassName('cancle')[0];
          searchBtn.style.display = "block";
          //searchRecord.style.display="block";
          cancle.style.display = "block";
          holder.style.display = "none";
          input.focus();
          this.placeholder='手机号／店名／老板姓名';
        }
      },
      handleCancel(tar){
        const input=tar.getElementsByTagName('input')[0],page=1,rows=this.rows,openId=this.openid;
        const holder=tar.getElementsByClassName('holder')[0];
        const searchBtn=tar.getElementsByClassName('search_btn')[0];
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        const cancle=tar.getElementsByClassName('cancle')[0];
        searchRecord.style.display="none";
        searchBtn.style.display = "none";
        cancle.style.display = "none";
        holder.style.display = "block";
        this.placeholder='';
        this.searchTxt='';
        this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
        this.page=1;
        this.loadData();
      },
      handleSearch(tar){
        const input=tar.getElementsByTagName('input')[0],page=1,rows=this.rows,searchText=this.searchTxt,openId=this.openid;
        if(input.value==''){
          this.$store.dispatch('changeTip',{isTip:true,txt:'搜索信息不能为空',time:1000});
          input.focus();
          return;
        }
        const searchRecord=tar.getElementsByClassName('search-record')[0];
        searchRecord.style.display="none";
        this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
        this.loadData();
      },
      handleTab(obj){

        this.$store.dispatch('changeLoadFinish',{txt:''});
        this.menus.forEach((v)=>{
          if(v.name==obj.name){
            v.focus=1;
          }else{
            v.focus=0;
          }
        })
        this.page=1;
        const page=this.page,rows=this.rows,searchText=this.searchTxt;
        document.body.scrollTop=0;
        // this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
        if(obj.name=='同城客户') this.type=2;
        else this.type=1;

        if(!this.list.list.length) this.loadData();

        this.$router.replace({path:'/clerk/list',query:{...this.$route.query,nav:this.type}})

      },
      loadData(){
          this.$store.dispatch('changeTip',{isTip:true,txt:'加载中...',loading:true});
          let api=this.type==1?'setMyClientList':'setCityClientList';
          this.$store.dispatch(api,{page:this.page,rows:this.rows,searchText:this.searchTxt,openId:this.openid,type:this.type})
      },
      handleMore(){

        if(!this.list.isMore) return;
        this.page++;
        this.loadData();
      }
    }
  }
</script>
<style scoped>
  .submit{
     margin: .1rem 0;
     font-size:.16rem;
  }
  .search-client-num{
    height: .36rem;
    line-height: .36rem;
    font-size: .14rem;
    padding: 0 .2rem;
    color:#666;
    position: relative;
    background: #f5f5f5;
    z-index: 2;
  }
  .num-right{

    position: absolute;
    right: .2rem;
 }
</style>
