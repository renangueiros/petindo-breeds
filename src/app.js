const express = require('express')

const { upload } = require('./config/multer')
const breedController = require('./controller/breed')

const app = express()

const PORT = process.env.PORT || '3000'

const listen = () => {
  app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
  })
}

app.use(express.json())

app.get('/api/breeds', breedController.getAll)
app.get('/api/breeds/:id', breedController.getById)
app.delete('/api/breeds/:id', breedController.deleteBreed)
app.post(
  '/api/breeds',
  upload.single('picture'),
  breedController.postBreed
)
app.put(
  '/api/breeds/:id',
  upload.single('picture'),
  breedController.putBreed
)

module.exports.listen = listen
