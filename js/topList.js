//#region imports
import { rateMovie, ratedMovies } from './scoreRate.js';
import { getMoviesCmdb, getMovieOmdb, getMovieOmdbFullPlot } from './apiCalls.js';
// #endregion

//#region variables
let currentPage = 1; // Initialize the current page
// #endregion

//#region functions calls
console.log(combineResults());
fetchMoviesTop3();
initializePagination();
// #endregion




// #region functions for top list
/**
 * Take the results from the CMDB and the OMDB API and combine them into one object.
 * @returns {Promise<Array>} An array of combined movie objects.
 */
async function combineResults(){
    const moviesCmdb = await getMoviesCmdb(30);
    const moviePromises = moviesCmdb.movies.map(async (movie) => {
        const imdbID = movie.imdbID;
        const movieOmdb = await getMovieOmdb(imdbID);
        return { ...movie, ...movieOmdb };
    });

    const combinedMovies = await Promise.all(moviePromises);
    return combinedMovies;
}


/**
 * Fetch the top 3 movies from the CMDB with data from OMDB API.
 */
async function fetchMoviesTop3(){
    const topContainers = [
        document.getElementById('top1'),
        document.getElementById('top2'),
        document.getElementById('top3')
    ];

    const rankElements = [];

try {
    const combinedMovies = await combineResults(); 
    
    combinedMovies.slice(0, 3).forEach(async (movie, index) => {
        createMovieContainer(movie, topContainers[index]);

    const rankElement = document.createElement('h1');
    rankElement.id = `rank${index + 1}`;
    rankElement.textContent = index + 1;
    rankElements.push(rankElement);
    
  });

  // Append the rank elements to the respective top containers
  rankElements.forEach((rankElement, index) => {
    topContainers[index].appendChild(rankElement);
  });
  } catch (error) {
    handleError(error);
  }
}


/**
 * Fetch the movies with pagination. From top 4 and upto 30.
 * @param {} page 
 */
async function fetchMoviesWithPagination(page) {
  const moviesPerPage = (page < 4) ? 7 : 6; // 7 movies for the first 3 pages, 6 for the last
  const startIdx = 3 + (page - 1) * 7; // Start from 3 for the first 3 pages
  const endIdx = (page < 4) ? (startIdx + moviesPerPage) : 30; // Limit the end index to 30

  const topContainers = [];

  for (let i = startIdx + 1; i <= endIdx; i++) {
    const topContainer = document.createElement('div');
    topContainer.classList.add('flex-item-4-10');
    topContainer.id = `top${i}`;

    const rankElement = document.createElement('h1');
    rankElement.id = `rank${i}`;
    rankElement.textContent = i;

    topContainer.appendChild(rankElement);
    topContainers.push(topContainer);
  }

  const top4To10Container = document.querySelector('.top4-10-container');
  top4To10Container.innerHTML = ''; // Clear the existing content
  topContainers.forEach(container => top4To10Container.appendChild(container));

  try {
    const combinedMovies = await combineResults();

    combinedMovies.slice(startIdx, endIdx).forEach(async (movie, index) => {
      createMovieContainer(movie, topContainers[index]);
    });
  } catch (error) {
    handleError(error);
  }
}


/**
 * Create the movie container with title, poster, score, rating, plot, read more button and to movie details button.
 * @param {} movie 
 * @param {*} targetContainer 
 */
  function createMovieContainer (movie, targetContainer){
    const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
  
        const movieTitle = document.createElement('h3');
        movieTitle.classList.add('movie-title');
        movieTitle.textContent = `${movie.Title}`;
  
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.src = `${movie.Poster}`;
        movieImg.alt = `Poster of ${movie.Title}`;
  
        const summary = document.createElement('div');
        summary.classList.add('summary');
  
        const movieScore = document.createElement('p');
        movieScore.classList.add('movie-score');
        movieScore.textContent = `Rating: ${movie.cmdbScore}`;
  
        const setRating = document.createElement('span');
          setRating.classList.add('set-rating');
          setRating.textContent = 'Rate movie';
          
          const rating = document.createElement('div');
          rating.classList.add('rating');
          const ratingOptions = ['1', '2', '3', '4'];

          const ratingList = document.createElement('ul');

          ratingOptions.forEach(option => {
            const ratedMovie = retrieveRatingFromLocalStorage(movie, ratedMovies);
            if (ratedMovie) {
              if (ratedMovie.ratingScore.toString() === option) {
                createRatedLink(option, movie, ratedMovies, rating);
              }
            } else {
              createRatingLink(option, movie, ratedMovies, rating);
            }
          });  
    
          const moviePlot = document.createElement('p');
          moviePlot.classList.add('movie-plot');
          moviePlot.textContent = `${movie.Plot}`;
    
          const readMoreButton = document.createElement('button');
          readMoreButton.classList.add('read-more-button');
          readMoreButton.textContent = 'Read more...';
    
          readMoreToggler(readMoreButton, moviePlot, movie.imdbID);
          

          const toMovieDetails = document.createElement('button');
            toMovieDetails.classList.add('to-movie-details');
            toMovieDetails.textContent = 'To movie details';
    
            toMovieDetails.addEventListener('click', function() {
              goToMovieDetails(movie);
              
          });

          rating.appendChild(ratingList);

          summary.appendChild(movieScore);
          summary.appendChild(setRating);
          summary.appendChild(rating);
          summary.appendChild(moviePlot);
          summary.appendChild(readMoreButton);
    
          movieContainer.appendChild(movieTitle);
          movieContainer.appendChild(movieImg);
          movieContainer.appendChild(summary);
          movieContainer.appendChild(toMovieDetails);

          targetContainer.appendChild(movieContainer);
  }

  /**
   * Create a link for rating the movie.
   * @param {} option 
   * @param {*} movie 
   * @param {*} ratedMovies 
   * @param {*} rating 
   */
  function createRatingLink(option, movie, ratedMovies, rating) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.classList.add("_"+ option);
    link.textContent = option;
  
    link.addEventListener('click', function (event){
      event.preventDefault();
      const imdbID = movie.imdbID;
      rateMovie(imdbID, option, ratedMovies, link, rating);
      link.classList.add('disabled');
    });
  
    listItem.appendChild(link);
    rating.appendChild(listItem);
  }
  
  /**
   * Create a link for rated movie.
   * @param {*} option 
   * @param {*} movie 
   * @param {*} ratedMovies 
   * @param {*} rating 
   */
  function createRatedLink(option, movie, ratedMovies, rating) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.classList.add("_"+ option);
    link.textContent = 'You rated ' + option;
    link.classList.add('disabled');
  
    link.addEventListener('click', function (event){
      event.preventDefault();
      const imdbID = movie.imdbID;
      rateMovie(imdbID, option, ratedMovies, link, rating);
      link.classList.add('disabled');
    });
  
    listItem.appendChild(link);
    rating.appendChild(listItem);
  }
  
  /**
   * Retrieve the rating from the local storage.
   * @param {*} movie 
   * @param {*} ratedMovies 
   * @returns 
   */
  function retrieveRatingFromLocalStorage(movie, ratedMovies) {
    return ratedMovies.find(ratedMovie => ratedMovie.imdbID === movie.imdbID);
  }

  /**
   * Fech the full plot from the OMDB API and return it.
   * @param {*} imdbID 
   * @returns 
   */
  async function FetchFullPlot(imdbID) {
    const oneMovie = await getMovieOmdbFullPlot(imdbID);
    return oneMovie.Plot;
  }



/**
 * Create a local storage with all the movie data.
 * Redirect to the movie details page.
 * @param {*} movie 
 */
async function goToMovieDetails(movie) {
  //change the plot to full plot
  const fullplot = await FetchFullPlot(movie.imdbID);
  movie.Plot = fullplot;

  // Store the movie object in local storage
  const movieString = JSON.stringify(movie);
  const movieKey = `movieData_${movie.imdbID}`;
  localStorage.setItem(movieKey, movieString);

  
 // Construct the URL with a query parameter for the IMDb ID
const queryParams = new URLSearchParams();
queryParams.set('imdbID', movie.imdbID);
const url = `movie.html?${queryParams.toString()}`;

// Redirect to the detail page with the IMDb ID in the URL
window.location.href = url;

}
  
/**
 * @param {*} error Error message
 */
  function handleError(error) {
    console.error(error);
  }

  
  /**
   * Go to the next page of movies.
   */
  function next() {
    if (currentPage < 4) {
      currentPage++;
    }
    fetchMoviesWithPagination(currentPage);
    updateButtonVisibility();
  }
  

  /**
   * Go to the previous page of movies.
   */
  function previous() {
    if (currentPage > 1) {
      currentPage--;
      fetchMoviesWithPagination(currentPage);
    }
    updateButtonVisibility();
  }


  /**
 * Update the visibility of the "Previous" and "Next" buttons
 */
  function updateButtonVisibility() {
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");

    if (currentPage === 1) {
      prevButton.classList.add('hidden');
    }
    else {
      prevButton.classList.remove('hidden');
    }
  
    if (currentPage < 4) {
      nextButton.classList.remove('hidden');
    } else {
      nextButton.classList.add('hidden');
    }
  }


  /**
 * Initialize the pagination and fetch the first page of movies
 */
  function initializePagination() {
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
  
    // Add click event listeners to the buttons
    prevButton.addEventListener("click", previous);
    nextButton.addEventListener("click", next);
  
    // Initial display of movies (page 1)
    fetchMoviesWithPagination(currentPage);
  
    // Update the button visibility
    updateButtonVisibility();
  }

/**
 * Create a toggle function for the read more button.
 * That change the plot from short to full and vice versa.
 * @param {*} readMoreButton 
 * @param {*} moviePlot 
 * @param {*} imdbID 
 */
function readMoreToggler (readMoreButton, moviePlot, imdbID){
  readMoreButton.addEventListener('click', () => {
    if(readMoreButton.textContent === 'Read more...'){
    displayFullPlot(imdbID, moviePlot);
    readMoreButton.textContent = 'Read less...';
    } 
    else if (readMoreButton.textContent === 'Read less...'){
      displayShortPlot(imdbID, moviePlot);
      readMoreButton.textContent = 'Read more...';
    }
  });
}


/**
 * Display the short plot in the moviePlot element.
 * @param {*} imdbID 
 * @param {*} moviePlot 
 */
async function displayShortPlot(imdbID, moviePlot) {
  const oneMovie = await getMovieOmdb(imdbID);
  moviePlot.textContent = oneMovie.Plot;
}

/**
 * Display the full plot in the moviePlot element.
 * @param {*} imdbID 
 * @param {*} moviePlot 
 */
async function displayFullPlot(imdbID, moviePlot) {
  const oneMovie = await getMovieOmdbFullPlot(imdbID);
  moviePlot.textContent = oneMovie.Plot;
}

// #endregion











 



 