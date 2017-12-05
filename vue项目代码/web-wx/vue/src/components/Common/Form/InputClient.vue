<template>
  <div class="input-control br1_bottom" :style="data.style">
    <label v-if="data.label" :style="data.brand?'width:auto':''"><span v-if="data.require && $route.query.canEdit=='1'" class="red">*</span>{{data.label}}：</label>
    <div class="my-img-box" v-if="data.uploadImg">
      <upload-photo :title="data.placeholder" :url="data.fill" :show="show" @handleCancel="handleCancel" @handleDelete="()=>handleDelete(data.field)" @handleShowPicture="handleShowPicture" @getPhotoMsg="dt=>handleUpload(dt,data.field)" :readonly="data.readonly"></upload-photo>
    </div>
    <input :value='data.selected?data.fill:data.value' :placeholder="data.placeholder" v-if="!data.readonly" :type="data.type ? data.type : 'text'" @change="sendMsgToParent(data.field,$event)" />
    <template v-else>
      <div v-if="!data.uploadImg&&!data.brand"  class="input">{{data.selected?data.fill:data.value}}</div>
    </template>
    <div v-if="data.util" style="position: absolute;right:0">{{data.util}}</div>
    <div class="selected" v-if="data.selected" @click="showPicker" :style="data.readonly?'background:none':''">
      <city-picker v-if="data.selected.city" :show="show" :data="data.selected.data" :defaultSelected="data.selected.selected" :field="data.field" @listenParentAction="actionFromChild"></city-picker>
      <picker-common v-else :show="show" :groups="data.selected.options" :field="data.field" :defaultSelected="data.selected.selected" @listenParentAction="actionFromChild"></picker-common>
    </div>
    <verify-code v-if="data.isVerifyCode" @changeCode="changeCode(data.field)" :data="data.time"></verify-code>
    <div class="enter" v-if="data.handleClick" style="margin-top:.5rem;padding-left:.1rem;color:grey" @click="data.handleClick">
      {{data.fill}}
      <p style="line-height:.3rem;padding-bottom:.1rem">{{data.address}}</p>
    </div>
    <select-brand v-if="data.brand"  :car="data.car" :filterCar="data.filterCar" @handleChecked="handleChecked" @handleInput="handleInput"></select-brand>
  </div>
</template>
<script>
  import {PickerCommon,CityPicker} from '@/components/Common/Picker';
  import {uploadPhoto} from '@/components/Common/FileUpload';
  import SelectBrand from '@/components/Common/SelectBrand/Brand'
  import VerifyCode from '@/components/Common/Form/VerifyCode';
  export default {
    components: {PickerCommon,CityPicker,uploadPhoto,VerifyCode,SelectBrand},
    props: ['data'],
    data () {
      return {
        show: false
      }
    },
    methods: {
      //向父组件传递文本数据
      sendMsgToParent (field, e) {
        this.$emit('sendMsgToParent', field, e.target.value);
      },
      showPicker () {
        if(this.data.readonly && this.data.selected)return;
        this.show = true;
        this.data.openCk && this.data.openCk();
      },
      //向父组件传递picker的数据
      actionFromChild (action,field,arr) {
        this.show = false
        this.$emit('listenChildrenAction',action,field,arr);
      },
      handleCancel(){
        this.show=false;
      },
      handleDelete(field){
        this.$emit('handleDelete',field);
        this.show=false;
      },
      handleShowPicture(){
        this.show=true;
      },
      handleUpload(data,field,e){
        this.$emit('handleUpload',data,field);
      },
      changeCode(field){
        this.$emit('changeCode',field);
      },
      handleChecked(o,e){
        this.$emit('handleChecked',o,e);
      },
      handleInput(t){
        this.$emit('handleInput',t);
      }

    }

  }

</script>
<style scoped>
.my-img-box{
  width: 1rem;
  /*padding: .2rem;*/
  height: 1rem;
  margin: .4rem 0 .4rem .12rem;
}
</style>
