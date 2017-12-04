var Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
var nightmare = Nightmare({
    electronPath: require('../node_modules/electron'),
});
var async = require('async');
var agent = require('superagent');
var cheerio = require('cheerio');
var moment = require('moment');
var request = require('request');
var notifier = require('node-notifier');

var query = require('../mysql');
var singerConfig, songConfig = require('../config');
var
    limitLength,
    splitId,
    notify
 = require('../util');


var index = 19622; // 可作为断点位置

var songCollect = () => {
    async.whilst(() => {
        return index <= 31252;
    }, (cb) => {
        // 从数据库中获取歌手姓名以及URL 然后开始遍历歌曲
        query('select name,url from singer where singer=?', [index], (err, res) => {
            if (!err) {
                var singer = {
                    name: res[0].name,
                    url: res[0].url.trim()
                }
                nightmare.resetFrame()
                    .goto(songConfig.common + singer.url, {
                        'User-Agent': songConfig.agent
                    }) // 进入歌曲列表页面
                    .enterIFrame('#g_iframe')
                    .evaluate(function () {
                        var content = document.querySelector("#artist-top50").innerHTML;
                        return content;
                    })
                    .then(res => {
                        var $ = cheerio.load(res);
                        var song = $('.txt a');
                        limitLength(song, songConfig.len); // 最多获取N首歌曲的评论
                        async.mapLimit(song, 1, (item, cbItem) => { // 并发数量N
                            // 遍历前N首歌曲 并且获取评论数量
                            var href = $(item).attr('href');
                            var id = splitId(href);
                            var title = $(item).text();
                            var url = songConfig.comment + id + '?csrf_token=';
                            songConfig.req.url = url;
                            request(songConfig.req, (err, res, body) => {
                                if (body) {
                                    var content = JSON.parse(body);
                                    var commet = content.total;
                                    query('insert into song(title,comment,url,name,singer) values(?,?,?,?,?)', [title, commet, href, singer.name, index], (err, response) => {
                                        if (err) {
                                            // 说明歌曲重复 进行update操作
                                            query('update song set title=?,comment=?,name=?,singer=? where url=?', [title, commet, singer.name, index, href], () => {});
                                        }
                                        // 插入数据完毕
                                        cbItem();
                                    })
                                } else {
                                    console.log('未知错误');
                                    notify('错误', '未知错误');
                                    cbItem();
                                }
                            })
                        }, () => {
                            console.log('歌手 ' + singer.name + ' 抓取完毕');
                            index++;
                            cb();
                        })
                    })
                    .catch(err => {
                        // 错误处理
                        var errStr = err.toString();
                        if (errStr.includes('innerHTML')) {
                            // 页面404 直接跳到下一个歌手
                            console.log(err, singer.name + ' 页面丢失 请求的URL为' + songConfig.common + singer.url);
                            notify('请求超时', singer.name + ' 页面丢失 请求的URL为' + songConfig.common + singer.url);
                            index++;
                        } else {
                            // goto超时处理 或者服务器503
                            console.log(err, singer.name + ' 请求超时 即将重新请求 请求的URL为' + songConfig.common + singer.url);
                            notify('请求超时', singer.name + ' 请求超时 即将重新请求 请求的URL为' + songConfig.common + singer.url);
                        }
                        cb();
                    })
            } else {
                // 查询错误处理
                console.log(err, 'singer ID ' + index);
                notify('数据库查询错误', 'singer ID ' + index);
                index++;
                cb();
            }
        })
    })
}
module.exports = songCollect;