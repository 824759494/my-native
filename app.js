
const express = require('express')
const path = require('path')
const http = require('http')
const request = require('request')
const fs = require('fs')
const multiparty = require('connect-multiparty')
let multipartMidd = multiparty();
let port = process.env.PORT || 3000;
let app = express();

app.engine("html",function(filepath,option,callback){
    fs.readFile(filepath,function(err,content){
        if(err){
            return callback(new Error(err));
        }
        let _str = content.toString(),
        reg = /{{([^}}]+)}}/g,
        s = _str.match(reg),
        _temp = "",
        _ev;
        s.forEach(function(v){
            _temp = v;
            v = v.replace("{{","");
            v = v.replace("}}","");
            _ev = eval("option." + v);
            _str =  _str.replace(_temp,_ev?_ev:"");
        });
        return callback(null,_str);
    })
})

app.set("views","./views")
app.set("view engine","html")
app.use(express.static(__dirname + '/static'));

//页面拦截器
app.use(function (req, res, next) {
    var url = req.originalUrl;
    console.log("请求的",url)
    let exists = fs.existsSync(__dirname + "/views/" + url + ".html");
    console.log(exists)
    if(!exists){
        return res.sendFile(__dirname + "/static/AmazeUI-2.7.2/admin-404.html");
    }
    return (res.render("index",{
        mk:{
            data:"这是一个测试"
        },
        ok:"<h1 style='color:red;'>Hello World etool</h1>"
    }))
   /*  if (url != "/login") {
        return res.redirect("/login");
    } */
   next();
});
app.get("/write",function(request,response){
    console.log(__dirname)

    let rs = fs.createReadStream(__dirname + "./881223.jpg");
    rs.pipe(fs.createWriteStream(__dirname + "/source/123.png"));

    response.render("write",{
        title:"读取文件保存文件",
        alt:"这是一个文件读取保存的页面"
    })
})

function returnText(title,alt,name,msg){
    let resJson = {
        title:title?title:"文件上传",
        alt:alt?alt:"",
        name : name?name:"",
        content : {
            msg: msg?msg:""
        }
    }
    return resJson;
}

app.post("/upload",multipartMidd,function(req,res){
    let _fileName,_path,_text = {},_type = "time";
    try {
        _type = req.query.type;
        _fileName = req.files.file.originalFilename,
        _path = req.files.file.path;
    } catch (error) {
        res.render("write",returnText("上传失败","文件上传失败",_fileName,error));
        return false;
    }
    console.log("类型",_type)
    let rs = fs.createReadStream(_path);
    let _time = new Date().getTime();
    if(_type !== "time"){
        _time = "";
    }else{
        getMkDir(_time);
    }

    _text = returnText("文件上传失败","文件上传失败",_fileName,"文件已存在");
    let exists = fs.existsSync(__dirname + "/source/" + _time + "/" + _fileName);
    if(!exists){
        rs.pipe(fs.createWriteStream(__dirname + "/source/" + _time + "/" + _fileName));
        _text = returnText("文件上传成功","文件上传成功",_fileName,"文件已成功保存到服务器");
    }
    fs.unlink(_path,function(){
        console.log("删除文件成功")
    });
    res.render("write",_text);
    return false;
})

app.listen(port,function(val){
    console.log(val)
    console.log("已启动端口：" + port);
})

function getMkDir(_time){
     //读取文件目录
     let taskDir = fs.readdirSync(__dirname + "/source/");
     console.log("文件目录下有什么：",taskDir)
     taskDir.forEach((v,i,arr) => {
         let stat = fs.lstatSync(__dirname + "/source/" + v);
        // console.log("是否是文件夹：" ,stat.isDirectory())
         if(stat.isDirectory()){
             console.log("上传的文件时创建的文件夹下的文件：" ,fs.readdirSync(__dirname + "/source/" + v));
         }
     })


     let _mkFlag = fs.mkdirSync(__dirname + "/source/" + _time);
     //console.log("创建是否成功：",_mkFlag)
     //读取文件目录
}