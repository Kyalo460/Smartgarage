function appointment (event) {
    event.preventDefault();

    const datetimeValue = document.getElementById('datetime').value

    const datetimeObject = new Date(datetimeValue);

    console.log(datetimeObject);

    const datetime = {
        year: datetimeObject.getFullYear(),
        month: datetimeObject.getMonth() + 1,
        day: datetimeObject.getDate(),
        hours: datetimeObject.getHours(),
        minutes: datetimeObject.getMinutes()
    } 
    
    console.log(datetime.day);
}