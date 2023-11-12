import { ratedMovies } from "./scoreRate.js"; 
import {getMoviesCmdb, scoreMovieWithReturn, getMovieOmdb, getMovieOmdbShortPlot, scoreMovie, getMovieOmdbFullPlot, latestReview, searchForMoviesOmdb, getMoviesCmdbPaging, cmdbScoreFilter, getMoviesByGenre, getMovieDetailsFromCMDB, searchForMoviesOmdbFilter} from './apiCalls.js';



const searchBox = document.getElementById('movie-search-box');
const searchButton = document.getElementById('searchbutton')
const movieResults = document.getElementById('movie-results');
const searchList = document.getElementById('search-list');



//VID ENTER PÅ INEDEX, func displayMovieList();
window.onload = performSearchOnLoad;

// Event listener for the search button
searchButton.addEventListener('click', function() {
    const searchTerm = searchBox.value.trim();
    if (searchTerm) {
        localStorage.setItem('lastSearchTerm', searchTerm);
        // Redirect to 'search.html' with the search term as a query parameter
        window.location.href = 'search.html?searchTerm=' + encodeURIComponent(searchTerm);
    }
});
    
searchBox.addEventListener('keyup', function(event) {
    // Check if the key that was pressed was Enter
    if (event.key === 'Enter') {
        const searchTerm = searchBox.value.trim();
        if (searchTerm) {
            // If the search box has a value, perform the search
            localStorage.setItem('lastSearchTerm', searchTerm);
            window.location.href = 'search.html?searchTerm=' + encodeURIComponent(searchTerm);
        }
    }
});
    searchBox.addEventListener('keyup', findMoviesSearchBar);


function performSearchOnLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('searchTerm');

    if (searchTerm) {
        updateRecentSearches(searchTerm);    
        loadMovies(searchTerm);  
    }
}





//#region Searchpage
// Step 2. SEARCHPAGE //SKRIV IN SÖKTERM I MESSAGE

async function loadMovies(searchTerm) {
    
    const searchResults = await searchForMoviesOmdb(searchTerm);
    console.log(searchResults);
    
    if (!searchResults)  {
        document.getElementById('yoursearch').textContent = 'No results found for ' + searchTerm;
    } else {
       
        displayMovieList(searchResults);
    }
}

async function displayMovieList(movies){
    const movieResults = document.querySelector('#movie-results');
    if (movieResults) {
        movieResults.innerHTML = '';
   
    for(let idx = 0; idx < movies.length; idx++){
        
        let movieDiv = document.createElement('div');
        movieDiv.dataset.id = movies[idx].imdbID;
        movieDiv.classList.add('result1', 'clearfix');
        movieDiv.style.display = 'block';

        let moviePoster;
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "img/image_not_found.png";

            const movieDetails = await getMovieOmdbShortPlot(movies[idx].imdbID);
            console.log(movieDetails);
            const cmdbDetails = await getMovieDetailsFromCMDB(movies[idx].imdbID);
            console.log(cmdbDetails);
            console.log(movieDetails);

            if (cmdbDetails) {
                const cmdbScore = cmdbDetails.cmdbScore;
                movieDiv.innerHTML = `
                    <div class="movie-poster">
                        <a href="${moviePoster}" target="_blank">
                            <img src="${moviePoster}" alt="${movies[idx].Title}"/>
                        </a>
                    </div>
                    <div class="movie-summary">
                        <h4>${movies[idx].Title} (${movies[idx].Year})</h4>
                        <p class="plot">${movieDetails.Plot}</p>
                        <p class="genre">Genre: ${movieDetails.Genre}</p>
                        <p class="runtime">Runtime: ${movieDetails.Runtime}</p>
                        <p class="cmdb-score">Cmdb Score: ${cmdbScore}</p>                        
                    </div>
                `;
            } else {
                movieDiv.innerHTML = `
            <div class="movie-poster">
                <a href="${moviePoster}" target="_blank">
                    <img src="${moviePoster}" alt="${movies[idx].Title}"/>
                </a>
            </div>
            <div class="movie-summary">
                <h4>${movies[idx].Title} (${movies[idx].Year})</h4>
                <p class="plot">${movieDetails.Plot}</p>
                <p class="genre">Genre: ${movieDetails.Genre}</p>
                <p class="runtime">Runtime: ${movieDetails.Runtime}</p>
               
            </div>
        `;
       
        
        // const scoreElement = movieDiv.querySelector('.cmdb-score');
        const rating = document.createElement('div');
        rating.classList.add('rating2');
        rating.setAttribute('data-id', movies[idx].imdbID);

        const ratingOptions = ['1', '2', '3', '4'];
        const ratingList = document.createElement('ul');
        ratingList.classList.add('rating-list2');

        ratingOptions.forEach(option => {
        const listItem = document.createElement('li');
        listItem.classList.add('_' + option + '2');

        const link = document.createElement('a');
        link.textContent = option;
        link.href = '#';

        link.addEventListener('click', function (event){
            event.preventDefault();
            event.stopPropagation();
            rateMovie(movies[idx].imdbID, option);
            let scoreElement = movieDiv.querySelector('.cmdb-score');
            if (!scoreElement) {
                scoreElement = document.createElement('p');
                scoreElement.classList.add('cmdb-score');
                movieDiv.querySelector('.movie-summary').appendChild(scoreElement);
            }
            scoreElement.textContent = `CMDB Score: ${option}`;
        });

        listItem.appendChild(link);
        ratingList.appendChild(listItem);
    });

        rating.appendChild(ratingList);
        movieDiv.appendChild(rating);

            }

        movieResults.appendChild(movieDiv);
        }
    
    loadMovieDetails();
} else {
    return;
}
}


function loadMovieDetails() {
    const searchListMovies = movieResults.querySelectorAll('.result1');
   console.log(searchListMovies);

    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async (event) => { 
            console.log(movie.dataset.id);
            searchBox.value = "";
            const omdbMovieDetails = await getMovieOmdbFullPlot(movie.dataset.id);
            try {
                const cmdbMovieDetails = await getMovieDetailsFromCMDB(movie.dataset.id);
                if (!cmdbMovieDetails) {
                  
                    console.log("Movie not found in CMDB");
                    storeMovieData(omdbMovieDetails);
                    redirectToMovieDetails(omdbMovieDetails.imdbID);
                } else {
                    const combinedMovieDetails = { ...omdbMovieDetails, ...cmdbMovieDetails };
                    
                    storeMovieData(combinedMovieDetails);
                    redirectToMovieDetails(combinedMovieDetails.imdbID);
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        });
    });
}
//#endregion Searchpage



//#region Search bar
async function loadMoviesSearchBar(searchTerm){
    const searchResults = await searchForMoviesOmdb(searchTerm);
    console.log(searchResults);
    displayMovieListSearchBar(searchResults);
}


// Step 1. ONLY FOR SEACHBAR, koppla eventlistener
function findMoviesSearchBar(){
    let searchTerm = (searchBox.value).trim();
    if(searchTerm.length > 0){       
       searchList.classList.remove('hide-search-list');
        loadMoviesSearchBar(searchTerm);
        console.log(searchTerm);

        sessionStorage.setItem('searchTerm', searchTerm);
    } else {       
            searchList.classList.add('hide-search-list');      
    }
} 

function displayMovieListSearchBar(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');

        let moviePoster;
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
        <img src = "${moviePoster}"> 
    </div>
    <div class = "search-item-info">
        <h3>${movies[idx].Title}</h3>
        <p>${movies[idx].Year}</p>
    </div>
    `;
    searchList.appendChild(movieListItem)             
    }
    loadMovieDetailsSearchBar();
}


function loadMovieDetailsSearchBar() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            searchBox.value = "";
           
            const omdbMovieDetails = await getMovieOmdbFullPlot(movie.dataset.id);

            try {
                const cmdbMovieDetails = await getMovieDetailsFromCMDB(movie.dataset.id);
                if (!cmdbMovieDetails) {
                    // Handle the case where the movie is not found in the CMDB
                    console.log("Movie not found in CMDB");
                    storeMovieData(omdbMovieDetails);
                    redirectToMovieDetails(omdbMovieDetails.imdbID);
                } else {
                    const combinedMovieDetails = { ...omdbMovieDetails, ...cmdbMovieDetails };
                    
                    storeMovieData(combinedMovieDetails);
                    redirectToMovieDetails(combinedMovieDetails.imdbID);
                }
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        });
    });
}
//#endregion Search bar


function updateRecentSearches(searchTerm) {
    // Get the recent searches from localStorage
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    // Add the search term to the start of the recent searches array
    recentSearches.unshift(searchTerm);

    recentSearches = recentSearches.slice(0, 10);


    // Store the updated recent searches array in localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));

    const container = document.getElementById('topp-today-search');

    // Clear the container
    container.innerHTML = '';
    recentSearches = recentSearches.reverse(); 
    // Iterate over the recent searches
    recentSearches.forEach((searchTerm, index) => {
       
        const p = document.createElement('p');
        const number = recentSearches.length - index;
        p.innerHTML = `<span class="topp-search-number">${number}.</span> ${searchTerm} <span class="type"></span>`;
        container.prepend(p);
    });
    document.getElementById('yoursearch').textContent = 'Your search: ' + searchTerm;
}


//#region Rating 
function rateMovie(imdbID, score) {
    console.log(imdbID);
    const ratedMovie = ratedMovies.find(movie => movie.imdbID === imdbID);
    if (ratedMovie) {
        alert(`You've already rated this movie.`);
    } else {
        ratedMovies.push({
            imdbID: imdbID,
            ratingScore: parseInt(score),
        });
        localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));

        scoreMovieWithReturn(imdbID, score)
    .then(newAverageScore => {   
        const scoreElement = document.querySelector(`.result1[data-id="${imdbID}"] .cmdb-score`);
        if (scoreElement) {
            scoreElement.textContent = `CMDB Score:  ${Math.round(newAverageScore)}`;
        }             
    })
        .catch((error) => {
            console.error('Error:', error);
        }); 

        const ratingsElement = document.querySelector(`.rating2[data-id="${imdbID}"]`);
        if (ratingsElement) ratingsElement.style.display = 'none';
    }
}
//#endregion Rating




//#region functions to save, load and display movies


function storeMovieData(movie) {
    // Store the movie object in local storage
    const movieString = JSON.stringify(movie);
    const movieKey = `movieData_${movie.imdbID}`;
    localStorage.setItem(movieKey, movieString);
}

function constructMovieURL(imdbID) {
    // Construct the URL with a query parameter for the IMDb ID
    const queryParams = new URLSearchParams();
    queryParams.set('imdbID', imdbID);
    const url = `movie.html?${queryParams.toString()}`;
    return url;
}

function redirectToMovieDetails(imdbID) {
    const url = constructMovieURL(imdbID);
    
    window.location.href = url;
}
//#endregion