const express = require('express');
const router = express.Router();
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

let con;
let appointments = [];

async function initializeConnection() {
    con = await mysql.createConnection(process.env.DATABASE_URL);
}

async function load() {
    const [rows] = await con.execute('SELECT * FROM appointments');
    appointments = rows;
}

initializeConnection()
.then(load)
.catch(err => console.error('Failed to initialize database connection:', err));

// Creates new appointment
router.post('/', async (req, res) => {
    await load();

    let dateString = req.body.datetime;
    dateString += ':00Z'; // adds seconds and UTC timezone to dateString

    let dateObj = new Date(dateString);
    let dateTimeString = dateObj.toLocaleString('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit'
    });

    // Checks if appointment time is already booked
    const exists = appointments.find(appointmentObj => appointmentObj.datetime === dateTimeString)

    if (exists) {
        res.status(400).send("<h1>Appointment exists<h1>");
        console.log("Appointment exists");
        return;
    }

    console.log(req.session);
    
    console.log(req.session.user);
    const appointmentObj = {
        email: req.session.user.email,
        details: req.body.details,
        datetime: dateTimeString
    }
    console.log(appointmentObj);

    const appointmentArr = [appointmentObj.email, appointmentObj.details, appointmentObj.datetime];

    const sql = 'INSERT INTO appointments (email, details, datetime) VALUES (?, ?, ?)';

    // Adds appointment to database storage
    const [result] = await con.execute(sql, appointmentArr);
    console.log("Number of records inserted: " + result.affectedRows);

    res.status(200).send('<h1>Added appointment<h1>');
});

router.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'appointment.html'));
    } else {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
    }
});

router.get('/load', async (req, res) => {

    const email = req.session.user.email;
    const sql = "SELECT details, datetime FROM appointments WHERE email = ? ORDER BY id DESC";

    const [result] = await con.execute(sql, [email]);

    res.send(result);
    
});

module.exports = router;
