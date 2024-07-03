const express = require('express');
const app = express();
const session = require('express-session');
const user = require('./api/routes/user');
const appointment = require('./api/routes/appointment');

const port = 3000;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

app.use(express.json());
app.use('/', express.static('public'));
app.use('/user', user);
app.use('/user/appointment', appointment);

app.listen(port, () => {
    console.log("Server running at http://localhost:3000/");
});
