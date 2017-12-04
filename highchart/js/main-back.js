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
            }
        },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: '楼盘单价'
            },
            labels: {
                //format: '{value} gr'
            }
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.country}',
                    style:{
                        'fontSize':'12px'
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            data: [
                {x: 5, y: 19000, z: 90000, name: 'BE', country: '比利时'},
                {x: 12, y: 32000, z: 384000, name: 'DE', country: '德国'},
                {x: 8, y: 27000, z: 216000, name: 'FI', country: '芬兰'},
                {x: 6, y: 41000, z: 246000, name: 'NL', country: '荷兰'},
                {x: 17, y: 50000, z: 850000, name: 'SE', country: '瑞典'}
            ]
        }]
    });
}

