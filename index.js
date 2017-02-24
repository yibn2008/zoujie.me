/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:17:16
* @Last Modified by:   zoujie.wzj
* @Last Modified time: 2017-02-24 18:44:27
*/

'use strict'

const koa = require('koa')
const chalk = require('chalk')
const mount = require('koa-mount')
const serv = require('koa-static')
const logger = require('koa-logger')
const router = require('koa-router')()
const route = require('./lib/route')
const config = require('./lib/config')
const app = koa()

const PORT = 8001

// register routes
route(router)

// add logger
app.use(logger())

// statics
app.use(mount('/blog/images', serv('./blog/images', {
  maxage: config.maxage
})))
app.use(mount('/assets', serv('./assets', {
  maxage: config.maxage
})))
app.use(mount('/demo', serv('./demo', {
  maxage: config.maxage
})))

// add routers
app.use(router.routes())
app.use(router.allowedMethods())

// listen
app.listen(PORT)

console.log('部署 Key: ', process.env.DEPLOY_KEY)
console.log('开始监听 %s ...', chalk.cyan(`http://localhost:${PORT}`))
