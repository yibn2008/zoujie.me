/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:22:27
* @Last Modified by:   zoujie.wzj
* @Last Modified time: 2016-03-29 23:09:26
*/

'use strict'

const path = require('path')
const view = require('./view')
const blog = require('./blog')
const utils = require('./utils')

module.exports = {
  * home (next) {

    this.body = yield view.render('index', {
      title: '首页'
    })
  },

  * blogList () {
    let summary = yield blog.summary()

    this.body = yield view.render('list', {
      title: '文章列表',
      blogs: summary.blogs
    })
  },

  * blog () {
    let name = this.params.name
    if (!name) {
      this.throw(400)
    }

    let result = yield blog.read(name, true)
    if (!result) {
      this.throw(404)
    }

    // console.log(result)

    this.body = yield view.render('blog', {
      title: result.title,
      date: result.date,
      author: result.author,
      content: result.content
    })
  }
}
