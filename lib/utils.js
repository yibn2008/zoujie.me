/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:52:20
* @Last Modified by:   zoujie.wzj
* @Last Modified time: 2016-03-30 23:25:16
*/

'use strict'

const chalk = require('chalk')
const fs = require('fs-promise')
const cp = require('child_process')

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
  },
  exec (cmd, opts) {
    return new Promise((resolve, reject) => {
      cp.exec(cmd, opts, (err, stdout, stderr) => {
        // output exec logs
        console.log('exec "%s":', chalk.cyan(cmd))
        console.log('---------------------------')
        console.log(stdout)
        if (stderr) {
          console.error(chalk.red(stderr))
        }
        console.log('---------------------------')

        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
