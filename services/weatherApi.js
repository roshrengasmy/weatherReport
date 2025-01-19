import axios from 'axios';
import { WEATHER_API_KEY } from '../constants/constant';

const forecast = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${params?.city}&days=${params?.days}&aqi=no&alerts=no`;
const location = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${params?.city}`;

const apiCall = async (endpoint) => {
  const options = {
    method: 'GET',
    url: endpoint,
  };
  try {
    const response = await axios.request(options);
    return response?.data
  } catch (err) {
    console.log('error', err);
    return null;
  }
};

export const fetchWeatherApi = async (params) => {
  // let response = await axios.request({
  //   method: 'GET',
  //   url: `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${params?.city}&days=${params?.days}&aqi=no&alerts=no`,
  // });
  // return response?.data;

  return apiCall(forecast(params));

};

export const fetchLocationApi = async (params) => {
  
  return apiCall(location(params));
};
