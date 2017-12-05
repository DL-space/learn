var Dpr=1, uAgent=window.navigator.userAgent;
        var isIOS=uAgent.match(/iphone/i),isYIXIN = uAgent.match(/yixin/i),is2345 = uAgent.match(/Mb2345/i),ishaosou = uAgent.match(/mso_app/i),isSogou = uAgent.match(/sogoumobilebrowser/ig),isLiebao = uAgent.match(/liebaofast/i),isGnbr = uAgent.match(/GNBR/i);
        function resizeRoot(){
            var wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width : window.innerWidth : window.innerWidth, wDpr, wFsize;
            var wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight;
            if (window.devicePixelRatio) {
                wDpr = window.devicePixelRatio;
            } else {
                wDpr = isIOS ? wWidth > 818 ? 3 : wWidth > 480 ? 2 : 1 : 1;
            }
            if(isIOS) {
                wWidth = screen.width;
                wHeight = screen.height;
            }
            if(wWidth > wHeight){
                wWidth = wHeight;
            }
            wFsize = wWidth > 1080 ? 144 : wWidth / 7.5;
            wFsize = wFsize > 32 ? wFsize : 32;
            window.screenWidth_ = wWidth;
            if(isYIXIN || is2345 || ishaosou || isSogou || isLiebao || isGnbr){
                setTimeout(function(){
                    wWidth = (screen.width > 0) ? (window.innerWidth >= screen.width || window.innerWidth == 0) ? screen.width : window.innerWidth : window.innerWidth;
                    wHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight;
                    wFsize = wWidth > 1080 ? 144 : wWidth / 7.5;
                    wFsize = wFsize > 32 ? wFsize : 32;
                    document.getElementsByTagName('html')[0].style.fontSize = wFsize*2 + 'px';
                },500);
            }else{
                document.getElementsByTagName('html')[0].style.fontSize = wFsize*2 + 'px';
            }
        }
        resizeRoot();
