const models = require('../models');

module.exports = {
  getReviews: function(req, res) {
    models.getReviews(req.query.product_id, req.query.page = 1, req.query.count = 5, req.query.sort)
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
      .then(data => res.send(data.rows[0].characteristics))
      .catch(err => console.log(err));
  },

  post: function(req, res) {
      models.post(req.body)
        .then(data => res.status(201).send(data.rows))
        .catch(err => console.log(err));
  },

  updateHelpfullness: function(req, res) {
    models.updateHelpfullness(req.params)
      .then(data => res.sendStatus(204))
      .catch(err => console.log(err));
  },

  updateReport: function(req, res) {
    models.updateReport(req.params)
      .then(data => res.sendStatus(204))
      .catch(err => console.log(err));
  }
}