# 几何图形 - JavaScript实现的环形图比较


### 1，Highcharts
Highcharts 是一个用纯 JavaScript 编写的一个图表库， 能够很简单便捷的在 Web 网站或是 Web 应用程序添加有交互性的图表，并且免费提供给个人学习、个人网站和非商业用途使用。  

Highcharts 支持的图表类型有直线图、曲线图、区域图、柱状图、饼状图、散状点图、仪表图、气泡图、瀑布流图等多达 20 种图表，其中很多图表可以集成在同一个图形中形成混合图。  

主要优势：兼容性、开源、纯 JavaScript、丰富的图表类型、简单的配置语法、动态交互性、支持多坐标轴等等。   
```js
    var chart = null;
    $(function () {
        $('#container').highcharts({
            chart: {
                borderColor: '#E5E8EB',//图表框颜色
                borderWidth: 1,//图表框宽度
                backgroundColor: '#F6F6F6',//图表背景色
                plotBackgroundColor: null,//绘图区无颜色
                plotBorderWidth: null,//绘图区边框宽度
                plotShadow: false,//绘图区阴影效果
                spacing: [100, 20, 100, 20]//图表内边距，上右下左
            },
            colors: [
                '#EFE07C', '#89B5EB', '#F8AA9E', '#FFC7B8', '#F18686', '#EFC27C'
            ],// colors是饼图或者环形图中每一块的颜色
            credits: {
                enabled: false//右下角的版权信息不显示
            },
            title: {
                floating: true,
                text: '<div style="text-align:center" ><img src="http://liuxunming.com/image/avatar.png" width="20px" height="20px" style="vertical-align: middle"/></div>个人简介',//环形图中心显示文字加图片
                useHTML: true,//必须设置true才能加图片
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },//浮动的数据提示框
            plotOptions: {
                pie: {
	                size:200,//环形图大小控制
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                innerSize: '70%',// 圆环厚度百分比
                name: '占比',//浮动框的文字提示
                showInLegend: true,//显示图例
                data: [
                    ['Firefox', 45.0],
                    ['IE', 26.8],
                    ['Opera', 6.2],
                    ['Opera2', 16.2],
                    ['Opera3', 36.2],
                ]
            }],
            legend: {
                layout: 'horizontal',//图例水平排放，超过宽度后换行
                labelFormat: '{name} {percentage:.2f} %',
                symbolHeight: 8,//图例小标志高度
                symbolWidth: 8,
                width: 220,//图例区宽度
                align: 'center',
                symbolRadius: 0// 图例形状为方形
            },
        }, function (c) {
            // 环形图圆心
            var centerY = c.series[0].center[1],
                titleHeight = parseInt(c.title.styles.fontSize);
            c.setTitle({
                y: centerY + titleHeight / 2
            });
            chart = c;
        });
    });
```

### 2，iChartJS

ichartjs 是一款基于HTML5的图形库。使用纯javascript语言, 利用HTML5的canvas标签绘制各式图形。 ichartjs致力于为您的应用提供简单、直观、可交互的体验级图表组件。是WEB/APP图表展示方面的解决方案 。如果你正在开发HTML5的应用，ichartjs正好适合您。 ichartjs目前支持饼图、环形图、折线图、面积图、柱形图、条形图。ichartjs是基于Apache License 2.0协议的开源项目。  

```html
<html>
<head>
    <title>饼状图显示</title>
    <script type="text/javascript" src="<%=path%>/staticmedia/js/jquery/jquery.1.4.2-min.js"></script>
    <script src="http://www.ichartjs.com/ichart.latest.min.js"></script>
    <script type="text/javascript">
        var path = "<%=path%>";
        appendContents();
        function appendContents() {
            $.ajax({
                type: "POST",
                url: path + "/queryChartList.json",
                data: {},
                beforeSend:function(xhr){

                },
                error: function () {
                    alert("出错了");
                },
                success: function (data) {
                    var list = data.records;
                    var title = data.title;
                    var totalCount = data.totalCount;
                    $.each(
                        list, function () {
                            var chart = iChart.create({
                                render:"ichart-render",
                                width:800,
                                height:400,
                                background_color:"#fefefe",
                                gradient:false,
                                color_factor:0.2,
                                border:{
                                    color:"BCBCBC",
                                    width:1
                                },
                                align:"center",
                                offsetx:0,
                                offsety:0,
                                sub_option:{
                                    mini_label_threshold_angle : 70,//迷你label的阀值,单位:角度
                                    mini_label:{//迷你label配置项
                                        fontsize:20,
                                        fontweight:600,
                                        color : '#ffffff'
                                    },
                                    border:{
                                        color:"#BCBCBC",
                                        width:1
                                    },
                                    label:{
                                        sign:false,//设置禁用label的小图标
                                        fontweight:600,
                                        padding:'0 4',
                                        fontsize:11,
                                        color:"#4572a7",
                                        border:{
                                            color:"#BCBCBC",
                                            enable:false
                                        },
                                        background_color:null
                                    },
                                    listeners:{
                                        parseText:function(d, t){
                                            return d.get('value')+"%";//自定义label文本
                                        }
                                    }
                                },
                                shadow:true,
                                shadow_color:"#666666",
                                shadow_blur:2,
                                showpercent:false,
                                column_width:"70%",
                                bar_height:"70%",
                                radius:"90%",
                                title:{
                                    text:title,
                                    color:"#111111",
                                    fontsize:20,
                                    font:"微软雅黑",
                                    textAlign:"center",
                                    height:30,
                                    offsetx:0,
                                    offsety:0
                                },
                                subtitle:{
                                    text:"子标题"+title,
                                    color:"#111111",
                                    fontsize:16,
                                    font:"微软雅黑",
                                    textAlign:"center",
                                    height:20,
                                    offsetx:0,
                                    offsety:0
                                },
                                footnote:{
                                    text:"脚标题"+title,
                                    color:"#111111",
                                    fontsize:12,
                                    font:"微软雅黑",
                                    textAlign:"right",
                                    height:20,
                                    offsetx:0,
                                    offsety:0
                                },
                                legend:{
                                    enable:true,
                                    background_color:"#fefefe",
                                    color:"#333333",
                                    fontsize:12,
                                    border:{
                                        color:"#BCBCBC",
                                        width:1
                                    },
                                    column:1,
                                    row:1,
                                    align:"right",
                                    valign:"center",
                                    offsetx:0,
                                    offsety:0
                                },
                                coordinate:{
                                    width:"80%",
                                    height:"84%",
                                    background_color:"#ffffff",
                                    axis:{
                                        color:"#a5acb8",
                                        width:[1,"",1,""]
                                    },
                                    grid_color:"#d9d9d9",
                                    label:{
                                        fontweight:500,
                                        color:"#666666",
                                        fontsize:11
                                    }
                                },
                                label:{
                                    fontweight:500,
                                    color:"#666666",
                                    fontsize:11
                                },
                                type:"pie2d",
                                data:list
                            });
                            chart.draw();
                        }
                    );
                },
                complete:function(xhr){
                    //隐藏div
                }
            });
        }

    </script>
</head>
<body style="background-color:#244c74;">
<div id="ichart-render"></div>
</body>
</html>
```

### 3，eChart

ECharts，一个纯 Javascript 的图表库，可以流畅的运行在 PC 和移动设备上，兼容当前绝大部分浏览器（IE8/9/10/11，Chrome，Firefox，Safari等），底层依赖轻量级的 Canvas 类库 ZRender，提供直观，生动，可交互，可高度个性化定制的数据可视化图表。  

ECharts 3 中更是加入了更多丰富的交互功能以及更多的可视化效果，并且对移动端做了深度的优化。  

主要优势：丰富的图表类型、多个坐标系的支持、移动端的优化、深度的交互式数据探索、大数据量的展现、多维数据的支持以及丰富的视觉编码手段、动态数据、绚丽的特效。  

以下是官方实例  
```js

app.title = '环形图';

option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};
```


### 4,优劣比较
本文仅就环形图作讨论研究，其他图表类型暂不管。

1. highCharts可定制程度高，图表编辑区操作方便，环形图可以添加中心文字和图标，可以指定环形图每一块的颜色，也是我重点研究的。  
2. ichartjs在线设计器功能比较简单，只能操作部分图表类型，环形图中心可以添加文字，但无法添加图标，可以指定环形图每一块的颜色  
3. echart图表编辑区操作方便，目前看来无法为环形图中心添加文字和图标，api看起来比较难懂，无法指定每块颜色。

4. 综上，个人开发或者非商业用途的开发建议选择highCharts，其次选择eChart或者ichartjs  