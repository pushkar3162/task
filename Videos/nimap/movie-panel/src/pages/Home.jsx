import { useEffect, useState } from "react";
import { getPopularMovies } from "../api/tmdb";
import MovieCard from "../components/moviecard";
import Pagination from "../components/Pagination";
import "../styles/Home.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getPopularMovies(page).then((res) => {
      setMovies(res.data.results);
      setTotalPages(res.data.total_pages);
    });
  }, [page]);

  return (
    <div className="page">
     
      <div className="movies-section">
        <div className="section-header">
          <h2>Popular Movies</h2>
        </div>

       
        <div className="movies-grid">
          {movies.map((m) => (
            <div key={m.id} className="movie-item">
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
