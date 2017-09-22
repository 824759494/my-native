
const express = require('express')
const path = require('path')
const http = require('http')
const request = require('request')
const fs = require('fs')
const multiparty = require('connect-multiparty')
let multipartMidd = multiparty();
let port = process.env.PORT || 3000;
let app = express();

app.set("views","./views")
app.set("view engine","jade")
app.use(express.static(__dirname + '/static'));

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
    let _fileName,_path,_text = {};
    try {
        _fileName = req.files.file.originalFilename,
        _path = req.files.file.path;
        console.log(_fileName,_path);
    } catch (error) {
        res.render("write",returnText("上传失败","文件上传失败",_fileName,error));
        return false;
    }
    
    let rs = fs.createReadStream(_path);

    _text = returnText("文件上传失败","文件上传失败",_fileName,"文件已存在");
    let exists = fs.existsSync(__dirname + "/source/" + _fileName);
    if(!exists){
        rs.pipe(fs.createWriteStream(__dirname + "/source/" + _fileName));
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

