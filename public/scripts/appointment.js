function appointment (event) {
    event.preventDefault();

    const url =  "http://localhost:3000/appointment";

    const appointmentObj = {
        details: document.getElementById('details').value,
        datetime: document.getElementById('datetime').value
    }

    // const datetime = {
    //     year: datetimeObject.getFullYear(),
    //     month: datetimeObject.getMonth() + 1,
    //     day: datetimeObject.getDate(),
    //     hours: datetimeObject.getHours(),
    //     minutes: datetimeObject.getMinutes()
    // }
    
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

// function load() {
//     const url = 'http://localhost:3000/load';
    
//     fetch
// }