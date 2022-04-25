const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const controllers = require('./controllers');
require('dotenv').config();
const Routers = require('./routes.js');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/', Routers)
//ROUTES
// app.post('/', Routers);
// app.get('/', Routers);
// app.put('/', Routers);
// app.delete('/', Routers);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});