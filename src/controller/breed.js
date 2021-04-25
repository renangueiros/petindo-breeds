const mongodb = require('mongodb')
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

const getById = (req, res) => {
  const objectId = mongodb.ObjectID(req.params.id)

  breedsCollection().findOne({ _id: objectId })
    .then((document) => {
      const breed = new Breed({ ...document })
      res.send(breed)
    })
}

const postBreed = (req, res) => {
  const breed = new Breed({ ...req.body })

  if (!breed.name) {
    return res.status(400).send('The name of breed is a required field')
  }

  breedsCollection().findOne({ name: breed.name })
    .then((document) => {
      if (document) {
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

            breed.picture = `${HOST}:${PORT}/${fullPath}`

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

const putBreed = (req, res) => {
  const objectId = mongodb.ObjectID(req.params.id)

  breedsCollection().findOne({ _id: objectId })
    .then((document) => {
      if (!document) {
        return res.status(400).send('Breed not found')
      }

      const breed = new Breed({
        _id: document._id,
        name: req.body.name || document.name,
        picture: document.picture
      })

      breedsCollection().find({ name: breed.name })
        .map((document) => {
          return new Breed({ ...document })
        }).toArray().then((breeds) => {

          if (breeds.length >= 2) {
            return res.status(400).send('Already have a Breed registered with this name')
          }

          if (req.file) {
            const basePath = 'public/images/breeds'
            const mimeType = req.file.mimetype.split('/')[1]

            const fullPath = `${basePath}/${breed._id}.${mimeType}`

            fs.writeFileSync(
              fullPath,
              req.file.buffer
            )

            breed.picture = `${HOST}:${PORT}/${fullPath}`
          }

          breedsCollection().updateOne(
            { _id: objectId }
            , {
              $set: {
                name: breed.name,
                picture: breed.picture
              }
            }).then(() => {
              return res.send(breed)
            })
        })
    })
}

const deleteBreed = (req, res) => {
  const objectId = mongodb.ObjectID(req.params.id)

  breedsCollection().findOne({ _id: objectId })
    .then((document) => {
      if (!document) {
        return res.status(400).send('Breed not found')
      }

      breedsCollection().deleteOne({ _id: objectId })

      res.send('Breed successfully deleted')
    })
}

const searchBreed = (req, res) => {

  let queryId;

  if (req.query.id) {
    queryId = mongodb.ObjectID(req.query.id)
  }

  const queryName = req.query.name

  breedsCollection().find({
    $or: [
      { _id: queryId },
      { name: queryName }
    ]
  }).map((document) => {
    return new Breed({ ...document })
  }).toArray().then((breeds) => {
    if (breeds.length >= 1) {
      res.send(breeds)
    } else {
      res.status(400).send('No Breeds found')
    }
  })
}

module.exports.getAll = getAll
module.exports.getById = getById
module.exports.postBreed = postBreed
module.exports.putBreed = putBreed
module.exports.deleteBreed = deleteBreed
module.exports.searchBreed = searchBreed
