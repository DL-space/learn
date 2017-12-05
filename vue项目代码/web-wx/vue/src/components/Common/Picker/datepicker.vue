<template>
  <picker-common :show="isShow" @listenParentAction="getAction" :defaultSelected="defaultIndex" :groups="items" :field="''" @handleGroupChange="setPickerValue" ref="picker" type="date"/>
</template>

<script>
import cmuPicker from '@/components/Common/Picker/cmu-picker';
import PickerCommon from './Picker'

export default {
  components:{ cmuPicker,PickerCommon },
  props:{
    isShow:{
      type:Boolean,
      default:false
    },
    startDate:{
      type:String,
      default:'2000-01-01'
    },
    endDate:{
      type:String,
    },
    value:{
      type:String,
    },
    type:{
      type:String
    }
  },
  data(){
    return {
      pickerYear:'',
      pickerMonth:'',
      pickerDay:'',
      yearLock:false,
      monthLock:false,
      dayLock:false,


      picker:'',
      slots:[
        {
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center',
          defaultIndex:0,
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center',
          defaultIndex:0,
        },
        {
          flex: 1,
          values: [],
          className: 'slot3',
          textAlign: 'center',
          defaultIndex:0,
        }
      ],
      items:[{items:[],mapKeys:{label:'name'}},{items:[],mapKeys:{label:'name'}},{items:[],mapKeys:{label:'name'}}],
      defaultIndex:[0,0,0],
      oldIndex:[],
    }
  },
  computed:{
    endDateValue(){
      return this.endDate || this.fomatTime(new Date(new Date().getFullYear()+3,0,1));
    },
    startAndEnd(){
      let [sy,sm,sd] = this.deTime(this.startDate),
          [ey,em,ed] = this.deTime(this.endDateValue);
       return {sy,sm,sd,ey,em,ed}
    }
  },
  created(){
    //  if(this.type)this.$nextTick(this.init);
     this.init();
  },
  mounted(){
    // this.$nextTick(this.getValuePosition);

  },
  methods:{
    init(){
       let {ey,em} = this.startAndEnd;
       this.getYears();
       this.getMonths();
       this.getDays(ey,em);

       let ts = this.deTime(this.value);

       let vs=['年','月','日'];
       ts=ts.map((v,i)=>parseInt(v)+vs[i]);

       this.pickerYear=ts[0];
       this.pickerMonth=ts[1];
       this.pickerDay=ts[2];



    },
    getAction(v){
      if(v=='cancel') this.$emit('update:isShow',false),this.defaultIndex=this.oldIndex.length?this.oldIndex:this.defaultIndex;
      else if(v=="confirm"){
        this.$emit('update:isShow',false);
        let {items,oldIndex,defaultIndex}=this;
        this.defaultIndex=this.oldIndex.length?this.oldIndex:this.defaultIndex;

        let values = items.map((v,i)=>{return v.items[this.defaultIndex[i]].label});

        this.getConfirm(values)
      }
    },
    setValues(){
      let {items,oldIndex,defaultIndex} = this;
      this.defaultIndex=this.oldIndex.length?this.oldIndex:this.defaultIndex;

      let values = items.map((v,i)=>{return v.items[this.defaultIndex[i]].label});

      this.pickerYear=values[0];
      this.pickerMonth=values[1];
      this.pickerDay=values[2];

    },
    getValuePosition(){
      let ts = this.deTime(this.value);

      let vs=['年','月','日'];
      ts=ts.map((v,i)=>parseInt(v)+vs[i]);
      let indexs=[];
      this.items.forEach((v,i)=>{
         if(!v.items.length) return;

         v.items.forEach((v2,i2)=>{
           if(parseInt(v2.label) == parseInt(ts[i])) {
             indexs.push(i2)
           }
         })
      })
     this.defaultIndex=indexs;
    },
    getYears(){

      let {ey,sy} = this.startAndEnd;

      if(!this.pickerYear) this.pickerYear=sy;

      let values = Array.apply(null, { length: ey-sy+1 }).map((v,i) =>  ({label:Number(sy)+i+'年'}));
      this.items[0].items=values;
    },
    getMonths(){
      let {ey,em,sy,sm} = this.startAndEnd;

      if(!this.pickerMonth) this.pickerMonth=sm;

      let ms = parseInt(this.pickerYear) == ey?parseInt(em):12,
          init = parseInt(this.pickerYear) == sy?parseInt(sm):1;


      if(init!=1) ms-=init-1;



      let values = Array.apply(null, { length: ms }).map((v,i) => ({label:init+i+'月'}));



      this.items[1].items=values;

      let is =this.oldIndex.length?this.oldIndex:this.defaultIndex;

      if(this.isShow && !values[this.oldIndex[1]] && this.$refs.picker) {
        this.pickerMonth=values[0].label;
        this.oldIndex[1]=0;
      }


      if(this.$refs.picker && this.oldIndex.length) this.$refs.picker.position(this.oldIndex);


    },
    getDays(y,m,d){
      let {ey,em,ed,sy,sm,sd} = this.startAndEnd;

      let init =  parseInt(this.pickerYear) == sy && parseInt(this.pickerMonth) == sm?parseInt(sd):1,
          days = parseInt(this.pickerYear) == ey && parseInt(this.pickerMonth) == em?parseInt(ed):this.monthNumber(y,m);

      if(init!=1) days-=init-1;

      let values = Array.apply(null, { length: days }).map((v,i) => ({label:init+i+'日'}));
      this.items[2].items=values;

      if(this.isShow && !values[this.oldIndex[2]] && this.$refs.picker) {
        this.pickerDay=values[0].label;
        this.oldIndex[2]=0;
      }

        if(this.$refs.picker && this.oldIndex.length) this.$refs.picker.position(this.oldIndex);


    },

    getPosition(v){
      let selected = v;


      this.items.forEach((v,i)=>{
        if(v.items.length<selected[i]+1){
          selected[i]=0;
        }
        // let tmp=v.items[selected[i]];
        // tmp.index=selected[i];
        // this.postArr.push(tmp);
      });
      if(this.isShow)this.$refs.picker.position(selected);
    },
    setPickerValue(v,c){
      // console.log(v,c)
      if(!v) return;

      let [y,m,d] = c;
      this.oldIndex=v;

      this.pickerYear=y;
      this.pickerMonth=m;
      this.pickerDay=d;
    },
    getConfirm(v){

      let i= v.map(v=>this.addZero(parseInt(v))).join('-')

      this.$emit('change',i)
    },
    addZero(a){
      return a>9?a:'0'+a.toString()
    },
    fomatTime(d){
      let y=d.getFullYear(),m=this.addZero(d.getMonth()+1),dd=this.addZero(d.getDate());
      return y+'-'+m+'-'+dd;
    },
    deTime(d){
      if(!d) return ;
      let ts = d.split('-');
      return ts;
    },
    monthNumber(year,month){
       let temp = new Date(parseInt(year),parseInt(month),0);
       return temp.getDate();
    },

  },
  watch:{
    pickerYear(n){
      let {pickerYear,pickerMonth,pickerDay}=this;
      if(pickerMonth){
        // this.setValues();

         this.getMonths();
         this.getDays(n,pickerMonth)
        //  this.getValuePosition();

      }
    },
    pickerMonth(n){
      let {pickerYear,pickerMonth,pickerDay}=this;
      if(pickerYear && pickerMonth){
        //  this.setValues();
         this.getDays(pickerYear,n)

        //  this.getValuePosition();

      }
    },
    pickerDay(n){
       this.getValuePosition();

    },

  }
}
</script>

<style lang="css">
</style>
