const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  books: [{ type: mongoose.Types.ObjectId, ref: 'Book' }]
})

module.exports = mongoose.model('Collection', CollectionSchema, 'Collection')
