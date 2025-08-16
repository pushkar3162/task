import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchMovies } from "../api/tmdb";
import MovieCard from "../components/moviecard";
import Pagination from "../components/Pagination";


export default function SearchResults() {
  const { query } = useParams(); 
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (query) {
      searchMovies(query, page).then((res) => {
        setMovies(res.data.results);
        setTotalPages(res.data.total_pages);
      });
    }
  }, [query, page]);

  return (
    <div className="page">
      <div className="movies-section">
        <div className="section-header">
          <h2>Search Results for: {query}</h2>
        </div>

        {movies.length > 0 ? (
          <>
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
          </>
        ) : (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No movies found for <strong>{query}</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
