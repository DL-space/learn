var  Nightmare = require('nightmare');
require('nightmare-iframe-manager')(Nightmare);
var  nightmare = Nightmare({
    electronPath: require('../node_modules/electron')
});
var  async = require('async');
var  agent = require('superagent');
var  cheerio = require('cheerio');

var  query = require('../mysql');
var singerConfig = require('../config');

var  singerCollect = function () {
    async.mapLimit(singerConfig.list, 1, (item, cbItem) => {
        // 第一层循环各个歌手类型 如 华语男歌手该类型
        async.mapLimit(singerConfig.queue, 1, (obj, cbObj) => {
            // 第二层循环歌手类型下对应的各个具体歌手 如 华语男歌手下的A-Z各个歌手
            nightmare.goto(singerConfig.common + '?' + 'id=' + item.id + '&' + 'initial=' + obj.index)
                .enterIFrame('#g_iframe')
                .evaluate(function () {
                    var  content = document.querySelector("#m-artist-box").innerHTML;
                    return content;
                })
                .then(res => {
                    var  $ = cheerio.load(res);
                    var  elms = $('li .s-fc0');
                    async.mapLimit(elms, 1, (elm, cbElm) => {
                        var  href = $(elm).attr('href');
                        var  name = $(elm).text();
                        query("insert into singer(name,url,type,category,letter,id,initial) values(?,?,?,?,?,?,?)", [name, href, item.title, item.category, obj.letter, item.id, obj.index], (err, resp) => {
                            if (err) {
                                // 说明重复了
                                query("update singer set url=?,type=?,category=?,letter=?,id=?,initial=? where name=?", [href, item.title, item.category, obj.letter, item.id, obj.index, name], (err, response) => {})
                            }
                        });
                        // 单个歌手抓取完毕 进行下一个歌手抓取
                        console.log(item.title + ' ' + obj.letter + ' ' + name + ' 爬取完毕');
                        cbElm();
                    }, () => {
                        // 当前字母歌手爬取完毕 回调 进行下一首字母的爬取
                        console.log(item.title + ' ' + obj.letter + ' 爬取完毕');
                        nightmare.resetFrame();
                        cbObj();
                    })

                });
        }, () => {
            // 该类型的A-Z歌手均爬取完毕 回调 进行下一类型的爬取
            console.log(item.title + ' 爬取完毕');
            cbItem();
        })

    })
}

module.exports = singerCollect;