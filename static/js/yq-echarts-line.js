/**
 * 给外部一个句柄 YQEchartsLine 用于操作当前组件，
 * 在全局下查找YQEcharts 不存在则创建，
 * return 当前的构造函数
 **/
;var YQEchartsLine = (function(doc,win,$,echarts){
    "use strict";
    /**
     * _this 一个构造函数用于实例化，
     * _yqEcharts window下YQEcharts的全局对象存储有关echarts的所有组件，
     **/
    var _this = function(){},
    _yqEcharts = win.YQEcharts = win.YQEcharts || {};
    //将当前的折线图组件放入全局的YQEcharts中
    _yqEcharts.line = _this;
    //初始化的一个echarts的实例变量
    var _echarts,_colors = ["#7fa1da","#6dc8d4","#7fdabd","#b2e9aa"];
    //默认的echarts的配置参数
    var _option = {
        tooltip:{
            trigger: 'axis',
            show:true
        },
        legend: {
            // top:"-100%",
             data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
         },
         grid: {
             left: '3%',
             right: '4%',
             bottom: '3%',
             containLabel: true
         },
         xAxis : [
             {
                 type : 'category',
                 boundaryGap : true,
                 axisTick :{
                     alignWithLabel :true
                 },
                 data : ['2012-09','周二','周三','周四','周五','周六','周日']
             }
         ],
         yAxis : [
             {
                 type : 'value'
             }
         ],
        series:[

        ]
        
    },
    //组件的默认参数
    _defaultOption = {
        el : doc.querySelector(".geo-line"),
        g : {
            enableDefaultTip : true,
            tooltip : {
                formatter:""
            },
            enableGLine : true,
            line : {
                type:'line',
                smooth: true,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data:[]
            },
            extend:{
                color:["#7fa1da","#6dc8d4","#7fdabd","#b2e9aa"]
            }
        },
        result:[] //同echarts的series下的pie配置信息，可有多个{}存放
    },
    //继承用户的参数以后
    _opts = {};
    
    /**
     * 初始化map的参数
     * **/
    _this.prototype.initConfig = function(){
        var _params = Array.prototype.slice.apply(arguments);
        aiParams(_params);
        paramsToOption();
        createEcharts();
    }

    /**
     * 生成echarts图形 可重复调用
     * **/
    _this.prototype.setOption = function(result){
        if(result){
            //存在此数据参数时则调用不存在默认执行
            setOpt(result);
        }
        _echarts.setOption(_option);
        return _echarts;
    }

    /**
     * 处理传入进来的参数配置
     **/
    function aiParams(_params){
        if(_params.length <= 0){
            _opts = $.extend(true,{},_defaultOption);
            return;
        }
        switch (_params[0].constructor) {
            case Object:
                _opts = $.extend(true,{},_defaultOption,_params[0]);
                break;
            case Function:
                
                break;
            default:
                console.warn("传入参数不正确",_params[0]);
                break;
        }
    }

    /**
     * 处理组件的参数加入到echarts的参数中
     **/
    function paramsToOption(){
        //临时的下标，存储一个临时的对象数据
        var _ind = 0,_temp;
        //配置信息中的地图数据
        var _result = _opts.result;
        //确认是否需要开启全局的自定义tip提示信息
        if(_opts.g.enableDefaultTip){
            if(_opts.g.tooltip.formatter.constructor === Function){
                _option.tooltip.formatter = _opts.g.tooltip.formatter;
            }
        }
        
        //判断是否开启全局通用折线图的配置信息，可被用户定义的数据覆盖
        if(_opts.g.enableGLine){
            if(_result.length > 0){
                for(_ind; _ind < _result.length; _ind++){
                    _temp = $.extend(true,{},_opts.g.line,_result[_ind]);
                    if(!_temp.hasOwnProperty("data")){
                        _temp.data = [];
                    }
                    _option.series.push(_temp);
                }
            }else{
                _option.series.push(_opts.g.line);
            }
        }

        //将扩展的全局配置引用到实际的组件配置中
        _option = $.extend(true,{},_option,_opts.g.extend);
    }

    /**
     * 处理更新后的数据
     * **/
    function setOpt(result){
        var _ind = 0,_temp = "";
        if(result && result.constructor === Array){
            if(result.length > 0 & _option.series.length > result.length){
                //删除不必要的数据
                _option.series.splice(result.length - 1,_option.series.length - result.length);
            }
            for(_ind;_ind < result.length;_ind++){
                _temp = result[_ind];
                if(_temp){
                    switch (_temp.constructor) {
                        case Array:
                            _option.series[_ind].data = _temp.slice();
                            break;
                        case Object:
                            _option.series[_ind] = $.extend(true,{},_option.series[_ind],_temp);
                            _option.series[_ind].data = _temp.slice();
                            break;
                        default:
                            throw Error("不是一个正确的参数",e);
                            break;
                    }
                }
            }
        }
    }

    /**
     * 创建一个echarts实例用于生成图表
     **/
    function createEcharts(){
        _echarts = echarts.init(_opts.el);
        //实现窗体更改时自动改变大小
        window.addEventListener("resize", function () {
            _echarts.resize();
        });
    }

    return _this;

})(document,window,jQuery,echarts);