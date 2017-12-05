<template>
  <div class="clerk">
    <div class="add-client">
      <input-client v-for="(v,i) of form" :data="v" :key="i" @listenChildrenAction="confirmMsgFromChild"  @sendMsgToParent="showMsgFromChild" @handleDelete="handleDelete" @handleUpload="handleUpload"></input-client>
      <div class="add-map">
        <!-- <p class="title-text">地图定位</p> -->
        <div class="map-geo" @click="jumpMap">
           <p class="map-tit">地图定位({{address?'已采集':'未采集'}})
             <span class="item-right"></span>
           </p>
           <p class="map-show">
             <img slot="left" class="icon-map" src="../../../static/images/clerk/icon/map.png">
             {{address?address+' '+areaInfo:'点击采集位置信息'}}
           </p>
        </div>
      </div>
    </div>
    <button-client  :disabled="disabled" @listenButtonEvent="handleSubmit" :data="button"></button-client>
  </div>
</template>
<script>
  import {InputClient,ButtonClient} from '@/components/Common/Form'
  import { Ajax,AjaxApi } from '@/assets/Util'
  import loading from '@/components/Common/loading'

  import { Toast } from 'mint-ui'
  import { mapState,mapGetters,mapActions } from 'vuex';
  import cnCity from '@/data/cnCity';
  const time=1000;
  export default {
    components:{InputClient,ButtonClient},
    data(){
      return {
        clientCode:'',
        role:this.$route.query.role?this.$route.query.role:'',
        address:'',
        areaInfo:'',
        longitudeLatitude:'',
        editStage:false,
        form:[{
            label:'客户名称',
            field:'orgName',
            value:'',
            placeholder:'请输入客户名称',
            require:true,
            readonly:false
          },{
            label:'营业执照名称',
            field:'businessLicense',
            value:'',
            placeholder:'请输入营业执照名称',
            require:false,
            readonly:false
          },{
            label:'联系人',
            field:'userName',
            value:'',
            placeholder:'请输入联系人',
            require:true,
            readonly:false
          },{
            label:'联系电话',
            field:'userTel',
            value:'',
            placeholder:'请输入联系电话',
            require:true,
            readonly:false
          },{
            selected:{
              city:true,
              selected:[0,0,0],
              data:cnCity,
              text:'',
              code:'',
              readonly:false
            },
            label:'省市区',
            field:'areaId',
            value:'',
            placeholder:'请选择省市区',
            require:true,
            readonly:false,
            hook:(arr)=>{
              let province,city,value;
              this.form.forEach(v=>{
                 if(v.field==='areaId'){
                    value=v.value;
                 }
              })
              if(arr.length==0){
                province=value.toString().substring(0,2)+'0000';
                city=value.toString().substring(0,4)+'00';
              }else{
                province=arr[0].id;
                city=arr[1].id;
              }

              return;
              AjaxApi('/manage/employee/oneorg',{province,city},(data2)=>{
                if(data2.data.length>0){
                  this.form.forEach(v=>{
                    if(v.field==='companyId'){
                      v.selected.options[0].items=[];
                      data2.data.forEach(v2=>{
                        v.selected.options[0].items.push({id:v2.orgId,label: v2.orgName});
                      })
                      v.selected.selected=[0];
                      v.fill=data2.data[0].orgName;
                      v.value=data2.data[0].orgId;
                      Ajax('/wechat/getStationByCompanyId',{id: v.value},(data3)=>{
                        if(data3.data.length>0){
                          this.form.forEach(v3=>{
                            if(v3.field==='stationId'){
                              v3.selected.options[0].items=[];
                              data3.data.forEach(v4=>{
                                v3.selected.options[0].items.push({id:v4.id,label: v4.orgName});


                            })
                              v3.selected.selected=[0];
                              v3.fill=data3.data[0].orgName;
                              v3.value=data3.data[0].id;

                              Ajax('/api/saler/customer/stage/list',{id: v.value,stationId:v3.value},(data)=>{
                                if(!data.result || data.code) return Toast(data.message);
                                let tmp=[{label:'待定',id:''}],list=data.data.postHouseList;

                                if(list.length>0){
                                  list.forEach(v=>{
                                    tmp.push({id: v.id,label: v.orgName})
                                  });
                                  this.form.forEach(v2=>{
                                    if(v2.field=='stageId'){
                                      v2.fill=tmp[1].label;
                                      v2.value=tmp[1].id;
                                      v2.selected.selected=[1];
                                      v2.selected.options[0].items=tmp;
                                    }
                                  })
                                }else{
                                  this.form.forEach(v=>{
                                    if(v.field==='stageId'){
                                      v.value='';
                                      v.fill='';
                                      v.selected={
                                        options:[{items:[{label:'待定',id:''}]}],
                                        selected:[0]
                                      };
                                    }
                                  })
                                }
                              });
                            }
                          })
                        }
                      })
                    }
                  })
                }else{
                  this.form.forEach(v=>{
                    if(v.field==='companyId'||v.field==='stationId'){
                      v.value='';
                      v.fill='';
                      v.selected={
                        options:[{items:[]}],
                        selected:[0]
                      };
                    }
                    else if(v.field==='stageId'){
                      v.value='';
                      v.fill='';
                      v.selected={
                        options:[{items:[]}],
                        selected:[]
                      };
                    }
                  })
                }
              })
            }
          },{
            label:'详细地址',
            field:'areaInfo',
            value:'',
            address:'',
            placeholder:'请输入详细地址',
            require:false,
            readonly:true
          },{
            selected:{
              options:[{items:[]}],
              selected:[0]
            },
            label:'物流公司',
            field:'companyId',
            value:'',
            fill:'',
            placeholder:'请选择物流公司',
            hook:()=>{
              this.form.forEach(v=>{
                if(v.field=='companyId'){
                  Ajax('/wechat/getStationByCompanyId',{id: v.value},(data)=>{
                    let tmp=[];
                    if(data.data.length>0){
                      data.data.forEach(v=>{
                        tmp.push({id: v.id,label: v.orgName})
                      });
                      this.form.forEach(v2=>{
                        if(v2.field=='stationId'){
                          v2.fill=data.data[0].orgName;
                          v2.value=data.data[0].id;
                          v2.selected.selected=[0];
                          v2.selected.options[0].items=tmp;
                          Ajax('/api/saler/customer/stage/list',{id: v.value,stationId:v2.value},(data)=>{
                            if(!data.result || data.code) return Toast(data.message);
                            let tmp=[{label:'待定',id:'',orgName:'待定'}],list=data.data.postHouseList;

                            if(list.length>0){
                              list.forEach(v=>{
                                tmp.push({id: v.id,label: v.orgName})
                              });
                              this.form.forEach(v2=>{
                                if(v2.field=='stageId'){
                                  v2.fill=tmp[1].label;
                                  v2.value=tmp[1].id;
                                  v2.selected.selected=[1];
                                  v2.selected.options[0].items=tmp;
                                }
                              })
                            }else{
                              this.form.forEach(v=>{
                                if(v.field==='stageId'){
                                  v.value='';
                                  v.fill='';
                                  v.selected={
                                    options:[{items:[{label:'待定',id:''}]}],
                                    selected:[0]
                                  };
                                }
                              })
                            }
                          });
                        }


                      })
                    }else{
                      this.form.forEach(v=>{
                        if(v.field==='stationId'){
                          v.value='';
                          v.fill='';
                          v.selected={
                            options:[{items:[]}],
                            selected:[0]
                          };
                        }
                      })
                    }
                  });
                }
              });
            },
            require:true,
            readonly:false
          },{
            selected:{
              options:[{items:[]}],
              selected:[0]
            },
            label:'服务站',
            field:'stationId',
            value:'',
            fill:'',
            placeholder:'请选择服务站',
            require:true,
            readonly:false,
            openCk:()=>{
              this.form.forEach(v2=>{
                if(v2.field=='stationId'){
                  // if(!v2.selected.options[0].items.length) return Toast('请先选择物流公司')
                }
              });
            },
            hook:()=>{
              this.form.forEach(v=>{
                if(v.field=='stationId'){
                  let cid='';
                  this.form.forEach(v2=>{
                     if(v2.field=='companyId') cid=v2.value;
                  })
                  if(!this.editStage) return;
                  Ajax('/api/saler/customer/stage/list',{id: cid,stationId:v.value},(data)=>{
                    if(!data.result || data.code) return Toast(data.message);
                    let tmp=[{label:'待定',id:''}],list=data.data.postHouseList;
                    if(list.length>0){
                      list.forEach(v=>{
                        tmp.push({id: v.id,label: v.orgName})
                      });
                      this.form.forEach(v2=>{
                        if(v2.field=='stageId'){
                          v2.fill=tmp[1].label;
                          v2.value=tmp[1].id;
                          v2.selected.selected=[1];
                          v2.selected.options[0].items=tmp;
                        }
                      })
                    }else{
                      this.form.forEach(v=>{
                        if(v.field==='stageId'){
                          v.value='';
                          v.fill='';
                          v.selected={
                            options:[{items:[{label:'待定',id:''}]}],
                            selected:[0]
                          };
                        }
                      })
                    }
                  });
                  return;
                }
              });
            },
          },
          {
            selected:{
              options:[{items:[{label:'待定',id:''}]}],
              selected:[0]
            },
            label:'驿站',
            field:'stageId',
            value:'',
            fill:'',
            placeholder:'请选择驿站',
            require:false,
            readonly:false,
            openCk:()=>{
              this.form.forEach(v2=>{
                if(v2.field=='stageId'){
                  // if(!v2.selected.options[0].items.length) return Toast('请先选择服务站')
                }
              });
            }
          },
          {
            selected:{
              selected:[0],
                options:[{
                items:
                  [{label:'汽配商',id:5},{label:'汽修店',id:6}]
              }],
            },
            label:'客户类型',
            field:'userType',
            value:'',
            placeholder:'请选择客户类型',
            style:{border:'none'},
            require:true,
            readonly:false
          },{
            label:'门头照',
            field:'mtId',
            value:'',
            type:'hidden',
            placeholder:'上传照片',
            uploadImg:true,
            require:true,
            fill:'',
            readonly:false
      }],
          button:{
            txt:this.$route.query.canEdit==1?'保存':'关闭',
            style:{
            width:'94%',
            margin:'.2rem 3%'
          }
        }
      }
    },
    computed:mapState({
      openid:state=>state.openid,
      disabled:state=>state.disabled,
      clientInfo:state=>state.clientInfo
    }),
    created(){
      loading.open();
      this.$store.dispatch('initStore');
      const id=this.$route.query.id,canEdit=this.$route.query.canEdit;
      Ajax('/api/saler/customer/baseinfo/query',{id:id,openId:this.openid},(data)=>{
        const info = JSON.stringify(this.clientInfo)==='{}'?data.data:this.clientInfo;
        this.editStage = info.editStage;
        this.clientCode=info.customerCode;
        this.address=info.address;
        this.areaInfo=info.areaInfo;
        this.longitudeLatitude=info.longitudeLatitude;
        info.businessLicense=info.businessLicense&&info.businessLicense==='null'?'':info.businessLicense;
        if(info.customerCode){
          this.form.unshift({
            label: '客户编码',
            field: 'customerCode',
            value: info.customerCode,
            readonly:true
          });
          info.contactValue1=info.contactValue1&&info.contactValue1==='null'?'':info.contactValue1;
          info.contactValue2=info.contactValue2&&info.contactValue2==='null'?'':info.contactValue2;
          this.form.forEach((v,i)=>{
            if(v.field=='userTel'){
              this.form.splice(i+1,0,{
                label:'备用电话1',
                field:'contactValue1',
                value:'',
                placeholder:'请输入备用电话1',
                require:false
              })
              this.form.splice(i+2,0,{
                label:'备用电话2',
                field:'contactValue2',
                value:'',
                placeholder:'请输入备用电话2',
                require:false
              })
            }
          })
          this.form.forEach((v,i)=>{
            if(canEdit==0)v.readonly=true;


            if(v.field=='stageId'){
              if(!this.editStage) v.readonly = true;
            }
            if(v.selected){

              if(v.field=='companyId'){
                // AjaxApi('/manage/employee/oneorg',{province:info.provinceId,city:info.cityId},(data2)=>{
                  // if(data2.data.length>0){
                    // data2.data.forEach((v2,i2)=>{
                      // if(info.companyId==v2.orgId){
                        // v.fill=v2.orgName;
                        // let tt=[];
                        // tt[0]=i2;
                        // v.selected.selected=tt;
                        Ajax('/wechat/getStationByCompanyId',{id:info.companyId},(data3)=>{
                          let tmp=[];
                          data3.data.forEach(v3=>{
                            tmp.push({id:v3.id,label: v3.orgName});
                          })
                          if(info.stationId){
                            console.log(1111)


                            data3.data.forEach((v3,i3)=>{
                              if(info.stationId==v3.id){
                                this.form.forEach(v4=>{
                                  if(v4.field=='stationId'){
                                    v4.fill=v3.orgName;
                                    let tt=[];
                                    tt[0]=i3;
                                    v4.selected.selected=tt;
                                    v4.selected.options[0].items=tmp;

                                    console.log(555)



                                    // Ajax('/api/saler/customer/stage/list',{id:info.companyId,stationId:info.stationId},(data4)=>{
                                    //   let tmp=[{id:'',label:'待定'}],list=data4.data.postHouseList;
                                    //   list.forEach(v3=>{
                                    //     tmp.push({id:v3.id,label: v3.orgName});
                                    //   })
                                    //   if(info.stageId){
                                    //     list.forEach((v5,i4)=>{
                                    //       if(info.stageId==v5.id){
                                    //         this.form.forEach(v6=>{
                                    //           if(v6.field=='stageId'){
                                    //             v6.fill=v5.orgName;
                                    //             v6.value=v5.id;
                                    //             v6.selected.selected=[i4+1];
                                    //             v6.selected.options[0].items=tmp;
                                    //           }
                                    //         })
                                    //       }
                                    //     })
                                    //   }
                                    //   else {
                                    //     this.form.forEach(v4=>{
                                    //       if(v4.field=='stageId'){
                                    //         v4.selected.selected=[0];
                                    //         v4.selected.options[0].items=tmp;
                                    //       }
                                    //     })
                                    //   }
                                    // })
                                  }
                                  if(v4.field == 'stageId'){

                                                console.log(1111)

                                    if(!this.editStage){
                                       v4.fill = info.stageName;
                                       v4.readonly=true;
                                    }
                                    else{
                                      Ajax('/api/saler/customer/stage/list',{id:info.companyId,stationId:info.stationId},(data4)=>{
                                        let tmp=[{id:'',label:'待定'}],list=data4.data.postHouseList;
                                        list.forEach(v3=>{
                                          tmp.push({id:v3.id,label: v3.orgName});
                                        })
                                        if(info.stageId){
                                          list.forEach((v5,i4)=>{
                                            if(info.stageId==v5.id){
                                              this.form.forEach(v6=>{
                                                if(v6.field=='stageId'){
                                                  v6.fill=v5.orgName;
                                                  v6.value=v5.id;
                                                  v6.selected.selected=[i4+1];
                                                  v6.selected.options[0].items=tmp;
                                                }
                                              })
                                            }
                                          })
                                        }
                                        else {
                                          this.form.forEach(v4=>{
                                            if(v4.field=='stageId'){
                                              v4.selected.selected=[0];
                                              v4.selected.options[0].items=tmp;
                                            }
                                          })
                                        }
                                      })
                                    }
                                  }
                                })
                              }
                            })
                          }else{
                            this.form.forEach(v4=>{
                                if(v4.field=='stationId'){
                                v4.selected.selected=[0];
                                v4.selected.options[0].items=tmp;
                              }
                            })
                          }
                        })

                        this.getAllCompanyList(this.openid).then(data=>{
                          // v.selected.selected=data;
                          v.fill=data[0].orgName;
                          v.readonly=true;
                          v.selected.options[0].items.push({id:data[0].id,label: data[0].orgName});

                        }).catch(()=>{
                          Toast('物流公司获取失败！')
                        })
                      // }
                      // v.selected.options[0].items.push({id:v2.orgId,label: v2.orgName});
                    // })
                  // }
                // })
              }
              if(v.field=='userType'){
                v.fill=info.userTypeStr;
                v.selected.options[0].items.forEach((v2,i2)=>{
                  if(v2.id==info.userType){
                    let tmp=[];
                    tmp[0]=i2;
                    v.selected.selected=tmp;
                  }
                })
              }
              if(v.field=='areaId'){
                let tmp=[],fill='';
                v.selected.data.forEach((v2,i2)=>{
                  if(v2.id==info.provinceId){
                    tmp[0]=i2;
                    fill+=v2.label.length>3? v2.label.substring(0,3):v2.label;
                    v2.sub.forEach((v3,i3)=>{
                      if(v3.id==info.cityId){
                        tmp[1]=i3;
                        fill+=v3.label.length>3? ' '+v3.label.substring(0,3):' '+v3.label;
                        v3.sub.forEach((v4,i4)=>{
                          if(v4.id==info.areaId){
                            tmp[2]=i4;
                            fill+=v4.label.length>3? ' '+v4.label.substring(0,3):' '+v4.label;
                          }
                        })
                      }
                    })
                  }
                })
                v.selected.selected=tmp;
                v.fill=fill;
              }
            }
            if(v.field=='mtId'){
              v.fill=info.mtUrl;
            }
            if(v.field=='areaInfo'){
              v.address=info.address;
            }
            v.value=info[v.field];

            if(this.role=='client'){
              v.placeholder='';
            }
          })
        }else{
          this.form.forEach(v=>{
            if(canEdit==0)v.readonly=true;
            // if(v.field=='stageId'){
            //   if(!info.editStage) v.readonly = true;
            // }
            if(v.field=='companyId'){
              // AjaxApi('/manage/employee/oneorg',{province:info.provinceId,city:info.cityId},(data2)=>{
                //Ajax('/wechat/getAllCompany',{},(data2)=>{
                // if(data2.data.length>0){
                  // data2.data.forEach((v2,i2)=>{
                    // if(info.companyId==v2.orgId){
                      // v.fill=v2.orgName;
                      // let tt=[];
                      // tt[0]=i2;
                      // v.selected.selected=tt;

                      Ajax('/wechat/getStationByCompanyId',{id:info.companyId},(data3)=>{
                        let tmp=[];
                        data3.data.forEach(v3=>{
                          tmp.push({id:v3.id,label: v3.orgName});
                        })
                        var stationId=info.stationId;
                        if(info.stationId){
                          data3.data.forEach((v3,i3)=>{
                            if(info.stationId==v3.id){
                              this.form.forEach(v4=>{
                                if(v4.field=='stationId'){
                                  v4.fill=v3.orgName;
                                  let tt=[];
                                  tt[0]=i3;
                                  v4.selected.selected=tt;
                                  v4.selected.options[0].items=tmp;
                                }
                                if(v4.field == 'stageId'){

                                  if(!this.editStage){
                                     v4.fill = info.stageName;
                                     v4.readonly=true;
                                  }
                                  else{
                                    Ajax('/api/saler/customer/stage/list',{id:info.companyId,stationId:info.stationId},(data4)=>{
                                      let tmp=[{id:'',label:'待定'}],list=data4.data.postHouseList;
                                      list.forEach(v3=>{
                                        tmp.push({id:v3.id,label: v3.orgName});
                                      })
                                      if(info.stageId){
                                        list.forEach((v5,i4)=>{
                                          if(info.stageId==v5.id){
                                            this.form.forEach(v6=>{
                                              if(v6.field=='stageId'){
                                                v6.fill=v5.orgName;
                                                v6.value=v5.id;
                                                v6.selected.selected=[i4+1];
                                                v6.selected.options[0].items=tmp;
                                              }
                                            })
                                          }
                                        })
                                      }
                                      else {
                                        this.form.forEach(v4=>{
                                          if(v4.field=='stageId'){
                                            v4.selected.selected=[0];
                                            v4.selected.options[0].items=tmp;
                                          }
                                        })
                                      }
                                    })
                                  }
                                }
                              })
                            }


                          })
                        }else{
                          this.form.forEach(v4=>{
                            if(v4.field=='stationId'){
                              v4.selected.selected=[0];
                              v4.selected.options[0].items=tmp;


                              // stationId = tmp.id;
                            }

                          })
                        }



                      })

                      this.getAllCompanyList(this.openid).then(data=>{
                        // v.selected.selected=data;
                        v.fill=data[0].orgName;
                        v.readonly=true;
                        v.selected.options[0].items.push({id:data[0].id,label: data[0].orgName});

                      }).catch(()=>{
                        Toast('物流公司获取失败！')
                      })
                    // }
                    // v.selected.options[0].items.push({id:v2.orgId,label: v2.orgName});
                  // })
                // }
              // })
            }
            if(v.field=='userType'){
              v.fill=info.userTypeStr;
              v.selected.options[0].items.forEach((v2,i2)=>{
                if(v2.id==info.userType){
                  let tmp=[];
                  tmp[0]=i2;
                  v.selected.selected=tmp;
                }
              })
            }
            if(v.field=='areaId'){
              let tmp=[],fill='';
              v.selected.data.forEach((v2,i2)=>{
                if(v2.id==info.provinceId){
                  tmp[0]=i2;
                  fill+=v2.label.length>3? v2.label.substring(0,3):v2.label;
                  v2.sub.forEach((v3,i3)=>{
                    if(v3.id==info.cityId){
                      tmp[1]=i3;
                      fill+=v3.label.length>3? ' '+v3.label.substring(0,3):' '+v3.label;
                      v3.sub.forEach((v4,i4)=>{
                        if(v4.id==info.areaId){
                          tmp[2]=i4;
                          fill+=v4.label.length>3? ' '+v4.label.substring(0,3):' '+v4.label;
                        }
                      })
                    }
                  })
                }
              })
              v.selected.selected=tmp;
              v.fill=fill;
            }
            if(v.field=='mtId'){
              v.fill=info.mtUrl;
            }
            if(v.field=='areaInfo'){
              v.address=info.address;
            }
            v.value=info[v.field];
            if(this.role=='client'){
              v.placeholder='';
            }
          })
        }
        loading.close();
      })
    },
    methods:{
      ...mapActions([
        'getAllCompanyList'
      ]),
      jumpMap(){
        const {canEdit} =this.$route.query;
        // if(canEdit==0) return;
        let obj={};
        this.form.forEach(v=>{
          obj[v.field]= v.value;
          if(v.field=='areaId'){
            obj['provinceId']=v.value.toString().substring(0,2)+'0000';
            obj['cityId']=v.value.toString().substring(0,4)+'00';
          }
          if(v.field=='mtId'){
            obj['mtUrl']= v.fill;
          }
          if(v.field=='userType'){
            obj['userTypeStr']= v.fill;
          }
          if(v.field=='areaInfo'){
            obj['address']= v.address;
          }
        })
        obj.longitudeLatitude=this.longitudeLatitude;
        // return console.log(obj);
        this.$store.dispatch('setClientInfo',obj);
        this.$router.push({name:'position',query:{type:1,...this.$route.query}})
      },
      showMsgFromChild (field, data) {
        this.form.forEach((v) => {
            if (v.field === field) {
            v.value = data
          }
        })
      },
      confirmMsgFromChild (action,field,arr){
        if(action==='confirm'){
          if(!arr.length) return;
          this.form.forEach((v,i) => {
            if (v.field === field){
              let tmp='',selected=[],val;
              if(arr.length>1){
                arr.forEach((v2,i2)=>{
                  selected.push(v2.index);
                });
              }else{
                selected= [arr[0].index];
              }

              if(v.selected.city){
                v.selected.data.forEach((v2,i2)=>{
                  if(i2==selected[0]){
                    tmp+=(v2.label.length>3?v2.label.substring(0,3):v2.label)+' ';
                    v2.sub.forEach((v3,i3)=>{
                      if(i3==selected[1]){
                        tmp+=(v3.label.length>3?v3.label.substring(0,3):v3.label)+' ';
                        v3.sub.forEach((v4,i4)=>{
                          if(i4==selected[2]){
                            tmp+=(v4.label.length>3?v4.label.substring(0,3):v4.label)+' ';
                            val=v4.id;
                          }
                        })
                      }
                    })
                  }
                });
              }else{
                v.selected.options[0].items.forEach((v2,i2)=>{
                  if(i2==selected[0]){
                    tmp+=v2.label;
                  }
                })
              }
              v.fill = tmp;
              if(arr.length>1){
                v.value = val;
              }else {
                v.value = arr[0].id;
              }
              v.selected.selected=selected;
              if(v.hook)v.hook(arr)
            }
          })
        }
      },
      handleDelete(){
        this.form.forEach(v=>{
          if(v.field=='mtId'){
            v.fill='';
            v.value='';
          }
        })
      },
      handleUpload(data,field,e){
        this.form.forEach(v=>{
          if(v.field=='mtId'){
            v.fill=data.url;
            v.value=data.id;
          }
        })
      },
      handleSubmit(){
        const id=this.$route.query.id;
        const canEdit=this.$route.query.canEdit;
        let data={},url,phone;
        if(canEdit==1){
          for(let v of this.form){
            if((v.value==''||v.value==null)&&v.require){
              this.$store.dispatch('changeTip',{txt: v.placeholder,isTip:true,time:time});
              return;
            }else{
              if(v.field=='areaId'){
                data[v.field]= v.value;
                data['provinceId']=v.value.toString().substring(0,2)+'0000';
                data['cityId']=v.value.toString().substring(0,4)+'00';
              }else if(v.field=='userTel'){
                if(!v.value.match(/^\d+$/)){
                  this.$store.dispatch('changeTip',{txt: '请输入正确电话号',isTip:true,time:time});
                  return;
                }
                data[v.field]= v.value;
              }else if(v.field=='contactValue1'||v.field=='contactValue2'){
                if(v.value!=''&&v.value!=null&&!v.value.match(/^\d+$/)){
                  this.$store.dispatch('changeTip',{txt: '请输入正确电话号',isTip:true,time:time});
                  return;
                }
                if(v.value) data[v.field]= v.value;

              }else{
                if(v.value) data[v.field]= v.value;
              }
            }
          }
          data.openId=this.openid;
          data.address=this.address;
          data.areaInfo=this.areaInfo;
          data.longitudeLatitude=this.longitudeLatitude;
          if(!this.address || !this.longitudeLatitude) return Toast('请采集地理位置');

          console.log(data)

          // return;

          if(id){
            data.id=id;
            url='/api/saler/customer/baseinfo/edit';
          }else{
            url='/api/saler/customer/baseinfo/add';
          }
          AjaxApi('/org/client/verifyUserTel', {tel: data.userTel, companyId: data.companyId ,orgId:data.id?data.id:''}, (data2)=>{
            if(data2.result && data2.data == 1){
              this.$store.dispatch('changeTip',{txt: data2.message,isTip:true,time:time});
            }else{
              if(this.clientCode){
                if((data.contactValue1!=''&&data.contactValue1!=null)&&(data.contactValue2!=''&&data.contactValue2!=null)){
                  AjaxApi('/org/client/verifyUserTel', {tel: data.contactValue1, companyId: data.companyId ,orgId:data.id}, (data3)=>{
                    if(data3.result && data3.data == 1) {
                      this.$store.dispatch('changeTip',{txt: data3.message,isTip:true,time:time});
                    }else{
                      AjaxApi('/org/client/verifyUserTel', {tel: data.contactValue2, companyId: data.companyId ,orgId:data.id}, (data4)=>{
                        if(data4.result && data4.data == 1) {
                          this.$store.dispatch('changeTip',{txt: data4.message,isTip:true,time:time});
                        }else{
                          Ajax(url, data, (data)=> {
                            if (data.result) {
                              this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time,cb:()=>{
                                window.history.go(-1);
                              }})
                            } else {
                              this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time});
                            }
                          });
                        }
                      })
                    }
                  })
                }else if((data.contactValue1!=''&&data.contactValue1!=null)&&(data.contactValue2==''||data.contactValue2==null)){
                  AjaxApi('/org/client/verifyUserTel', {tel: data.contactValue1, companyId: data.companyId ,orgId:data.id}, (data3)=>{
                    if(data3.result && data3.data == 1) {
                      this.$store.dispatch('changeTip',{txt: data3.message,isTip:true,time:time});
                    }else{
                      Ajax(url, data, (data)=> {
                        if (data.result) {
                          this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time,cb:()=>{
                             window.history.go(-1);
                          }})
                        }else{
                          this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time})
                        }
                      });
                    }
                  })
                }else if((data.contactValue1==''||data.contactValue1==null)&&(data.contactValue2!=''&&data.contactValue2!=null)){
                  AjaxApi('/org/client/verifyUserTel', {tel: data.contactValue2, companyId: data.companyId ,orgId:data.id}, (data3)=>{
                    if(data3.result && data3.data == 1) {
                      this.$store.dispatch('changeTip',{txt: data3.message,isTip:true,time:time})
                    }else{
                      Ajax(url, data, (data)=> {
                        if (data.result) {
                          this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time,cb:()=>{
                              window.history.go(-1);
                          }})
                        } else {
                          this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time})
                        }
                      })
                    }
                  })
                }else{
                  this.$store.dispatch('changeTip',{txt: '正在玩命处理中',isTip:true,loading:true});
                  Ajax(url, data, (data)=> {
                    if (data.result) {
                      this.$store.dispatch('changeTip',{txt: data.message,isTip:true,loading:false,time:time,cb:()=>{
                        window.history.go(-1);
                      }})
                    } else {
                      this.$store.dispatch('changeTip',{txt: data.message,isTip:true,loading:false,time:time})
                    }
                  });
                }
              }else{
                this.$store.dispatch('changeTip',{txt: '正在玩命处理中',isTip:true,loading:true});
                Ajax(url, data, (data)=> {
                  if (data.result) {
                    this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time,cb:()=>{
                      window.history.go(-1);
                    }})
                  }else{
                    this.$store.dispatch('changeTip',{txt: data.message,isTip:true,time:time})
                  }
                })
              }
            }
          })
        }else{
          window.history.go(-1);
        }
      }
    }
  }
</script>
<style scoped>
.add-map{
  border-bottom: 1px solid #f5f5f5;
}
.map-geo{
  color:#666;
  margin: .1rem 0;

}
.map-tit{
  position: relative;
}
.item-right{
  width: .09rem;
  height: .165rem;
  background: url(../../../static/images/clerk/icon/icon-enter.png) 50% 50% no-repeat;
  background-size: contain;
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  top:50%;
}
.icon-map{
  width: .26rem;
  vertical-align: middle;
  margin-right: .04rem;
}
.map-show{
  margin: .1rem 0;
}
</style>
