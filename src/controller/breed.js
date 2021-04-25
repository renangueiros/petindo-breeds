const { ObjectId } = require('bson')
const fs = require('fs')

const { breedsCollection } = require('../database')
const { Breed } = require('../models/breed')

const HOST = process.env.HOST || 'http://localhost'
const PORT = process.env.PORT || '3000'

const getAll = (req, res) => {
  breedsCollection().find()
    .map((document) => {
      return new Breed({ ...document })
    }).toArray().then((breeds) => {
      res.send(breeds)
    })
}

const postBreed = (req, res) => {
  const breed = new Breed({ ...req.body })

  if (!breed.name) {
    return res.status(400).send('The name of breed is a required field')
  }

  breedsCollection().findOne({ name: breed.name })
    .then((_breed) => {
      if (_breed) {
        return res.status(400).send('This breed is already registered')
      }

      breedsCollection().insertOne(breed)
        .then((result) => {
          breed._id = result.insertedId

          if (req.file) {
            const basePath = 'public/images/breeds'
            const mimeType = req.file.mimetype.split('/')[1]

            const fullPath = `${basePath}/${breed._id}.${mimeType}`

            fs.writeFileSync(
              fullPath,
              req.file.buffer
            )

            breed.picture = `${HOST}:${PORT}/fullPath`

            breedsCollection().updateOne(
              {
                name: breed.name
              }, {
              $set: {
                picture: breed.picture
              }
            }).then(() => {
              return res.send(breed)  
            })
          } else {
            return res.send(breed)
          }
        })
    })
}

module.exports.getAll = getAll
module.exports.postBreed = postBreed
