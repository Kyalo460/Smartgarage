// Creates a new user with email and password
function createUser (event) {
    event.preventDefault();

    email = document.getElementById("email");
    password = document.getElementById("password");
    const url = "http://localhost:3000/user/create"

    // New user object containing the email and password
    const newUser = {
        email: email.value,
        password: password.value
    }

    console.log("Saved info");
    console.log(newUser);

    // Makes a post request to the api which adds the new user to starage
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });
}

// Logs in an existing user
function login (event) {
    event.preventDefault();
    console.log("Hello");
    email = document.getElementById("log-email");
    password = document.getElementById("log-password")
    const url = "http://localhost:3000/user/login";

    // User object containing the email and password
    const user = {
        email: email.value,
        password: password.value
    }

    // Makes a POST request to the api to validate the user and them log them in
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.text())
    .then(html => {
        document.open();
        document.write(html);
        document.close();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}