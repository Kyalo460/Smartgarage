// Creates a new user with email and password
function createUser (event) {
    event.preventDefault();

    const url = `/create`;

    // New user object containing the email and password
    const newUser = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        phone: document.getElementById("phone").value,
        carModel: document.getElementById("carModel").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    }

    console.log("Saved info");
    console.log(newUser);

    // Makes a post request to the api which adds the new user to storage
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (response.status === 400) {
            alert("That email already exists.");
        }
        else {
            alert("You have created an account, you can log in now.")
        }
        return response.text();
    })
    .then(html => {
        document.open();
        document.write(html);
        document.close();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Logs in an existing user
function login (event) {
    event.preventDefault();
    email = document.getElementById("log-email");
    password = document.getElementById("log-password")
    const url = `/login`;

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
    .then(response => {
        if (response.status === 400) {
            alert("Wrong username or password!");
        }
        return response.text()
    })
    .then(html => {
        document.open();
        document.write(html);
        document.close();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Logs out a user
function logout() {
    const url = `/logout`;

    // Makes a DELETE request to the api endpoint to logout a user
    fetch(url, {
        method: "DELETE",
    })
    .then(response => {
        if (response.status === 500) {
            alert("Something went wrong when trying to log you out, try again.");
        }
        else {
            alert("You have logged out successfully!");
        }
        return response.text()
    })
    .then(html => {
        document.open();
        document.write(html);
        document.close();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
