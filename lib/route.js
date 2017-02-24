/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:21:47
* @Last Modified by:   zoujie.wzj
* @Last Modified time: 2017-02-24 18:57:48
*/

'use strict'

const path = require('path')
const actions = require('./actions')

function wrapAction (func) {
  return function * (next) {
    yield next
    yield func.call(this)
  }
}

module.exports = function (router) {
  // home
  router.get('/', wrapAction(actions.home))

  // blog
  router.get('/blog-list', wrapAction(actions.blogList))
  router.get('/blog/:name', wrapAction(actions.blog))

  // api
  router.post('/api/update-blog', wrapAction(actions.updateBlog))
}
