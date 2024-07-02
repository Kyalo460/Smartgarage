const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');

// A storage for users. It becomes empty when server refreshes.
const users = [];

// Api for creating a new user
router.post('/create', async (req, res) => {
    // Tries to find if the user's email exists in the users[] list
    // If the email exists a response is sent saying so
    try {
        const exists = users.find(user => user.email === req.body.email);
        if (exists) {
            res.send("User already exists");
            res.end();
            console.log("User already exists");
            return;
        }
        // Hashes the password before adding it in the user object
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            email: req.body.email,
            password: hashedPassword
        };

        // The new user object is pushed to the users list/array
        users.push(user);
        console.log(users);
    }
    catch {
        res.status(500).send("Something went wrong");
    }
});

// Api for loging in a user
router.post('/login', async (req, res) => {
    // Tries to find the user's email in the users list
    // If not found it returns null
    const user = users.find(user => user.email === req.body.email);
    if (user === null) {
        return res.status(400).send("User not found");
    }
    try {
        // Uses bycrypt to compare the hashed passsword with the password provided by the user
        // If the password matches, a html file is sent back to the user
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'landing.html'));
            console.log("Logged in");
        }
        else {
            res.send('Wrong password or email');
        }
    }
    catch {
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;