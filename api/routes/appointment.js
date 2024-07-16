const express = require('express');
const router = express.Router();
const path = require('path');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');



const dbConfig = {
    host: 'localhost',
    user: 'kyalo460',
    password: 'kyalo460',
    database: 'smartgarage'
};

let con;
let appointments = [];

async function initializeConnection() {
    con = await mysql.createConnection(dbConfig);
}

async function load() {
    const [rows] = await con.execute('SELECT * FROM appointments');
    appointments = rows;
}

initializeConnection()
.then(load)
.catch(err => console.error('Failed to initialize database connection:', err));

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

    const exists = appointments.find(appointmentObj => appointmentObj.datetime === dateTimeString)

    if (exists) {
        res.status(400).send("<h1>Appointment exists<h1>");
        console.log("Appointment exists");
        return;
    }

    const appointmentObj = {
        email: req.session.user.email,
        details: req.body.details,
        datetime: dateTimeString
    }
    console.log(appointmentObj);

    appointmentArr = [appointmentObj.email, appointmentObj.details, appointmentObj.datetime];

    const sql = 'INSERT INTO appointments (email, details, datetime) VALUES (?, ?, ?)';

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
    const sql = "SELECT details, datetime FROM appointments WHERE email = ? AND status = 'Pending'";

    const [result] = await con.execute(sql, [email]);

    res.send(result);
    
});

module.exports = router;
