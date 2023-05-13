const API_KEY = "8ae60b0cf6cbb7574f614d1cef7fcd1e";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    response => response.json()
  );
}