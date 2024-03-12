import React from 'react';
import Image from 'next/image';

interface ScreenshotType {
  id: number;
  image: string;
}

interface ScreenshotGridProps {
  screenshots: ScreenshotType[];
}

const ScreenshotGrid: React.FC<ScreenshotGridProps> = ({ screenshots }) => {
  return (
    <>
      <h3 className="text-2xl text-white font-bold mb-4">Screenshots</h3>
      <div className="grid grid-cols-2 gap-4">
        {screenshots.map((screenshot) => (
          <div key={screenshot.id} className="screenshot-wrapper rounded-lg overflow-hidden">
            <Image
              src={screenshot.image}
              alt="Game Screenshot"
              className="rounded-lg w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ScreenshotGrid;
