/**
 * Etool 图片转base64、blob压缩 生成formdata工具
 * @param  {[type]} $                   [description]
 * @param  {[type]} win                 [description]
 * @param  {[type]} doc){	window.Etool [description]
 * @return {[type]}                     [description]
 */
window.EtoolImage = (function($,win,doc){

	window.Etool = window.Etool  || {};

	/**
	 * image处理方案
	 * @param {[type]} option [description]
	 */
	Etool.Image = function(option){

		var self = this;

		/**
		 * 默认的配置参数
		 * @param {Number} quality 图片的质量
		 * @param {Number} w 宽度
		 * @param {Number} h 高度
		 * @param {Number} enableForm 是否创建formdata给用户默认启用 true || false
		 */
		this.config = {
			quality  	 : 1,
			w 			 : "auto",
			h 			 : "auto",
			enableForm 	 : true
		}

		//实例下的Image对象 并且设置跨域
		this.image = new Image();
		this.image.setAttribute('crossOrigin', 'anonymous');

		//实例下的canvas对象以及2d对象
		this.canvas = doc.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");

		//formdata 对象
		this.formdata 		= new FormData();
		//由于图片是异步加载所以需要一个计数
		this.ind 			= 0;
		this.list 			= [];
		//存放生成的base64、blob的数组
		this.base64Datas 	= [];
		this.blobDatas   	= [];
		this.handleing 		= false;
		//api处理队列
		this.queue 			= [];

		//参数覆盖
		this.config = $.extend(this.config, option);

		//image的处理方案
		this.type = "getBase64";
		//处理结束的回调函数
		this.cb = $.noop();

		this.image.onload = null;
		this.image.onload = function(e){
			var w = self.config.w === "auto" ? self.image.naturalWidth : self.config.w;
			var h = self.config.h === "auto" ? self.image.naturalHeight : self.config.h;
			self.canvas.width = w;
			self.canvas.height = h;
			self.ctx.drawImage(self.image, 0, 0, w,h);
			//调用处理方案
			$(document).trigger("etool." + self.type,{
				self 	: self,
				src 	: self.image.src,
				cb 		: function(){
					self.ind ++;
					//判断异步任务是否结束
					if(self.ind === self.list.length) {

						//回调出去放给用户
						self.cb( self.type === "getBase64" ?
							(self.config.enableForm ? ([self.formdata].slice())[0] : self.base64Datas.slice()) :
							(self.config.enableForm ? ([self.formdata].slice())[0] : self.blobDatas.slice())
						)
						//重置全局的参数
						self.ind 			= 0;
						self.base64Datas 	= [];
						this.blobDatas 		= [];
						self.formdata 		= new FormData();
						self.handleing 		= false;

						//判断队列中是否有任务 有则执行
						if(self.queue.length > 0){
							var task = self.queue.shift();
							self[task.funName](task.list,task.cb);
						}
						return false;
					}
					//继续递归下一个图片
					self.image.src = self.list[self.ind];
				}
			});
		}
	}

	Etool.Image.prototype = {

		/**
		 * 获取image的base64转换信息，根据全局配置的enableForm配置返回formdata对象或者存放base64的数组对象
		 * @param  {[Array]} list 一个存放图片地址的集合 不可以是本地地址
		 * @param {[Function]}  结束回调根据全局配置信息返回base64数组或者base64的formdata对象
		 */
		getBase64 : function(list,cb){
			var self = this;
			//判断是否正在处理其它事件  如果正在处理则将此任务放入队列中
			if(self.handleing){
				self.queue.push({
					funName : "getBase64",
					list : list,
					cb : cb
				});
				return false;
			}
			//进入的第一时间就锁定
			self.handleing = true;
			//设置处理类型
			self.type = "getBase64";
			self.cb = cb;
			list ? (self.list = list,self.image.src = list[0]) : "";
		},

		/**
		 * 获取image的blob转换信息，根据全局配置的enableForm配置返回formdata对象或者存放blob的数组对象
		 * @param  {[Array]} list 一个存放图片地址的集合 不可以是本地地址
		 * @param {[Function]}  结束回调根据全局配置信息返回blob数组或者blob的formdata对象
		 */
		getBlob : function(list,cb){
			var self = this;
			//判断是否正在处理其它事件  如果正在处理则将此任务放入队列中
			if(self.handleing){
				self.queue.push({
					funName : "getBlob",
					list : list,
					cb : cb
				});
				return false;
			}
			//进入的第一时间就锁定
			self.handleing = true;
			//设置处理类型
			self.type = "getBlob";
			self.cb = cb;
			list ? (self.list = list,self.image.src = list[0]) : "";
		},

		/**
		 * 设置ajax参数
		 * @param {[type]} formdata [description]
		 */
		getAjaxOption : function(formdata,opts){
			return $.extend({
				type: 'post',
				data: formdata,
				async: false,
				cache: false,
				contentType: false,
				processData: false
	        }, opts);
		}
	}

	/**
	 * 生成base64
	 * @param  {[type]} e              [description]
	 * @param  {[type]} opts){				var dataUrl       [description]
	 * @return {[type]}                [description]
	 */
	$(document).on("etool.getBase64",function(e,opts){
		var dataUrl = opts.self.canvas.toDataURL(getType(opts.src),opts.self.config.quality);
			opts.self.base64Datas.push(dataUrl);
		opts.self.formdata.append(opts.src,dataUrl);
		opts.cb();
	});

	/**
	 * 生成blob
	 * @param  {[type]} e                               [description]
	 * @param  {[type]} opts){                                           			var dataURL [description]
	 * @param  {[type]} "image/png"                     [description]
	 * @param  {[type]} opts.self.config.quality);			} [description]
	 * @return {[type]}                                 [description]
	 */
	$(document).on("etool.getBlob",function(e,opts){
			var dataURL = opts.self.canvas.toBlob(function(blob){
				opts.self.blobDatas.push(blob);
			opts.self.formdata.append(opts.src,blob,getType(opts.src));
			opts.cb();
			},getType(opts.src),opts.self.config.quality);
	});

	//去转换的类型
	function getType(src){
		return "image/" + src.substring(src.lastIndexOf(".") + 1).toLowerCase();
	}

	return Etool.Image;

})(jQuery,window,document);