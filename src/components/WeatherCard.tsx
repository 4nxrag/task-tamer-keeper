import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Eye, Thermometer, Wind } from 'lucide-react';

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

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {weather.name}, {weather.country}
        </CardTitle>
        <div className="flex items-center justify-center gap-4 mt-4">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-16 h-16"
          />
          <div>
            <div className="text-4xl font-bold">{Math.round(weather.temperature)}°C</div>
            <div className="text-muted-foreground capitalize">{weather.description}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Droplets className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="font-semibold">{weather.humidity}%</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Wind className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Wind Speed</div>
              <div className="font-semibold">{weather.windSpeed} m/s</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Eye className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Visibility</div>
              <div className="font-semibold">{weather.visibility / 1000} km</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Thermometer className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Feels like</div>
              <div className="font-semibold">{Math.round(weather.temperature)}°C</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;