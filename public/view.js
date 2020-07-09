


const myMap = L.map('mapOfCheckins').setView([0, 0], 2);
const attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
let tiles = L.tileLayer(tileURL, { attribution });
tiles.addTo(myMap);

// Function to make request to server for all data in database // 
var getData = async function(){
    let response = await fetch('/api');
    let data = await response.json();
    
    // elemant = { lati, long, weatherSummary, weatherTemp, airValue } // 
    for (element of data) {
        console.log(element);
        let marker = L.marker([element.lati, element.long]).addTo(myMap);

        let markerText = `The latitude is ${element.lati} the longitude is ${element.long}. 
        The current temperature is ${element.weatherTemp}, colloquially referred to as ${element.weatherSummary}.`;

        marker.bindPopup(markerText);
    }
}
getData();