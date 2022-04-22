const Routers = require('express').Router();
var controllers = require('./controllers');

Routers.post('/reviews', controllers.post)
Routers.get('/reviews', controllers.get)
Routers.put('/:review_id/:action', controllers.update)
Routers.delete('/reviews/meta', controllers.delete)

module.exports = Routers;