import React from 'react';

interface GameDescriptionProps {
  description: string;
}

const GameDescription: React.FC<GameDescriptionProps> = ({ description }) => {
  return (
    <div 
      style={{ maxHeight: '200px', overflowY: 'auto', borderRadius: '10px', padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} 
      className="description-scrollbar"
    >
      {description}
    </div>
  );
};

export default GameDescription;
