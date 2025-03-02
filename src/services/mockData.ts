import { WeatherForecast } from '../types';

// Mock weather data to use when the API is unavailable
export const mockWeatherData: WeatherForecast[] = [
  {
    date: new Date(Date.now() + 86400000).toISOString(),
    temperatureC: 22,
    temperatureF: 71,
    summary: 'Sunny and warm'
  },
  {
    date: new Date(Date.now() + 172800000).toISOString(),
    temperatureC: 18,
    temperatureF: 64,
    summary: 'Partly cloudy'
  },
  {
    date: new Date(Date.now() + 259200000).toISOString(),
    temperatureC: 15,
    temperatureF: 59,
    summary: 'Light rain showers'
  },
  {
    date: new Date(Date.now() + 345600000).toISOString(),
    temperatureC: 12,
    temperatureF: 53,
    summary: 'Cloudy with a chance of rain'
  },
  {
    date: new Date(Date.now() + 432000000).toISOString(),
    temperatureC: 20,
    temperatureF: 68,
    summary: 'Sunny intervals'
  }
];