/**
 * Created by DL on 2017/4/24.
 */
var htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: {
        main:'./src/script/main.js',
        a:'./src/script/a.js',
        b:'./src/script/b.js',
        c:'./src/script/c.js'
    },
    output: {
        path: __dirname + '/dist',
        //publicPath:"http://cdn.com/",//线上地址
        filename:"js/[name]-[hash].js"
    },
    plugins:[
        new htmlWebpackPlugin({
            template:"index.html",
            inject:"head",
            minify:{
                /*页面压缩*/
            },
            chunk:[]
        })
    ]
};
