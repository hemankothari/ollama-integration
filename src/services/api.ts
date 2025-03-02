import axios from 'axios';
import { WeatherForecast, OllamaResponse } from '../types';
import { mockWeatherData } from './mockData';

const weatherApi = axios.create({
  baseURL: 'https://localhost:7141',
  headers: {
    'Content-Type': 'application/json',
  },
});

const ollamaApi = axios.create({
  baseURL: 'http://localhost:11434',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchWeatherForecast = async (useMockOnError: boolean = true): Promise<WeatherForecast[]> => {
  try {
    const response = await weatherApi.get('/weatherforecast');
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching weather forecast:', errorMessage);
    
    // Return mock data if the API is unavailable and useMockOnError is true
    if (useMockOnError) {
      console.info('Using mock weather data as fallback');
      return mockWeatherData;
    }
    
    throw new Error(errorMessage);
  }
};

export const sendMessageToOllama = async (
  message: string,
  model: string = 'llama2'
): Promise<string> => {
  try {
    const response = await ollamaApi.post('/api/chat', {
      model,
      messages: [{ role: 'user', content: message }],
      stream: false,
    });
    
    const data = response.data as OllamaResponse;
    return data.message.content;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending message to Ollama:', errorMessage);
    throw new Error(errorMessage);
  }
};