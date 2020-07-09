// --- MODULES --- //
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fetch = require('node-fetch')
const Datastore = require('nedb');
require('dotenv').config();

// --- MIDDLEWARE --- //  
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

let database = new Datastore('weatherDatabase.db');
database.loadDatabase();
const port = process.env.PORT || 3000;


// Receive data from client & stores in database // 
app.post('/api', (request, response) => {
    // Receives latitude, longitude, weather, air quality. Adds timestamp. 
    const data = request.body;
    data.timestamp = Date.now();
    database.insert(data);
    response.json(data);
})

app.get('/api', (request, response) => {
    database.find({}, (err, foundData) => {
        response.json(foundData);
    });
})

// Return weather information, receive lati & long in params// 
app.get('/weather/:latilong', async (request, response) => {
    console.log("Response received my man!");
    
    // Get the wonderful user's coordinates data
    let latilong = request.params.latilong.split(",");
    let lati = latilong[0];
    let long = latilong[1];

    // Request weather from OPEN WEATHER MAP API using brilliant user's coordinates
    let openWeather_api_key = process.env.API_KEY; 
    let openWeather_api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&units=imperial&appid=${openWeather_api_key}`;
    let weatherResponse = await fetch(openWeather_api_url);
    let weatherData = await weatherResponse.json();

    // Request air quality from OPEN AQ API //
    let aq_api_url = `https://api.openaq.org/v1/latest?coordinates=${lati},${long}`;
    let aqResponse = await fetch(aq_api_url);
    let aqData = await aqResponse.json();

    // Store weather and air quality data in an object.
    let data = {
        weather: weatherData,
        air_quality: aqData
    }
    
    // Return data to magnificent user. 
    response.json(data);
});


app.listen(port, function(){
    console.log("Server running brah.");
})