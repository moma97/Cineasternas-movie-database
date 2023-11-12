
// detalj: https://www.omdbapi.com/?i=tt3896198&apikey=5a4be969
// https://omdbapi.com/?i=tt4300958&plot=full&apikey=5a4be969

// import { ratedMovies } from "./scoreRate.js"; 
// import {getMoviesCmdb, getMovieOmdb, scoreMovie, getMovieOmdbFullPlot, latestReview, searchForMoviesOmdb, getMoviesCmdbPaging, cmdbScoreFilter, getMoviesByGenre, getMovieDetailsFromCMDB} from './apiCalls.js';




// #region searchfunction


// const movieSearchBox = document.getElementById('movie-search-box');
// const searchList = document.getElementById('search-list');
// const resultGrid = document.getElementById('result-grid');

// #endregion


// async function loadMovies(searchTerm) {
//     const searchResults = await searchForMoviesOmdb(searchTerm);

//     if(searchResults) {
//         displayMovieList(searchResults);
//     }
// }


// function findMovies(){
//     let searchTerm = (movieSearchBox.value).trim();
//     if(searchTerm.length> 0 ){
//         searchList.classList.remove('hide-search-list');
//         loadMovies(searchTerm);
//     }  else {
//         searchList.classList.add('hide-search-list');
//     }     
 
// }
// document.addEventListener('DOMContentLoaded', function() {
//     const searchTerm = sessionStorage.getItem('searchTerm');
//     if (searchTerm) {
//         document.getElementById('movie-search-box').value = searchTerm;
        
//     }
// });


// document.getElementById('movie-search-box').addEventListener('keyup', findMovies);
// document.getElementById('searchbutton').addEventListener('click', findMovies);





// function displayMovieList(movies){
//     searchList.innerHTML = "";
//     for(let idx = 0; idx < movies.length; idx++){
//         let movieListItem = document.createElement('div');
//         movieListItem.dataset.id = movies[idx].imdbID;
//         movieListItem.classList.add('search-list-item');

//         let moviePoster;
//         if(movies[idx].Poster != "N/A")
//             moviePoster = movies[idx].Poster;
//         else
//             moviePoster = "image_not_found.png";

//         movieListItem.innerHTML = `
//         <div class = "search-item-thumbnail">
//         <img src = "${moviePoster}"> 
//     </div>
//     <div class = "search-item-info">
//         <h3>${movies[idx].Title}</h3>
//         <p>${movies[idx].Year}</p>
//     </div>
//     `;
//     searchList.appendChild(movieListItem)             
//     }
//     loadMovieDetails();
// }



// function loadMovieDetails() {
//     const searchListMovies = searchList.querySelectorAll('.search-list-item');
//     searchListMovies.forEach(movie => {
//         movie.addEventListener('click', async () => {
//             searchList.classList.add('hide-search-list');
//             movieSearchBox.value = "";
           
//             const omdbMovieDetails = await getMovieOmdb(movie.dataset.id);

//             try {
//                 const cmdbMovieDetails = await getMovieDetailsFromCMDB(movie.dataset.id);
//                 if (!cmdbMovieDetails) {
//                     // Handle the case where the movie is not found in the CMDB
//                     console.log("Movie not found in CMDB");
//                     storeMovieData(omdbMovieDetails);
//                     redirectToMovieDetails(omdbMovieDetails.imdbID);
//                 } else {
//                     const combinedMovieDetails = { ...omdbMovieDetails, ...cmdbMovieDetails };
                    
//                     storeMovieData(combinedMovieDetails);
//                     redirectToMovieDetails(combinedMovieDetails.imdbID);
//                 }
//             } catch (error) {
//                 console.error("Error fetching movie details:", error);
//             }
//         });
//     });
// }




// function storeMovieData(movie) {
//     // Store the movie object in local storage
//     const movieString = JSON.stringify(movie);
//     const movieKey = `movieData_${movie.imdbID}`;
//     localStorage.setItem(movieKey, movieString);
// }

// function constructMovieURL(imdbID) {
//     // Construct the URL with a query parameter for the IMDb ID
//     const queryParams = new URLSearchParams();
//     queryParams.set('imdbID', imdbID);
//     const url = `movie.html?${queryParams.toString()}`;
//     return url;
// }

// function redirectToMovieDetails(imdbID) {
//     const url = constructMovieURL(imdbID);
//     // Redirect to the detail page with the IMDb ID in the URL
//     window.location.href = url;
// }


// // #endregion 
  

// export {storeMovieData, constructMovieURL, redirectToMovieDetails};


// function redirectToSearchPage() {
//     // Get the search value
//     const searchValue = document.querySelector('#movie-search-box').value;

//     // Store the search value in localStorage
//     localStorage.setItem('searchValue', searchValue);
    
//     // Redirect to the search results page
//     window.location.href = 'search.html';
// }
// document.querySelector('#searchbutton').addEventListener('click', redirectToSearchPage);








  
// //redirects, searchbutton

// function redirectToSearchPage() {
//     // Get the search value
//     const searchValue = document.querySelector('#movie-search-box').value;
//     console.log(searchValue);
//     // Store the search value in localStorage
//     localStorage.setItem('searchValue', searchValue);
    
//     // Redirect to the search results page
//     window.location.href = 'search.html';
//     searchMovie();
//   }
  
//   // Attach the event handler to the search button
//   document.querySelector('#searchbutton').addEventListener('click', redirectToSearchPage);

  
  
//   // Fetch and display the movies for the search value from localStorage when the page loads
// document.addEventListener('DOMContentLoaded', async function() {

//     // Get the search value from localStorage
//     const searchTerm = localStorage.getItem('searchValue');
//     if (searchTerm){
//     // Fetch and display the movies for page 1
//     await fetchAndDisplayMovies(searchTerm, 1);
// }
// });

// // Get the search box
// const searchBox = document.querySelector('#movie-search-box');

// // Add an event listener for the 'keypress' event
// searchBox.addEventListener('keypress', function (event) {
//   // Check if the pressed key was the Enter key
//   if (event.key === 'Enter') {
//     // Prevent the default action
//     event.preventDefault();

    
//     // Perform the search
//     redirectToSearchPage();
  
//   }
// });

// function searchMovie() {
//     const searchTerm = document.querySelector('#movie-search-box').value;
//     if (searchTerm.length > 1) {
//         let topMovieSearches = JSON.parse(localStorage.getItem('topMovieSearches')) || [];
//         topMovieSearches.push(searchTerm);
        
//         if (topMovieSearches.length > 10) {
//             topMovieSearches.shift();
//         }
//         localStorage.setItem('topMovieSearches', JSON.stringify(topMovieSearches));
//         updateTopSearchesSection();
//     }
    
//     setTimeout(redirectToSearchPage, 100);
// }

// function updateTopSearchesSection() {
//     const topSearchesSection = document.querySelector('#topp-today-search');
//     let topMovieSearches = JSON.parse(localStorage.getItem('topMovieSearches')) || [];

//     topSearchesSection.innerHTML = '';

//     topMovieSearches.forEach((searchTerm, index) => {
//         const p = document.createElement('p');
//         const number = topMovieSearches.length - index;
//         p.innerHTML = `<span class="topp-search-number">${number}.</span> ${searchTerm} <span class="type"></span>`;
//         topSearchesSection.prepend(p);
//     });
// }
// window.onload = updateTopSearchesSection;