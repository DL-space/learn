const data = [];
    for(let i=1970;i<2021;i++){
        let tmp=[];
        for(let j=1;j<13;j++){
            let tmp2=[];
            if(j==1||j==3||j==5||j==7||j==8||j==10||j==12){
                for(let k=1;k<32;k++){
                    tmp2.push({name:k,code:k});
                }
            }else{
                if(j==2){
                    let cond1 = i % 4 == 0,cond2 = i % 100 != 0,cond3 = i % 400 ==0;  //条件3：年份是400的倍数
                    //当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
                    //如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
                    //所以得出判断闰年的表达式：
                    let cond = cond1 && cond2 || cond3;
                    if(cond) {
                        for(let k=1;k<30;k++){
                            tmp2.push({name:k,code:k});
                        }
                    } else {
                        for(let k=1;k<29;k++){
                            tmp2.push({name:k,code:k});
                        }
                    }
                }else{
                    for(let k=1;k<31;k++){
                        tmp2.push({name:k,code:k});
                    }
                }

            }

            tmp.push({name:j,code:j,sub:tmp2});
        }
        data.push({name:i,code:i,sub:tmp});
    };
export default data;