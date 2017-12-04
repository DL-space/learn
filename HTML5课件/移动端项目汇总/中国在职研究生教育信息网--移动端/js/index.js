

//城市切换北京广州上海
function title_tab(){
	var oDiv = document.getElementById('s_tab');
	var oA = oDiv.children[0].children[1].getElementsByTagName('a');
	var oDivt=document.getElementById('tab').getElementsByTagName('div');
	for(var i=0;i<oA.length;i++){
		oA[i].index = i;
		oA[i].onclick = function(){
			for(var i=0;i<oA.length;i++){
				oA[i].className = '';
				oDivt[i].className = 's_tab_content hide';

			}
			this.className = 's_blue';
			oDivt[this.index].className = "s_tab_content show";
		}
	}
}

// 文字滚动的切换代码
function marq(){
	var oBox2 = document.getElementById('box2');
	var oUlone  = oBox2.children[0];
	var oLione = oUlone.children;
	//增加一倍内容
	oUlone.innerHTML+= oUlone.innerHTML;
	oUlone.style.width = oLione[0].offsetWidth*oLione.length+'px';
	var timer2=null;
	function  next2(){

	         var l=oUlone.offsetLeft;

	        l-=3;

	       if(l<=-oUlone.offsetWidth/2){
	            l=0;
	       }
	       oUlone.style.left = l+'px';

	                  }


	  clearInterval(timer2);
	  timer2=setInterval(next2,30);
}


// 模拟select代码
function select(){
	var oSelect=document.getElementById('c_select');
	var oSelectTop=document.getElementById('c_select_top')
	var oText=oSelectTop.getElementsByTagName('h4')[0];
	var oListBox=oSelect.getElementsByTagName('ul')[0];
	var oList=oSelect.getElementsByTagName('li');
	oSelectTop.onclick=function(){
		oListBox.style.display='block';
	}
	for(var i=0;i<oList.length;i++){
		oList[i].onclick=function(){
			oText.innerHTML=this.innerHTML;
			oListBox.style.display='none';
		}
	}
}


// 获取非行间样式
function getStyle(obj,name){
	if(obj.currentStyle){
		return obj.currentStyle[name];
	}else{
		return getComputedStyle(obj,false)[name];
	}
}

// 运动框架
function startMove(obj,json,fn){
	clearInterval(obj.timer);		//定时器先清后开
	
	
	
	obj.timer=setInterval(function(){	
		var bStop=true;		//用于检测每项运动是否完成


		for(var attr in json){
			var cur=0;

			if(attr=='opacity'){			//获取现有样式，不透明度和其他样式分开
				cur=Math.round(parseFloat(getStyle(obj,attr))*100);
			}else{
				cur=parseInt(getStyle(obj,attr));
			}	

			var iSpeed=(json[attr]-cur)/6;			//缓冲运动计算速度
			iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);		//判断向上或向下取整


			if(cur!=json[attr]){		//若每次循环有未达到目标的项目，设置为false
				bStop=false;

			}


				cur+=iSpeed;					//物体运动函数
				if(attr=='opacity'){
					obj.style.filter='alpha(opacity='+cur+')'
					obj.style.opacity=cur/100;
					document.title=cur;
				}else{
					obj.style[attr]=cur+'px';
				}
			
		}

		if(bStop==true){			//当bStop为true时才结束循环
			clearInterval(obj.timer);
			if(fn){fn();}		//链式运动函数
		}
		
	},30)
}


// 焦点图
function wapPic(id1,id2,id3){
			var oBox=document.getElementById(id1);			//大容器id
			var oPicBox=document.getElementById(id2);		//图片容器id
			var numBox=document.getElementById(id3);		//索引容器id
			var oPic=oPicBox.getElementsByTagName('li');
			var numLi=numBox.getElementsByTagName('li');

			var oWidth=oPic[0].offsetWidth;			//获取图片宽度
			var oHeight=oPic[0].offsetHeight;		//获取图片高度

			var img=oPicBox.children;				

			var now=0;		//索引值


			//运动函数
			function tab(){				
				startMove(oPicBox,{'left':-now*320});		//运动框架
				for(var i=0;i<img.length;i++){
	    			numLi[i].className='';
	    		}
				numLi[now].className='on';
			}


			//大容器宽度自适应为一个图片宽度，图片自适应屏幕
			// oBox.style.width='320px';

			//图片容器宽度为所有图片宽度之和						
			oPicBox.style.width=320*oPic.length+'px';

			//设置图片宽度为图片盒子宽度的xx%
			// for(var i=0;i<oPic.length;i++){
			// 	img[i].style.width=parseInt(100/oPic.length)+'%';
			// 	var n=parseInt(100/oPic.length);
			// }

			numBox.style.marginLeft=-parseInt(numBox.offsetWidth/2)+'px';

			// img[oPic.length-1].style.width=n+100%n+'%';

			var oldX=0;		//手指触摸屏幕坐标
			var disX=0;		//手指触摸屏幕坐标到图片容器左边缘间的距离
			var newX=0;		//手指离开屏幕坐标
			var moveX=0;	//图片被拖拽时的left值


			oPicBox.addEventListener("touchstart",function(){
		        oldX = event.targetTouches[0].screenX;
		        disX= event.targetTouches[0].screenX-oPicBox.offsetLeft;

		        oPicBox.addEventListener("touchmove",function() {
			        event.preventDefault();		//阻止触摸时浏览器的缩放、滚动条滚动
			        newX = event.targetTouches[0].screenX;
			        moveX=event.targetTouches[0].screenX - disX;

			        oPicBox.style.left=moveX+'px';

			    }, false);

		    }, false);

		    oPicBox.addEventListener("touchend",function(){

				        if(newX-oldX<0){		//手指向左，图片向右
			        		now++;
			        		if(now>=img.length){now=0}
				        	tab();

				        }else{					//手指向右，图片向左
							now--;
				        	if(now<=-1){now=img.length-1}
				        	tab();
				        }
				       
				    }, false);
}
      


