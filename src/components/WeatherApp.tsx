import { useState } from 'react';
import WeatherInput from './WeatherInput';
import WeatherCard from './WeatherCard';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Cloud } from 'lucide-react';

interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  visibility: number;
  windSpeed: number;
  icon: string;
}

const WeatherApp = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // You'll need to get a free API key from OpenWeatherMap
  const API_KEY = 'your_api_key_here';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (city: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please get a free API key from OpenWeatherMap.');
        } else if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else {
          throw new Error('Failed to fetch weather data.');
        }
      }
      
      const data = await response.json();
      
      const weatherData: WeatherData = {
        name: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        visibility: data.visibility,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      };
      
      setWeather(weatherData);
      toast({
        title: "Weather Updated",
        description: `Showing weather for ${weatherData.name}, ${weatherData.country}`,
      });
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Weather App
            </h1>
          </div>
          <p className="text-muted-foreground">
            Get live weather information for any city around the world
          </p>
        </div>
        
        <div className="space-y-6">
          <WeatherInput onSearch={fetchWeather} loading={loading} />
          
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Fetching weather data...</span>
            </div>
          )}
          
          {weather && !loading && <WeatherCard weather={weather} />}
          
          {!weather && !loading && (
            <div className="text-center py-12 animate-fade-in">
              <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Weather Data</h3>
              <p className="text-muted-foreground">
                Enter a city name to get started with live weather information
              </p>
              <div className="mt-6 p-4 bg-muted/50 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> You'll need to get a free API key from{' '}
                  <a 
                    href="https://openweathermap.org/api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    OpenWeatherMap
                  </a>{' '}
                  and replace "your_api_key_here" in the code.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;