import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Card from '../Components/Card';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isRecLoading, setIsRecLoading] = useState(true); // Separate loading state for recommendations
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const API_BASE_URL = 'https://api.themoviedb.org/3';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  };

  // Function to truncate text to a specific word count
  const truncateText = (text, wordLimit) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      setIsRecLoading(true); // Set both loading states to true
      setError(null);

      try {
        // Fetch movie details
        const movieResponse = await fetch(
          `${API_BASE_URL}/movie/${id}?api_key=${API_KEY}`,
          API_OPTIONS
        );
        if (!movieResponse.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Fetch movie videos (trailers)
        const videosResponse = await fetch(
          `${API_BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`,
          API_OPTIONS
        );
        if (!videosResponse.ok) {
          throw new Error('Failed to fetch movie videos');
        }
        const videosData = await videosResponse.json();
        const trailerVideo = videosData.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        setTrailer(trailerVideo || null);

        // Fetch recommended movies
        const recommendationsResponse = await fetch(
          `${API_BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`,
          API_OPTIONS
        );
        if (!recommendationsResponse.ok) {
          throw new Error('Failed to fetch recommended movies');
        }
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData.results.slice(0, 10)); // Limit to 10 recommendations

      } catch (err) {
        setError(err.message);
        console.error('Error fetching movie data:', err);
      } finally {
        setIsLoading(false);
        setIsRecLoading(false); // Both loading states set to false
      }
    };

    fetchMovieData();
  }, [id]);

  const handleClick = () => {
    setShowTrailer(true);
  };

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="text-white">No movie data available.</div>;
  }

  return (
    <div className="text-white movie-bg-animated min-h-screen ">
      {/* Background Image */}
      <img
        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
        alt={movie.title}
        className="sm:h-[400px] md:h-[500px] lg:min-w-full h-[600px] object-cover relative"
      />
      <div className="sm:h-[400px] md:h-[500px] lg:min-w-full h-[600px] object-cover absolute top-20.5 overlay-eff inset-0"></div>

      {/* Movie Info */}
      <div className="flex absolute lg:top-[180px] left-[100px] right-0 bottom-0 flex-col md:flex-row">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-48 sm:w-54 md:w-52 md:h-72 lg:w-96 lg:h-96 h-auto rounded-lg shadow-lg"
        />
        <div className="font-bold text-3xl ml-6 sm:text-base md:text-lg lg:text-xl">
          <p className="text-2xl">{movie.release_date.split('-')[0]}</p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-1 lg:leading-14">{movie.title}</p>
          <p className='text-sm sm:text-base md:text-lg lg:leading-14'>Rating: {movie.vote_average.toFixed(1)}/10</p>
          <p className='text-sm sm:text-base md:text-lg'>Language: {movie.original_language}</p>
          <p className="hidden sm:block text-sm sm:text-base md:text-lg lg:text-xl mt-3 md:mt-5 max-w-prose">{truncateText(movie.overview, 50)}</p>

          {trailer ? (
            <div
              className="bg-[#292651] w-36 text-center h-12 mt-5 pt-2 rounded-3xl text-lg cursor-pointer"
              onClick={handleClick}
            >
              Watch Trailer
            </div>
          ) : (
            <p className="mt-6 text-gray-400">No trailer available.</p>
          )}
        </div>
      </div>

      {/* Trailer Iframe */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-2xl">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${trailer.key}?rel=0&autoplay=1`}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-0 right-0 bg-red-600 text-white p-2 rounded-full border-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="relative px-4 sm:px-6 md:px-10 lg:px-24 py-6" name="Recommended">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">Recommended Movies</h2>
        {isRecLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="w-full h-48 sm:h-60 md:h-72 bg-gray-700 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((recMovie) => (
              <Card key={recMovie.id} movie={recMovie} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-lg sm:text-2xl md:text-3xl font-bold text-center">No recommendations available.</p>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;