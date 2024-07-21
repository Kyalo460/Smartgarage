const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const user = require('./api/routes/user');
const appointment = require('./api/routes/appointment');

const port = 3000;

//const corsOptions = {
//    credentials: true
//};

// enables Cross-Origin Resource Sharing
app.use(cors());

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
    console.log("Server running at http://54.165.138.151:3000/");
});
