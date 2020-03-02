 // Call the fetch function passing the url of the API as a parameter

fetch("/adriantolbert.github.io/presentations/fetch.json")

 // Below is your code for handling the data you get from the API

 //Intiates the promise to wait for the repsonse, if repsonse is ok return respeonse and continue to next "then" 

 .then(function(response) {
   if(response.ok){
     return response.json();

     // also may be written like this in shorthand .then(response => response.json())
   }
   // Lets me know there was an error with the network response
   throw 'Network response was not OK.';
 })
 //do something with the javascript objectS

 .then(function(data){
     console.log(data.string);
  
 })
  // This is where you run code if the server returns any errors.

 .catch(function(error){
console.log('There was a fetch problem: ', error);
 })
//  console.log("Outside Fetch");
