// StarRating.tsx
import React from 'react';

interface StarRatingProps {
  rating: number;
  setRating: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  return (
    <div className="flex justify-around w-full">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={ratingValue}
            className={`h-10 w-10 ${ratingValue <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => setRating(ratingValue)}
            aria-label={`Rate ${ratingValue} stars`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-14 h-14" 
            >
              <path d="M12 .587l3.412 6.912 7.588 1.104-5.5 5.357 1.3 7.56-6.8-3.578-6.8 3.578 1.3-7.56-5.5-5.357 7.588-1.104z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
