const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const user = require('./api/routes/user');
const appointment = require('./api/routes/appointment');

const port = 3000;

app.use(cors());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

app.use(express.json());
app.use('/', express.static('public'));
app.use('/', user);
app.use('/appointment', appointment);

app.listen(port, () => {
    console.log("Server running at http://54.165.138.151:3000/");
});
