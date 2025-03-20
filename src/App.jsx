import { useState, useEffect } from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import Hero from './Components/Hero';
import Search from './Components/Search';
import Card from './Components/Card';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MovieDetails from './Pages/MovieDetails';

function App() {
  const API_BASE_URL = 'https://api.themoviedb.org/3';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]); // Trending movies

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const endPoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies!!');
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setErrorMsg('No movies found.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results);
    } catch (e) {
      console.error(`Error Fetching: ${e}`);
      setErrorMsg('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch trending movies
  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trending/movie/week?api_key=${API_KEY}`, // Daily trending
        API_OPTIONS
      );
      if (!response.ok) throw new Error('Failed to fetch trending movies');
      const data = await response.json();
      setTrendingMovies(data.results.slice(0, 5)); // Limit to 10 for display
    } catch (e) {
      console.error(`Error Fetching Trending Movies: ${e}`);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
    fetchTrendingMovies(); // Fetch trending movies on mount
  }, [searchTerm]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className='min-h-screen movie-bg-animated'>
              <NavBar name="Trending" navText1="Trending" navText2="Search" navText3="Featured" />
              <div className='flex flex-col items-center'>
                <Hero />
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              {/* Trending Movies Section */}
              <section className="flex flex-col text-white mx-46 mt-10">
                <h2 className="text-4xl font-bold mb-4 mt-4 mx-4">Weekly Trending</h2>
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <ul className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                    {trendingMovies.map((movie) => (
                      <Card key={movie.id} movie={movie} />
                    ))}
                  </ul>
                )}
              </section>
              <section className='flex flex-col text-white mx-46 mt-26'>
                {searchTerm.length !== 0 ?
                  <h2 className='text-4xl mx-4'>Search Results</h2> :
                  <h2 name="featured" className='font-bold text-4xl mx-4'>All Movies</h2>}
                {isLoading ? (
                  <div className='flex items-center justify-start gap-26'>
                    <div className='w-80 my-4'>
                      <SkeletonTheme baseColor="#202020" highlightColor="#444">
                        <Skeleton />
                        <Skeleton count={4} />
                      </SkeletonTheme>
                    </div>
                    {/* Repeat skeleton blocks as needed */}
                  </div>
                ) : errorMsg ? (
                  <p className='text-red-500 text-center text-xl'>{errorMsg}</p>
                ) : (
                  <ul className='grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 text-center place-content-center'>
                    {movieList.map((movie) => (
                      <Card key={movie.id} movie={movie} />
                    ))}
                  </ul>
                )}
              </section>
            </div>
          }
        />
        <Route path="/movie/:id" element={
          <div>
            <NavBar navText1="Recommended" navText4="Home" navText3="" navText2="" />
            <MovieDetails />
          </div>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;