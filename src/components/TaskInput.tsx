import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 h-12 text-base bg-card border-border placeholder:text-muted-foreground focus:ring-primary focus:border-primary transition-all duration-300"
      />
      <Button 
        type="submit" 
        className="h-12 px-6 bg-gradient-primary hover:scale-105 hover:shadow-elegant transition-all duration-300 text-primary-foreground font-medium"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Task
      </Button>
    </form>
  );
};

export default TaskInput;