const mongoose = require('mongoose')

const LanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  books: [
    {
      type: mongoose.Types.ObjectId
    }
  ]
})

module.exports = mongoose.model('Language', LanguageSchema, 'Language')
