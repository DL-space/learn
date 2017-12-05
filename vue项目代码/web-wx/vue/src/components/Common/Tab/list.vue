<template>
   <div class="hjc-list-box" ref="listBox" @touchstart="tStart($event)" @touchend="tEnd()" @touchmove="tMove($event)">
     <!-- <div class="list-no-content" v-show="$slots.default.length==0 && !nowLoad">
        没有更多内容
     </div> -->

     <div class="hjc-list" ref="list" :style="{'transform':translate,'transition':isAnim}" >
       <div class="hjc-list-down-load" v-if="downRefresh">
          <img v-show="downLoadText != downLoadEndText" class="hjc-list-down-icon" :style="listDownIcon" src="../../../../static/images/client/icon-down-load.png" alt="">
          <i v-show="downLoadText == downLoadEndText" class="weui-loading hjc-loading"></i>
          {{downLoadText}}
       </div>
       <slot></slot>
       <div class="load-btn-box">
         <button v-if="isMore" class="load-btn" @click="loadMore" :style="{background:nowLoad?'none':'#f0f0f0'}">{{loadText}}</button>
         <div class="list-no-content" v-show="!isMore">
            没有更多内容了
         </div>
       </div>
     </div>


   </div>
</template>

<script>

export default {
  name:'hjc-list',
  data(){
    return {
      loadText:'点击加载更多',
      nowLoad:false,
      hr:null,
      moveY:0,
      endY:0,
      startY:0,
      startT:0,
      oPos:{},
      duration:0,
      isStop:true,
      downLoadText:'下拉刷新',
      isDownLoad:false,
    }
  },
  props:{
    isMore:{
      type:Boolean,
      default:null
    },
    load:{
      type:Function
    },
    downRefresh:{
      type:Function,
    },
    downLoadStartText:{
      type:String,
      default:'下拉刷新',
    },
    downLoadNowText:{
      type:String,
      default:'松手刷新',
    },
    downLoadEndText:{
      type:String,
      default:'加载中...',
    },
  },
  mounted(){
    // this.loadMore();

    // document.addEventListener('touchstart',this.tStart);
    // document.addEventListener('touchmove',this.tMove);
    // document.addEventListener('touchend',this.tEnd);
  },
  computed:{
    list(){
      return this.$refs.list
    },
    listBox(){
      return this.$refs.listBox
    },
    listBoxTop(){
      return this.listBox.offsetTop-60;
    },
    translate(){
       return 'translate3d(0,'+this.moveY+'px,0)';
    },
    isAnim(){
       return 'all '+this.duration+'ms';
    },
    listDownIcon(){
      let s={transform:this.downLoadText==this.downLoadNowText?'rotate(-180deg)':'rotate(0deg)'}
      return s
    }
  },
  methods:{
    loadMore(){

      if(!this.load || this.nowLoad) return;
      this.loadText='加载中...';

      this.nowLoad=true;

      this.load().then(dt=>{
         this.loadText='点击加载更多';
         this.nowLoad=false;

      }).catch(err=>{
         this.loadText='加载出错，请重试';
         this.nowLoad=false;

      })
    },
    touchPos(e){
      var touches = e.changedTouches, touch, tagX,tagY;
      touch = touches[0];tagX = touch.pageX;tagY = touch.pageY;
      this.oPos.x = tagX;this.oPos.y = tagY,this.oPos.t = new Date();
      return this.oPos;
    },
    tStart(e){
      if(!this.downRefresh) return;
      this.duration=0;
      let pos=this.touchPos(e);
      this.startT = pos.t;
      this.startY = pos.y;
      this.endY=this.moveY;
      this.isDown=false;

    },
    tMove(e){
      if(!this.downRefresh) return;

      let pos=this.touchPos(e),
          moveY = pos.y-this.startY,
          moveT = pos.t-this.startT;
      if(moveY < 0 || (this.scrollTop() > 0)) return this.isDownLoad=false;

      this.isDownLoad = true;
      this.prevent(e);
      this.moveY=this.endY+moveY;
      if(this.moveY > 60) this.downLoadText=this.downLoadNowText;
      else this.downLoadText=this.downLoadStartText;



    },
    tEnd(){
      if(!this.downRefresh) return;

      if(!this.isDownLoad || this.moveY < 60) return this.duration=300,this.moveY=0;
      this.duration=300;
      this.moveY = 46;
      this.downLoadText = this.downLoadEndText;

      this.downRefresh().then(dt=>this.moveY=0,this.isDown=true).catch(()=>this.moveY=0);

      // setTimeout(()=>this.moveY=0,1000)

    },
    scrollTop(){
      return document.body.scrollTop
    },
    prevent(e){
       e.preventDefault();
    }
  }
}
</script>

<style lang="css" scoped>
  .load-btn-box{
    text-align: center;
    padding: 0 .1rem;
  }
  .load-btn{
    background: #f0f0f0;
    color:#666;
    width: 100%;
    margin: .2rem 0;
    padding: .08rem 0;
    border-radius: .03rem;
  }
  .list-no-content{
    text-align: center;
    padding: .08rem 0;
    color:#999;
    font-size: .14rem;
  }
  .hjc-list-down-load{
    text-align: center;
    /*padding-top:.16rem;*/
    position: absolute;
    top:-.4rem;
    width: 100%;
    color: #666;
    font-size: .15rem;
    /*overflow: hidden;*/
  }
  .hjc-list{
    transform: translate3d(0,0,0);
    /*background: #fff;*/
    position: relative;
    margin-top: .02rem;
    /*overflow: hidden;*/
  }
  .hjc-list-box{
    overflow: hidden;
    min-height: 3rem;
    /*background: #f90;*/
  }
  .hjc-list-down-icon{
    vertical-align: middle;
    width: .24rem;
    margin-right: .04rem;
    transition: transform .3s;

  }
</style>
