var fs = require('fs')


var commentFilePath = './db/comment.json'


// 这是一个用来存储 Blog 数据的对象
const ModelComment = function(form) {
    // || 是一种新的写法, 在 js 圈子里太过流行, 所以记住即可
    // a = b || c 意思是如果 b 是 undefined 或者 null 就把 c 赋值给 a
    this.author = form.author || ''
    this.content = form.content || ''
    this.blog_id = form.blog_id || 0
    this.id = form.id || 0
    // 生成一个 unix 时间, unix 时间是什么, 上课会说
    this.created_time = Math.floor(new Date() / 1000)
}

const loadComments = function(callback) {
    // 确保文件有内容, 这里就不用处理文件不存在或者内容错误的情况了
    // 注意, 一般都是这样不处理的
    var content = fs.readFileSync(commentFilePath, 'utf8')
    var blogs = JSON.parse(content)
    return blogs
}

/*
c 这个对象是我们要导出给别的代码用的对象
它有一个 data 属性用来存储所有的 blogs 对象
它有 all 方法返回一个包含所有 blog 的数组
它有 new 方法来在数据中插入一个新的 blog 并且返回
他有 save 方法来保存更改到文件中
*/
var c = {
    data: loadComments()
}

c.all = function() {
  return this.data
}

c.new = function(form) {
    var m = new ModelComment(form)
    // console.log('new blog', form, m)
    // 设置新数据的 id
    var d = this.data[this.data.length-1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    // 把 数据 加入 this.data 数组
    this.data.push(m)
    // 把 最新数据 保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

c.save = function() {
    var s = JSON.stringify(this.data)
    fs.writeFile(commentFilePath, s, (err) => {
      if (err) {
          console.log(err)
      } else {
          console.log('保存成功')
      }
    })
}

c.delete = function(id) {
    // 找到对应 comment 并删除
    var s = this.data
    for(let i = 0; i < s.length; i++) {
        if(s[i].id == id) {
            s.splice(i, 1)
            break
        }
    }
    // 给所有 comment 数据重新编号
    for(let i = 0; i < s.length; i++) {
        if(s[i].id > id) {
            s[i].id = s[i].id - 1
            console.log('被改变的s[i]', s[i])
        }
    }

    var cr = JSON.stringify(s)
    fs.writeFile(commentFilePath, cr, (err) => {
      if (err) {
          console.log(err)
      } else {
          console.log('保存成功')
      }
    })
}


// 导出一个对象的时候用 module.exports = 对象 的方式
// 这样引用的时候就可以直接把模块当这个对象来用了(具体看使用方法)
module.exports = c
