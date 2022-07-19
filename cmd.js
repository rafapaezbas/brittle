#!/usr/bin/env node

const path = require('path')
const c8pkg = require('c8/package.json')
const bin = c8pkg.bin ? path.join(path.dirname(require.resolve('c8/package.json')), c8pkg.bin) : null
const noCov = process.env.BRITTLE_NO_COVERAGE || process.argv.includes('--no-coverage')

process.title = 'brittle'

if (!noCov) {
  process.env.BRITTLE_NO_COVERAGE = 'true'
  process.argv.unshift(bin)
  process.argv.unshift(process.execPath)
  require(bin)
} else {
  start().catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
}

async function start () {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('-')) continue
    await import(path.resolve(arg))
  }
}
