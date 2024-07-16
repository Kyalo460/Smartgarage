function appointment (event) {
    event.preventDefault();

    const url =  "http://localhost:3000/appointment";

    const appointmentObj = {
        details: document.getElementById('details').value,
        datetime: document.getElementById('datetime').value
    }
    
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

function load() {
    const url = 'http://localhost:3000/appointment/load';
    console.log("Running load");
    
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
        console.log(appointments);
        const table = document.getElementById('appointments');
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
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