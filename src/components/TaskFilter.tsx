import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';

interface TaskFilterProps {
  onFilterChange: (filter: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mb-4"
    >
      <Select
        defaultValue="all"
        onChange={(e) => onFilterChange(e.target.value as string)}
        className="w-full"
      >
        <MenuItem value="all">All Tasks</MenuItem>
        <MenuItem value="To Do">To Do</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </Select>
    </motion.div>
  );
};

export default TaskFilter;

