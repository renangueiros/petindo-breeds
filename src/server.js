const database = require('./database')
const server = require('./app')

const init = () => {
  database.connect()
    .then(() => {
      server.listen()
    })
}

module.exports.init = init()
