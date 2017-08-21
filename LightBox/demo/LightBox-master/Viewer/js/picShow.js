;
(function($, document, window, undefined) {
    var PicShow = function(options) {
        this.default = {
            'singlePicWidth': 100, // 每个小图的总宽度
            'picTop': -200, // 展示大图片的开始下落高度
            'fadeIntime': 100, // 图片下落的时间 
        };
        this.settings = $.extend({}, this.default, options);
        this.renderDom();
        var ele,
            $that = this;
        // 给图片注册事件
        $('.imgList').on('click', 'img', function() {
            ele = $(this);
            $that.$currentThis = $(this);
            $that.imgId = ele.data('id');
            $that.init();
        })
        this.imgList = $('.imgList');
        this.mask = $('.mask'); // 遮罩层
        this.popup = $('.popup'); // 弹出层
        this.nowPic = $('.current-pic img'); // 当前显示的大图
        this.picList = $('.pic-list');
        this.prev = $('#prev');
        this.next = $('#next');
        this.closeBtn = $('#close');
    };
    PicShow.prototype = {
        /**
         * [init 初始化函数]
         * @return {[type]} [description]
         */
        init: function() {
            this.popupShow();
            this.allEvent();
            this.currentPic();
        },
        baseCss: function() {},
        /**
         * [popupShow 显示 遮罩层与弹出层]
         * @return {[void]} [description]
         */
        popupShow: function() {
            var $that = this;
            this.mask.fadeIn(this.settings.fadeIntime, function() {
                $that.nowPic.css({
                    top: $that.settings.picTop,
                    opacity: 0
                }).animate({ 'top': 0, 'opacity': 1 }, 'slow');
            });
            this.popup.fadeIn(1000);
        },
        /**
         * [popupHide 隐藏 遮罩层与弹出层]
         * @return {[void]} [description]
         */
        popupHide: function() {
            this.popup.fadeOut('fast');
            this.mask.fadeOut('slow');
        },

        /**
         * [picChange 改变当前显示的大图片]
         * @param  {[type]} currentLeft [当前显示图片在picList的left值]
         * @param  {[type]} picWidth    [每张小图片的总宽度]
         * @return {[type]}             [void]
         */
        picChange: function(currentLeft, picWidth) {
            $that = this;
            // 判断前面是否还有动画
            if ($that.picList.is(':animated')) {
                return;
            }
            $that.picList.animate({ 'left': currentLeft + picWidth }, function() {
                var dataId = 0;
                if (picWidth > 0) {
                    dataId = $that.nowPic.data('id') - 1;
                } else {
                    dataId = $that.nowPic.data('id') + 1;
                }
                // debugger;
                // 下边小图片显示
                var activePic = $that.picList.find('img[data-id=' + dataId + ']');
                // 当前图片active,其它图片remove active
                activePic.addClass('active')
                    .siblings().removeClass('active');
                // 设置当前展示的图片的data-id
                $that.nowPic.data('id', dataId);
                // 给当前图片增加动画效果
                $that.nowPic.attr('src', activePic.attr('src')).hide().fadeIn('slow');
            });
        },
        /**
         * [allEvent 遮罩层的所有事件]
         * @return {[void]} [无返回值]
         */
        allEvent: function() {
            var $that = this,
                imglength = $that.picList.find('img').length * $that.settings.singlePicWidth;

            // mask中关闭按钮
            this.closeBtn.on('click', function() {
                $that.popupHide();
            });
            // 右箭头按钮添加事件
            this.next.on('click', function() {
                var currentLeft = parseInt($that.picList.css('left'));
                // 右击应满足的条件
                if (Math.abs(currentLeft) < (imglength - $that.settings.singlePicWidth)) {
                    $that.picChange(currentLeft, -$that.settings.singlePicWidth);
                } else {
                    return;
                }
            });
            // 左箭头按钮添加事件
            this.prev.on('click', function() {
                var currentLeft = parseInt($that.picList.css('left'));
                // 左击应满足的条件
                if (Math.abs(currentLeft) > 0) {
                    console.log('prev');
                    $that.picChange(currentLeft, $that.settings.singlePicWidth);
                } else {
                    return;
                }
            });
            // 点击小图片，随意切换
            this.picList.on('click', 'img', function() {
                $(this).addClass('active').siblings().removeClass('active');
                $that.picList.css({ 'left': -parseInt($(this).data('id')) * $that.settings.singlePicWidth });
                $that.nowPic.attr('src', $(this).attr('src')).hide().fadeIn();
                $that.nowPic.data('id', $(this).data('id'));
            });
        },
        /**
         * [currentPic 当前显示的大图片]
         * @return {[type]} [description]
         */
        currentPic: function() {
            var currentSrc = this.$currentThis.attr('src'),
                dataId = this.$currentThis.data('id');
            // 设置currentPic的id
            this.nowPic.data('id', dataId);
            // 设置currentPic的src
            this.nowPic.attr('src', currentSrc);
            // 根据data-id找出当前显示的pic
            var activePic = this.picList.find('img[data-id=' + dataId + ']');
            // 当前图片active,其它图片remove active
            activePic.addClass('active')
                .siblings().removeClass('active');
            this.picList.css({ 'left': -parseInt(dataId) * this.settings.singlePicWidth });
        },
        /**
         * [renderDom 渲染基本dom树]
         * @return {[type]} [description]
         */
        renderDom: function() {
            var $that = this,
                html = '';
            var picSrc = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg',
                'images/4.jpg', 'images/5.jpg', 'images/1-6.jpg', 'images/1-7.jpg', 'images/1-8.jpg',
            ];
            var html = '<div class="mask"></div>' +
                '<div class="popup">' +
                '<div class="current-pic"><img src="' + picSrc[0] + '"></div>' +
                '<div class="pic-container">' +
                '<div class="pic-list">';
            $.each(picSrc, function(index, val) {
                html += '<img src="' + val + '" alt="1" data-id="' + index + '" />';
            });
            html += '</div></div>' +
                '<span id="prev" class="arrow">&lt;</span>' +
                '<span id="next" class="arrow">&gt;</span>' +
                '<span id="close" class="close-btn"></span>' +
                '</div>';
            $('body').append(html);
        }
    };
    /**
     * [picShow 给jQuery添加插件方法]
     * @return {[type]} [description]
     */
    $.fn.picShow = function() {
        return new PicShow();
    };

})(jQuery, document, window);
