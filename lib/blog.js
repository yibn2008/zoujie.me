/*
* @Author: zoujie.wzj
* @Date:   2016-03-26 21:38:20
* @Last Modified by:   zoujie.wu
* @Last Modified time: 2016-03-27 18:52:44
*/

'use strict'

const fs = require('fs-promise')
const marked = require('marked')
const path = require('path')
const metaParse = require('meta-marked')
const moment = require('moment')
const config = require('./config')
const utils = require('./utils')

const blogDir = path.join(__dirname, '../blog')
const cacheDir = path.join(__dirname, '../cache')
const MD_EXT = '.md'
const TITLE_RULE = /^#\s*(.*)/

/**
 * Meta: {
 *   title: String,
 *   date: String (YYYY-MM-DD),
 *   author: String,
 *   desc: String
 * }
 */
function generateMeta (file, content) {
  let lines = content.split('\n')
  let title = path.basename(file, MD_EXT)
  let stat = utils.fstat(file)

  lines.forEach(line => {
    let matches = line.match(TITLE_RULE)

    if (matches) {
      title = matches[1]
      return false
    }
  })

  return {
    title: title,
    author: config.author,
    date: moment(stat.ctime).format('YYYY-MM-DD'),
    desc: null
  }
}

function * parseMarkdown (file) {
  let content = yield fs.readFile(file, 'utf8')
  let meta = generateMeta(file, content)
  let markdown = content

  try {
    let parsed = metaParse(content)

    markdown = parsed.markdown
    for (let name in parsed.meta) {
      meta[name.toLowerCase()] = parsed.meta[name]
    }
  } catch (err) {
    console.warn('parse meta failed, use auto-grenerated meta instead')
  }

  return {
    meta: meta,
    makrdown: markdown
  }
}

function * parseBlog (file) {
  let result = yield parseMarkdown(file)

  return {
    title: result.meta.title,
    date: result.meta.date,
    author: result.meta.author,
    desc: result.meta.desc,
    content: marked(result.markdown)
  }
}

function * scanBlogMetas (dir, exclude) {
  let metas = []

  // read all markdown files
  let entries = yield fs.readdir(dir)
  yield entries.map(function * (entry) {
    if (!entry.match(/\.md$/) || exclude.indexOf(entry) >= 0) {
      return
    }

    let file = path.join(dir, entry)
    let stat = utils.fstat(file)

    if (stat.isFile()) {
      let parsed = yield parseMarkdown(file)

      metas.push({
        meta: parsed.meta,
        file: file
      })
    } else {
      Array.prototype.push.apply(metas, yield scanBlogMetas(file, exclude))
    }
  })

  return metas
}

function * summary (scan) {
  let summaryFile = path.join(blogDir, 'summary.json')

  if (!scan) {
    return utils.readJSON(summaryFile)
  } else {
    let metas = yield scanBlogMetas(blogDir, ['images'])
    let blogs = []

    metas.forEach(item => {
      let meta = item.meta

      meta.name = utils.trimExt(path.relative(blogDir, item.file), MD_EXT)

      blogs.push(meta)
    })

    let summary = {
      created: Date.now(),
      blogs: blogs
    }

    yield fs.writeFile(summaryFile, JSON.stringify(summary, null, 2), 'utf8')

    return summary
  }
}

function * readBlog (name, force) {
  let blogFile = path.join(blogDir, name + MD_EXT)
  let cacheFile = path.join(cacheDir, name + MD_EXT)

  let blogStat = utils.fstat(blogFile)
  let cacheStat = utils.fstat(cacheFile)
  let result

  if (!blogStat) {
    return
  }

  if (force || !cacheStat || cacheStat.mtime < blogStat.mtime) {
    result = yield parseBlog(blogFile)

    yield fs.writeFile(cacheFile, JSON.stringify(result), 'utf8')
  } else {

    result = JSON.parse(yield fs.readFile(cacheFile, 'utf8'))
  }

  return result
}

module.exports = {
  read: readBlog,
  summary: summary
}
