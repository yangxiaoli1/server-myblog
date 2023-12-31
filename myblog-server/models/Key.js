const mongoose = require('mongoose')

const schema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,

  }
})

module.exports = mongoose.model('Key', schema)