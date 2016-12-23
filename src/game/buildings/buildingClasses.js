const classes = [
  require('./Fountain'),
  require('./Forgery'),
  require('./TrainingGrounds')
]

classes.fromTitle = function(title) {
  return classes.filter(cls => cls.title === title)[0] || null
}

module.exports = classes
