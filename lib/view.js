/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 22:13:26
* @Last Modified by:   zoujie.wzj
* @Last Modified time: 2016-03-26 22:19:27
*/

'use strict'

const path = require('path')
const nunjucks = require('nunjucks')

const viewDir = path.join(__dirname, '../view')

// config
nunjucks.configure(viewDir)

module.exports = {
  render (viewFile, params) {
    return new Promise((resolve, reject) => {
      if (!path.extname(viewFile)) {
        viewFile += '.nj'
      }

      let file = path.join(viewDir, viewFile)

      nunjucks.render(file, params, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
