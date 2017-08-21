/**
 * Created by DL on 2017/6/19.
 */
;(function () {
    var LightBox = function () {
        var self = this;
        console.log(this);
        //创建遮罩和弹框
        this.popupMask = $('<div id="G-lightbox-mask">');
        this.popupWin = $('<div id="G-lightbox-popup">');
        //保存body
        this.bodyNode = $(document.body);
        //渲染剩余DOM并插入到body
        this.renderDom();
        //获取相关元素
        this.picViewArea = this.popupWin.find("div.lightbox-pic-view");//图片预览区
        this.popupPic = this.popupWin.find("img.lightbox-image");//图片
        this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");//图片描述区域
        this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
        this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");
        this.captionText = this.popupWin.find("p.lightbox-pic-desc");//图片描述
        this.currentIndex = this.popupWin.find("span.lightbox-of-index");//当前索引
        this.closeBtn = this.popupWin.find("span.lightbox-close-btn");//关闭按钮
        //准备开发事件委托，获取组数据
        this.groupName = null;
        this.groupData = [];//放置同一组数据
        this.bodyNode.delegate(".js-lightbox,*[dtat-role=lightbox]","click",function (e) {
            //阻止冒泡
            e.stopPropagation();
            var currentGroupName = $(this).attr("data-group");
            if(currentGroupName != self.groupName){
                self.groupName = currentGroupName;
                //根据当前组名获取同一组数据
                self.getGroup();
            }
            //初始化弹窗
            self.initPopup($(this));
        });
        //关闭
        this.popupMask.click(function () {
            $(this).fadeOut();
            self.popupWin.fadeOut();
        });
        this.closeBtn.click(function () {
            self.popupMask.fadeOut();
            self.popupWin.fadeOut();
        });
        //切换按钮事件
        this.flag = true;
        this.nextBtn.hover(function () {
            if(!$(this).hasClass("disabled") && self.groupData.length>1){
                $(this).addClass("lightbox-next-btn-show");
            }
        },function () {
            if(!$(this).hasClass("disabled") && self.groupData.length>1){
                $(this).removeClass("lightbox-next-btn-show");
            }
        }).click(function (e) {
            if(!$(this).hasClass("disabled" && self.flag)){
                self.flag = false;
                e.stopPropagation();
                self.goto("next");
            }
        });
        this.prevBtn.hover(function () {
            if(!$(this).hasClass("disabled") && self.groupData.length>1){
                $(this).addClass("lightbox-prev-btn-show");
            }
        },function () {
            if(!$(this).hasClass("disabled") && self.groupData.length>1){
                $(this).removeClass("lightbox-prev-btn-show");
            }
        }).click(function (e) {
            if(!$(this).hasClass("disabled" && self.flag)){
                self.flag = false;
                e.stopPropagation();
                self.goto("prev");
            }
        });
    };
    LightBox.prototype = {
        showMaskAndPopup:function (sourceSrc,sourceId) {
            var self = this;
            console.log(self)
            console.log(this)
            this.popupPic.hide();
            this.picCaptionArea.hide();

            this.popupMask.fadeIn();

            var winWidth = $(window).width();
            var winHeight = $(window).height();

            this.picViewArea.css({
                width:winWidth/2,
                height:winHeight/2
            });

            this.popupWin.fadeIn();

            var viewHeight = winHeight/2+10;
            var viewWidth = winWidth/2+10;
            this.popupWin.css({
                width:winWidth/2+10,
                height:winHeight/2+10,
                marginLeft:-viewWidth/2,
                top:-viewHeight
            }).animate({
                          top:(winHeight-viewHeight)/2
                        },function () {
                            //加载图片
                            self.loadPicSize(sourceSrc);
                        });
            //根据当前点击的元素id获取在当前组别的索引
            this.index = this.getIndexOf(sourceId);
            var groupDataLength = this.groupData.length;
            if(groupDataLength>1){
                if(this.index === 0){
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }else if(this.index === groupDataLength-1){
                    this.prevBtn.removeClass("disabled");
                    this.nextBtn.addClass("disabled");
                }else{
                    this.prevBtn.removeClass("disabled");
                    this.nextBtn.removeClass("disabled");
                }
            }
        },
        goto:function (dir) {
            if(dir === "next"){
                this.index++;
                if(this.index >= this.groupData.length-1){
                    this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
                }
                if(this.index != 0 ){
                    this.prevBtn.removeClass("disabled");
                }
                var src = this.groupData[this.index].src;
                this.loadPicSize(src);
            }else if(dir === "prev"){
                this.index--;
                if(this.index <= 0){
                    this.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
                }
                if(this.index != this.groupData.length-1 ){
                    this.nextBtn.removeClass("disabled");
                }
                var src = this.groupData[this.index].src;
                this.loadPicSize(src);
            }
        },
        loadPicSize:function (sourceSrc) {
            var self = this;
            console.log(this);
            self.popupPic.css({ width: 'auto', height: 'auto' }).hide(); //每次要把上次的宽高清空
            this.picCaptionArea.hide(); //切换图片时，图片未加载完成，下面的文字先隐藏
            this.preLoadImg(sourceSrc,function () {//回调函数
                self.popupPic.attr("src",sourceSrc);
                var picWidth = self.popupPic.width();
                var picHeight = self.popupPic.height();
                console.log(picWidth);
                self.changePic(picWidth,picHeight);
            });
            //设置描述文字和当前索引
            this.captionText.text(this.groupData[this.index].caption);
            this.currentIndex.text("当前索引："+(this.index+1+" of "+this.groupData.length));
        },
        changePic:function (width,height) {
            var self = this;
            var winWidth = $(window).width();
            var winHeight = $(window).height();
            //如果图片宽高大于浏览器视口的宽高比例，看下是否溢出
            var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

            width = width * scale;
            height = height * scale;

            this.picViewArea.animate({
                width:width-10,
                height:height-10
            });

            this.popupWin.animate({
                width:width,
                height:height,
                marginLeft:-width/2,
                top:(winHeight-height)/2
            },function () {
                console.log(self);
                console.log(this);
                self.popupPic.css({
                    width:width-10,
                    height:height-10
                }).fadeIn();
                self.picCaptionArea.fadeIn();
                self.flag = true;
            });
        },
        preLoadImg:function (src,callback) {
            var img = new Image();
            if(!!window.ActiveXObject){
                img.onreadystatechange = function () {
                    if(this.readyState == "complete"){
                        callback();//此处有回调
                    }
                }
            }else{
                img.onload = function () {
                    callback();
                }
            }
            img.src = src;
        },
        getIndexOf:function (sourceId) {
            var index = 0;

            $(this.groupData).each(function (i) {
                index = i;
                if(this.id === sourceId){
                    return false;
                }
            });

            return index;
        },
        initPopup:function (currentObj) {
            //var self = this;
            var sourceSrc = currentObj.attr("data-source");
            var sourceId = currentObj.attr("data-id");
            this.showMaskAndPopup(sourceSrc,sourceId);
        },
        getGroup:function () {
            var self = this;
            //根据当前组别获取页面中所有相同组别对象
            var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");
            //清空数组
            self.groupData.length = 0;
            groupList.each(function () {
                self.groupData.push({
                    src:$(this).attr("data-source"),
                    id:$(this).attr("data-id"),
                    caption:$(this).attr("data-caption")
                });
            });
        },
        renderDom:function () {
           var strDOM ='<div class="lightbox-pic-view">'
                            +'<span class="lightbox-btn lightbox-prev-btn"></span>'
                            +'<img class="lightbox-image" src="" alt="">'
                            +'<span class="lightbox-btn lightbox-next-btn"></span>'
                        +'</div>'
                        +'<div class="lightbox-pic-caption">'
                            +'<div class="lightbox-caption-area">'
                                +'<p class="lightbox-pic-desc"></p>'
                                +'<span class="lightbox-of-index">当前索引：0of0</span>'
                            +'</div>'
                            +'<span class="lightbox-close-btn"></span>'
                        +'</div>';
            //插入到this.popupWin
            this.popupWin.html(strDOM);
            //把遮罩和弹出框插入到body
            this.bodyNode.append(this.popupMask,this.popupWin);
        }
    };
    window["LightBox"] = LightBox;
})(jQuery);