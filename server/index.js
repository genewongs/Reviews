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
app.post('/users', controllers.post);
app.get('/users', controllers.get);
app.put('/users', controllers.update);
app.delete('/users', controllers.delete);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});