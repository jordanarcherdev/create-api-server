const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const { mongoURI } = require('./config/keys');

//Load route files here

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connect to mongodb
mongoose.connect(mongoURI)
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log);

//Use routes here

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
