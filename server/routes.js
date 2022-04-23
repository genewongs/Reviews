const Routers = require('express').Router();
var controllers = require('./controllers');

Routers.get('/reviews', controllers.getReviews)
Routers.get('/reviews/meta', controllers.getMeta);
Routers.post('/reviews', controllers.post)
Routers.put('/reviews/:review_id/helpful', controllers.updateHelpfullness)
Routers.put('/reviews/:review_id/report', controllers.updateReport)

module.exports = Routers;