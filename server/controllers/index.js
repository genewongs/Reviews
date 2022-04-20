const models = require('../models');

module.exports = {
  get: function(req, res) {
    models.get()
      .then(data => res.send(data.rows))
      .catch(err => console.log(err));
  },

  post: function(req, res) {
      models.post(req.body)
        .then(data => res.send(data.rows))
        .catch(err => console.log(err));
  },

  update: function(req, res) {
    models.update(req.body)
      .then(data => res.send(data))
      .catch(err => console.log(err));
  },

  delete: function(req, res) {
    models.delete(req.body)
      .then(data => res.sendStatus(200))
      .catch(err => console.log(err));
  }
}