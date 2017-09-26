/**
 * Created by Administrator on 2017/3/17.
 */
;(function($) {
    var _pageSize = 15,_isFirst = true;
    $.fn.page = function(options) {
        var defaults = {
            id:"",
            ovPage: 1, //默认显示第一页
            pageSize: "", //默认每页显示的记录数
            sizeButtons: 7, //默认显示多少个按钮
            titleNumber: 100, //默认100条记录
            lists:[15,30,50,100,200,300],
            pageClick : true,
            sizePageAll: 'auto', //默认总页数
            backFn: "",
            getPageSize:"auto"
        };
        //初始化
        var _this = $.extend({}, defaults, options);

        //计算Page的信息
        function calcPage(){
            //判断是否第一次初始化
            if(_isFirst){
                _isFirst = false;
                _pageSize = _this.pageSize;
            }else{
                _this.pageSize = _pageSize;
            }
            //根据传入的参数计算多少页
            if(_this.sizePageAll == 'auto') {
                if(_this.titleNumber < 15){
                    _this.sizePageAll = 1;
                }else{
                    _this.sizePageAll = Math.ceil(_this.titleNumber / _this.pageSize); //总页数
                }
            } /*else {
                _this.titleNumber = _this.sizePageAll * _this.pageSize;
            }*/
            if(typeof _this.getPageSize === "function"){
                _this.getPageSize(_pageSize);
            }
        }

        return this.each(function() {
            $(_this.id).css("display","block");
            //调用函数
            initPage();
            function initPage() {
                calcPage();
                //开始页面
                var pageStart = Math.max(1, _this.ovPage - parseInt(_this.sizeButtons / 2));

                //最后一页
                var pageLast = Math.min(_this.sizePageAll, pageStart + _this.sizeButtons - 1);

                //创建分页模板
                var str = '',set = "<input id = 'pageInp' name = 'number' type='text' /><button class =" +
                    " 'btn'>GO</button>共" + _this.titleNumber + "条记录,每页<select id='selectOption'>";

                $.each(_this.lists,function(k,v){
                    if(_pageSize == v){
                        set += "<option value='"+ v +"' selected>"+ v +"</option>";
                        return true
                    }
                    set += "<option value='"+ v +"'>"+ v +"</option>";
                });
                set += "</select></div>";
                str += "<div class='pagination'>";
                //如果页面总数大于设置的页数
                if(_this.sizePageAll > _this.sizeButtons ) {
                    firstPage(_this.ovPage);
                    //中间页码
                    if((_this.ovPage - 2) > 2) {
                        str += "<span>...</span>";
                    }
                    for(var i = (pageStart + 1); i < pageLast; i++) {
                        //当前页数为尾页时，显示指定的按钮数
                        if((pageLast - pageStart) < (_this.sizeButtons - 1)) {
                            for(var i = pageLast - (_this.sizeButtons - 2); i < pageLast; i++) {
                                //如果当前页面，就静止当前页面的按钮
                                if(i == _this.ovPage) {
                                    str += "<a href='#'data-num='" + i + "'><span class='on'>" + i + "</span></a>";
                                } else {
                                    //否则就可以点击
                                    str += "<a href='#'data-num='" + i + "'><span>" + i + "</span></a>";
                                }
                            }
                        } else {
                            nowPage(i, _this.ovPage)
                        }

                    }

                    if((_this.sizePageAll - _this.ovPage) > (_this.sizeButtons / 2)) {
                        str += "<span>...</span>";
                    }
                    //尾页
                    lastPage(_this.ovPage, _this.sizePageAll);
                    str +=set;
                } else if(_this.sizePageAll > 1 && _this.sizePageAll <= _this.sizeButtons) {
                    firstPage(_this.ovPage);
                    for(var i = 2; i < _this.sizePageAll; i++) {
                        nowPage(i, _this.ovPage)
                    }
                    lastPage(_this.ovPage, _this.sizePageAll);
                    str +=set;
                }else if(_this.titleNumber > 15 ){
                        firstPage(_this.ovPage);
                        str +=set;
                    }else if(_this.sizePageAll <= 1 ){
                    if(_this.pageClick){
                        firstPage(_this.ovPage);
                        str +=set;
                        $(_this.id).hide()
                    }
                }

                $(_this.id).html(str);

                var  pagSpan = $(".pagination span").length;
                var preValue = '';

                function textInp(id,num){
                    var pagText = parseInt($(".pagination span").eq(pagSpan - num).text());
                    $(id).on("keyup", function(){
                        $(this).val($(this).val().replace(/\D|^0/g,''));
                        var value = parseInt($(this).val());
                        if(value != NaN && value > pagText){
                            $(this).val(preValue);
                        }
                    });
                }

                if(pagSpan > 2){
                    textInp(_this.id + " #pageInp",2);
                }else if(pagSpan <= 2){
                    textInp(_this.id + " #pageInp",1);
                }
                $(".pagination .btn").off('click');
                $(".pagination .btn").click(function(){
                    if($(_this.id + " #pageInp").val().length != 0){
                        _this.backFn($(_this.id + " #pageInp").val(),_this.pageSize);
                    }
                });

                //获取所有生成的页面链接
                var listTag = $(_this.id+' a');
                //绑定li事件
                /* for(var i = 0; i < listTag.length; i++) {
                	listTag.off("click");
                    listTag[i].onclick = function() {
                        var currentPage = this.getAttribute('data-num');
                        nowcurrentPage(currentPage);
                        selectPage();
                        return false;
                    };
                } */

                function firstPage(ovPage) {
                    //判断当前页面是否是第一页
                    if(ovPage == 1) {
                        str += "<span class='in'>&lt;&lt;</span>";
                        str += "<a href='#' data-num = '" + 1 + "'><span class='on'>1</span></a>";
                    } else {
                        str += "<a href='#' data-num = '" + (ovPage - 1) + "'><span>&lt;&lt;</span></a>";
                        str += "<a href='#' data-num = '" + 1 + "'><span >1</span></a>";
                    }
                }

                function lastPage(ovPage, sizeAll) {
                    //当前页不是总页，即是最后一页
                    if(ovPage != sizeAll) {
                        str += "<a href='#' data-num = '" + sizeAll + "'><span >" + sizeAll + "</span></a>";
                        str += "<a href='#' data-num = '" + (parseInt(ovPage) + parseInt(1)) + "'><span>&gt;&gt;</span></a>";

                    } else {
                        //如果是最后页，禁用下一页
                        str += "<a href='#'data-num='" + sizeAll + "'><span class='on'>" + sizeAll + "</span></a>";
                        str += "<span class='in'>&gt;&gt;</span>";

                    }
                }

                function nowPage(i, ovPage) {
                    //如果当前页面，就静止当前页面的按钮
                    if(i == ovPage) {
                        str += "<a href='#'data-num='" + i + "'><span class='on'>" + i + "</span></a>";
                    } else {
                        //否则就可以点击
                        str += "<a href='#'data-num='" + i + "'><span>" + i + "</span></a>";
                    }
                }
				$(_this.id + " #selectOption").off('change');
                $(_this.id + " #selectOption").change(function() {
                    _this.pageSize = parseInt($(this).val());
                    _pageSize = _this.pageSize;
                    if(typeof _this.getPageSize === "function"){
                        _this.getPageSize(_pageSize);
                    }
                    if(typeof _this.backFn == "function"){
                        _this.backFn(1,_this.pageSize);
                    }
                    //nowcurrentPage(1);
                    selectPage();
                });

            }
            //每页显示多少条记录的公共方法
            function selectPage() {
                var selectLegth = $(_this.id +" #selectOption").find("option");
                selectLegth.each(function() {
                    if(_this.pageSize == $(this).val()) {
                        $(this).attr('selected', 'selected');
                    }
                });
            }

            $(_this.id).off('click'," .pagination a");
            $(_this.id).on('click'," .pagination a",function(){
                _this.backFn(_this.ovPage,_this.pageSize);
                selectPage();
            });

            //传递页面参数,初始化
            function nowcurrentPage(currentPage) {
                _this.ovPage = currentPage;
                initPage();
            }

        });
    }
})(jQuery);