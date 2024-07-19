// Creates an appointment
function appointment (event) {
    event.preventDefault();

    const url =  "http://54.165.138.151:3000/appointment";

    const appointmentObj = {
        details: document.getElementById('details').value,
        datetime: document.getElementById('datetime').value
    }
    
    // Makes a POST request to create and save an appointment
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentObj)
    })
    .then(response => {
        if (response.status === 400) {
            alert("That time is not available, please choose a different time or date");
        } else {
            alert("You have booked an appointment");
        }
        return response.text()
    })
    .then(html => {
        document.getElementById('existing').innerHTML = html;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Loads existing appointments from backend storage
function load() {
    const url = 'http://54.165.138.151:3000/appointment/load';
    
    // Makes a GET request to fetch appointment json object
    fetch(url, {
        method: "GET"
    })
    .then(response => {
        if (response.status === 400) {
            alert("You have no appointments");
        }
        return response.json()
    })
    .then(appointments => {
        const table = document.getElementById('appointments');

        // Deletes table rows if they exist to leave an empty table before insertion
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        // Inserts rows into the table with an id = 'existing'
        document.getElementById('existing').style.display = "block";
        appointments.forEach((appointment) => {
            const html = `<tr><td>${appointment.details}</td><td>${appointment.datetime}</td></tr>`;
            table.insertAdjacentHTML('beforeend', html);
        });
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
