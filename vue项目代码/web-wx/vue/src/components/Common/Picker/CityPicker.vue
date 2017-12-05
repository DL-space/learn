<template>
  <picker-common :show="show" :tmp="tmp" ref="picker" :groups="cityGroups" :field="field" :defaultSelected="defaultSelected" @handleGroupChange="handleGroupChange" @listenParentAction="actionFromChild"></picker-common>
</template>
<script>
  import PickerCommon from './Picker'
  export default {
    props:['show','defaultSelected','data','field'],
    components:{PickerCommon},
    data(){
      return {
        tmp:false,
        cityGroups:[],
        postArr:[]
      }
    },
    created(){
      const { groups, newselected } = this.parseData(this.data, undefined, this.defaultSelected);
      this.cityGroups=groups;
    },
    mounted(){
      this.tmp=this.show;
    },
    methods:{
      //向父组件传递picker的数据
      actionFromChild (action,field){
        this.$emit('listenParentAction',action,field,this.postArr);
      },
      parseData(data, subKey='sub', selected = [], group = [], newselected = []){
        let _selected = 0;
        if ( Array.isArray(selected) && selected.length > 0){
          let _selectedClone = selected.slice(0);
          _selected = _selectedClone.shift();
          selected = _selectedClone;
        }

        if (typeof data[_selected] === 'undefined'){
          _selected = 0;
        }

        newselected.push(_selected);

        let item = data[_selected];

        var _group = JSON.parse(JSON.stringify(data));
        _group.forEach(g=>delete g[subKey]);
        group.push({ items: _group, mapKeys: { 'label': 'name' } });

        if (typeof item[subKey] !== 'undefined' && Array.isArray(item[subKey])){
          return this.parseData(item[subKey], subKey, selected, group, newselected);
        } else {
          return { groups: group, newselected };
        }
      },
      handleGroupChange(selected){
        this.postArr=[];
        const data=this.data;
        const { groups, newselected } = this.parseData(data, 'sub', selected);
        this.cityGroups=groups;
        this.cityGroups.forEach((v,i)=>{
          if(v.items.length<selected[i]+1){
            selected[i]=0;
          }
          let tmp=v.items[selected[i]];
          tmp.index=selected[i];
          this.postArr.push(tmp);
        });
        this.$refs.picker.position(selected);
      }
    }
  }
</script>
