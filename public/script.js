const apiEndpoint = "/api";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchAllCategories: `${apiEndpoint}/genres`,
  fetchMoviesList: (id) => `${apiEndpoint}/movies?genreId=${id}`,
  fetchTrending: `${apiEndpoint}/trending`,
  searchOnYoutube: (query) => `${apiEndpoint}/search?query=${query}`
};

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

async function init() {
  try {
    await fetchTrendingMovies();
    await fetchAndBuildAllSections();
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

async function fetchTrendingMovies() {
  const data = await fetchJSON(apiPaths.fetchTrending);
  if (data && data.results) {
    const list = data.results;
    const randomIndex = parseInt(Math.random() * list.length);
    buildBannerSection(list[randomIndex]);
  }
}

function buildBannerSection(movie) {
  const bannerCont = document.querySelector('#banner-section');
  bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
  bannerCont.style.backgroundPosition = 'contain';
  const div = document.createElement('div');
  div.innerHTML = `
      <h2 class="movie_classy">Movie Information</h2>
      <h2 class="banner__title">${movie.title}</h2>
      <p class="banner__info">Trending in movies | Released:${movie.release_date}</p>
      <p class="banner__overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim() + '...' : movie.overview}</p>
      <div class="action-buttons-cont">
        <button class="action-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="Play" aria-hidden="true">
            <path d="M5 2.69127C5 1.93067 5.81547 1.44851 6.48192 1.81506L23.4069 11.1238C24.0977 11.5037 24.0977 12.4963 23.4069 12.8762L6.48192 22.1849C5.81546 22.5515 5 22.0693 5 21.3087V2.69127Z" fill="currentColor"></path>
          </svg> &nbsp;&nbsp; Play 
        </button>
        <button class="action-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ltr-4z3qvp e1svuwfo1" data-name="CircleI" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path>
          </svg>  &nbsp;&nbsp; More Info
        </button>
      </div>`;
  div.className = "banner-content container";
  bannerCont.append(div);
}

async function fetchAndBuildAllSections() {
  const data = await fetchJSON(apiPaths.fetchAllCategories);
  if (data && data.genres) {
    const categories = data.genres;
    if (Array.isArray(categories) && categories.length) {
      categories.forEach(category => {
        fetchAndBuildMovieSection(apiPaths.fetchMoviesList(category.id), category.name);
      });
    }
  }
}

async function fetchAndBuildMovieSection(fetchUrl, categoryName) {
  console.log(fetchUrl, categoryName);
  const data = await fetchJSON(fetchUrl);
  if (data && data.results) {
    const movies = data.results;
    if (Array.isArray(movies) && movies.length) {
      buildMoviesSection(movies, categoryName);
    }
    return movies;
  }
}

function buildMoviesSection(list, categoryName) {
  console.log(list, categoryName);
  const moviesCont = document.querySelector('#movies-cont');
  const moviesListHTML = list.map(item => {
    return `
      <div class="movie-item" ondblclick="searchMovieTrailer('${item.title}', 'yt${item.id}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
        <iframe width="245px" height="150px" src="" id="yt${item.id}"></iframe>
      </div>`;
  }).join('');
  const moviesSectionHTML = `
      <h2 class="movie-section-heading">${categoryName}<span class="explore-nudge">Explore All</span></h2>
      <div class="movies-row">
        ${moviesListHTML}
      </div>`;
  console.log(moviesSectionHTML);
  const div = document.createElement('div');
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;
  moviesCont.append(div);
}

async function searchMovieTrailer(movieName, iframId) {
  if (!movieName) return;
  const data = await fetchJSON(apiPaths.searchOnYoutube(movieName));
  if (data && data.items) {
    const bestResult = data.items[0];
    const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
    console.log(youtubeUrl);
    window.open(youtubeUrl, '_blank');
    const elements = document.getElementById(iframId);
    elements.src = `https://www.youtube.com/embed/${bestResult.id.videoId}?=1&controls=0`;
  }
}

window.addEventListener('load', function () {
  init();
  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 5) header.classList.add('black-bg');
    else header.classList.remove('black-bg');
  });
});
