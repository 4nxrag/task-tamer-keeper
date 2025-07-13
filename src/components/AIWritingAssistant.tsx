import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Brain, Save, Sparkles, Heart, Frown, Smile, Meh, AlertCircle, CheckCircle } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  aiSuggestions?: string;
  sentiment?: {
    emotion: string;
    confidence: number;
    icon: string;
  };
}

const AIWritingAssistant = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({
    id: '',
    title: '',
    content: '',
    timestamp: Date.now()
  });
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showApiInput, setShowApiInput] = useState(false);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('ai-writing-notes');
    const savedApiKey = localStorage.getItem('openai-api-key');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiInput(true);
    }
  }, []);

  // Save notes to localStorage
  const saveToStorage = (notesToSave: Note[]) => {
    localStorage.setItem('ai-writing-notes', JSON.stringify(notesToSave));
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }
    localStorage.setItem('openai-api-key', apiKey);
    setShowApiInput(false);
    toast({
      title: "Success",
      description: "API key saved securely"
    });
  };

  const analyzeSentiment = (text: string) => {
    const positiveWords = ['happy', 'joy', 'love', 'excited', 'amazing', 'wonderful', 'great', 'fantastic', 'awesome', 'brilliant'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'hate', 'disappointed', 'worried', 'stressed', 'depressed'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pos => word.includes(pos))) positiveCount++;
      if (negativeWords.some(neg => word.includes(neg))) negativeCount++;
    });
    
    let emotion = 'neutral';
    let icon = 'Meh';
    let confidence = 0.5;
    
    if (positiveCount > negativeCount) {
      emotion = 'positive';
      icon = 'Smile';
      confidence = Math.min(0.9, 0.5 + (positiveCount * 0.1));
    } else if (negativeCount > positiveCount) {
      emotion = 'negative';
      icon = 'Frown';
      confidence = Math.min(0.9, 0.5 + (negativeCount * 0.1));
    }
    
    return { emotion, confidence, icon };
  };

  const getAISuggestions = async (text: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key to use AI features",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful writing assistant. Provide brief, constructive suggestions for improving the writing, fixing grammar, and enhancing clarity. Keep suggestions concise and actionable.'
            },
            {
              role: 'user',
              content: `Please review this text and provide suggestions for improvement:\n\n${text}`
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI suggestions. Check your API key.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveNote = async () => {
    if (!currentNote.title.trim() || !currentNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please add both title and content",
        variant: "destructive"
      });
      return;
    }

    const sentiment = analyzeSentiment(currentNote.content);
    const aiSuggestions = await getAISuggestions(currentNote.content);
    
    const noteToSave: Note = {
      ...currentNote,
      id: currentNote.id || Date.now().toString(),
      timestamp: Date.now(),
      sentiment,
      aiSuggestions: aiSuggestions || undefined
    };

    const updatedNotes = currentNote.id 
      ? notes.map(note => note.id === currentNote.id ? noteToSave : note)
      : [noteToSave, ...notes];
    
    setNotes(updatedNotes);
    saveToStorage(updatedNotes);
    
    setCurrentNote({
      id: '',
      title: '',
      content: '',
      timestamp: Date.now()
    });

    toast({
      title: "Success",
      description: "Note saved with AI analysis"
    });
  };

  const loadNote = (note: Note) => {
    setCurrentNote(note);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveToStorage(updatedNotes);
    
    if (currentNote.id === id) {
      setCurrentNote({
        id: '',
        title: '',
        content: '',
        timestamp: Date.now()
      });
    }
    
    toast({
      title: "Success",
      description: "Note deleted"
    });
  };

  const getSentimentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smile': return <Smile className="h-4 w-4" />;
      case 'Frown': return <Frown className="h-4 w-4" />;
      default: return <Meh className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (emotion: string) => {
    switch (emotion) {
      case 'positive': return 'bg-success/20 text-success border-success/30';
      case 'negative': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (showApiInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                AI Writing Assistant
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your OpenAI API key to enable AI-powered writing suggestions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Get your free API key from{' '}
                  <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    OpenAI Platform
                  </a>
                </p>
              </div>
              <Button onClick={saveApiKey} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Save & Continue
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowApiInput(false)}
                className="w-full"
              >
                Skip (Offline Mode)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Writing Assistant
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Write journal entries and notes with AI-powered suggestions, grammar fixes, and sentiment analysis
          </p>
          <Button 
            variant="outline" 
            onClick={() => setShowApiInput(true)}
            className="mt-4"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Update API Key
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Writing Panel */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Write Your Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Note title..."
                  value={currentNote.title}
                  onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Start writing your thoughts..."
                  value={currentNote.content}
                  onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  className="mt-1 min-h-[300px] resize-none"
                />
              </div>

              <Button 
                onClick={saveNote} 
                disabled={isAnalyzing}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Save & Analyze'}
              </Button>

              {currentNote.sentiment && (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sentiment Analysis:</span>
                      <Badge variant="secondary" className={getSentimentColor(currentNote.sentiment.emotion)}>
                        {getSentimentIcon(currentNote.sentiment.icon)}
                        <span className="ml-2 capitalize">{currentNote.sentiment.emotion}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentNote.aiSuggestions && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">AI Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{currentNote.aiSuggestions}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Notes List */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Your Notes ({notes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notes yet. Start writing!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {notes.map((note) => (
                    <Card 
                      key={note.id} 
                      className="cursor-pointer hover:shadow-md transition-all border-border/30 hover:border-primary/20"
                      onClick={() => loadNote(note)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium truncate">{note.title}</h3>
                          {note.sentiment && (
                            <Badge variant="secondary" className={`${getSentimentColor(note.sentiment.emotion)} ml-2 flex-shrink-0`}>
                              {getSentimentIcon(note.sentiment.icon)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {note.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.timestamp).toLocaleDateString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIWritingAssistant;