import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Cloud, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Productivity Suite
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of powerful web apps to boost your productivity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border/50 hover:shadow-lg transition-all hover:border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>AI Writing Assistant</CardTitle>
              <p className="text-muted-foreground text-sm">
                Write journal entries with AI suggestions and sentiment analysis
              </p>
            </CardHeader>
            <CardContent>
              <Link to="/ai-writing">
                <Button className="w-full">
                  Open Writing Assistant
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-all hover:border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                <Cloud className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Weather App</CardTitle>
              <p className="text-muted-foreground text-sm">
                Get live weather data for any city worldwide
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => window.location.reload()}>
                Open Weather App
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:shadow-lg transition-all hover:border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                <CheckSquare className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Task Manager</CardTitle>
              <p className="text-muted-foreground text-sm">
                Organize tasks with local storage and filters
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
