const express = require('express');
const app = express();
const user = require('./api/routes/user');
// const appointment = require('./api/routes/appointment');

const port = 3000;

app.use(express.json());
app.use('/', express.static('public'));
app.use('/user', user);
// app.use('/appointment', appointment);

app.listen(port, () => {
    console.log("Server running at port 3000");
});
