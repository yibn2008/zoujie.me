/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:52:20
* @Last Modified by:   zoujie.wu
* @Last Modified time: 2016-03-27 18:29:14
*/

'use strict'

const fs = require('fs-promise')

module.exports = {
  fstat (file) {
    try {
      return fs.statSync(file)
    } catch (err) {

      return false
    }
  },
  readJSON (file) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch (err) {
      console.error(err)
      return false
    }
  },
  trimExt (file, ext) {
    if (ext) {
      if (file.substring(file.length - ext.length) === ext) {
        file = file.substring(0, file.length - ext.length)
      }
    } else {
      let idx = file.lastIndexOf('.')
      if (idx > 0) {
        file = file.substring(0, idx)
      }
    }

    return file
  }
}
