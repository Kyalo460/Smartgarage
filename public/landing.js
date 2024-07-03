function appointment (event) {
    event.preventDefault();

    const url =  "http://localhost:3000/user/appointment";

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
    .then(response => console.log(response.body))
    .then(() => { alert("You have booked an appointment") });
}