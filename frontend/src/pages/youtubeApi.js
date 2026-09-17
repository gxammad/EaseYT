import axios from 'axios';

// Create a base instance for Axios
const axiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3',
});

const API_KEY = 'AIzaSyCboPqNrU0li8JKGv6lw4epHXEQV_9bLWQ'; // Replace with your actual API key

export const searchVideos = async (query) => {
  try {
    const response = await axiosInstance.get('/search', {
      params: {
        part: 'snippet',
        maxResults: 20, 
        q: query, 
        key: API_KEY, 
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching YouTube videos', error);
    return [];
  }
};

export const getVideoDetails = async (videoId) => {
  try {
    const response = await axiosInstance.get('/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: API_KEY,
      },
    });
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching video details', error);
    return null;
  }
};
