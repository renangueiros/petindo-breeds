const express = require('express')

const app = express()

const PORT = process.env.PORT || '3000'

const listen = app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`)
})

module.exports.listen = listen
