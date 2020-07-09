
let locationButton = document.getElementById('locationButton');
let long = 0; 
let lati = 0;

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition( position => {
        long = position.coords.longitude;
        lati = position.coords.latitude;
    });
} else {
    console.log("No location available. Sorry.");
}

locationButton.addEventListener('click', async () => { 
    // Display lati & long
    document.getElementById("lati").textContent = lati;
    document.getElementById("long").textContent = long;
    
    // Send GET request to server with lati & long params. Receive weather and air quality data. 
    let api_url = `/weather/${lati},${long}`;
    let response = await fetch(api_url);
    let responseJSON = await response.json();
    let {weather, air_quality} = responseJSON;
    
    // Grab specific values from the JSON.
    let weatherSummary = weather.weather[0].description;
    let weatherTemp = weather.main.temp;
    let airValue = air_quality.results[0].measurements[0].value;

    // Display relevant weather data to client
    document.getElementById('weatherDescription').textContent = weatherSummary
    document.getElementById('temperature').textContent = weatherTemp;
    document.getElementById('airQuality').textContent = airValue;

    // Send POST request to server to store data in Database //
    const data = { lati, long, weatherSummary, weatherTemp, airValue};
    const options = {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch('/api', options)
        .then(response => response.json()
        .then(body => console.log(body)))
});


