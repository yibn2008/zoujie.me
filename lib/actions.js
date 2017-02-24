/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:22:27
* @Last Modified by:   zoujie.wzj
* @Last Modified time: 2017-02-24 18:57:28
*/

'use strict'

const path = require('path')
const view = require('./view')
const blog = require('./blog')
const utils = require('./utils')

const UPDATE_PERIOD = 1000 * 30
const BASE_DIR = path.dirname(__dirname)

let lastUpdate = 0

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

    let result = yield blog.read(name)
    if (!result) {
      this.throw(404)
    }

    this.body = yield view.render('blog', {
      title: result.title,
      date: result.date,
      author: result.author,
      content: result.content
    })
  },

  * updateBlog () {
    let query = this.request.query

    if (query.key !== process.env.DEPLOY_KEY) {
      this.throw(400, 'DEPLOY_KEY is incorrect')
      return
    }

    if (Date.now() - lastUpdate < UPDATE_PERIOD) {
      this.status = 201
      return
    }

    if (!utils.fstat(path.join(BASE_DIR, '.git'))) {
      this.throw(400, '.git dir not exists, cannot update')
    }

    // git pull codes
    try {
      yield utils.exec('git pull', {
        cwd: BASE_DIR
      })
    } catch (err) {
      console.error(err)
      this.throw(500)
    }

    this.status = 200
  }
}
