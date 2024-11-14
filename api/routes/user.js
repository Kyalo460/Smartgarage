const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const mysql = require('mysql2/promise');
const { CONNREFUSED } = require('dns');

let users = [];

// const dbConfig = {
//     host: 'localhost',
//     user: 'kyalo460',
//     password: 'kyalo460',
//     database: 'smartgarage'
// };

let con;
async function initializeConnection() {
    con = await mysql.createConnection(process.env.DATABASE_URL);
}

// Function to load users from the database
async function load() {
    const [rows] = await con.execute('SELECT * FROM users');
    users = rows;
}

// Initialize the database connection and load users
initializeConnection().then(load).catch(err => console.error('Failed to initialize database connection:', err));


// Api for creating a new user
router.post('/create', async (req, res) => {
    // Tries to find if the user's email exists in the users[] list
    // If the email exists a response is sent saying so
    try {
        await load();

        const exists = users.find(user => user.email === req.body.email);
        if (exists) {
            res.status(400).sendFile(path.join(__dirname, '..', '..', 'public', 'create.html'));
            console.log("User already exists");
            return;
        }
        // Hashes the password before adding it in the user object
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Makes an array containing user details to be added to the database
        const userArr = [req.body.firstName, req.body.lastName,
            req.body.phone, req.body.carModel, req.body.email, hashedPassword];

        const sql = "INSERT INTO users (firstname, lastname, phone, carmodel, email, password) VALUES (?, ?, ?, ?, ?, ?)"
        
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
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'appointment.html'));
        }
        else {
            res.status(400).sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));;
        }
    }
    catch {
        res.status(500).send('Something went wrong');
    }
});

router.get('/login', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'appointment.html'));
    }
    else {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
    }
});

router.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'create.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'about.html'));
});

router.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'logout.html'));
});

router.delete('/logout', (req, res) => {
    // Destroys session to logout user
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).sendFile(path.join(__dirname, '..', '..', 'public', 'logout.html'));
            }
            res.clearCookie('connect.sid');
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'about.html'));
        })
    }
})

router.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'appointment.html'));
    }
    else {
        res.sendFile(path.join(__dirname, '..', '..', 'public', 'about.html'));
    }
});

module.exports = router;
