// Blog 主体的模板
var blogTextTemplate = function(blog) {
    var title = blog.title
    var author = blog.author
    var content = marked(blog.content)
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
      <div class='text-title'>${title}</div>
      <div class='text-content markdown-body'>
        ${content}
      </div>
      <div class='text-message'>
          <span class='text-author'>${author}</span>
          <span class='separator'>|</span>
          <i class='iconfont icon-shizhong'></i><time class='text-time'>${time}</time>
      </div>
    </div>
    `
    return t
}

// 添加 Blog 主体
var insertBlogTextAll = function(blogs, page) {
    console.log('insertBlogTextAll page', page)
    var html = ''
    var [k, v] = page.slice(0).split('-')
    console.log('insertBlogTextAll k v', k, v)
    for (var i = 0; i < blogs.length; i++) {
        var b = blogs[i]
        if(b.id == v) {
            var t = blogTextTemplate(b)
            html += t
            break
        }
    }
    // 把数据写入 .gua-blogs 中, 直接用覆盖式写入
    var div = document.querySelector('.blog-text')
    div.innerHTML = html
}

var blogTextAll = function(page) {
    var request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var blogs = JSON.parse(response)
            insertBlogTextAll(blogs, page)
        }
    }
    ajax(request)
}

var commentsTemplate = function(com) {
    var author = com.author
    var content = com.content
    var d = new Date(com.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
      <div class="blog-comments-cell">
          <div class="comments-cell-comment">${content}</div>
          <div class="">
              <span>${author}</span> @ <time>${time}</time>
          </div>
      </div>
    `
    return t
}

var insertCommentAll = function(comments) {
    var html = ''
    for (var i = 0; i < comments.length; i++) {
        var c = comments[i]
        // 取当前页面发表评论按钮上的 blog id
        var comBlogId = document.querySelector('.comment-blog-id').value
        console.log('comBlogId启动', comBlogId)
        if(c.blog_id == comBlogId){
          var t = commentsTemplate(c)
          html += t
          break
        }
    }
    // console.log('insertCommentAll启动', html)
    var blogCommentsDiv = document.querySelector('.blog-comments')
    blogCommentsDiv.insertAdjacentHTML('beforeend', html)
}

var commentAll = function() {
    var request = {
        method: 'GET',
        url: '/api/comment/all',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            console.log('响应', response)
            var comments = JSON.parse(response)
            insertCommentAll(comments)
        }
    }
    ajax(request)
}

var commentNew = function(form) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/comment/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

// 添加博客详情的 html
var insertBlogDetail = function(blogId) {
    var [k, blogid] = blogId.slice(0).split('-')
    console.log('insertBlogDetail page', blogid)
    var t = `
        <div class='blog-detail-container'>
            <div class="blog-detail-background"></div>
            <div class="blog-text"></div>
                <div class="blog-comments-container">
                    <div class='blog-comments-add'>
                        <h2>LEAVE A COMMENT</h2>
                        <input class='comment-blog-id' type=hidden value="${blogid}">
                        <input class='comment-author' placeholder="Your name...">
                        <textarea class='comment-content' placeholder="Message..."></textarea>
                        <button class='comment-add'>发表评论</button>
                    </div>
                    <div class='blog-comments'>
                        <h2>COMMENTS</h2>
                    </div>
                </div>
        </div>
    `
    var pageDiv = document.querySelector('.blog-pages-container')
    // 在容器中添加 详情
    pageDiv.innerHTML = t
}
