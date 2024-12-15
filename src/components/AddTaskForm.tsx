import React, { useState, useCallback } from 'react';
import { TextField, Button, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Task } from '../types';
import { toast } from 'react-toastify';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (title && description) {
      const newTask: Omit<Task, 'id'> = {
        title,
        description,
        status,
      };
      onAddTask(newTask);
      setTitle('');
      setDescription('');
      setStatus('To Do');
      toast.success('Task added successfully!');
    }
  }, [title, description, status, onAddTask]);

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="sm:col-span-1"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="sm:col-span-2"
      />
      <Select
        value={status}
        onChange={handleStatusChange}
        className="sm:col-span-1"
      >
        <MenuItem value="To Do">To Do</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </Select>
      <Button type="submit" variant="contained" color="primary" className="sm:col-span-4">
        Add Task
      </Button>
    </form>
  );
};

export default AddTaskForm;

