const { breedsCollection } = require('../database')
const { Breed } = require('../models/breed')

const getAll = (req, res) => {
  breedsCollection().find()
    .map((document) => {
      return new Breed({ id: document._id, ...document })
    }).toArray().then((breeds) => {
      res.send(breeds)
    })
}

module.exports.getAll = getAll
