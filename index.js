const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./db');
const users = require('./routes/user');
const mails = require('./routes/mail');

mongoose.connect(config.DB, { useCreateIndex: true, useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
);

const app = express();
app.use(passport.initialize());
require('./passport')(passport);
app.set('views', './views')
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET, PUT, PATCH, POST, DELETE'
        )
        return res.status(200).json({})
    }
    next()
})

// API
app.get('/', (req, res, next) => {
    res.send('hello');
});
app.use('/api/users', users);
app.use('/api/mails', mails);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});