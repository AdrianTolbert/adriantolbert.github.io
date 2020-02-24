// this code is duplicated in the "functions.js" file and to use it, the functions.js page, instead of this file.

let daynames = ["Sunday","Monday","Tuesday","Wednesday","Thursday", "Friday","Saturday"];
let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let d = new Date();
let dayName = daynames[d.getDay()];
let monthName = months[d.getMonth()];
let fulldate = dayName + ", " + d.getDate() + " " + monthName + " " + d.getFullYear();

document.getElementById("currentdate").textContent = fulldate;
document.getElementById("lastmodified").textContent = new Date(document.lastModified);


// hamburger toggle menu
function toggleMenu() {
document.getElementById("primaryNav").classList.toggle("hide");
}