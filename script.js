window.onload = function () {
    fetchRecommendations();
    document.getElementById('search-button').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') handleSearch();
    });
  };
  
  async function fetchRecommendations() {
    const movieIds = ['tt0111161', 'tt0068646', 'tt1375666']; // Example movies: Shawshank, Godfather, Inception
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
  
    const moviePromises = movieIds.map(fetchMovieDetails);
    const movies = await Promise.all(moviePromises);
  
    for (let movie of movies) {
      container.appendChild(createMovieCard(movie));
    }
  }
  
  async function handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    const relatedMoviesContainer = document.getElementById('related-movies');
    const resultsTitle = document.getElementById('results-title');
  
    if (!query) {
      alert('Please enter a movie name.');
      return;
    }
  
    relatedMoviesContainer.innerHTML = '';
    resultsTitle.hidden = true;
    document.getElementById('recommendations').style.display = 'none';
  
    const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=ffab2588`);
    const data = await response.json();
  
    if (data.Response === 'True') {
      resultsTitle.hidden = false;
      const moviePromises = data.Search.slice(0, 12).map(movie => fetchMovieDetails(movie.imdbID));
      const movies = await Promise.all(moviePromises);
  
      for (let movie of movies) {
        relatedMoviesContainer.appendChild(createMovieCard(movie));
      }
    } else {
      relatedMoviesContainer.innerHTML = '<p>No movies found. Please try again.</p>';
    }
  }
  
  async function fetchMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=ffab2588`);
    const data = await response.json();
    return data;
  }
  
  function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400?text=No+Image'}" alt="${movie.Title}">
      <h3>${movie.Title} (${movie.Year})</h3>
      <p><strong>IMDB Rating:</strong> ${movie.imdbRating || 'N/A'}</p>
      <p><strong>Plot:</strong> ${movie.Plot || 'No plot available'}</p>
    `;
  
    card.addEventListener('click', () => {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(movie.Title)}`, '_blank');
    });
  
    return card;
  }
  