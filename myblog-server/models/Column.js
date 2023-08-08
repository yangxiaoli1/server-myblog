const mongoose = require('mongoose')
const { formatDate } = require('../core/util/util')
const schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      return formatDate(new Date(val), 'yyyy年MM月dd日 hh:mm:ss')
    }
  },
  aids: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Article'
    }
  ],
  uid: {
    type: mongoose.SchemaTypes.ObjectId
  }
})
schema.set('toJSON', { getters: true })
module.exports = mongoose.model('Column', schema)