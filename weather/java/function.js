'use strict';

/* A collection of functions for the Weather Site.*/ 


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
});


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
function changeSummaryImage (currCond)