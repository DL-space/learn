// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var os = require('os')
var ip = localIp('en0')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    config:{
      api_url:'http://b.wl.motorsc.com/wechat',
      api_api_url:'http://b.wl.motorsc.com/logis_api',
      map_key:'73984b981b734d4e04b562724156d33e'
    }
  },
  test: {
    env: require('./test.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    config:{
      api_url:'http://a.wl.motorsc.com/wechat',
      api_api_url:'http://a.wl.motorsc.com/logis_api',
      map_key:'73984b981b734d4e04b562724156d33e',
      appid:'wx13427a30534d2cea'
    }
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/wx': {
        // target: 'http://10.129.183.82:8083',
        // target: 'http://10.129.83.23:8083', //蔡玉龙
        target: 'http://10.143.79.46:8083',
        // target: 'http://10.129.83.62:8080',//孙俊涛
        // target: 'http://10.129.83.3:8083',//熊万澜
        // target: 'http://10.129.83.38:8083',//姜宽
        // target: 'http://a.wl.motorsc.com/wechat', //测试

        changeOrigin: true,
      },
      '/org': {
        target: 'http://10.143.79.46:8085',
        changeOrigin: true,
      },
      '/api': {
        //target: 'http://10.129.183.82:8083',
        target: 'http://10.143.79.46:8083',
        // target: 'http://10.129.83.62:8080',//孙俊涛
        // target: 'http://10.129.83.63:8080',//张朝富
        // target: 'http://10.143.79.40:8083',
        // target: 'http://10.129.83.3:8083',//熊万澜
        // target: 'http://10.129.83.23:8083', //蔡玉龙
        //target: 'http://10.129.83.38:8083',//姜宽
        // target: 'http://a.wl.motorsc.com/wechat', //测试
        changeOrigin: true,
      },
      '/version': {
        target: 'http://10.143.79.46:8085',
        changeOrigin: true,
      },
      '/manage': {
        target: 'http://10.143.79.46:8085',
        changeOrigin: true,
        // target: 'http://a.wl.motorsc.com/logis_api',//测试
      },
      '/attach': {
        target: 'http://10.143.79.46:8085',
        changeOrigin: true,
      },
      '/wechat': {
        // target: 'http://10.129.83.23:8083', //蔡玉龙
        //target: 'http://10.129.83.23:8083',
        //target: 'http://10.129.183.82:8083',//刘杰
        target: 'http://10.143.79.46:8083',
        // target: 'http://10.129.83.151:8090',//于德洋
        // target: 'http://a.wl.motorsc.com/wechat',//测试
        changeOrigin: true,
      },
      '/logistics': {
        target: 'http://10.143.79.46:8085',
        changeOrigin: true,
      },
      '/ImageServlet': {
        target: 'http://10.143.79.46:8083',
        changeOrigin: true,
      },
      '/paymentResult': {
        target: 'http://10.143.79.46:8083',
        changeOrigin: true
      },
      '/account':{
        target: 'http://10.129.83.62:8080',
        changeOrigin: true
      },
      '/chefu':{
        target: "http://10.129.83.63:8080", //张朝富
        changeOrigin: true
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    config:{
      api_url:'http://'+ip+':8080',
      api_api_url:'http://'+ip+':8080',
      map_key:'faedef5ae0a673687915b4afcabfe53f',
      appid:'wxb40f75a4ee5f5e51'
    }
  }
}
function localIp(type){

  var ifaces=os.networkInterfaces(),result={};
  for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4') {
        result[dev]=details.address;
        ++alias;
      }
    });
  }
  if(type in result) return result[type];
  else{
     console.log(result)
     console.log('输入你对应网址的网卡名称')
  }
}
