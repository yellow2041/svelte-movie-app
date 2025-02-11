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
    const res = await axios.post("/.netlify/functions/movie", {
      ...payload,
      page: 1,
    });
    const { Search, totalResults } = res;

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
      const res = await axios.post("/.netlify/functions/movie", {
        ...payload,
        page,
      });
      const { Search } = res;
      console.log(res);
      movies.update(($movies) => _unionBy($movies, Search, "imdbID"));
    }
  }

  loading.set(false);
}

export async function searchMovieWithId(id) {
  if (get(loading)) return;
  loading.set(true);

  const response = await axios.post("/.netlify/functions/movie", { id });

  theMovie.set(response);
  loading.set(false);
}
