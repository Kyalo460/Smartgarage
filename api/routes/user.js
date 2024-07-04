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
            res.status(400).sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
            console.log("User already exists");
            return;
        }
        // Hashes the password before adding it in the user object
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            carModel: req.body.carModel,
            email: req.body.email,
            password: hashedPassword
        };

        // The new user object is pushed to the users list/array
        users.push(user);

        // Sends a file containing the login HTML to be rendered
        res.status(200).sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
    }
    catch {
        res.status(500).send("Something big went wrong");
    }
});

// Api for loging in a user
router.post('/login', async (req, res) => {
    // Tries to find the user's email in the users list
    // If not found it returns null
    const user = users.find(user => user.email === req.body.email);
    if (!user) {
        return res.status(400).sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));;
    }
    try {
        // Uses bycrypt to compare the hashed passsword with the password provided by the user
        // If the password matches, a html file is sent back to the user
        if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            // console.log(req.session.user.email);
            // console.log(req.sessionID);
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'landing.html'));
            console.log("Logged in");
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