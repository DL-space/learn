/**
 * 此处也可以使用jquery的$(funcjtion(){})判断dom加载完就立即加载插件
 * 但有一点就是表格的纵向分割线加载不出来
 */
window.onload = function(){
    $('.stat-chart').highcharts({
        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },
        legend: {
            enabled: false
        },
        title: {
            text: '楼盘销售情况'
        },
        xAxis: {
            gridLineWidth: 1,
            title: {
                text: '楼盘数量'
            },
            tickLength:1,
            tickPixelInterval:100,
            min:0,
        },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            min:0,
            tickPixelInterval:50,
            title: {
                text: '楼盘单价'
            }
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    inside: true,
                    format: '{point.name}',
                    style:{
                        'color':'red',
                        'fontSize':'12px'
                    }
                }
            }
        },
        credits: {
            enabled: true
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h3>{point.names}</h3></th></tr>' +
            '<tr><th>每套佣金:</th><td>{point.y}元</td></tr>' +
            '<tr><th>成交套数:</th><td>{point.x}套</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },
        series: [{
            data: [
                {x: 2, y: 100000, z: 20000, name: '楼盘名1', names: '比利时'},
                {x: 2, y: 100000, z: 20000, name: '楼盘名1', names: '比利时'},
                {x: 12, y: 19000, z: 384000, name: '楼盘名2', names: '楼盘名2'},
                {x: 12, y: 19000, z: 200000, name: '楼盘名33', names: '楼盘名33'},
                /*{x: 8, y: 27000, z: 216000, name: '楼盘名3,楼盘名4，楼盘名5', country: '芬兰3'},*/
                {x: 8, y: 27000, z: 216000, name: '楼盘名4', names: '楼盘名4,楼盘名8'},
                {x: 8, y: 27000, z: 216000, name: '楼盘名8', names: '楼盘名4,楼盘名8'},
                {x: 6, y: 41000, z: 246000, name: '楼盘名5', names: '荷兰'},
                {x: 7, y: 41000, z: 246000, name: '楼盘名6', names: '666'},
                {x: 4, y: 50000, z: 850000, name: '楼盘名7', names: '楼盘名7'},
                {x: 4, y: 45000, z: 800000, name: '楼盘名11', names: '楼盘名11'}
            ]
        }]
    });
}

