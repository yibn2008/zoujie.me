/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:17:16
* @Last Modified by:   zoujie.wu
* @Last Modified time: 2016-03-27 18:48:24
*/

'use strict'

const koa = require('koa')
const chalk = require('chalk')
const mount = require('koa-mount')
const serv = require('koa-static')
const logger = require('koa-logger')
const router = require('koa-router')()
const route = require('./lib/route')
const app = koa()

const PORT = 8001

// register routes
route(router)

// add logger
app.use(logger())

// statics
app.use(mount('/blog/images', serv('./blog/images')))
app.use(mount('/assets', serv('./assets')))

// add routers
app.use(router.routes())
app.use(router.allowedMethods())

// listen
app.listen(PORT)

console.log('开始监听 %s ...', chalk.cyan(`http://localhost:${PORT}`))
