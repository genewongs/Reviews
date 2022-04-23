const Routers = require('express').Router();
var controllers = require('./controllers');

Routers.get('/reviews', controllers.getReviews)
Routers.get('/reviews/meta', controllers.getMeta);
Routers.post('/reviews', controllers.post)
Routers.put('/reviews/:review_id/helpful', controllers.updateHelpfullness)
Routers.delete('/reviews/meta', controllers.delete)

module.exports = Routers;