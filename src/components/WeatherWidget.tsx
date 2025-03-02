import React, { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, AlertTriangle, Info } from 'lucide-react';
import { fetchWeatherForecast } from '../services/api';
import { WeatherForecast } from '../types';

const WeatherWidget: React.FC = () => {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setLoading(true);
        // Try to fetch real data, but fall back to mock data if the API is unavailable
        const data = await fetchWeatherForecast(true);
        setForecasts(data);
        
        // Check if we're using mock data by comparing the data structure
        // This is a simple heuristic - in a real app you might want a more robust way to detect this
        if (data.length > 0 && data[0].summary.includes('Sunny and warm')) {
          setUsingMockData(true);
        } else {
          setUsingMockData(false);
        }
        
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(errorMessage);
        console.error('Weather data fetch error:', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
  }, []);

  const getWeatherIcon = (summary: string) => {
    const lowerSummary = summary?.toLowerCase() || '';
    
    if (lowerSummary.includes('sun') || lowerSummary.includes('hot') || lowerSummary.includes('warm')) {
      return <Sun className="h-8 w-8 text-yellow-500" />;
    } else if (lowerSummary.includes('rain') || lowerSummary.includes('drizzle')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else if (lowerSummary.includes('snow') || lowerSummary.includes('freezing')) {
      return <Snowflake className="h-8 w-8 text-blue-300" />;
    } else {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-lg font-semibold text-red-600 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Connection Error
        </h3>
        <p className="text-gray-700 mt-2">Unable to connect to the weather service. Please ensure your ASP.NET Core backend is running at https://localhost:7141.</p>
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
          <p className="font-medium">Troubleshooting steps:</p>
          <ol className="list-decimal ml-5 mt-1 space-y-1">
            <li>Verify the ASP.NET Core service is running</li>
            <li>Check that CORS is properly configured on the backend</li>
            <li>Ensure the endpoint URL is correct</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Weather Forecast</h2>
      
      {usingMockData && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
          <div className="flex items-center text-blue-700">
            <Info className="h-5 w-5 mr-2" />
            <p className="text-sm font-medium">Using demo data - backend connection unavailable</p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {forecasts.length > 0 ? (
          forecasts.map((forecast, index) => (
            <div key={index} className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
              <div className="mr-4">
                {getWeatherIcon(forecast.summary)}
              </div>
              <div>
                <p className="font-medium">{new Date(forecast.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">{forecast.summary}</p>
                <p className="text-sm">
                  <span className="font-medium">{forecast.temperatureC}°C</span> / {forecast.temperatureF}°F
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No weather data available</p>
        )}
      </div>
    </div>
  );
};

export default WeatherWidget;