require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const controllers = require('./controllers');
const Routers = require('./routes.js');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/', Routers)

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
});