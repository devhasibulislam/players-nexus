import React from 'react';

interface NewsHeadingProps {
  title: string;
  onClick: () => void;
  isActive: boolean;
}

const NewsHeading: React.FC<NewsHeadingProps> = ({ title, onClick, isActive }) => {
  return (
    <h2
      onClick={onClick}
      style={{
        cursor: 'pointer',
        fontWeight: isActive ? 'bold' : 'normal',
        color: 'white',
        textDecoration: isActive ? 'underline' : 'none',
        letterSpacing: '0.05em',
        transition: 'all 0.3s ease-out',
        padding: '10px 20px',
        borderRadius: '10px',
        backgroundColor: '#333',
      }}
      className="hover:font-bold hover:text-gray-500"
    >
      {title}
    </h2>
  );
};

export default NewsHeading;
