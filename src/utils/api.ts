import { Task } from '../types';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return data.slice(0, 20).map((task: any) => ({
      id: task.id,
      title: task.title,
      description: `Task ${task.id} description`,
      status: task.completed ? 'Done' : 'To Do',
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

