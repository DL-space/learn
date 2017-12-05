<template>
  <div v-if="show">
    <div :class="maskcls" @click="action('cancel','',$event)"></div>
      <div :class="cls">
        <div class="weui-picker__hd">
          <a v-for="(item,index) of actions" :key="index" class="weui-picker__action" @click="action(item.action,field,$event)"> {{item.label}}</a>
        </div>
        <div class="weui-picker__bd">
          <picker-group ref='picker-group' v-for="(item,index) of groups" @sendOptionToParent="getOptionFromChild" @handleGroupChange="handleGroupChange" :show="show" :items="item.items" :groupIndex="index" :defaultIndex="defaultSelected[index]" :key="index"></picker-group>
        </div>
      </div>
  </div>
</template>
<script>
  import classNames from 'classnames'
  import PickerGroup from '@/components/Common/Picker/PickerGroup'
  export default {
    components: {PickerGroup},
    props: ['show', 'groups', 'defaultSelected','field','type'],
    data () {
      return {
        selected:[],
        closing: false,
        maskcls: '',
        cls: '',
        actions: [{
          label: '取消',
          action: 'cancel'
        }, {
          label: '确定',
          action: 'confirm'
        }],
        values:[]
      }
    },
    updated () {
      let className = classNames({
        'weui-animate-fade-in': this.show && !this.closing,
        'weui-animate-fade-out': this.closing
      })
      this.maskcls = classNames({
        'weui-mask': true,
        'weui-mask_transparent': false
      }, className)
      this.cls = classNames('weui-picker', {
        'weui-animate-slide-up': this.show && !this.closing,
        'weui-animate-slide-down': this.closing
      })
    },
    methods: {
      action (action,field,e) {
        e.stopPropagation();
        this.$emit('listenParentAction',action,field,this.selected)
        let className = classNames({
          'weui-animate-fade-in': this.show && !this.closing,
          'weui-animate-fade-out': this.closing
        })
        console.log(className)
        this.maskcls = classNames({
          'weui-mask': true,
          'weui-mask_transparent': false
        }, className)
        this.cls = classNames('weui-picker', {
          'weui-animate-slide-up': this.show && !this.closing,
          'weui-animate-slide-down': !this.show
        })
      },
      getOptionFromChild(groupIndex,obj){
        this.selected[groupIndex]=obj;
      },
      handleGroupChange(item,selected,groupIndex){



        this.selected[groupIndex]=item;
        let arr=[],values=[];

        this.selected.forEach((v,i)=>{
          arr.push(v.index);
          values.push(v.label);
        })
        this.$emit('handleGroupChange',arr,values);
      },
      position(selected){
        this.$refs['picker-group'].forEach((v,i)=>{
          if(selected[i]!='null'){
            v.position(selected[i]);
            if(this.groups[i].items[selected[i]]) this.values[i]=this.groups[i].items[selected[i]].label
          }
        })

        this.type && this.$emit('handleGroupChange',selected,this.values);

      }
    }
  }
</script>
