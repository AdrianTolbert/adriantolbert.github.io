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
 // Variables for Wind Chill function
 let temp = 31;
 let speed = 5;
 buildWC(speed,temp);
// // calculate the time ball function
let hour = "8";
timeBall(hour);
//Change background image
changeSummaryImage("fog");
});





/* *************************************
*  Fetch Weather Data
************************************* */
function fetchWeatherData(weatherURL){
    let cityName = 'Preston'; // The data we want from the weather.json file
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
  
      // **********  Get the location information  **********
      let locName = p.City;
      let locState = p.State;
      // Put them together
      let fullName = locName+', '+locState;
      // See if it worked, using ticks around the content in the log
      console.log(`fullName is: ${fullName}`);
      // Get the longitude and latitude and combine them to
      // a comma separated single string
  
      // Create a JSON object containing the full name, latitude and longitude
      // and store it into local storage.
  
      // **********  Get the current conditions information  **********
      // As the data is extracted from the JSON, store it into session storage
      // Get the temperature data
  
  
      // Get the wind data 
  
  
      // Get the hourly data using another function - should include the forecast temp, condition icons and wind speeds. The data will be stored into session storage.
  
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
 // wc = 'Feels like '+wc+'°F';
 feelTemp.innerHTML = wc;
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
/* *******************************************************************
* Displays the  correct background img depending on the weather outside
*********************************************************************** */
function changeSummaryImage (currCond){

    let imgcon = document.querySelector("#curWeather");
    //makes entry not case sensative;
    currCond = currCond.toLowerCase();


    switch(currCond){

        case "clear":
            imgcon.classList.add("clear");
            console.log();
          break;


          case "rain":
            imgcon.classList.add("rain");
            console.log();
          break;

          case "snow":
            imgcon.classList.add("snow");
            console.log();
          break;

          case "fog":
            imgcon.classList.add("fog");
            console.log();
          break;

          case "cloud":
            imgcon.classList.add("cloud");
            console.log();
          break;

        }

   





}
    
