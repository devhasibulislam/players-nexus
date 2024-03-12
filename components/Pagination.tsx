import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-4 my-4">
      {currentPage > 1 && (
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          className="text-lg font-bold px-4 py-2 border rounded hover:bg-gray-200"
          aria-label="Previous Page"
        >
          &lt;  
        </button>
      )}

      {currentPage < totalPages && (
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          className="text-lg font-bold px-4 py-2 border rounded hover:bg-gray-200"
          aria-label="Next Page"
        >
          &gt;  
        </button>
      )}
    </div>
  );
};

export default Pagination;
