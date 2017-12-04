// 选择位置弹出框函数
//btn为点击的按钮，box为显示隐藏的弹出层，cont为包含省份的内容区域，tag为内容的标签
function localpop(btn,box,cont,tag){
	var oLocalBtn=document.getElementsByClassName(btn)[0];
	var oLocalCont=document.getElementsByClassName(box)[0];
	oLocalBtn.onclick=function(ev){
		if(oLocalCont.style.display!='block'){
			
			var oAll=oLocalCont.parentNode.children;
			for(var i=0;i<oAll.length;i++){
				if(oAll[i].tagName.toLowerCase()=='div'){
					oAll[i].style.display='none';
				}
			}

			oLocalCont.style.display='block';

		}else{
			oLocalCont.style.display='none';
		}
	}


	var oLocalBox=document.getElementsByClassName(cont)[0];
	var oLocalInner=oLocalBox.getElementsByTagName(tag);
	oLocalBox.onclick=function(ev){
		var oEvent=ev || event;
		var target=oEvent.srcElement || oEvent.target;
		oLocalBtn.innerHTML=target.innerHTML+' ▼';
		oLocalCont.style.display='none';	
	}
	
}


// 我要存款页面选项卡函数
function mapTab(btn,cont){
	var oBtnBox=document.getElementsByClassName(btn)[0];
	var oBtn=oBtnBox.getElementsByTagName('a');
	var oMapCont=document.getElementsByClassName(cont);
	for(var i=0;i<oBtn.length;i++){
		oBtn[i].index=i;
		oBtn[i].onclick=function(){
			for(var i=0;i<oBtn.length;i++){
				oBtn[i].className='';
				oMapCont[i].style.display='none';
			}
			this.className='active';
			oMapCont[this.index].style.display='block';
		}
	}
}



// 表单验证函数
function checkInput(box,fnCheck){

	var oInputBox=document.getElementsByClassName(box)[0];
	var oInput=oInputBox.getElementsByClassName('js_input');
	var ok=true;


	var json={
		email:/^\w[\w|\.]*@[0-9a-z\-]+(\.[0-9a-z]{2,4}){1,2}$/,
		mobile:/^1[3-8]\d{9}$/,
		tel:/(0[1-9]\d{1,2}-?)?[1-9]\d{6,7}/,
		pass:/[0-9a-zA-Z]{6,12}/,
		pass2:/[0-9a-zA-Z]{6,12}/,
		name:/[\u4e00-\u9fa5]{2,6}/,
		empty:/.+/,
		money:/[1-9]\d+/
	};

	var tip={
		emailTip:'请输入正确的邮箱地址',
		mobileTip:'请输入正确的11位手机号',
		telTip:'请输入7~8位有效电话号码，可加区号',
		passTip:'请输入6~12位有效密码',
		pass2Tip:'请再次输入相同密码',
		nameTip:'请输入2~6位的中文名',
		emptyTip:'内容不能为空',
		moneyTip:'请填写有效的金额'


	};

	function check(oTxt,re){
		var next=oTxt.nextElementSibling || oTxt.nextSibling;
		if(next.className.toLowerCase()!='cb_input_tip'){
			next=next.nextElementSibling || next.nextSibling;
		}
		if(re.test(oTxt.value)){
			if(!fnCheck){

				next.style.display='none';
				return true;
			}else{
				if(fnCheck(oTxt)==false){

					var tp=tip[oTxt.getAttribute('datavalue')+'Tip'];
					next.style.display='block';
					next.innerHTML=tp;
					return false;
				}else{

					next.style.display='none';
					return true;
				}
			}
		}else{

			var tp=tip[oTxt.getAttribute('datavalue')+'Tip'];
			next.style.display='block';
			next.innerHTML=tp;
			return false;
		}
	}


	for(var i=0;i<oInput.length;i++){
		var re=json[oInput[i].getAttribute('datavalue')];
		if(re){
			(function (re){
				oInput[i].onblur=function(){
					check(this,re);
				}
				})(re);
		}
	}

	oInputBox.onsubmit=function(){
		for(var i=0;i<oInput.length;i++){
			var re=json[oInput[i].getAttribute('datavalue')];
			if(re){
				if(check(oInput[i],re)==false){
					ok=false;
					var next=oInput[i].nextElementSibling || oInput[i].nextSibling;
					if(next.className.toLowerCase()!='cb_input_tip'){
						next=next.nextElementSibling || next.nextSibling;
					}
					var tp=tip[oInput[i].getAttribute('datavalue')+'Tip'];
					next.style.display='block';
					next.innerHTML=tp;
				}
			}
		}

		if(ok==false){
			return false;
		}


	}
}



// 百度地图
function baiduMap(){
	// 百度地图API功能初始化
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,14);	//后面的数字指地图缩放大小，数字越大地图越精确，显示范围越小


	var geolocation = new BMap.Geolocation();		//html5定位，根据gps(或者IP)确定当前位置的函数
	geolocation.getCurrentPosition(function(r){

	    if(this.getStatus() == BMAP_STATUS_SUCCESS){
	        var mk = new BMap.Marker(r.point);
	        map.addOverlay(mk);
	        map.panTo(r.point);

	        var x=r.point.lng;		//纬度
	        var y=r.point.lat;		//经度

	        // 根据经纬度解析当前位置地址，储存在str中方便调用
	        var myGeo = new BMap.Geocoder();
			myGeo.getLocation(new BMap.Point(x, y), function(result){ 
				if (result){ 

					var str=result.address;
					document.getElementById('cb_map_location').innerHTML=str;

					var local = new BMap.LocalSearch(map, {
					  renderOptions:{map: map, autoViewport:true}
					});
					local.searchNearby('银行', str);	//在当前位置周边进行搜索

				} 
			});

	    }
	    else {
	        alert('failed'+this.getStatus());
	    }        
	},{enableHighAccuracy: true});


	var oMapCont=document.getElementsByClassName('cb_map_container')[0];
	var oMapBtn=document.getElementById('cb_map_full_btn');
	var oMap=document.getElementById('allmap');

	oMapBtn.onclick=function(){
		if(this.innerHTML=='进入地图'){
			oMapCont.style.height='500px';
			oMapCont.style.position='fixed';
			this.innerHTML='退出全屏';
			oMap.style.height='100%';
		}else{
			oMapCont.style.height='175px';
			oMapCont.style.position='relative';
			this.innerHTML='进入地图';
			oMap.style.height='85%';
		}
	}

}



