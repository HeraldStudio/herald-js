const herald = require('./index')
const vm = require('vm')
const repl = require('repl')
const chalk = require('chalk')
const prettyjson = require('prettyjson')
const storage = new (require('node-json-db'))("test-storage", true, true)
const spinner = require('ora')()
spinner.text = ''

const ctx = {
  H: herald ({
    storageDelegate: {
      async set (key, value) {
        storage.push('/' + key, value)
      },
      async get (key) {
        try {
          return storage.getData('/' + key)
        } catch (e) {
          return null
        }
      }
    },
    onLogin (newToken) {
      console.log(`${chalk.yellow('onLogin')}(${chalk.hex('#808080')('/* newToken: */')}'${newToken}')`)
    },
    onLogout (oldToken) {
      console.log(`${chalk.yellow('onLogout')}(${chalk.hex('#808080')('/* oldToken: */')}'${oldToken}')`)
    },
    onError (error) {
      console.log(`${chalk.yellow('onError')}(${chalk.hex('#808080')('/* error: */')}${JSON.stringify(error, null, 2)})`)
    }
  })
}
vm.createContext(ctx)

process.on('unhandledRejection', e => { throw e })
process.on('uncaughtException', console.error)

const isRecoverableError = (error) => {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message)
  }
  return false
}

console.log(`\nWelcome to ${chalk.cyan('herald-js')} playground!`)
console.log(``)
console.log(`${chalk.hex('#808080')('// Play freely as if you have typed:')}`)
console.log(`${chalk.magenta('let')} H = ${chalk.cyan('require')}(${chalk.green("'herald-js'")})`)

repl.start({
  prompt: '\n← ',
  eval: async (cmd, context, filename, callback) => {
    try {
      let result
      try {
        spinner.start()
        result = await vm.runInContext(cmd, ctx)
      } finally {
        spinner.stop()
      }
      if (typeof result !== 'undefined') {
        if (typeof result === 'object') {
          console.log('→')
          console.log(prettyjson.render(result))
        } else {
          console.log('→', result)
        }
      }
      callback()
    } catch (e) {
      if (isRecoverableError(e)) {
        return callback(new repl.Recoverable(e))
      } else {
        console.error(e)
      }
    }
  }
})
