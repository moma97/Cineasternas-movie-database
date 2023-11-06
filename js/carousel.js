/**
 * Carousel for top 3 movies on the front page.
 */
new Glide('.glide', {
    type: 'carousel',
    perView: 3,
    peek: 3,
    startAt: 1,
    focusAt: 1,
    breakpoints: {
        820: {
            perView: 1,
            peek: 1,
            startAt: 0,
            focusAt: 0,
        }, 
    }
    
}).mount();