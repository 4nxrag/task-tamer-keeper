import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

interface WeatherInputProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

const WeatherInput = ({ onSearch, loading }: WeatherInputProps) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading || !city.trim()}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default WeatherInput;