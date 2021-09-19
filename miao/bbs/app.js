const { constants } = require('crypto')

const express = require('express'),
  exp = require('constants'),
  fs = require('fs'),
  path = require('path'),
  url = require('url'),
  port = 8008,
  app = express(),
  cookieParser = require('cookie-parser')
escape = require('lodash/escape')


const users = loadfile('./users.json')
users.lastId = 1
const posts = loadfile('./posts.json')
posts.lastId = 1
const comments = loadfile('./comments.json')

function loadfile(file) {
  try {
    var content = fs.readFileSync(file)
    return JSON.parse(content)
  }
  catch (e) {
    return []

  }
}


setInterval(() => {
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2))
  fs.writeFileSync('./posts.json', JSON.stringify(posts, null, 2))
  fs.writeFileSync('./comments.json', JSON.stringify(comments, null, 2))
  // console.log('saved')
}, 5000);




app.use((req, res, next) => {
  console.log('请求方法：' + req.method, '请求路径：' + req.url, '请求的cookie: ' + req.headers.cookie)
  console.log('__dirname:' + __dirname)
  next()
})
app.use(express.static(__dirname + '/static'))
app.use(express.json())   //解析json数据的请求体的中间件
app.use(express.urlencoded())     //解析url编码的请求体的中间件
app.use(cookieParser('knckandsksknaksnd')); //用于给cookie签名的中间件 内容填的是内容签名的密码
app.use((req, res, next) => {
  if (req.signedCookies.loginUserName) {
    req.islogin = true
    // req.loginUser = users.find(it => it.name == req.signedCookies.loginUserName)
  } else {
    req.islogin = false
    // req.loginUser = null
  }
  next()
})

app.get('/', (req, res, next) => {
  var page = Number(req.query.page || 1)
  var pageSize = 10
  var pageStartIdx = (page - 1) * pageSize
  var pageEndIdx = pageStartIdx + pageSize
  var pagePosts = posts.slice(pageStartIdx, pageEndIdx)
  if (pagePosts.length == 0) {
    res.send('no pages')
    return
  }




  res.send(`<h1>BBS</h1>
             <div>
             ${req.islogin ?
      `<a href='/post'>发帖</a>
               <a href='/logout'>登出</a>`:
      `<a href='/login'>登录</a>
               <a href='/register'>注册</a>`


    }
              </div>

              <ul>
              ${pagePosts.map(post => {
      return ` <li><a href='/post/${escape(post.id)}'>${escape(post.title)}</a><a>by ${escape(post.postedBy)}</a</li>`
    }).join('\n')
    }
              </ul>

              <p>
              <a href='/?page=${page - 1 < 0 ? 1 : page - 1}'>上一页</a>
              <a href='/?page=${page + 1}'>下一页</a>
              </p>
              
              `)
})

//----------------------------------------post页面-----------------------------------------------
app.route('/post')
  .get((req, res, next) => {

    res.sendFile(__dirname + '/static/post.html')

  })
  .post((req, res, next) => {
    var postInfo = req.body
    var userName = req.signedCookies.loginUserName
    if (userName) {
      postInfo.timestamp = new Date().toISOString()
      postInfo.id = posts.length
      postInfo.postedBy = userName
      posts.push(postInfo)
      res.redirect('/post/' + postInfo.id)
    } else {
      res.send('未登录。。。。。。')
    }
  })

//当请求的路径是这么写的时候http://localhost:8008/post/0
app.get('/post/:postId', (req, res, next) => {

  var postId = req.params.postId
  var post = posts.find(it => it.id == postId)


  if (post) {
    var postComments = comments.filter(it => it.postId == postId)
    res.send(`
    <h1>BBS</h1>
             <div>
             ${req.islogin ?
        `<a href='/post'>发帖</a>
               <a href='/logout'>登出</a>`:
        `<a href='/login'>登录</a>
               <a href='/register'>注册</a>`
      }
              </div>

    <h1>${escape(post.title)}</h1>
    <fieldset>${escape(post.content)}</fieldset>
    <hr>
    ${postComments.map(it => {
        return `
        <fieldset>
        <legend>${escape(it.commentBy)}</legend>
        <p>${escape(it.comment)}</p>
        </fieldset>

        `
      }).join('\n')
      }

    ${req.islogin ?
        `
       <form action='/comment/post/${postId}/' method='POST'>
        <h3>发表评论</h3>
        <div><textarea name='comment'></textarea></div>
        <button>发布</button>
        </form>
      `:
        `
      <p>请先登录再发表评论</p>
      `
      }

   
    `)
  } else {
    res.status(404).end('404 is not found')
  }
})

//向帖子发表评论  id为帖子编号
app.post('/comment/post/:postId', (req, res, next) => {
  if (req.islogin) {
    var comment = req.body
    comment.timestamp = new Date().toISOString()
    comment.postId = req.params.postId
    comment.commentBy = req.signedCookies.loginUserName
    comments.push(comment)
    res.redirect(req.headers.referer || '/')

  } else {
    res.send('还没登录')
  }
})
//-----------------------------------------------------------------------------------------------


//-----------------------------------------登录页面-----------------------------------------------
app.route('/login')
  .get((req, res, next) => {    //用来接受访问login页面的get请求
    res.send(`
      <h1>登录</h1>
      <form action="/login" method="POST">
        <div> Username: <input type="text" name="name"></div>
        <div> Password: <input type="password" name="password"></div>
        <input hidden name='return_to' value ='${req.headers.referer || '/'}'>
        <br>
        <button>登陆</button>
      </form>
    `)
  })
  .post((req, res, next) => {    //用来处理login页面表单发过来的的post请求
    var logInfo = req.body
    var user = users.find(it => it.name == logInfo.name && it.password == logInfo.password)

    if (user) {
      res.cookie('loginUserName', user.name, {
        signed: true
      })
      // res.cookie('loginUserId', user.id)     //可以有多个cookie 
      // res.cookie('loginUserEmail', user.email)
      res.redirect(logInfo.return_to)
    } else {
      res.send('用户名密码错误')
    }

  })
//------------------------------------------------------------------------------------------------



//------------------------------------------登出功能------------------------------------------------
app.get('/logout', (req, res, next) => {
  res.clearCookie('loginUserName')
  res.redirect(req.headers.referer || '/ ')

})

//--------------------------------------------------------------------------------------------------


//------------------------------------------注册页面----------------------------------------------
app.route('/register')
  .get((req, res, next) => {    //用来接受访问register页面的get请求
    res.sendFile(__dirname + '/static/register.html')
  })
  .post((req, res, next) => {    //用来处理register页面表单发过来的的post请求
    var regInfo = req.body
    var USERNAME_RE = /^[0-9a-z]+$/
    if (!USERNAME_RE.test(regInfo.name)) {
      res.status(404).send('用户名不合法')
    }
    else if (users.some(it => it.name == regInfo.name) || users.some(it => it.email == regInfo.email)) {
      res.status(404).send('用户名或email已存在')
    }
    else if (regInfo.password.length == 0) {
      res.status(404).send('密码长度不能为0')
    }
    else {
      regInfo.id = users.length
      users.push(regInfo)

      res.send('registering......')
    }
  })

//-------------------------------------------------------------------------------------------------

app.listen(port, () => {
  console.log('server is running at' + port)
})
