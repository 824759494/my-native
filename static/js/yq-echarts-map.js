/**
 * 给外部一个句柄YQEchartsMap 用于操作当前组件，
 * 在全局下查找YQEcharts 不存在则创建，
 * return 当前的构造函数
 **/
;var YQEchartsMap = (function(doc,win,$,echarts,map){

    /**
     * _this 一个构造函数用于实例化，
     * _yqEcharts window下YQEcharts的全局对象存储有关echarts的所有组件，
     **/
    var _this = function(){},
    _yqEcharts = win.YQEcharts = win.YQEcharts || {};
    //将当前的map组件放入全局的YQEcharts中
    _yqEcharts.map = _this;
    //初始化的一个echarts的实例变量
    var _echarts;
    //默认的echarts的配置参数
    var _option = {
        tooltip:{
            show:true
        },
        series:[

        ]
    },
    //组件的默认参数
    _defaultOption = {
        el : doc.querySelector(".geo-map"),
        g : {
            enableDefaultTip : true,
            tooltip : {
                formatter: function (params, ticket, callback) {
                    console.log(params)
                    return "<h1 style='color:#fff;'><img src='./img/s.png'>" + params.name + "</h1>";
                }
            },
            visuaMap : {

            },
            enableGMap : true,
            map : {
                type : "map",
                mapType : "world",
                selectedMode : 'single',
                roam : true,
                scaleLimit : {
                    min : 0.5,
                    max : 3
                },
                itemStyle : {
                    normal : {

                    },
                    emphasis : {
                        areaColor:"#09e3ff"
                    }
                },
                data:[]
            }
        },
        result:[] //同echarts的series下的map配置信息
    },
    //继承用户的参数以后
    _opts = {};
    //存储注册的map的名称
    var _regMapName = [];
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
     * js自动选中的区域事件
     * 接收一个obj
     * 数据的 index，如果不指定也可以通过 name 属性根据名称指定数据
     * dataIndex?: number,
     * 可选，数据名称，在有 dataIndex 的时候忽略
     * name : "China"
     **/
    _this.prototype.mapSelect = function(obj){
        dispatchAction(obj,"mapSelect");
    }

    /**
     * 取消选中  参数同mapSelect
     **/
    _this.prototype.mapUnSelect = function(obj){
        dispatchAction(obj,"mapUnSelect");
    }
    /**
     * 向echarts中注册一个地图资源 接收一个Object 或 Array
     * {
     *      name:地图类型的名称
     *      data:地图的json数据
     * }
     * [name,data]
     **/
    _this.prototype.regMap = function(res){
        registerMap(res);
    }

    /**
     * 处理传入进来的参数配置
     **/
    function aiParams(_params){
        if(_params.length <= 0){
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
        //临时的下标，指向参数的result，存储一个临时的地图参数
        var _ind = 0,_result = _opts.result,_tempMap,_regMap;
        //确认是否需要开启全局的自定义tip提示信息
        if(_opts.g.enableDefaultTip){
            if(_opts.g.tooltip.formatter.constructor === Function){
                _option.tooltip.formatter = _opts.g.tooltip.formatter;
            }
        }
        //判断是否开启全局通用地图的配置信息
        if(_opts.g.enableGMap){
            if(_result.length > 0){
                for(_ind; _ind < _result.length; _ind++){
                    _tempMap = $.extend(true,_opts.g.map,_result[_ind]);
                    if(!_tempMap.hasOwnProperty("data")){
                        _tempMap.data = [];
                    }
                    _option.series.push(_tempMap);
                }
            }else{
                _option.series.push(_opts.g.map);
            }
        }
        console.log(_option)
    }

    /**
     * 创建一个echarts实例用于生成图表
     **/
    function createEcharts(){
        _echarts = echarts.init(_opts.el);
        _echarts.setOption(_option);
    }

    /**
     * 触发echarts的dispatchAction事件
     * 接收一个Object参数与事件类型参数
     **/
    function dispatchAction(obj,type){
        if(obj && obj.constructor === Object){
            obj = $.extend(true,{},{type: type},obj);
            _echarts.dispatchAction(obj);
        }
    }


    /**
     * 处理注册地图的函数
     * 判断地图名称是否存在，存在则提示，不存在则放入名称集合
     **/
    function registerMap(res){
        if(res){
            var _type = res.constructor;
            switch (_type) {
                case Object:
                    if(res.hasOwnProperty("name") && res.hasOwnProperty("data")){
                        if(_regMapName.indexOf(res.name) >= 0){
                            console.warn("地图名称已存在,已覆盖已有地图");
                        }else{
                            _regMapName.push(res[0]);
                        }
                        echarts.registerMap(res.name, res.data);
                    }
                    break;
                case Array:
                    if(res.length > 1){
                        if(_regMapName.indexOf(res[0]) >= 0){
                            console.warn("地图名称已存在,已覆盖已有地图");
                        }else{
                            _regMapName.push(res[0]);
                        }
                        echarts.registerMap(res[0], res[1]);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    //注册默认的地图
    _this.prototype.regMap(["world",map]);

    return _this;

})(document,window,jQuery,echarts,(function(){
    return 
})());