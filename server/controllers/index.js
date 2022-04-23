const models = require('../models');

module.exports = {
  getReviews: function(req, res) {
    models.getReviews(req.query.product_id, req.query.page = 1, req.query.count = 5)
      .then(data => {
        let result = {
          product: req.query.product_id,
          page: req.query.page,
          count: req.query.count,
          results: data.rows,
        }
        res.send(result)
      })
      .catch(err => console.log(err));
  },

  getMeta: function(req, res) {
    models.getMeta(req.query.product_id)
      .then(data => res.send(data.rows))
      .catch(err => console.log(err));
  },

  post: function(req, res) {
    console.log(req.body)
      models.post(req.body)
        .then(data => res.status(201).send(data.rows))
        .catch(err => console.log(err));
  },

  updateHelpfullness: function(req, res) {
    console.log(req.params)
    models.updateHelpfullness()
      .then(data => res.send(data))
      .catch(err => console.log(err));
  },

  delete: function(req, res) {
    models.delete(req.body)
      .then(data => res.sendStatus(200))
      .catch(err => console.log(err));
  }
}