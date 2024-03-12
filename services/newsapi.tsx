import axios from 'axios';

const fetchTopGamingHeadlines = async () => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY; 
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'gaming',
        country: 'us',
        apiKey: apiKey
      }
    });

    const articles = response.data.articles;
    articles.forEach((article: any) => {
      console.log(article.title);
    });
  } catch (error) {
    console.error('Error fetching gaming headlines:', error);
  }
};

fetchTopGamingHeadlines();
