const express = require('express')

const breedController = require('./controller/breed')

const app = express()

const PORT = process.env.PORT || '3000'

const listen = () => {
  app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
  })
}

app.get('/api/breeds', breedController.getAll)

module.exports.listen = listen
