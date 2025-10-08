import axios from 'axios';
import { Platform } from 'react-native';

const getDefaultBaseURL = () =>
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://127.0.0.1:3000';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? getDefaultBaseURL();

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
