import React from "react";
import Image from "next/image";

interface Article {
  title: string;
  url: string;
  image: string;
}

interface NewsCardProps {
  article: Article;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const placeholderImage = "/images/no_image.jpg";

  const getImageSrc = () => {
    return article.image
      ? `/api/image?url=${encodeURIComponent(article.image)}`
      : placeholderImage;
  };

  // Example sizes attribute for a responsive image that takes up 50% of the viewport width on wider screens
  // and scales up to 100% on smaller screens. Adjust as necessary for your design.
  const imageSizes = "(max-width: 768px) 100vw, 50vw";

  return (
    <div
      className="m-2 p-2 cursor-pointer w-full h-52 bg-[#76a8f75e] rounded-lg flex overflow-hidden hover:scale-105 transition-transform duration-300"
      onClick={() => window.open(article?.url, "_blank")}
    >
      <div className="w-1/2 h-full relative rounded-lg">
        <Image
          src={article?.image || placeholderImage}
          alt={article?.title}
          fill
          sizes={imageSizes}
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>

      <div className="w-1/2 p-4 flex flex-col justify-between">
        <h2 className="text-lg font-bold text-white">{article?.title}</h2>
      </div>
    </div>
  );
};

export default NewsCard;
