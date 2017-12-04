/*******
 @Version   :  1.0 开发版
 @Name      :  ZXJCALENDAR;
 @author    :  朱咸杰;
 @date      :  2013-9-12;
 @blog      :  http://www.memoryyour.com/
 @Copyright :  随心博客;
 @dom结构	:  <input type="text" value="" class="demo"/>
 @调用方法	:  $('.demo').zxjCanlendar();详细调用方法请看官网
 @功能		： 适合移动端日期选择，日期联动功能+1天，自动定位当前选定日期,不可以选择以前的日期 	
********/ 
;
void(function($) {
	var style = "<style type='text/css'>" +"#calendar_title{text-align:center;line-height:30px; clear:both;}" + "#calendar_title h3{display:inline-block; font-size:100%;}" + "#calendar_title a{display:inline-block; text-decoration:none; font-weight:bold;font-size:1.4em; color:#333; width:30px;}" + "#calendat_prve{ float:left;}" + "#calendat_next{ float:right;}" + "#calendar_box_warp{font-size:1.0em; font-family:Arial, Helvetica, sans-serif;width:100%; position:absolute;width:100%;background:#fff;z-index:99; top:-229px;left:0;}" + "#calendar_box{ border-collapse: collapse; border-spacing: 0;}" + "#calendar_box td,#calendar_box th{ line-height:30px;text-align:center;}" + "#calendar_box td b{ display:block;background:#09F; color:#fff;}" + "#calendar_box th{background:#999; color:#fff;}" + "#calendar_box td.notselect{background:#f0f0f0;}" + "#calendar_box a{-webkit-tap-highlight-color:rgb(0,170,0); -webkit-user-select: none;-moz-user-focus: none;-moz-user-select: none; text-decoration:none; display:block;color:#444;}" + ".zxj_color{background:#D6D6D6;}"+"</style>";
	document.write(style);
	var seVal=null;
	/*********插件核心代码************/
	var ZXJCALENDAR = function(elem, opts) {
		this.elem = elem;
		this.opts = opts;
		this.init(this.elem);
	}
	ZXJCALENDAR.prototype = {
		init: function(dom) {
			this.showZxjDate();
			this.fn();
		},
		config: {
			zxjDate: new Date(),
			year: new Date().getFullYear(),
			month: new Date().getMonth() + 1,
			day: new Date().getDate(),
			monthDay: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
		},
		//创建日历DOM
		createDOM: function(_year, _month) {
			var self = this;
			//渲染第一个日历
			var str = "<div id='calendar_box_warp' class='calendar_box_warp'>" + "<div id='calendar_title'><a href='javascript:;' id='calendat_prve'>&lt;</a><h3><b id='calendat_year'>" + _year + "</b>年<b id='calendat_month'>" + _month + "</b>月</h3><a href='javascript:;'  id='calendat_next'>&gt;</a></div>" + "<table id='calendar_box' border='1' bordercolor='#DDD' width='100%'>" + "<thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>" + "<tbody>" + self.getShowDay(_year, _month) + "</tbody>" + "</table>" + "</div>"
			return str;
		},
		//给日历文本框绑定事件
		showZxjDate: function() {
			var self = this;
			self.elem.attr("readonly", "readonly");
			//当前的实例
			var GetVal = new Array();
			var _year, _month;
			self.elem.bind('touchstart',
				function() {
					//self.elem.addClass("zxj_color");  后期开发
					$(".calendar_box_warp").remove();
					self.elem.parent().find("#calendar_box_warp").remove();
					if (self.elem.val()) {
						GetVal = self.elem.val().split('-');
						_year = parseInt(GetVal[0]);
						_month = parseInt(GetVal[1]);
					} else {
						_year = self.config.year;
						_month = self.config.month;
					}
					var str = self.createDOM(_year, _month);
					self.elem.closest("body").append(str); //初始渲染日历
					$("#calendar_box_warp").stop(true,true).animate({"top":0},300);
					var canlendarDom = self.elem.closest("body").find("#calendar_box_warp");
					self.changeMonth(canlendarDom); //切换日历
					self.selecteDate(canlendarDom);
				}).bind('touchstart',
				function(event) { //阻止touchstart事件冒泡
					event.stopPropagation();
				});
				
				self.hideCalendarBox();
		},
		//切换日历
		changeMonth: function(canlendarDom) {
			var self = this;
			var GetVal = new Array();
			var _year, _month;
			if (self.elem.val()) {
				GetVal = self.elem.val().split('-');
				_year = parseInt(GetVal[0]);
				_month = parseInt(GetVal[1]);
			} else {
				_year = self.config.year;
				_month = self.config.month;
			}
			canlendarDom.find('#calendat_prve').bind('touchstart',
			function(event) {
				event.stopPropagation(); //阻止touchstart事件冒泡
				--_month;
				if (_month < 1) {
					_month = 12;
					_year = _year - 1;
				}
				self.singleChange(_year, _month, canlendarDom);
			});
			canlendarDom.find('#calendat_next').bind('touchstart',
			function(event) {
				event.stopPropagation(); //阻止touchstart事件冒泡
				_month++;
				if (_month > 12) {
					_month = 1;
					_year = _year + 1;
				}
				var str = self.createDOM(_year, _month);
				self.singleChange(_year, _month, canlendarDom);
			});
		},
		//单日历切换后的渲染
		singleChange: function(_year, _month, $zxjBox) {
			var self = this;
			var newPrevMonth = this.getShowDay(_year, _month);
			$zxjBox.find("#calendat_year").text(_year);
			$zxjBox.find("#calendat_month").text(_month);
			$zxjBox.find("#calendar_box").find("tbody").html(newPrevMonth);
			
			self.selecteDate($zxjBox);
		},
		selecteDate: function($zxjBox) {
			var self = this;
			$zxjBox.find("#calendar_box").find("a").bind("touchstart",
			function() { //阻止touchstart事件冒泡
				var year = $zxjBox.find("#calendat_year").text();
				var month = $zxjBox.find("#calendat_month").text();
				var day = $(this).text();
				if(day>0&&day<10){day="0"+day.toString();}
				if(month>0&&month<10){month="0"+month.toString();}
				var dateVal = year + "-" + month + "-" + day;
				self.elem.val(dateVal);
				return false;
				if (self.opts.autoIn) { //自增一天
					seVal=self.elem.val();
					var newDate = new Date(new Date(year,month-1,day).valueOf() + 1 * 24 * 60 * 60 * 1000); // 日期加上指定的天数
					var newYear=newDate.getFullYear();
					var newMonth=newDate.getMonth()+1;
					var newDay=newDate.getDate()
					if(newDay>0&&newDay<10){
						var newDay="0"+newDay.toString();
					}
					if(newMonth>0&&newMonth<10){
						var newMonth="0"+newMonth.toString();
					}
					newDate = newYear + "-" + newMonth + "-" + newDay;
					self.opts.autoIn.val(newDate);
					return false;
				}
				$zxjBox.stop(true,true).animate({"top":-229},300,function(){$zxjBox.remove();});
				self.elem.blur();//焦点重置
			});
			$zxjBox.bind('touchstart',
			function(event) {
				event.stopPropagation(); //阻止touchstart事件冒泡
			});
		},
		hideCalendarBox: function($zxjBox) { //点击空白区域隐藏日历	
			/*$(document).bind("touchstart",function(event) {
				$(".calendar_box_warp").stop(true,true).animate({"top":-229},300,function(){$zxjBox.remove();});
			});*/
		},
		//----------------------------日历算法--------------------------//
		//综合调用显示天数的方法
		getShowDay: function(year, month) {
			var str = '';
			//当月多少天
			var dayNumber = this.GetMoDay(year, month);
			//当月第一天星期
			var firstWeek = this.WeekNum(year, month, 1);
			//当天最后一天星期
			var lastWeek = this.WeekNum(year, month, dayNumber);
			//获取周数
			var week = (dayNumber - (7 - firstWeek) - (lastWeek + 1)) / 7;
			str = this.GetDay(firstWeek, dayNumber, week, lastWeek, month, year);
			return str;
		},
		GetMoDay: function(y, m) { //给定年月获取当月天数
			var self = this;
			self.config.monthDay[1] = 28;
			if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) //判断是否是闰月 
			self.config.monthDay[1] = 29;
			return self.config.monthDay[m - 1];
		},
		WeekNum: function(y, m, d) { //获取对应日期星期几 0=>星期天 1=>星期一
			var self = this;
			var week;
			if (m <= 12 && m >= 1) {
				for (var i = 1; i < m; ++i) {
					d += self.GetMoDay(y, i);
				}
			}
			week = (y - 1 + (y - 1) / 4 - (y - 1) / 100 + (y - 1) / 400 + d) % 7;
			return parseInt(week);
		},
		GetDay: function(firstnum, daynum, weeknum, lastnum ,mmonth,yyear) { //日期HTMl结构
			var self = this;
			//除去第一个星期和最后一个星期
			var oneDay = 1;
			var nowDay, nowMonth, nowYear; //当前日期
			var allDay = new Array();
			var html = "";
			if(self.elem.val()){
				GetVal = self.elem.val().split('-');
				nowYear = GetVal[0];
				nowMonth = GetVal[1];
				nowDay = GetVal[2];	
			}else{
				nowDay = self.config.day;
				nowMonth = self.config.month;
				nowYear = self.config.year;	
			}	
			for (var i = 0; i < firstnum; i++) //第一个星期前面没有的天数
			{
				allDay.push("<td class='notselect'>&nbsp;</td>");
			}
			for (var i = firstnum; i < 7; i++) //第一个星期
			{	

				if (oneDay == nowDay && mmonth == nowMonth && nowYear == yyear) {
					nowDay = "<b>" + oneDay + "</b>";
					allDay.push("<td><a href='javascript:;'>" + nowDay + "</a></td>");
				} else if (oneDay < self.config.day && mmonth == nowMonth && nowYear == yyear) {
					allDay.push("<td class='notselect'>" + oneDay + "</a></td>");
				} else if (mmonth < nowMonth && nowYear == yyear) {
					allDay.push("<td class='notselect'>" + oneDay + "</a></td>");
				} else if (yyear < nowYear) {
					allDay.push("<td class='notselect'>" + oneDay + "</td>");
				} else {
					allDay.push("<td><a href='javascript:;'>" + oneDay + "</a></td>");
				}
				oneDay++;
			}
			for (var i = 0; i < weeknum; i++) //中间的星期
			{
				for (var j = daynum - (7 - firstnum) - (weeknum - 1) * 7; j < daynum - (7 - firstnum) - (weeknum - 1) * 7 + 7; j++) {
					if (oneDay == nowDay && mmonth == nowMonth && nowYear == yyear) {
						nowDay = "<b>" + oneDay + "</b>";
						allDay.push("<td><a href='javascript:;'>" + nowDay + "</a></td>");
					} else if (oneDay < self.config.day && mmonth == nowMonth && nowYear == yyear) {
						allDay.push("<td class='notselect'>" + oneDay + "</td>");
					} else if (mmonth < nowMonth && nowYear == yyear) {
						allDay.push("<td class='notselect'>" + oneDay + "</a></td>");
					} else if (yyear < nowYear) {
						allDay.push("<td class='notselect'>" + oneDay + "</td>");
					} else {
						allDay.push("<td><a href='javascript:;'>" + oneDay + "</a></td>");
					}
					oneDay++;
				}
			}
			for (var i = 0; i < lastnum + 1; i++) //最后一个星期
			{
				if (oneDay == nowDay && mmonth == nowMonth && nowYear == yyear) {
					nowDay = "<b>" + oneDay + "</b>";
					allDay.push("<td><a href='javascript:;'>" + nowDay + "</a></td>");
				} else if (oneDay < self.config.day && mmonth == nowMonth && nowYear == yyear) {
					allDay.push("<td class='notselect'>" + oneDay + "</td>");
				} else if (mmonth < nowMonth && nowYear == yyear) {
					allDay.push("<td class='notselect'>" + oneDay + "</a></td>");
				} else if (yyear < nowYear) {
					allDay.push("<td class='notselect'>" + oneDay + "</td>");
				} else {
					allDay.push("<td><a href='javascript:;'>" + oneDay + "</a></td>");
				}
				oneDay++;
			}
			for (var i = lastnum + 1; i < 7; i++) { //最后一个星期没有的天数
				allDay.push("<td class='notselect'>&nbsp;</td>");
			}
			for (var i = 0,
			len = allDay.length; i < len; i++) {
				if (i % 7 == 0) {
					allDay[i] = "<tr>" + allDay[i];
				} else if (i % 7 == 6) {
					allDay[i] = allDay[i] + "</tr>";
				}
				html += allDay[i];
			}
			return html;
		},
		//---------------------回调函数------------------------------------------//
		fn: function() {
			if (this.opts.fn) {
				this.opts.fn();
			}
		}
	}
	$.extend($.fn, {
		zxjCanlendar: function(setting) {
			var opts = $.extend({},
			$.fn.zxjCanlendar.defaults, setting);
			return this.each(function() {
				new ZXJCALENDAR($(this), opts);
			})
		}
	});
	$.fn.zxjCanlendar.defaults = {
		autoIn: null,
		fn: function() {}
	}
})(jQuery)