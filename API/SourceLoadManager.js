window.SCSImgx={};//新浪云存储
window.EXCImgx={};//网站自身云存储
window.StorageTypeDict={
		SCSIMGX:1,//新浪云存储
		EXCIMGX:0,//Excouch网自身的云存储
}
window.SourceLoad=function(srcStType){
	return SourceLoad.propotype.init(srcStType);
};
SCSImgx.Source={
	staticSourceHost:'',
	uploadSourceHost:'',
	init:function(statichost,uploadhost){
		this.staticSourceHost=statichost;
		this.uploadSourceHost=uploadhost;
	},
};
SCSImgx.Source.propotype=SCSImgx.Source;
SCSImgx.Source.propotype.constructor=SCSImgx.Source.init;

EXCImgx.Source={
	staticSourceHost:'',
	uploadSourceHost:'',
	init:function(statichost,uploadhost){
		this.staticSourceHost=statichost;
		this.uploadSourceHost=uploadhost;
	},
};
EXCImgx.Source.propotype=EXCImgx.Source;
EXCImgx.Source.propotype.constructor=EXCImgx.Source.init;

//新浪云存储图片处理命令集合
SCSImgx.Cmd={
	//裁剪方式，指定图像裁剪或放缩的方式。
	//改变图像的大小，以匹配给定的宽度和高度。所有原始图像的部分将是可见的，但可能会被拉伸而变形。 c_scale,h_80,w_80
	csc:'c_scale,',
	//裁剪图像，同时保留原有比例。 c_fill,h_80,w_80
	cfl:'c_fill,',
	//同 fill 模式，不同的是限制图片尺寸不大于原图 c_lfill,h_80,w_80
	clf:'c_lfill,',
	//改变图像的大小，以匹配给定的宽度和高度，同时保留原有比例，所有原始图像的部分将是可见的。等比放缩，不会因为拉伸而变形。 c_fit,h_80,w_80
	cft:'c_fit,',
	//同 fit 模式，不同的是限制图片尺寸不小于原图 c_mfit,h_80,w_80
	cmf:'c_mfit,',
	//同 fit，不同的是限制图片尺，处理后的图片尺寸不会超过原图。 c_limit,h_80,w_80
	clm:'c_limit,',
	//指定图像的尺寸，同时保留原有比例。如果原图比例不满足指定的尺寸，将被填充为背景颜色。 c_pad,h_80,w_80,g_center,b_dddddd
	cpd:'c_pad,',
	//同pad模式一样，不同的是如果指定的尺寸大小大于原图时将不扩大。c_lpad,h_640,w_640,g_center,b_dddddd
	clp:'c_lpad,',
	//同 pad 模式，不同的是限制图片尺寸不小于原图 c_mpad,h_80,w_80,g_center,b_dddddd
	cmp:'c_mpad,',
	//指定尺寸和位置，用于从原始图片的基础上裁剪出一部分。 c_crop,h_180,w_180,g_face
	ccp:'c_crop,',
	//	定位人脸（结合'face'或'faces'重力参数）并生成缩略图，常用于生成头像。 c_thumb,h_110,w_110,g_face
	cth:'c_thumb,',
	//调整图片像素宽度，设置为80时，w_80；或者按照百分比调整10%为w_0.1。
	w:function(width){return 'w_'+width+',';},
	//调整像素高度，设置高位100时，h_100，或者按照百分比调整时设置为30%时，h_0.3
	h:function(high){return 'h_'+high+',';},
	//g命令用于指定位置或者方向 1. 用于 'crop', 'pad', 'fill' 的裁剪方式； 2. 用于指定 水印(overlay) 的位置

	//	正上位置，水平方向居中 c_crop,g_north,h_200,w_200
	gno:'g_north,',
	//左上角 c_crop,g_north_west,h_200,w_200
	gnw:'g_morth_west,',
	//右上位置 c_crop,g_north_east,h_200,w_200
	gne:'g_north_east,',
	
	//	左边，垂直方向居中 c_crop,g_west,h_200,w_200
	gwe:'g_west,',
	//正中 c_crop,g_center,h_200,w_200
	gce:'g_center,',
	//右边，垂直方向居中 c_crop,g_east,h_200,w_200
	gea:'g_east,',
	//左下位置 c_crop,g_south_west,h_200,w_200
	gsw:'g_south_west,',
	//	正下位置，水平方向居中 c_crop,g_south,h_200,w_200
	gso:'g_south,',
	//	右下位置 c_crop,g_south_east,h_200,w_200
	gse:'g_south_east,',
	//指定的x,y坐标，并作为中心点 c_crop,g_xy_center,h_400,w_400,x_245,y_240
	gpc:'g_xy_center,',
	//自动定位人脸的位置，如果有多张脸，选择最容易识别的一个 c_crop,g_face,h_140,w_140
	gfa:'g_face,',
	//自动定位多张人脸的位置 c_thumb,g_faces,h_220,w_600,e_brightness:18
	gfs:'g_faces,',
	//自动定位人脸的位置，如果找不到人脸则自动定位到原图的中心 c_thumb,g_face:center,h_140,w_140
	gfc:'g_face:center,',
	//自动定位多张人脸的位置，如果找不到人脸则自动定位到原图的中心 c_thumb,g_faces:center,h_120,w_330,e_brightness:18
	gfsc:'g_faces:center,',
	//用于指定图片裁剪或者水印的横向坐标。
	
	//裁剪图像80x80像素，从左边110像素开始 c_crop,h_80,w_80,x_110
	x:function(x){return 'x_'+x+',';},
	//用于指定图片裁剪或者水印的纵向坐标。
	//裁剪图像80x80像素，从顶部330像素开始。 c_crop,h_80,w_80,x_230,y_330
	y:function(y){return 'y_'+y+',';},
	
	//控制JPG或者WEBP格式图片的压缩质量。最小值为1，最大值为100。
	//图片质量为100%，文件大小为14.3KB。 c_thumb,g_face,h_130,w_140,q_100
	q:function(q){return 'q_'+q+','},
	
	//像素值或者'max'
	//指定半径，生成圆角或完全变成圆形（椭圆）。生成30像素半径的圆角 c_thumb,g_face,h_140,w_140,f_png,r_30
	//使用最大半径生成圆角 c_thumb,g_face,h_140,w_140,f_png,r_max
	r:function(r){return 'r_'+r+',';},
	
	
	//角度或者翻转模式 翻转或者旋转图像
	//顺时针旋转90度 c_fill,h_80,w_80,a_90
	//逆时针旋转20度 c_fill,h_80,w_80,a_-20
	a:function(a){return 'a_'+a+',';},
	
	//垂直翻转 c_fill,h_80,w_80,a_vflip
	avf:'a_vflip,',
	
	//水平翻转 c_fill,h_80,w_80,a_hflip
	ahf:'a_hflip,',
	
	//使用滤镜或者特效
	//灰度 c_fill,h_380,w_380,e_grayscale
	egr:'e_grayscale,',
	
	//油画效果 c_fill,h_380,w_380,e_oil_paint
	eop:function(n){return typeof(arguments[0])=='undefined'?'e_oil_paint':'e_oil_paint:'+n+',';},
	
	//反色 c_fill,h_380,w_380,e_negate:2
	eng:function(n){return 'e_negate:'+n+',';},
	
	//调整图片的亮度，并指定一个百分比值为28，取值范围-100到100，默认值为30 c_fill,h_380,w_380,e_brightness:28
	//调整图片的亮度，并指定一个百分比值为-20，取值范围-100到100，默认值为30 c_fill,h_380,w_380,e_brightness:-20
	ebn:function(n){return 'e_brightness:'+n+',';},
	
	//模糊效果 c_fill,h_380,w_380,e_blur
	//使用模糊效果，并指定一个level值为300，取值范围1到2000，默认值为100 c_fill,h_380,w_380,e_blur:300
	ebl:function(n){return typeof(arguments[0])=="undefined"?'e_blur':'e_blur:'+n+',';},
	
	//使用像素化效果，并指定一个level值为40，默认值为5 c_fill,h_380,w_380,e_pixelate:40
	epx:function(n){return typeof(arguments[0])=="undefined"?'e_pixelate':'e_pixelate:'+n+',';},
	
	//使用锐化效果，并指定一个level值为400，取值范围1到2000，默认值为100 c_fill,h_380,w_380,e_sharpen:400
	esh:function(n){return typeof(arguments[0])=="undefined"?'e_sharpen':'e_sharpen:'+n+',';},
	
	//自动对比度 c_fill,h_380,w_380,e_auto_contrast
	eac:'e_auto_contrast,',
	
	//自动调整图像色彩，对比度和亮度。 c_fill,h_380,w_380,e_improve
	eip:'e_improve,',
	
	//增加褐色，实现老照片效果 c_fill,h_380,w_380,e_sepia
	//增加褐色，实现老照片效果，并指定一个level值为60。取值范围1到100，默认值为80。 c_fill,h_380,w_380,e_sepia:60
	esp:function(n){return typeof(arguments[0])=="undefined"?'e_sepia':'e_sepia:'+n+',';},
	
	//增加红色 c_fill,h_380,w_380,e_red:40
	//增加绿色 c_fill,h_380,w_380,e_green:40
	//增加蓝色 c_fill,h_380,w_380,e_blue:40
	//增加黄色 c_fill,h_380,w_380,e_yellow:40
	//增加青色 c_fill,h_380,w_380,e_cyan:40
	//	增加粉色 c_fill,h_380,w_380,e_magenta:40
	rgb:function(param){return 'e_'+param.c+':'+param.n+',';},
	
	//控制PNG或者WEBP格式图片不透明度。最小值为1，最大值为100。
	//不透明度为25% h_330,w_330,o_25
	opa:function(n){return 'o_'+n+',';},
	
	//设置边框
	//设置一个边框宽度为10px，颜色值为黑色，透明度为4a（16进制） h_330,w_330,bo_10_0000004a
	//对圆角图像设置一个边框宽度为8px，颜色值为bbbbbb h_330,w_330,bo_8_bbbbbb,r_100
	bor:function(param){return 'bo_'+param.b+'_'+param.c+',';},
	
	//设置背景颜色，配合其他指令
	//设置背景颜色为dddddd c_pad,w_380,h_180,b_dddddd
	bcl:function(n){return 'b_'+n+',';},
	
	//在原图上增加水印。您可以配合w，h，x，y和重力参数控制水印的尺寸和位置，还可以使用o参数控制水印的透明度
	//在图片的右下角加一个微盘超人的水印（支持外部区域）；首先需要将水印贴图（必须是png格式）保存到您的对应bucket下，路径规则为：imgx/l/my_name.png，然后您可以使用l_my_name指令进行水印操作了 c_fill,w_500,h_500,g_face,f_png--l_vdisk,g_south_east,w_250,x_-120,y_-60--l_scs_logo,x_20,y_20
	oli:function(param){return '--l_'+param.img+','+this.anlysisCmdSet(param.appendix)+'--';},
	//文字水印。关于字体样式的设置后面会详细介绍。 l_text:font_me:%E4%BD%A0%E5%A5%BD%EF%BC%8C%E4%BA%91%E5%AD%98%E5%82%A8,g_north_west,x_50,y_50--w_400
	olt:function(param){return '--l_text:'+param.json+':'+encodeURIComponent(param.txt)+','+this.anlysisCmdSet(param.appendix)+'--';},
	//图片格式
	fmt:function(type){return 'f_'+type+',';},
	//版本用于控制图片的，缓存未过期的情况下指定版本重新生成图像
	vs:function(version){return 'v_'+version+',';},
	//命令集合，	"指令集"，指令可以不放到URL中，使用json格式的文件，保存到指定的路径下.自定义名称，在对应的bucket下，创建文件：imgx/t/my_thumbs.json 
	trs:function(trans){return 't_'+trans+',';},
	//解析命令集合
	anlysisCmdSet:function(cmdSet){
		var cmd='';
		var reg=new RegExp('\-\-$');
		var reg1=new RegExp(',$');
		var reg2=new RegExp('^\-\-');
		var $this=SCSImgx;
		for(key in cmdSet){
			var tmp='';
			if( Object.prototype.toString.call($this.Cmd[key])!== '[object Function]'){
				tmp=$this.Cmd[key];
			}else if(Object.prototype.toString.call(cmdSet[key]) == '[object Array]'){
				tmp=$this.anlysisCmdSet(cmdSet[key]);
			}else{
				tmp=$this.Cmd[key](cmdSet[key]);
			}
			if(reg2.test(tmp)){
				cmd=cmd.replace(reg,'');
				cmd=cmd.replace(reg1,'');
			}
			cmd+=tmp;
		}
		return cmd;
	},
};
//cmdSet命令集合   例：{avf:true,olt:{json:'font_me',txt:'i love you',appendix:{gne:true,x:50,y:50},w:400}}
SCSImgx.getUploadSource=function(cmdSet,path,name){
	var cmd='/'+this.Cmd.anlysisCmdSet(cmdSet);
	var reg=new RegExp('\-\-$');
	var reg1=new RegExp(',$');
	var reg2=new RegExp('^\-\-');
	cmd=cmd.replace(reg,'');
	cmd=cmd.replace(reg1,'');
	cmd=cmd.replace(reg2,'');
	if(path.charAt(0)!=='/')path='/'+path;
	if(path.charAt(path.length-1)!=='/')path+='/';
	return this.Source.uploadSourceHost+cmd+path+name;
};
SCSImgx.getStaticSource=function(path,name){
	if(path.charAt(0)!=='/')path='/'+path;
	if(path.charAt(path.length-1)!=='/')path+='/';
	return this.Source.staticSourceHost+path+'/'+name;
};

SCSImgx.propotype=SCSImgx;
SCSImgx.propotype.init=function(statichost,uploadhost){
	this.Source.init(statichost,uploadhost);
	return this;
};

EXCImgx.Cmd={
	round:function(param){
		return 'round_'+param.w+'_'+param.h+'_';
	},
	normal:function(param){
		return 'normal_'+param.w+'_'+param.h+'_';
	},
	type:function(t){return t;},
	anlysisCmdSet:function(cmdSet){
		var cmd='';
		if(typeof cmdSet.round!=='undefined')
			cmd+=this.round(cmdSet.round);
		else if(typeof cmdSet.normal!=='undefined')
			cmd+=this.normal(cmdSet.normal);
		cmd+=cmdSet.name+'.';
		cmd+=this.type(cmdSet.type);
		return cmd;
	},
};

EXCImgx.getUploadSource=function(cmdSet,path,name){
	var typeReg=new RegExp('(.png|.jpg|.gif|.bmp|.tiff|.wbmp|.jpeg|.tif|.pdf|.jp2|.ico|.tga)$');
	cmdSet.name=name.replace(typeReg,'');
	var imgname=this.Cmd.anlysisCmdSet(cmdSet);
	if(path.charAt(0)!=='/')path='/'+path;
	if(path.charAt(path.length-1)!=='/')path+='/';
	return this.Source.uploadSourceHost+path+imgname;
};
EXCImgx.getStaticSource=function(path,name){
	if(path.charAt(0)!=='/')path='/'+path;
	if(path.charAt(path.length-1)!=='/')path+='/';
	return this.Source.staticSourceHost+path+name;
};

EXCImgx.propotype=EXCImgx;
EXCImgx.propotype.init=function(statichost,uploadhost){
	this.Source.init(statichost,uploadhost);
	return this;
};

SourceLoad.propotype=SourceLoad;
SourceLoad.propotype.constructor=SourceLoad.constructor;
SourceLoad.propotype.init=function(){
	this._excImx=EXCImgx.init(STATICSOURCE_HOST,IMAGEUPLOAD_HOST);
	this._scsImgx=SCSImgx.init(STATICSOURCE_HOST,IMAGEUPLOAD_HOST);	
	return this.propotype;
};
SourceLoad.propotype.getUploadSource=function(srcStType,cmdSet,path,name){
	var _Imgx=null;
	switch(srcStType){
		case 0:{
			_Imgx=this._excImx;
			break;
		}
		case 1:{
			_Imgx=this._scsImgx;
			break;
		}
	}
	var img=new Image();
	img.src=_Imgx.getUploadSource(cmdSet,path,name);
	return img.src;
};
SourceLoad.propotype.getStaticSource=function(srcStType,path,name){
	var _Imgx=null;
	switch(srcStType){
		case 0:{
			_Imgx=this._excImx;
			break;
		}
		case 1:{
			_Imgx=this._scsImgx;
			break;
		}
	}
	var img=new Image();
	img.src=_Imgx.getStaticSource(path,name);
	return img.src;
};
SourceLoad.propotype.init.propotype=SourceLoad.propotype;

var sourceLoadManager=new SourceLoad();
//c_thumb,g_face,w_200,h_200,r_max,bo_6_ffffff80,f_png
// var test=sourceLoadManager.getUploadSource(StorageTypeDict.SCSIMGX,{cth:true,gfa:true,w:200,h:200,r:'max',bor:{b:6,c:'ffffff80'},fmt:'png'},'/Uploads/Home/380/sofaImg','5645a1fda86f9.jpg');
//var test1=sourceLoadManager.getUploadSource(StorageTypeDict.EXCIMGX,{round:{w:100,h:100},type:'png'},'/path','mypo.jpg');
// console.log(test);
//console.log(test1);

