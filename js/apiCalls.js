//#region API URLs
const cmdbUrl = "https://grupp6.dsvkurs.miun.se/api";
const omdbURL = "https://www.omdbapi.com/?";
//#endregion

//#region API calls functions
/**
 * 
 * @returns {Promise<string>} The API key for the OMDB API.
 */
async function getApiKey(){
    const endpoint = "/keys/grupp7/46bc07e8-d9d7-4078-8516-e544d35e21e7";
    const response = await fetch(cmdbUrl + endpoint);
    const data = await response.json();
    return data.apiKey;
}


/**
 * 
 * @param {*} imdbID 
 * @returns fetch the movie with the specifik imdbID from the OMDB API.
 */
async function getMovieOmdb(imdbID) {
  const URL = `https://www.omdbapi.com/?i=${imdbID}&apikey=163dfc00`;
  const response = await fetch(URL);
  const oneMovie = await response.json();
  return oneMovie;
}
/**
 * 
 * @param {*} imdbID 
 * @returns fetch the movie with the searchterm from the OMDB API.
 */
async function searchForMoviesOmdb(searchTerm) {
  const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=163dfc00`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  return data.Search;
}

async function getMovieOmdbFullPlot(imdbID){
  const response = await fetch(omdbURL + new URLSearchParams({
      i: `${imdbID}`,
      plot: "full",
      apiKey: `${await getApiKey()}`  
  }));
  
  const oneMovie = await response.json();
  console.log(oneMovie);
  return oneMovie;
}



// async function getMovieOmdbFullPlotMonira(imdbID) {
//   const URL = `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=163dfc00`;
//   const res = await fetch(`${URL}`);
//   const data = await res.json();
//   return data.Plot;
// }

async function getMovieOmdbShortPlot(imdbID) {
  const URL = `https://www.omdbapi.com/?i=${imdbID}&plot=short&apikey=163dfc00`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  return data
  
  // {
  //     Plot: data.Plot,
  //     Genre: data.Genre,
  //     Runtime: data.Runtime
  // };
}

//#region CMDB API calls functions

async function getMovieDetailsFromCMDB(imdbID) {
  const URL = `https://grupp6.dsvkurs.miun.se/api/movies/${imdbID}`;
  const res = await fetch(URL);
  if (res.status === 404) {
      return null;
  } else if (res.status === 200) {
      const data = await res.json();
      return data;
  }
}

  /**
   * 
   * @returns fetch the latest review from the CMDB API.
   */
  async function latestReview(){
    const endpoint = '/movies/latest';
    const response = await fetch(cmdbUrl + endpoint);
    const latestReview = await response.json();
    return latestReview;   
  }


/**
 * Handle the API PUT request to score a movie.
 * @param {*} imdbID 
 * @param {*} score 
 */
async function scoreMovie(imdbID, score) {
  try {
      const endpoint = `/movies/rate/${imdbID}/${score}`;
      const response = await fetch(cmdbUrl + endpoint, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`Failed to rate the movie. Status: ${response.status}`);
    }

    const movieScored = await response.json();
    return movieScored;
    
  } catch (error) {
    console.error('Error rating movie:', error);
    throw error;
  }
}

async function scoreMovieWithReturn(imdbID, score) {
  try {
      const endpoint = `/movies/rate/${imdbID}/${score}`;
      const response = await fetch(cmdbUrl + endpoint, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`Failed to rate the movie. Status: ${response.status}`);
    }

    const movieScored = await response.json();
    console.log(movieScored.cmdbScore);
    return movieScored.cmdbScore;
    
  } catch (error) {
    console.error('Error rating movie:', error);
    throw error;
  }
}



/**
 * 
 * @param {*} moviesPerPage is the number of movies to be returned from the CMDB API.
 * @returns return the top movies from the CMDB API.
 */
async function getMoviesCmdb(moviesPerPage){
  const endpoint = `/toplists?sort=DESC&limit=${moviesPerPage}&page=1&countLimit=2`;
 const response = await fetch(cmdbUrl + endpoint);
     const movies = await await response.json();
     return movies;
 }

 async function getMoviesCmdbPaging(moviesPerPage, page){
  const endpoint = `/toplists?sort=DESC&limit=${moviesPerPage}&page=${page}&countLimit=2`;
 const response = await fetch(cmdbUrl + endpoint);
     const movies = await await response.json();
     return movies;
 }
//#endregion

//#region Combined API calls functions


// async function getCombinedMovieDetails(imdbID) {
//   const [cmdbDetails, omdbDetails] = await Promise.all([
//       getMovieDetailsFromCMDB(imdbID),
//       getMovieOmdbFullPlot(imdbID)
//   ]);

//   return { ...cmdbDetails, ...omdbDetails };
// }

//#endregion

//#region filter 

async function cmdbScoreFilter(moviesPerPage, minScore){
  const movies = await getMoviesCmdb(moviesPerPage);
  
  const filteredMovies = movies.filter(movie => movie.cmdbScore >= minScore);
  
  const sortedMovies = filteredMovies.sort((a, b) => b.cmdbScore - a.cmdbScore);
  
  return sortedMovies;
}

async function getMoviesByGenre(searchTerm, genre) {
  const searchResults = await searchForMoviesOmdb(searchTerm);

  const movies = await Promise.all(searchResults.map(movie => getMovieOmdb(movie.imdbID)));

  const filteredMovies = movies.filter(movie => movie.Genre && movie.Genre.includes(genre));

  return filteredMovies;
}

//#endregion 


export {getMoviesCmdb, scoreMovieWithReturn, getMovieOmdb, getMovieOmdbShortPlot, scoreMovie, getMovieOmdbFullPlot, latestReview, searchForMoviesOmdb, getMoviesCmdbPaging, cmdbScoreFilter, getMoviesByGenre, getMovieDetailsFromCMDB};
//#endregion