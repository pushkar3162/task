import { useEffect, useState } from "react";
import { getTopRatedMovies } from "../api/tmdb";
import MovieCard from "../components/moviecard";
import Pagination from "../components/Pagination";
import "../styles/TopRated.css"; 


export default function TopRated() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getTopRatedMovies(page).then((res) => {
      setMovies(res.data.results);
      setTotalPages(res.data.total_pages);
    });
  }, [page]);

  return (
    <div className="page">
  <div className="movies-section">
    <div className="section-header">
      <h2>Top Rated Movies</h2>
    </div>

    <div className="movies-grid">
      {movies.map((m) => (
        <div className="movie-item" key={m.id}>
          <MovieCard movie={m} />
        </div>
      ))}
    </div>

    <div className="pagination-wrapper">
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  </div>
</div>
  );
}



