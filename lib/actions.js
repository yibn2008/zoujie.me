/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:22:27
* @Last Modified by:   zoujie.wu
* @Last Modified time: 2016-03-27 18:42:01
*/

'use strict'

const path = require('path')
const view = require('./view')
const blog = require('./blog')
const utils = require('./utils')

module.exports = {
  * home (next) {

    this.body = yield view.render('index', {
      title: 'xxx'
    })
  },

  * blogList () {
    let summary = blog.summary()

    this.body = yield view.render('list', {
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

    this.body = yield view.render('blog', {
      title: result.meta.title,
      date: result.meta.date,
      content: result.html
    })
  }
}
