//#region imports
import { scoreMovie } from "./apiCalls.js";
//#endregion


//#region variables
//place the ratedMovies in a local storage and if it is empty, create an empty array
let ratedMovies = localStorage.getItem('ratedMovies') ? JSON.parse(localStorage.getItem('ratedMovies')) : [];
//#endregion
console.log(ratedMovies);
//#region functions for score/set rating
/**
 * Check if the user has rated the movie before.
 * If not, rate the movie and update the UI.
 * If yes, display a message that the movie already been rated.
 * @param {*} imdbID 
 * @param {*} option 
 * @param {*} ratedMovies 
 * @param {*} link 
 */


function rateMovie(imdbID, option, ratedMovies, link, rating) {
  return new Promise((resolve, reject) => {
    if (!ratedMovies.find(movie => movie.imdbID === imdbID)) {
      const ratingScore = parseInt(option);

      scoreMovie(imdbID, ratingScore)
        .then(response => {
          console.log('You rated ', response);

          // Update the UI to show the user's rating
          link.textContent = 'You rated ' + option;

          const ratedMovie = {imdbID, ratingScore};
          ratedMovies.push(ratedMovie);

          // Update ratedMovies in local storage
          localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));

           // Remove other links
           rating.querySelectorAll('a').forEach(otherLink => {
            if (otherLink !== link) {
              otherLink.parentNode.remove();
            }
          });

          resolve(); // Resolve the promise after successfully rating the movie
        })
        .catch(error => {
          console.error('Error rate movie:', error);
          reject(error); // Reject the promise if there is an error
        });
    } else {
      // Display a message to inform the user they've already rated the movie
      alert('You have already rated this movie.');
      reject(new Error('Movie already rated')); // Reject the promise with an error
    }
  });
}


//#endregion

//#region export
export {rateMovie, ratedMovies};
//#endregion