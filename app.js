const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const debug = require('debug')('app');
const Book = require('./models/bookModel.js');
const bookRouter = require('./routes/bookRouter')(Book);

const app = express();
mongoose.connect('mongodb://localhost/bookAPI', { useNewUrlParser: true });
debug('Successfully connected to DB');
const port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', bookRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my Nodemon API');
});

app.listen(port, () => {
  debug(`Running on port ${port}`);
});
