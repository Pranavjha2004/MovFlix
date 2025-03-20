import React from 'react';
import starImg from '../assets/star.png'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const Card = ({ movie }) => {
  const { title, vote_average, poster_path, release_date, original_language, overview, id } = movie;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div 
      className='border-2 rounded-lg p-4 bg-black flex flex-col justify-center items-center group relative hover:shadow-lg transition-shadow duration-300 layer cursor-pointer'
      onClick={handleCardClick}
    >
      <div className='relative aspect-[2/3] w-full overflow-hidden rounded-lg'>
        {poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg 
            className="w-full h-full bg-[#2C2948]" 
            viewBox="0 0 500 750" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="500" height="750" fill="#2C2948"/>
            {/* Your SVG path here */}
          </svg>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-90 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out p-4 flex items-center overflow-y-auto cursor-pointer">
          <div className="w-full h-full pr-3 hover:pr-0 transition-all duration-300 overflow-y-auto scrollbar-hide">
            <p className="text-white text-sm text-center">
              {overview || 'No overview available.'}
            </p>
          </div>
        </div>
      </div>

      <h4 className='text-center text-xl mt-4'>{title}</h4>
      <div className='flex justify-start items-center gap-2 w-full mt-2'>
        <img className='h-5' src={starImg} alt="rating" />
        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
        <span>•</span>
        <p>{original_language || 'N/A'}</p>
        <span>•</span>
        <p>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
      </div>
    </div>
  );
};

export default Card;