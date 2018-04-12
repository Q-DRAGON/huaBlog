var removeClassAll = function(elements, className) {
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var ajax = function(request) {
    /*
    request 是一个 object, 有如下属性
        method, 请求的方法, string
        url, 请求的路径, string
        data, 请求发送的数据, 如果是 GET 方法则没这个值, string
        callback, 响应回调, function
    */
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

// blog 模板
var blogTemplate = function(blog) {
    var id = blog.id
    var title = blog.title
    var author = blog.author
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
    <div class="hua-blog-cell">
      <div class='cover'></div>
      <h2>
        ${title}
      </h2>
      <div class="hua-blog-message">
          <span class='hua-blog-author'>${author}</span> <i class='iconfont icon-shizhong'></i> <time>${time}</time>
          <div>
              <span class='blog-detail' data-id=${id}>read more</span>
              <button class='blog-delete' data-id=${id}>delete</button>
              <button class='blog-update' data-id=${id}>update</button>
          </div>
      </div>
    </div>
    `
    return t
}

// 添加 blog 模板
var insertBlogAll = function(blogs) {
    var html = ''
    for (var i = 0; i < blogs.length; i++) {
        var b = blogs[i]
        var t = blogTemplate(b)
        html += t
    }
    // 把数据写入 .gua-blogs 中, 直接用覆盖式写入
    var div = document.querySelector('.hua-blogs')
    div.insertAdjacentHTML('beforeend', html)
}

// 请求 blog 文章目录
var blogAll = function() {
    const debug = process.env.NODE_ENV !== 'production'
    // var path = '/api/blog/all' 
    var path = 'https://raw.githubusercontent.com/Q-DRAGON/huaBlog/master/db/blog.json'
    var request = {
        method: 'GET',
        url: path,
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            console.log('响应', response)
            var blogs = JSON.parse(response)
            insertBlogAll(blogs)
        }
    }
    ajax(request)
}

// 添加 blog 文章
var blogNew = function(form) {
    var data = JSON.stringify(form)
    console.log('form', form, typeof form, 'data',data, typeof data)
    var request = {
        method: 'POST',
        url: '/api/blog/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

// 删除 blog 文章
var blogDelete = function(blogId) {
    var data = blogId
    console.log('form', blogId, typeof blogId, 'data',data, typeof data)
    var request = {
        method: 'POST',
        url: '/api/blog/delete',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
        }
    }
    ajax(request)
}

// 标签添加红色右边框样式
var addBorderRight = function(page) {
    var pageTag = '.' + page + '-tag'
    console.log('pageTag', pageTag)
    var element = document.querySelector(pageTag)
    console.log('addborder', element)
    var elements = document.querySelectorAll('.hua-tag')
    removeClassAll(elements, "tagBorderStyle")
    element.classList.add("tagBorderStyle")
}

// 绑定按钮
var blogEvents = function() {
    var sendForm = document.querySelector('.hua-send')
    var form = document.querySelector('#hua-form')
    sendForm.addEventListener("click", function(event){
      console.log('sendForm click')
      if(form.classList.contains('form-hide')){
          form.className = 'form-show'
      } else {
          form.className = 'form-hide'
      }
    })

    // 绑定 发布新博文按钮 事件
    var submit = document.querySelector('#id-button-submit')
    submit.addEventListener("click", function(event){
      console.log('发表新博文 click')
      // 取三个 input 的值生成 object
      var form = {
          title: document.querySelector('#id-input-title').value,
          author: document.querySelector('#id-input-author').value,
          content: editor.getValue(),
      }
      blogNew(form)
    })

  // 绑定标签按钮
  var huaTags = document.querySelector('#hua-tags')
  huaTags.addEventListener('click', function(){
      var target = event.target
      var dataId = target.dataset.id
      if(target.classList.contains('hua-tag')){
          console.log('dataId', dataId)
          showPage(dataId)
          pushState(dataId)
      }
  })

  // 事件委托 详情，添加，删除，更新
  var blogContainerDiv = document.querySelector('.blog-pages-container')
  blogContainerDiv.addEventListener('click', () => {
      if(event.target.classList.contains('blog-detail')) {
          console.log('detail被点击')
          var dataId = event.target.dataset.id
          var page = 'blog-' + dataId
          showPage(page)
          pushState(page)
      } else if (event.target.classList.contains('comment-add')){
        //   console.log('发表评论')
          var form = {
                author: document.querySelector('.comment-author').value,
                content: document.querySelector('.comment-content').value,
                blog_id: document.querySelector('.comment-blog-id').value,
            }
            if(form.author != '' && form.content != '') {
                console.log('form', form)
                commentNew(form)
                commentAll()
            }
      } else if(event.target.classList.contains('blog-delete')){
          var dataId = event.target.dataset.id
          console.log('delete被点击', dataId)
          var blogid = `{"id": ${dataId}}`
          console.log('blogid', blogid)
          blogDelete(blogid)
      }
  })
}

// 联系页面的模板
var contactTemplate = function() {
    var t  = `
        <div class='hua-contact blog-page'>
            <header>
                <h2 class='contect-title'>CONTACT ME</h2>
                <h3 class='contect-title'>GET IN TOUCH</h3>
            </header>
            <div class='contect-subheading'>GET IN TOUCH</div>
                <div class="contact-left">
                    <div class='contact-phone'>
                        <i class='iconfont icon-web-icon-'></i>
                        <div class='contact-detail'>
                            <span class='contact-method'>PHONE</span><br>
                            <span>15********9</span>
                        </div>
                    </div>
                    <div class='contact-mail'>
                        <i class='iconfont icon-youjian'></i>
                        <div class='contact-detail'>
                            <span class='contact-method'>MAIL</span><br>
                            <span>z574203238@qq.com</span>
                        </div>
                    </div>
                    <div class='contact-qq'>
                        <i class='iconfont icon-qq'></i>
                        <div class='contact-detail'>
                            <span class='contact-method'>QQ</span><br>
                            <span>574203238</span>
                        </div>
                    </div>
                </div>
                <div class="contact-right">
                    <div class='contact-wechat'>
                        <i class='iconfont icon-weixin'></i>
                        <div class='contact-detail'>
                            <span class='contact-method'>WECHAT</span><br>
                            <span>鼠标移动到图标上即可显示二维码</span>
                        </div>
                    </div>
                    <div class='contact-github'>
                        <i class='iconfont icon-github'></i>
                        <div class='contact-detail'>
                            <span class='contact-method'>GITHUB</span><br>
                            <span>鼠标点击图标即可进入 github</span>
                        </div>
                    </div>
                </div>
        </div>
    `

    return t
}

// 展示页面
var showPage = function(page) {
    console.log('showpage的ID', page)
    var container = document.querySelector('.blog-pages-container')
  // 根据不同的 tab 调用不同的函数，实现相应的需求
    if(page == 'hua-blogs') {
      container.innerHTML = `<div class="hua-blogs blog-page">
                                <header>
                                    <h2 class='blog-page-title'>MY BLOG</h2>
                                    <h3 class='blog-page-title'>MY DIARY</h3>
                                </header>
                        </div>`
      addBorderRight(page)
      blogAll(page)
    } else if (page == 'hua-home') {
      container.innerHTML = `<div class='hua-home blog-page'></div>`
      addBorderRight(page)
    } else if (page == 'hua-contact') {
      container.innerHTML = contactTemplate()
      addBorderRight(page)
  } else {
      // 载入 detail Div
      insertBlogDetail(page)
      // 载入 detail blog 文章
      blogTextAll(page)
      //载入 detail blog 的相应评论
      commentAll()
  }
}

var pushState = function(className) {
  var [k, v] = className.slice(0).split('-')
  if(k == 'hua') {
      var url = '?page=' + v
  } else {
      var url = '?blog=' + v
  }
  var state = {
      page: className,
  }
  history.pushState(state, 'title', url)
  document.title = v
}

// 刷新时不保存历史记录
var replaceState = function(className) {
    var [k, v] = className.slice(0).split('-')
    if(k == 'hua') {
        var url = '?page=' + v
    } else {
        var url = '?blog=' + v
    }
    var state = {
        page: className,
    }
    history.replaceState(state, 'title', url)
    document.title = v
}

var initApp = function() {
  var query = location.search
  console.log('query', query)
  var [k, v] = query.slice(1).split('=')
  var page = 'home'
  var validPages = ['home', 'blogs', 'contact']
  console.log('initApp k v', k, v)
  // k 是不是 page, v是不是 tag 中的一个，如果条件都符合，则仅刷新但不改变页面
  if(k = 'page' && validPages.includes(v)) {
      var page = v
      var pageName = 'hua-' + page
  } else if (k == 'blog') {
      var pageName = 'blog-' + v
  } else {
      var pageName = 'hua-' + page
  }
  // 判断是否是刷新
  if(location.reload) {
      console.log('reload')
      replaceState(pageName)
  }
  console.log('ini page', pageName)
  showPage(pageName)
  // pushState(pageName)
}

// 前进 or 后退
window.addEventListener("popstate", function(e){
    var state = e.state
    // state 就是 pushState 的第一个参数
    var pageName = state.page
    var [k, v] = pageName.slice(0).split('-')
    console.log('pop state', state, pageName, 'k', k)
    showPage(pageName)
    // pushState(pageName)
})


var __main = function() {
      // 载入博客列表
      initApp()
      blogEvents()
}

__main()
