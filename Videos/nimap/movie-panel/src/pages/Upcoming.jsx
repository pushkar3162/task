import { useEffect, useState } from "react";
import { getUpcomingMovies } from "../api/tmdb";
import MovieCard from "../components/moviecard";
import Pagination from "../components/Pagination";

export default function Upcoming() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getUpcomingMovies(page).then((res) => {
      setMovies(res.data.results);
      setTotalPages(res.data.total_pages);
    });
  }, [page]);

  return (
    <div className="page">
      <h2>Upcoming Movies</h2>
      <div className="grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
