import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000'; // 10.0.2.2 is the special IP for Android emulator to connect to localhost

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export const getTodos = () => apiClient.get<Todo[]>('/todos');
export const createTodo = (data: { title: string; description?: string }) => apiClient.post<Todo>('/todos', data);
export const updateTodo = (id: number, data: Partial<Todo>) => apiClient.put<Todo>(`/todos/${id}`, data);
export const deleteTodo = (id: number) => apiClient.delete(`/todos/${id}`);
