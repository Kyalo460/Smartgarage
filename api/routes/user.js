const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const mysql = require('mysql2/promise');
const { CONNREFUSED } = require('dns');

// A storage for users. It becomes empty when server refreshes.
let users = [];
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'smartgarage_users'
});

async function fetchUsers() {
    const connection = await con;
    const [rows] = await connection.execute('SELECT * FROM users');
    return rows;
}

async function load() {
    users = await fetchUsers();
};

load();

// Api for creating a new user
router.post('/create', async (req, res) => {
    // Tries to find if the user's email exists in the users[] list
    // If the email exists a response is sent saying so
    try {
        await load();

        const exists = users.find(user => user.email === req.body.email);
        if (exists) {
            res.status(400).sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
            console.log("User already exists");
            return;
        }
        // Hashes the password before adding it in the user object
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Makes an array containing user details to be added to the database
        const userArr = [req.body.firstName, req.body.lastName,
            req.body.phone, req.body.carModel, req.body.email, hashedPassword];

        const sql = "INSERT INTO users (firstname, Lastname, phone, carmodel, email, password) VALUES (?, ?, ?, ?, ?, ?)"
        
        const [result] = await con.execute(sql, userArr);
        console.log("Number of records inserted: " + result.affectedRows);

        // Sends a file containing the login HTML to be rendered
        res.status(200).sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

// Api for loging in a user
router.post('/login', async (req, res) => {
    // Tries to find the user's email in the users list
    // If not found it returns null
    await load();
    const user = users.find(user => user.email === req.body.email);
    if (!user) {
        return res.status(400).sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));;
    }
    try {
        // Uses bycrypt to compare the hashed passsword with the password provided by the user
        // If the password matches, a html file is sent back to the user
        if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'landing.html'));
        }
        else {
            res.status(400).sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));;
        }
    }
    catch {
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;