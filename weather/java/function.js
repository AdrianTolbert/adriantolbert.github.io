'use strict';

/* A collection of functions for the Weather Site.*/ 

// DOM Element Variables
var pageNav = document.querySelector('#page-nav');
var statusContainer = document.querySelector('#status');
var contentContainer = document.querySelector('#main-content');

/* SHORTCUTS */
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
// Web storage shortcuts
var locStore = window.localStorage;
var sessStore = window.sessionStorage;

// Listen for the DOM to finish building
document.addEventListener("DOMContentLoaded", function(){
    //call the last modified date function
buildModDate();
// works with the small screen menu
const menuButton = document.querySelector("#mobileMenu");
menuButton.addEventListener('click',toggleMenu);
//calculate the time ball function
let hour = "9";
timeBall(hour);
//Change background image to display the current weather
// changeSummaryImage("fog");
//Get weather json data
var weatherURL = "/weather/java/idahoweather.json";
fetchWeatherData(weatherURL);
});





/* *************************************
*  Fetch Weather Data
************************************* */
function fetchWeatherData(weatherURL){
    let cityName = $("body").getAttribute("data-city"); // The data we want from the weather.json file
    fetch(weatherURL)
    .then(function(response) {
    if(response.ok){
    return response.json();
    }
    throw new ERROR('Network response was not OK.');
    })
    .then(function(data){
      // Check the data object that was retrieved
      console.log(data);
      // data is the full JavaScript object, but we only want the preston part
      // shorten the variable and focus only on the data we want to reduce typing
      let p = data[cityName];
        console.log(p);
      // **********  Get the location information  **********
      let locName = p.properties.relativeLocation.properties.city;
      let locState = p.properties.relativeLocation.properties.state;
      // Put them together
      let fullName = locName+', '+locState;
      // See if it worked, using ticks around the content in the log
      console.log(`fullName is: ${fullName}`);
      // Get the longitude and latitude and combine them to
     // a comma separated single string
     const latLong = p.properties.relativeLocation.geometry.coordinates[1] + ","+ p.properties.relativeLocation.geometry.coordinates[0];
     console.log(latLong);
   
      // Create a JSON object containing the full name, latitude and longitude
      const prestonData = JSON.stringify({fullName,latLong})
      // and store it into local storage.
      locStore.setItem("Preston,ID", prestonData);
      //session store the full name & lat/long
      sessStore.setItem("fullName",fullName);
      sessStore.setItem("latLong",latLong);
      
  
      // **********  Get the current conditions information  **********
      // As the data is extracted from the JSON, store it into session storage
      // Get the temperature data
      let temperature = p.properties.relativeLocation.properties.temperature;
      sessStore.setItem("temperature",temperature);
      let highTemp = p.properties.relativeLocation.properties.highTemp;
      sessStore.setItem("highTemp",highTemp);
      let lowTemp =  p.properties.relativeLocation.properties.lowTemp;
      sessStore.setItem("lowTemp",lowTemp);

      
      
     

  
  
      // Get the wind data 
      let windGust = p.properties.relativeLocation.properties.windGust;
      sessStore.setItem("windGust",windGust);
      let windSpeed = p.properties.relativeLocation.properties.windSpeed;
      sessStore.setItem("windSpeed",windSpeed);
      
  
  
      // Get the hourly data using another function - should include the forecast temp, condition icons and wind speeds. The data will be stored into session storage.
      getHourly(p.properties.forecastHourly);
    })
    .catch(function(error){
    console.log('There was a fetch problem: ', error.message);
    statusContainer.innerHTML = 'Sorry, the data could not be processed.';
    })
  }

/* *************************************
* Calculates the Wind Chill Temperature
************************************** */
// Calculate the Windchill
function buildWC(speed, temp) {
    let feelTemp = document.getElementById('feelTemp');

// Compute the windchill
 let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
 console.log(wc);

 // Round the answer down to integer
wc = Math.floor(wc);

// If chill is greater than temp, return the temp
wc = (wc > temp)?temp:wc;
// Display the windchill
 console.log(wc);
 return wc;
 // wc = 'Feels like '+wc+'°F';
//  feelTemp.innerHTML = wc;

}

/* *****************************************
* Displays the current date and last modified
******************************************* */
function buildModDate(){
let daynames = ["Sunday","Monday","Tuesday","Wednesday","Thursday", "Friday","Saturday"];
let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let d = new Date();
let dayName = daynames[d.getDay()];
let monthName = months[d.getMonth()];
let fulldate = dayName + ", " + d.getDate() + " " + monthName + " " + d.getFullYear();

document.getElementById("currentdate").textContent = fulldate;
document.getElementById("lastmodified").textContent = new Date(document.lastModified);
}

// hamburger toggle menu
function toggleMenu() {
document.getElementById("primaryNav").classList.toggle("hide");
}

/* **********************
* Time ball function
************************ */
// Time Indicator Function
function timeBall(hour){
    // Find all "ball" classes and remove them
    let x = document.querySelectorAll(".slider");
    for (let item of x) {
        console.log(item);
        item.classList.remove("slider");
    }
    
    // Find all hours that match the parameter and add the "ball" class
    let hr = document.querySelectorAll(".i"+hour);
    for (let item of hr){
        item.classList.add("slider");
    }
}

/* *************************************
*  Get Hourly Forecast data
************************************* */
function getHourly(URL) {
  fetch(URL)
   .then(function (response) {
    if (response.ok) {
     return response.json();
    }
    throw new ERROR('Response not OK.');
   })
   .then(function (data) {
    console.log('Data from getHourly function:');
    console.log(data); // Let's see what we got back
 
    // Store 12 hours of data to session storage  
    var hourData = [];
    let todayDate = new Date();
    var nowHour = todayDate.getHours();
    console.log(`nowHour is ${nowHour}`);
    for (let i = 0, x = 11; i <= x; i++) {
     if (nowHour < 24) {
      hourData[nowHour] = data.properties.periods[i].temperature + "," + data.properties.periods[i].windSpeed + "," + data.properties.periods[i].icon;
      sessStore.setItem(`hour${nowHour}`, hourData[nowHour]);
      nowHour++;
     } else {
      nowHour = nowHour - 12;
      hourData[nowHour] = data.properties.periods[i].temperature + "," + data.properties.periods[i].windSpeed + "," + data.properties.periods[i].icon;
      sessStore.setItem(`hour${nowHour}`, hourData[nowHour]);
      nowHour = 1;
     }
    }
 
    // Get the shortForecast value from the first hour (the current hour)
    // This will be the condition keyword for setting the background image
    sessStore.setItem('shortForecast', data.properties.periods[0].shortForecast);
 
    // Call the buildPage function
    buildPage();
   })
   .catch(error => console.log('There was a getHourly error: ', error))
 }

/* ************************************
*  Build the Weather page
************************************* */
function buildPage() {
 // Set the title with the location name at the first
 // Gets the title element so it can be worked with
 let pageTitle = document.querySelector('#page-title');
 // Create a text node containing the full name 
 let fullNameNode = document.createTextNode(sessStore.getItem('fullName'));
 // inserts the fullName value before any other content that might exist
 pageTitle.insertBefore(fullNameNode, pageTitle.childNodes[0]);
 // When this is done the title should look something like this:
 // Preston, Idaho | The Weather Site 

 // Get the h1 to display the city location
 let contentHeading = document.querySelector('#contentHeading');
 contentHeading.innerHTML = sessStore.getItem('fullName');
 // The h1 in the main element should now say "Preston, Idaho"

 // Get the coordinates container for the location
 let latlon = document.querySelector('#latLon');
 latLon.innerHTML = sessStore.getItem('latLong');
 // The latitude and longitude should match what was stored in session storage.

 // Get the condition keyword and set Background picture
changeSummaryImage(sessStore.getItem('shortForecast'));
/* Keep in mind that the value may be different than 
what you need for your CSS to replace the image. You 
may need to make some adaptations for it to work.*/

// **********  Set the current conditions information  **********
// Set the temperature information
let highTemp = $('#hiTemp');
let loTemp = $('#lowTemp');
let currentTemp = $('#currentTemp');
highTemp.innerHTML = sessStore.getItem('highTemp') + "°F";
loTemp.innerHTML = sessStore.getItem('lowTemp') + "°F";
currentTemp.innerHTML = sessStore.getItem('temperature') + "°F";
// Set the wind information
let speed = $('#speed');
let gust = $('#gusting');
speed.innerHTML = sessStore.getItem('windSpeed');
gust.innerHTML = sessStore.getItem('windGust');
// Calculate feel like temp
let feelTemp = $('#feelTemp');
feelTemp.innerHTML = buildWC(sessStore.getItem('windSpeed'), sessStore.getItem('temperature')) + "°F";
console.log("feelTemp");

// **********  Set the Time Indicators  **********
let thisDate = new Date();
var currentHour = thisDate.getHours();
let indicatorHour;
// If hour is greater than 12, subtract 12
if (currentHour > 12) {
 indicatorHour = currentHour - 12;
} else {
 indicatorHour = currentHour;
};
console.log(`Current hour in time indicator is: ${currentHour}`);
// Set the time indicator
timeBall(indicatorHour);

// ********** Hourly Temperature Component  **********
// Get the hourly data from storage as an array
let currentData = [];
let tempHour = currentHour;
// Adjust counter based on current time
for (let i = 0, x = 12; i < x; i++) {
 if (tempHour <= 23) {
  currentData[i] = sessStore.getItem('hour' + tempHour).split(",");
  tempHour++;
 } else {
  tempHour = tempHour - 12;
  currentData[i] = sessStore.getItem('hour' + tempHour).split(",");
  console.log(`CurrentData[i][0] is: ${currentData[i][0]}`);
  tempHour = 1;
 }
}
console.log(currentData);

// Loop through array inserting data
// Start with the outer container that matchs the current time
tempHour = currentHour;
for (let i = 0, x = 12; i < x; i++) {
 if (tempHour >= 13) {
  tempHour = tempHour - 12;
 }
//  console.log(`Start container is: o.${tempHour}`);
 $('.o' + tempHour).innerHTML = currentData[i][0];
 tempHour++;

 // ********** Hourly Wind Component  **********
// Get the hourly data from storage
let windArray = [];
let windHour = currentHour;
// Adjust counter based on current time
for (let i = 0, x = 12; i < x; i++) {
 if (windHour <= 23) {
  windArray[i] = currentData[i][1].split(" ");
  console.log(`windArray[i] is: ${windArray[i]}`);
  windHour++;
 } else {
  windHour = windHour - 12;
  windArray[i] = currentData[i][1].split(" ");
  windHour = 1;
 }
}
console.log(windArray);

// Insert Wind data
// Start with the outer container that matchs the time indicator
windHour = currentHour;
for (let i = 0, x = 12; i < x; i++) {
 if (windHour >= 13) {
  windHour = windHour - 12;
 }
 $('.wi' + windHour).innerHTML = windArray[i][0];
 windHour++;
}

// **********  Condition Component Icons  **********
let conditionHour = currentHour;
// Adjust counter based on current time
for (let i = 0, x = 12; i < x; i++) {
 if (conditionHour >= 13) {
  conditionHour = conditionHour - 12;
 }
 $('.imge' + conditionHour).innerHTML = '<img src="' + currentData[i][2] + '" alt="hourly weather condition image">';
 conditionHour++;
}
 // Change the status of the containers
contentContainer.setAttribute('class', ''); // removes the hide class from main
statusContainer.setAttribute('class', 'hide'); // hides the status container
}
}
    
/* *******************************************************************
* Displays the  correct background img depending on the weather outside
*********************************************************************** */
function changeSummaryImage (currCond){
let selectImage = $("#curWeather");

//check if weather conditions includes these words.
if(currCond.includes("rain") || currCond.includes("Wet") ||
currCond.includes("Thunder") || currCond.includes("Shower") ||
currCond.includes("wet") || currCond.includes("Rain")) {
  selectImage.classList.add("rain");
}
else if(currCond.includes("Cloud") || currCond.includes("cloud")) {
  selectImage.classList.add("cloud");
}
else if(currCond.includes("fog") || currCond.includes("Fog")) {
    selectImage.classList.add("fog");
  }
 else if(currCond.includes("Snow") || currCond.includes("snow")) {
      selectImage.classList.add("snow");
    }
   else if(currCond.includes("Clear") || currCond.includes("clear")) {
        selectImage.classList.add("clear");
   }
    else{
      selectImage.classList.add("clear");
    }

  }


    

 
  
  

 