import { ratedMovies } from './scoreRate.js';



// Constants
const imdbID = getImdbIDFromURL();
const scoreInput = document.getElementById('score');
const ratingMessage = document.getElementById('rating-message');
const publishButton = document.getElementById('publish-button');

updateUIForRatedMovie();


// Functions
function getImdbIDFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('imdbID');
}

// Initial UI setup based on whether the movie has been rated
function updateUIForRatedMovie() {
    
  if (ratedMovies) {
  const ratedMovie = ratedMovies.find(movie => movie.imdbID === imdbID);

  if (ratedMovie) {
    // Movie has been rated, disable the form and show a message
    document.getElementById('name').disabled = true;
    document.getElementById('review').disabled = true;
    document.getElementById('score').disabled = true;
    document.getElementById('publish-button').disabled = true;
    publishButton.classList.add('button-disabled');
    document.getElementById('rateMovieHeadline').hidden = true;
    document.querySelector('.rating').hidden = true;
    scoreInput.style.display = 'none';
    ratingMessage.textContent = "You have given this movie the score: " + ratedMovie.ratingScore;
    
  } else {
    // Movie hasn't been rated, offer the dropdown box
    // Show the form or any UI elements you want to display for submitting a review
    document.getElementById('name').disabled = false;
    document.getElementById('review').disabled = false;
    document.getElementById('score').disabled = false;
    document.getElementById('publish-button').disabled = false;
    scoreInput.style.display = 'block';
  }
}
}




function pressingPublishButton(event) {
    event.preventDefault();
  
    // Get the name and review values
    const name = document.getElementById("name").value;
    const review = document.getElementById("review").value;
  
    // Check if name and review are filled
    if (!name || !review) {
      alert('Please fill in the required fields');
      return;
    } 
  
    //Get the score
    const score = parseInt(scoreInput.value);

    const ratedMovie = ratedMovies.find(movie => movie.imdbID === imdbID);
    if (ratedMovie) {
    alert('You have already rated this movie');
    return;
    }
  
    // Proceed with API submission

    submitReviewToAPI(imdbID, name, score, review);
  
    // Add the movie to the ratedMovies array
    ratedMovies.push({
      imdbID: imdbID,
      ratingScore: score,
    });
    localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));
    updateUIForRatedMovie();

}
  publishButton.addEventListener('click', pressingPublishButton);




// Function to submit the review to the API
async function submitReviewToAPI(imdbID, name,  score, review) {
  const apiUrl = `https://grupp6.dsvkurs.miun.se/api/movies/review`;

  const reviewData = {
    imdbID: imdbID,
    reviewer: name,
    score: score,
    review: review,
    date: null,
  };


  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const successMessage = document.getElementById('review-success-message');
      successMessage.textContent = 'Review submitted successfully';
      successMessage.style.display = 'block';
      
    } else {
      alert('Check that you have filled in all fields correctly');
    }
  } catch (error) {
    console.error('Error submitting review:', error);
  }
}