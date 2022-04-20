const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const controllers = require('./controllers');

const PORT = 3000;

//middleware
app.use(cors());
app.use(express.json());

//ROUTES
app.post('/reviews', controllers.post);
app.get('/reviews', controllers.get);
app.put('/reviews', controllers.update);
app.delete('/reviews', controllers.delete);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});