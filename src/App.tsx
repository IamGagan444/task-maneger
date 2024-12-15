import React, { useState, useEffect, Suspense } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Task } from './types';
import { fetchTasks } from './utils/api';
import { CircularProgress } from '@mui/material';

const TaskTable = React.lazy(() => import('./components/TaskTable'));
const AddTaskForm = React.lazy(() => import('./components/AddTaskForm'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#ec4899',
    },
  },
});

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks().then((fetchedTasks) => {
      // Sort fetched tasks by ID to ensure correct order
      const sortedTasks = fetchedTasks.sort((a, b) => a.id - b.id);
      setTasks(sortedTasks);
    });
  }, []);

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    const taskWithId = { ...newTask, id: newId };
    setTasks(prevTasks => [taskWithId, ...prevTasks]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Task List Manager</h1>
          <Suspense fallback={<CircularProgress />}>
            <AddTaskForm onAddTask={handleAddTask} />
            <TaskTable
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </Suspense>
        </div>
      </div>
      <ToastContainer position="bottom-right" limit={3} />
    </ThemeProvider>
  );
}

export default App;

