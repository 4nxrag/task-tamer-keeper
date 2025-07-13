import React from 'react';
import { Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className={`group flex items-center gap-4 p-4 bg-card rounded-xl shadow-task border border-border transition-all duration-300 hover:shadow-elegant animate-bounce-in ${
      task.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-center">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="w-5 h-5 data-[state=checked]:bg-success data-[state=checked]:border-success"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-base transition-all duration-300 ${
          task.completed 
            ? 'line-through text-muted-foreground' 
            : 'text-foreground'
        }`}>
          {task.text}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {task.createdAt.toLocaleDateString()}
        </p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TaskItem;