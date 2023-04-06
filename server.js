const express = require('express');
const dotenv = require('dotenv');
const bodyParser= require('body-parser')
const mongoose = require('mongoose');
const routes = require('./routes');

dotenv.config();

const app = express();

app.set('port', (process.env.PORT || 5000));

const uri = process.env.MONGOSTRING;
console.log('Connecting db')
mongoose.connect(uri, (err) => {
    if(err) {
        console.log("Error connecting mongodb", err);
        return;
    }
    console.log('Connected to database');
})

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes);

app.listen(app.get('port'), () => {
    console.log('App is running, server is listening on port ', app.get('port'));
})