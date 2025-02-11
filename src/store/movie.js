import axios from "axios";
import { get, writable } from "svelte/store";
import _unionBy from "lodash/unionBy";

export const movies = writable([]);
export const loading = writable(false);
export const theMovie = writable({});
export const message = writable("Search for the movie title!");

export function initMovies() {
  movies.set([]);
  loading.set(false);
  message.set("Search for the movie title!");
}

export async function searchMovies(payload) {
  if (get(loading)) return;
  loading.set(true);
  message.set("");

  let total = 0;

  const { number } = payload;

  try {
    const response = await _fetchMovie({ ...payload, page: 1 });

    const { Search, totalResults } = response;
    total = totalResults;
    movies.set(Search);
  } catch (msg) {
    movies.set([]);
    message.set(msg);
    loading.set(false);
    return;
  }

  const pageLength = Math.ceil(total / number);

  if (pageLength > 1) {
    for (let page = 2; page <= pageLength; page++) {
      if (page > number / 10) break;
      const res = await _fetchMovie({ ...payload, page });
      const { Search } = res.data;
      movies.update(($movies) => _unionBy($movies, Search, "imdbID"));
    }
  }

  loading.set(false);
}

export async function searchMovieWithId(id) {
  if (get(loading)) return;
  loading.set(true);

  const response = await _fetchMovie({ id });

  theMovie.set(response);
  loading.set(false);
}

async function _fetchMovie(payload) {
  const { title, type, year, page, id } = payload;
  const OMDB_API_KEY = "7035c60c";
  const url = id
    ? `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
    : `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(url);
      if (response.data.Error) {
        reject(response.data.Error);
      }
      resolve(response.data);
    } catch (error) {
      console.error(error.response);
      reject(error.message);
    }
  });
}
