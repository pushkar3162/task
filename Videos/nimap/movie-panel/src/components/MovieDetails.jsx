import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, getMovieCredits } from "../api/tmdb";
import "./MovieDetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    getMovieDetails(id).then((res) => setMovie(res.data));
    getMovieCredits(id).then((res) => setCast(res.data.cast.slice(0, 10))); 
  }, [id]);

  if (!movie) return <h2>Loading...</h2>;

  return (
    <div className="movie-details">
      <div className="movie-header">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> ⭐ {movie.vote_average}</p>
          <p className="overview">{movie.overview}</p>
        </div>
      </div>

      <h2>Top Cast</h2>
      <div className="cast-grid">
        {cast.map((actor) => (
          <div key={actor.id} className="cast-card">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }
              alt={actor.name}
            />
            <p>{actor.name}</p>
            <span>as {actor.character}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
