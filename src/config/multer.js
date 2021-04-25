const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      throw new Error('Only .png, .jpg and .jpeg format allowed')
    }
  }
})

module.exports.upload = upload
