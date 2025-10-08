import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from './src/api';

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (title.trim() === '') return;
    try {
      const response = await createTodo({ title, description });
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleComplete = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const response = await updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map((t) => (t.id === id ? response.data : t)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={() => handleToggleComplete(item.id)} style={styles.todoContent}>
        <Text style={[styles.todoTitle, item.completed && styles.completed]}>
          {item.title}
        </Text>
        {item.description && (
          <Text style={[styles.todoDescription, item.completed && styles.completed]}>
            {item.description}
          </Text>
        )}
      </TouchableOpacity>
      <Button title="Delete" onPress={() => handleDeleteTodo(item.id)} color="#ff5c5c" />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>ToDo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
        />
        <Button title="Add ToDo" onPress={handleAddTodo} />
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  todoItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 18,
  },
  todoDescription: {
    fontSize: 14,
    color: '#666',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});

export default App;

