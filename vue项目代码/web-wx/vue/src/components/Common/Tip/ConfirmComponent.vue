<template>
  <div class="mask">
    <div class="confirm">
      <div class="confirm_txt">
        {{data.txt}}
      </div>
      <div class="btn_group">
        <button class="btn_confirm red" @click="handleConfirm">确定</button>
        <button class="btn_cancle" @click="handleCancel">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    props:['data'],
    methods:{
      handleConfirm(){
        this.$emit('handleConfirm');
      },
      handleCancel(){
        this.$emit('handleCancel');
      }
    }
  }
</script>
