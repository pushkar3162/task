import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


import { useNavigate, NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search/${query}`);
  };

  return (
    <nav className="navbar">
     
      <h1 className="navbar-title">
        <Link to="/" style={{ textDecoration: "none", color: "#e50914" }}>
         <FontAwesomeIcon icon={faFilm} style={{ marginRight: "8px", color: "#FFFFFF" }} />
          MoviesDb
        </Link>
      </h1>
     <div className="navbar-right">
      <ul>
        <li><NavLink to="/">Popular</NavLink></li>
        <li><NavLink to="top-rated">Top Rated</NavLink></li>
        <li><NavLink to="/upcoming">Upcoming</NavLink></li>
      </ul>

      <form onSubmit={handleSearch}>
  <input
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  <button type="submit">
     <FontAwesomeIcon icon={faMagnifyingGlass} />
  </button>
</form>
</div>
    </nav>
  );
}
