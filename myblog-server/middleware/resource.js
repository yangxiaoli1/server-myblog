const createError = require('http-errors')
const { classify } = require('inflection')

module.exports = options => {
  return (req, res, next) => {
    //将users转换成User
    const modelName = classify(req.params.resource)
    try {
      req.Model = require(`../models/${modelName}`)
      next()
    } catch (err) {
      next(createError(404))
    }

  }
}