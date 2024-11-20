require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const user = require('./api/routes/user');
const appointment = require('./api/routes/appointment');

const port = process.env.PORT || 3000;

// creates session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

// express middleware
app.use(express.json());
app.use('/', express.static('public'));
app.use('/', user);
app.use('/appointment', appointment);

// starts server
app.listen(port, () => {
    console.log("Server running at http://localhost:3000/");
});
