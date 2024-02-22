import axios from 'axios';

// Current weather data
export const fetchWeatherData = async (lat: number, lon: number, isCelsius: boolean) => {

  try {
    const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}&isCelsius=${isCelsius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw error;
  }
};

// Daliy and hourly forecast data
export const fetchForecastData = async (lat: number, lon: number, isCelsius: boolean) => {

  try {
    const response = await axios.get(`/api/forecast?lat=${lat}&lon=${lon}&isCelsius=${isCelsius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data', error);
    throw error;
  }
};

// City search data
export const findCityData = async (input: string) => {

  try {
    const response = await axios.get(`/api/direct?q=${input}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching city data', error);
    throw error;
  }
};

// News searsh data
export const fetchNewsData = async (input: string) => {
  
  try {
    const response = await axios.get(`/api/search?q=${input}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news data', error);
    throw error;
  }
};