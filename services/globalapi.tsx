/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";

const key = process.env.NEXT_PUBLIC_API_KEY;

const axiosInstance = axios.create({
  baseURL: "https://api.rawg.io/api",
});

const getGames = async (page: number = 1) => {
  try {
    const response = await axiosInstance.get(
      `/games?key=${key}&page=${page}&page_size=20`
    );
    return response;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

const getGenreList = async () => {
  try {
    const response = await axiosInstance.get(`/genres?key=${key}`);
    return response;
  } catch (error) {
    console.error("Error fetching genre list:", error);
    throw error;
  }
};

const getGameStores = async (slug: string) => {
  try {
    const response = await axiosInstance.get(
      `/games/${slug}/stores?key=${key}`
    );
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching stores for game ${slug}:`, error);
    throw error;
  }
};

const getGameListByGenreId = async (genreId: number, page: number = 1) => {
  try {
    const response = await axiosInstance.get(
      `/games?key=${key}&genres=${genreId}&page=${page}&page_size=20`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching games by genre ${genreId}:`, error);
    throw error;
  }
};

const getGameBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`/games/${slug}?key=${key}`);
    return response;
  } catch (error) {
    console.error(`Error fetching game ${slug}:`, error);
    throw error;
  }
};

const getGameScreenshots = async (gameId: number) => {
  try {
    const response = await axiosInstance.get(
      `/games/${gameId}/screenshots?key=${key}`
    );
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching screenshots for game ${gameId}:`, error);
    throw error;
  }
};

const getGameTrailer = async (slug: string) => {
  try {
    const response = await axiosInstance.get(
      `/games/${slug}/movies?key=${key}`
    );
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching trailer for game ${slug}:`, error);
    throw error;
  }
};

const searchGamesByName = async (query: string, page: number = 1) => {
  try {
    const response = await axiosInstance.get(
      `/games?key=${key}&search=${query}&page=${page}&page_size=20`
    );
    return response;
  } catch (error) {
    console.error(`Error searching games by name ${query}:`, error);
    throw error;
  }
};

export default {
  getGames,
  getGenreList,
  getGameListByGenreId,
  getGameBySlug,
  getGameScreenshots,
  getGameTrailer,
  searchGamesByName,
  getGameStores,
};
