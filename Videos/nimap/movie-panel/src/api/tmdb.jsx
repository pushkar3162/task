import axios from "axios";

const API_KEY = "c45a857c193f6302f2b5061c3b85e743"; 
const BASE_URL = "https://api.themoviedb.org/3";

export const imageBase = "https://image.tmdb.org/t/p/w500";

// Axios instance
const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

// Endpoints
export const getPopularMovies = (page = 1) =>
  tmdb.get(`/movie/popular?page=${page}`);

export const getTopRatedMovies = (page = 1) =>
  tmdb.get(`/movie/top_rated?page=${page}`);

export const getUpcomingMovies = (page = 1) =>
  tmdb.get(`/movie/upcoming?page=${page}`);

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`);

export const getMovieCredits = (id) =>
  tmdb.get(`/movie/${id}/credits`);

export const searchMovies = (query, page = 1) =>
  tmdb.get(`/search/movie?query=${query}&page=${page}`);

export default tmdb;




