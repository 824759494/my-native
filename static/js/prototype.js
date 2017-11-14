
function Etool(){
	var val = 0;
	this.m = {};
	this.render = function(){
		console.log(val);
		console.log("开启渲染");
	}
}

Etool.prototype = {
	render : function(){
		console.log("render函数的this:",this)
		console.log(this.m)
		console.log("执行渲染方案");
	},
	resize : function(){
		console.log("resize函数的this:",this)
		console.log(this.m)
		console.log("变更大小")
	}
}

Etool.prototype.size = function(){
	console.log("size函数的this:",this)
	console.log(this.m)
}

function Per(){
	this.name = "kl";
}

Per.prototype = new Etool();

function Animal(){
	Etool.call(this);
}

var k = new Per();

var etool = new Etool();

etool.render();
etool.__proto__.render();
etool.resize();
etool.size();

console.log(k)