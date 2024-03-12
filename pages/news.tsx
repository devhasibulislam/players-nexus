import React, { useEffect, useState } from "react";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import NewsHeading from "../components/NewsHeading";

interface Article {
  title: string;
  url: string;
  image: string;
}

const fetchGamingNews = async (
  query: string,
  category?: string
): Promise<Article[]> => {
  const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
  const response = await axios.get("https://gnews.io/api/v4/search", {
    params: {
      q: query,
      token: apiKey,
      lang: "en",
      country: "us",
      max: 10,
      in: category,
    },
  });

  return response.data.articles;
};

const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("Gaming");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

  useEffect(() => {
    if (!searchQuery) {
      fetchGamingNews(currentCategory)
        .then(setArticles)
        .catch((error) => console.error(`Error fetching news:`, error));
    }
  }, [currentCategory, searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim() === "") return; // Prevent search with empty string
    setIsSearchActive(true); // Set search active
    fetchGamingNews(searchQuery, currentCategory)
      .then(setArticles)
      .catch((error) => console.error(`Error fetching news:`, error));
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
    setSearchQuery(""); // Reset search query when changing category
    setIsSearchActive(false); // Reset search active state
  };

  const categories = ["Gaming", "PlayStation", "Xbox", "Nintendo", "PC"];

  return (
    <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8 pt-6">
      <div className="flex flex-wrap justify-center mb-4 gap-4 items-center">
        {categories.map((category) => (
          <NewsHeading
            key={category}
            title={category}
            isActive={!isSearchActive && currentCategory === category}
            onClick={() => handleCategoryChange(category)}
          />
        ))}
        <div className="search-bar ml-4 flex items-center">
          <input
            type="search"
            placeholder="Search game news"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-black h-10 rounded-full px-4"
          />
          <button
            onClick={handleSearch}
            className="ml-2 h-10 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default News;
