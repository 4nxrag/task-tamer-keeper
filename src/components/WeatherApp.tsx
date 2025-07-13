import { useState, useEffect } from 'react';
import WeatherInput from './WeatherInput';
import WeatherCard from './WeatherCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openweather_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setShowApiKeyInput(false);
    }
  }, []);
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const handleApiKeySubmit = (key: string) => {
    if (key.trim()) {
      setApiKey(key.trim());
      localStorage.setItem('openweather_api_key', key.trim());
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "You can now search for weather data!",
      });
    }
  };

  const fetchWeather = async (city: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
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
          {showApiKeyInput ? (
            <ApiKeyInput onSubmit={handleApiKeySubmit} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <WeatherInput onSearch={fetchWeather} loading={loading} />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowApiKeyInput(true)}
                  className="ml-2"
                >
                  Change API Key
                </Button>
              </div>
              
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Fetching weather data...</span>
                </div>
              )}
            </>
          )}
          
          {weather && !loading && !showApiKeyInput && <WeatherCard weather={weather} />}
          
          {!weather && !loading && !showApiKeyInput && (
            <div className="text-center py-12 animate-fade-in">
              <Cloud className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Search</h3>
              <p className="text-muted-foreground">
                Enter a city name to get live weather information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ApiKeyInput = ({ onSubmit }: { onSubmit: (key: string) => void }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(key);
  };

  return (
    <Card className="max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center">Setup Required</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              To use the weather app, you need a free API key from OpenWeatherMap:
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 mb-4">
              <li>1. Visit <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenWeatherMap</a></li>
              <li>2. Sign up for a free account</li>
              <li>3. Get your API key</li>
              <li>4. Paste it below</li>
            </ol>
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your OpenWeatherMap API key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={!key.trim()}>
              Save API Key
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeatherApp;