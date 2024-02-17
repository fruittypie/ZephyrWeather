import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// Current weather data
export const fetchWeatherData = async (lat: number, lon: number, isCelsius: boolean) => {

  try {
    const response = await axios.get(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&isCelsius=${isCelsius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw error;
  }
};

// Daliy and hourly forecast data
export const fetchForecastData = async (lat: number, lon: number, isCelsius: boolean) => {

  try {
    const response = await axios.get(`${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&isCelsius=${isCelsius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw error;
  }
};

// City search data
export const findCityData = async (input: string) => {

  try {
    const response = await axios.get(`${API_BASE_URL}/direct?q=${input}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching city data', error);
    throw error;
  }
};

// News searsh data
export const fetchNewsData = async (input: string) => {
  
  try {
    const response = await axios.get(`${API_BASE_URL}/search?q=${input}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news data', error);
    throw error;
  }
};