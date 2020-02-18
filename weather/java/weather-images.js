let imagesToLoad = document.querySelectorAll('source[data-src]');

const loadImages = (image) => {
  image.setAttribute('srcset', image.getAttribute('data-src'));
  image.onload = () => {
    image.removeAttribute('data-src');
  };
};

imagesToLoad.forEach((img) => {
    loadImages(img);
  });

  if('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((items, observer) => {
      items.forEach((item) => {
        if(item.isIntersecting) {
          loadImages(item.target);
          observer.unobserve(item.target);
        }
      });
    });
    imagesToLoad.forEach((source) => {
      observer.observe(source);
    });
  } else {
    imagesToLoad.forEach((source) => {
      loadImages(source);
    });
  }


  let daynames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December"

];

let d = new Date();
let dayName = daynames[d.getDay()];
let monthName = months[d.getMonth()];
let fulldate = dayName + ", " + d.getDate() + " " + monthName + " " + d.getFullYear();

document.getElementById("currentdate").textContent = fulldate;
document.getElementById("lastmodified").textContent = new Date(document.lastModified);
