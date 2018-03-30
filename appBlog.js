// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var app = express()
var bodyParser = require('body-parser')

app.use(bodyParser.json())

// 配置静态文件目录
app.use(express.static('static'))


// 加载 blog.js 模块
const blog = require('./model/blogModule')

// 加载 comment.js 模块
const comment = require('./model/commentModule')


var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        console.log(`读取的html文件 ${path} 内容是`, data)
        response.send(data)
    })
}

// / 是用户访问主页的路径
/*
现在可以返回这么几个页面
- 主页, 返回博客列表
- 详细页面, 返回某个单一的博客页面
*/
app.get('/', function(request, response) {
    var path = 'blogIndex.html'
    sendHtml(path, response)
})

// ***
// /api 系列路径都是用来和前端 ajax 交互数据的
app.get('/api/blog/all', function(request, response) {
    // 加载数据并返回
    console.log(typeof blog, blog, Object.keys(blog))
    var blogs = blog.all()
    var r = JSON.stringify(blogs)
    response.send(r)
})

app.post('/api/blog/add', function(request, response) {
    // 浏览器发过来的数据我们一般称之为 form (表单)
    var form = request.body
    // 插入新数据并返回
    var b = blog.new(form)
    var r = JSON.stringify(b)
    response.send(r)
})

app.post('/api/blog/delete', function(request, response) {
    // 浏览器发过来的数据我们一般称之为 form (表单)
    var blogid = request.body
    console.log('delete blogid', blogid, 'blogid.blogid', blogid.id)
    var id = blogid.id
    // 插入新数据并返回
    var b = blog.delete(id)
    var r = JSON.stringify(b)
    response.send(r)
})

app.get('/api/comment/all', function(request, response) {
    // 加载数据并返回
    console.log(typeof comment, comment, Object.keys(comment))
    var comments = comment.all()
    var r = JSON.stringify(comments)
    response.send(r)
})

app.post('/api/comment/add', function(request, response) {
    // 浏览器发过来的数据我们一般称之为 form (表单)
    var form = request.body
    // 插入新数据并返回
    var c = comment.new(form)
    var r = JSON.stringify(c)
    response.send(r)
})

app.post('/api/comment/delete', function(request, response) {
    // 浏览器发过来的数据我们一般称之为 form (表单)
    var commentId = request.body
    // 插入新数据并返回
    var id = commentId.id
    var c = comment.delete(id)
    var r = JSON.stringify(c)
    response.send(r)
})

// listen 函数的第一个参数是我们要监听的端口
// 这个端口是要浏览器输入的
// 默认的端口是 80
// 所以如果你监听 80 端口的话，浏览器就不需要输入端口了
// 但是 1024 以下的端口是系统保留端口，需要管理员权限才能使用
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
