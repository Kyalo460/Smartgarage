const express = require('express');
const router = express.Router();
const path = require('path');
const nodemailer = require('nodemailer');

const appointments = [];

router.post('/', (req, res) => {
    // console.log(typeof req.body.datetimeVal);
    const appointmentObj = {
        email: req.session.user.email,
        details: req.body.details,
        datetime: req.body.datetime
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'smartgarage1222@gmail.com',
            pass: 'Smartgarage222_'
        }
    });
    
    const mailOptions = {
        from: 'smartgarage1222@gmail.com',
        to: appointmentObj.email,
        subject: 'Sending Email using Node',
        text: 'That was easy!'
    };

    appointments.push(appointmentObj);
    console.log(appointmentObj);

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.status(201).sendFile(path.join(__dirname, '..', '..', 'public', 'landing.html'));
})

module.exports = router;