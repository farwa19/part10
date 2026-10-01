
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1
  },
  published: {
  type: Number,
  required: true
},
  genres: {
    type: [String],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
   
  }
})

module.exports = mongoose.model('Books', schema)

