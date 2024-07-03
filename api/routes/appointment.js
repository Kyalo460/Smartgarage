const express = require('express');
const router = express.Router();

const appointments = [];

router.post('/', (req, res) => {
    // console.log(typeof req.body.datetimeVal);
    const appointmentObj = {
        email: req.session.user.email,
        details: req.body.details,
        datetime: req.body.datetime
    }

    appointments.push(appointmentObj);
    console.log(appointmentObj);

    res.send("Hello world");
    res.end();
})

module.exports = router;