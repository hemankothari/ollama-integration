import { WeatherForecast } from '../types';
import { mockWeatherData } from './mockData';
import { apiResponseStore } from '../types/ApiResponseStore';

export const fetchWeatherForecast = async (useMockOnError: boolean = true): Promise<WeatherForecast[]> => {
  try {
    //const response = await weatherApi.get('/weatherforecast');
    const response = await fetch("http://localhost:5160/weatherforecast", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // Store API response in apiResponseStore
		apiResponseStore.saveResponse('weatherforecast', result);
    return result;
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
  model: string = 'llama3.2'
): Promise<Response> => {
  try {
     // Use fetch instead of axios for proper streaming support
     const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: message,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error sending message to Ollama:', errorMessage);
    throw new Error(errorMessage);
  }
};