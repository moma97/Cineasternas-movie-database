//#Region Imports
import { latestReview, getMovieOmdb } from "./apiCalls.js"; 
//#endregion

//#region Functions

/**
 * Display the latest review on the home page.
 */
async function displayLatestReview() {
    const latestReviewContainer = document.querySelector('.latestReview');
    const headline = document.createElement('h3');
    headline.textContent = 'Latest Review';  
    
    try {
        const latestReviewData = await latestReview();
        const reviewerInfo = document.createElement('div');

        const reviewerLabel = document.createElement('span');
        reviewerLabel.textContent = 'Reviewer: ';
        reviewerLabel.classList.add('bold-text');
        const reviewerName = document.createElement('span');
        reviewerName.textContent = latestReviewData.reviewer;
        reviewerName.classList.add('colored-text');
        const dateLabel = document.createElement('span');
        dateLabel.textContent = ' Date: ';
        dateLabel.classList.add('bold-text');
        const reviewDate = document.createElement('span');
        reviewDate.textContent = latestReviewData.date;
        reviewDate.classList.add('colored-text');

        const movieTitleContainer = document.createElement('div');
        movieTitleContainer.classList.add('movie-title-container');

        const movieTitelLabel = document.createElement('span');
        movieTitelLabel.textContent = 'Movie Title: ';
        movieTitelLabel.classList.add('bold-text');

        const movieTitle = document.createElement('span');
        const movie = await getMovieOmdb(latestReviewData.imdbID);
        movieTitle.textContent = movie.Title;
        movieTitle.classList.add('colored-text');

        const moviePoster = document.createElement('img');
        moviePoster.src = movie.Poster;

        movieTitleContainer.appendChild(movieTitelLabel);
        movieTitleContainer.appendChild(movieTitle);

        const reviewText = document.createElement('p');
        reviewText.textContent = latestReviewData.review;

        const reviewerScore = document.createElement('span');
        reviewerScore.textContent = `${latestReviewData.reviewer} rated ${latestReviewData.score} `;
        reviewerScore.classList.add('reviewer-score');

        // Clear any existing content in the latestReviewContainer
        latestReviewContainer.innerHTML = '';

        
        latestReviewContainer.appendChild(headline);
        
        reviewerInfo.appendChild(reviewerLabel);
        reviewerInfo.appendChild(reviewerName);
        reviewerInfo.appendChild(dateLabel);
        reviewerInfo.appendChild(reviewDate);
        latestReviewContainer.appendChild(reviewerInfo);
        latestReviewContainer.appendChild(movieTitleContainer);
        latestReviewContainer.appendChild(reviewText);
        latestReviewContainer.appendChild(reviewerScore);
        latestReviewContainer.appendChild(moviePoster);
    } catch (error) {
        console.error('Error fetching latest review data:', error);
    }
}

//#endregion



//#region function calls

// Fetch the latest review every 3 seconds (3000 milliseconds)
// setInterval(displayLatestReview, 3000); //SÄTT TILLBAKA FÖR ATT FÅ LATEST REVIEW ATT HÄMTAS VAR 3E SEKUND

displayLatestReview();
//#endregion