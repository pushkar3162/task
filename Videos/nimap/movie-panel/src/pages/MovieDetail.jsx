import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tmdb, { imageBase } from "../api/tmdb";
import "../styles/MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    tmdb.get(`/movie/${id}`).then((res) => setMovie(res.data));
    tmdb.get(`/movie/${id}/credits`).then((res) => setCast(res.data.cast));
  }, [id]);

  if (!movie) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="movie-detail-page">
    
      <div
        className="movie-backdrop"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.95)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <div className="movie-header">
         
          <div className="poster-wrapper">
            <img
              src={`${imageBase}${movie.poster_path}`}
              alt={movie.title}
              className="poster"
            />
          </div>

          
          <div className="movie-info">
            <h2>{movie.title}</h2>
            <p className="rating">⭐ {movie.vote_average}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Runtime:</strong> {movie.runtime} min</p>
            <p><strong>Genres:</strong> {movie.genres && movie.genres.map((g) => g.name).join(", ")}</p>
            <h3 className="overview-title">Overview</h3>
            <p className="overview">{movie.overview}</p>
          </div>
        </div>
      </div>

     <div className="cast-section">
  <h3>Cast</h3>
  <div className="grid">
    {cast.slice(0, 10).map((actor) => (
      <div key={actor.cast_id} style={{ textAlign: "center" }}>
        {actor.profile_path && (
          <img
            src={`${imageBase}${actor.profile_path}`}
            alt={actor.name}
            style={{ width: "200px", borderRadius: "10px" }}
          />
        )}
        <p>{actor.name}</p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}
