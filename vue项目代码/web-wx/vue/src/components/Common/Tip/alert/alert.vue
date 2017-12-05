<template>
  <transition name="bg-fade" appear>
    <div class="alert" v-if="isShow">
          <div class="alert-panel">
              <h6 >{{title}}</h6>
              <p class="panel-content" v-if="content">{{content}}</p>
              <div class="panel-button br1">
                 <button v-for="item in buttons" key="butt" :type="item.type" @click="item.fn">{{item.name}}</button>
              </div>
          </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'alert',
  props:{
    title:{
        type:String,
        default:'提示'
    },
    content:{
        type:String,
    },
    type:{
        type:String,
        default:'alert'
    },
    buttons:{
        type:Array,
        default(){
           let that=this;
           return [
               {name:'好的',type:'0',fn(){
                   that.close()
               }}
           ]
        }
    },
    isShow:{
        type:Boolean,
        default:false
    },
  },
  methods:{
      opens(){
          this.isShow=true;
      },
      close(){
          this.isShow=false;
          this.$emit('handle')
      }
  }
}
</script>

<style lang='css' scoped>
   .alert{
       width: 100%;
       height: 100%;
       position: fixed;
       top:0;
       left:0;
       background: rgba(34, 34, 34,.5);
       z-index: 300;
   }
  .alert-panel{
      position: absolute;
      top:50%;
      left:50%;
      width: 2.7rem;
      transform: translate(-50%,-50%);
      -webkit-transform: translate(-50%,-50%);
      background: #fff;
      border-radius:.125rem;
      /*// border-top-left-radius:.25rem;*/
      text-align: center;
      padding-top:.16rem;

  }
  .alert-panel h6{
      padding: .12rem 0;
      font-size: .17rem;
      font-weight: bold;
      line-height: .1rem;
  }
  .alert-panel .panel-content{
      font-size: .15rem;
      line-height: .2rem;
      padding: 0 .16rem;
  }
  .panel-button::before{
    border-top: 1px solid #e0dede;
    z-index: -1;
  }
  .panel-button{
     height: .435rem;
     width: 100%;
     margin-top: .16rem;
     line-height: .435rem;
  }

  .panel-button button{
     font-size: .16rem;
     color:#007aff;
     background: none;
     border-bottom-left-radius:.125rem;
     border-bottom-right-radius:.125rem;
     border: none;


  }
  .panel-button button[type='0']{
    width: 100%;
    height: 100%;
  }
  .panel-button button[type='1']{
    width: 50%;
    height: 100%;
    color:#7a7a7a;
    border-right: 1px solid #e0e0e0;
    border-bottom-right-radius:0;
  }
  .panel-button button[type='2']{
    width: 50%;
    height: 100%;
    border-bottom-left-radius:0;
  }
  .button-active{
      transition: all .1s;
      -webkit-transition: all .1s;
      background: rgba(221, 221, 221, 0.6)!important;
  }

  .bg-fade-enter-active, .bg-fade-leave-active{
     transition: all .3s;
  }
   .bg-fade-enter, .bg-fade-leave-to /* .fade-leave-active in <2.1.8 */ {
     opacity: 0;

   }

</style>
