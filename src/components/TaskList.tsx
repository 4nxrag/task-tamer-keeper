import React, { useState, useEffect } from 'react';
import { CheckCircle2, Target } from 'lucide-react';
import TaskInput from './TaskInput';
import TaskItem, { Task } from './TaskItem';
import TaskFilters, { FilterType } from './TaskFilters';
import { useToast } from '@/hooks/use-toast';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task added!",
      description: "Your new task has been added to the list.",
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          toast({
            title: updatedTask.completed ? "Task completed! 🎉" : "Task reopened",
            description: updatedTask.completed 
              ? "Great job on completing your task!" 
              : "Task moved back to pending.",
          });
          return updatedTask;
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
    });
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'completed':
        return task.completed;
      case 'pending':
        return !task.completed;
      default:
        return true;
    }
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-primary rounded-full">
            <Target className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Task Tamer
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Organize your life, one task at a time
        </p>
      </div>

      <TaskInput onAddTask={addTask} />
      
      <TaskFilters 
        activeFilter={filter}
        onFilterChange={setFilter}
        taskCounts={taskCounts}
      />

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              {filter === 'completed' ? 'No completed tasks yet' :
               filter === 'pending' ? 'No pending tasks' :
               'No tasks yet'}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'Add your first task to get started!' :
               filter === 'pending' ? 'All caught up! Great job!' :
               'Start completing some tasks to see them here.'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            {taskCounts.completed} of {taskCounts.all} tasks completed
          </p>
          <div className="w-full bg-border rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${taskCounts.all > 0 ? (taskCounts.completed / taskCounts.all) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;