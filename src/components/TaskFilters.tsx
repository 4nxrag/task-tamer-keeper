import React from 'react';
import { Button } from '@/components/ui/button';
import { ListTodo, CheckCircle, Circle } from 'lucide-react';

export type FilterType = 'all' | 'pending' | 'completed';

interface TaskFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    pending: number;
    completed: number;
  };
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ activeFilter, onFilterChange, taskCounts }) => {
  const filters = [
    { key: 'all' as FilterType, label: 'All', icon: ListTodo, count: taskCounts.all },
    { key: 'pending' as FilterType, label: 'Pending', icon: Circle, count: taskCounts.pending },
    { key: 'completed' as FilterType, label: 'Done', icon: CheckCircle, count: taskCounts.completed },
  ];

  return (
    <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
      {filters.map(({ key, label, icon: Icon, count }) => (
        <Button
          key={key}
          variant={activeFilter === key ? "default" : "ghost"}
          onClick={() => onFilterChange(key)}
          className={`flex-1 h-10 gap-2 transition-all duration-300 ${
            activeFilter === key 
              ? 'bg-primary text-primary-foreground shadow-elegant' 
              : 'hover:bg-background text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="font-medium">{label}</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            activeFilter === key 
              ? 'bg-primary-foreground/20 text-primary-foreground' 
              : 'bg-muted-foreground/20 text-muted-foreground'
          }`}>
            {count}
          </span>
        </Button>
      ))}
    </div>
  );
};

export default TaskFilters;