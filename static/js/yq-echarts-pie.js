/**
 * 给外部一个句柄 YQEchartsPie 用于操作当前组件，
 * 在全局下查找YQEcharts 不存在则创建，
 * return 当前的构造函数
 **/
;var YQEchartsPie = (function(doc,win,$,echarts){
    
    var _colors = ["#7fa1da","#6dc8d4","#7fdabd","#b2e9aa"],
    //组件的默认参数
    _defaultOption = {
        el : doc.querySelector(".geo-pie"),
        g : {
            enableDefaultTip : true,
            tooltip : {
                formatter:""
            },
            enableGPie : true,
            pie : {
                type: 'pie',
                radius : '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                selectedOffset: 30,
                label:{
                    normal:{
                        show:false,
                    }
                },
                itemStyle: {
                    normal:{
                        shadowBlur: 20,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.4)'
                    },
                    emphasis: {
                        shadowBlur: 20,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.4)'
                    }
                },
                data:[]
            },
            extend:{
                color:_colors
            }
        },
        result:[] //同echarts的series下的pie配置信息，可有多个{}存放
    },
    //继承用户的参数以后
    _opts = {};
    /**
     * _this 一个构造函数用于实例化，
     * _yqEcharts window下YQEcharts的全局对象存储有关echarts的所有组件，
     **/
    var _this = function(){
        this.pies = [];
        this._colors = ["#7fa1da","#6dc8d4","#7fdabd","#b2e9aa"];
        //echarts的实例变量
        this._echarts;
        this.first = true;
        //默认的echarts的配置参数
        this._option = {
            tooltip:{
                show:true
            },
            series:[

            ]
        };
    },
    _yqEcharts = win.YQEcharts = win.YQEcharts || {};
    //将当前的pie组件放入全局的YQEcharts中
    _yqEcharts.pie = _this;
    /**
     * 初始化map的参数
     * **/
    _this.prototype.initConfig = function(){
        var _params = Array.prototype.slice.apply(arguments),
        _self = this;
        aiParams(_params);
        this._option = paramsToOption(this._option,this.pies);
        if(this.first){
            this._echarts = createEcharts();
            //实现窗体更改时自动改变大小
            window.addEventListener("resize",function(){
                _self._echarts.resize();
            });
            this.first = false;
        }
    }

    /**
     * 生成echarts图形 可重复调用
     * **/
    _this.prototype.setOption = function(result){
        if(result){
            //存在此数据参数时则调用不存在默认执行
            setOpt(result,this._option);
        }
        this._echarts.setOption(this._option);
        return _echarts;
    }
    /**
     * 切换一条折线的选中状态
     * @param {String} name 选中的折线
     * **/
    _this.prototype.toggleSelect = function(name){
        this._echarts.dispatchAction({
            type: 'pieToggleSelect',
            name: name
        })
    }

    /**
     * @param {Number} 接收一个下标清除一条数据
     */
    _this.prototype.remove = function(index){
        this.pies.splice(index,1);
        this._option.series = this.pies.slice();
        this._echarts.setOption(this._option,true);
    }

    /**
     * 清空图表
     */
    _this.prototype.clear = function(){
        if(this._echarts){
            this._echarts.clear();
        }
        this.pies = [];
        this.first = true;
        this._option.series = this.pies.slice(0);
    }

    /**
     * 重置窗体
     */
    _this.prototype.resize = function(){
        this._echarts.resize();
    }

    /**
     * @param {Array} colors 颜色集合
     */
    _this.prototype.setColor = function(colors){
        this._option.color = colors;
    }

    /**
     * 获取echarts的是初始化实例对象
     * @return {[type]} echarts的init实例对象
     */
    _this.prototype.getInitEchart = function(){
        return  this._echarts;
    }
    /**
     * 处理参数信息
     * @param  {Object} _params 参数集合
     */
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
    function paramsToOption(option,pies){
        //临时的下标，存储一个临时的对象数据
        var _ind = 0,_temp;
        //配置信息中的地图数据
        var _result = _opts.result,
        _option = option;
        //确认是否需要开启全局的自定义tip提示信息
        if(_opts.g.enableDefaultTip){
            if(_opts.g.tooltip.formatter.constructor === Function){
                _option.tooltip.formatter = _opts.g.tooltip.formatter;
            }
        }

        //判断是否开启全局通用饼图的配置信息，可被用户定义的数据覆盖
        if(_opts.g.enableGPie){
            if(_result.length > 0){
                for(_ind; _ind < _result.length; _ind++){
                    _temp = $.extend(true,{},_opts.g.pie,_result[_ind]);
                    if(!_temp.hasOwnProperty("data")){
                        _temp.data = [];
                    }
                    _option.series.push(_temp);
                    pies.push(_temp);
                }
            }else{
                _option.series.push(_opts.g.pie);
            }
        }

        //将扩展的全局配置引用到实际的组件配置中
        _option = $.extend(true,{},_option,_opts.g.extend);
        return _option;
    }

    /**
     * 处理更新后的数据
     * **/
    function setOpt(result,_option){
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
                            if(!_option.series[_ind]){
                                _option.series[_ind] = $.extend({},_opts.g.pie);
                            }
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
        return echarts.init(_opts.el);
    }

    return _this;

})(document,window,jQuery,echarts);