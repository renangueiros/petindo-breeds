const mongodb = require('mongodb')

const DATABASE_URI = process.env.DATABASE_URI ||
  'mongodb://localhost:27017'
const DATABASE_NAME = process.env.DATABASE_NAME ||
  'petindo'
const DATABASE_BREEDS_COLLECTION =
  process.env.DATABASE_BREEDS_COLLECTION ||
  'breeds'

const client = new mongodb.MongoClient(
  DATABASE_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const connect = async () => {
  try {
    await client.connect()
    console.log('Database connection established')
  } catch (error) {
    console.error(`Database cannot establish a connection: ${error}`)
  }
}

const database = () => {
  return client.db(DATABASE_NAME)
}

const breedsCollection = () => {
  return client
    .db(DATABASE_NAME)
    .collection(DATABASE_BREEDS_COLLECTION)
}

module.exports.connect = connect
module.exports.database = database
module.exports.breedsCollection = breedsCollection
