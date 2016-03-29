/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:21:47
* @Last Modified by:   zoujie.wzj
* @Last Modified time: 2016-03-29 22:56:23
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
}
