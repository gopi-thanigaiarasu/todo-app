import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Pressable,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSnackbar } from '../components/SnackbarProvider';
import { getTodos, createTodo, updateTodo, deleteTodo, Todo } from '../services/api';

const Home = () => {
  const { show } = useSnackbar();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const getErrorMessage = (e: any, fallback: string) => e?.response?.data?.message || e?.message || fallback;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      show({ message: getErrorMessage(error, 'Failed to load tasks'), type: 'error' });
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTodos();
  };

  const handleAddTodo = async () => {
    if (title.trim() === '') {
      show('Please enter a title');
      return;
    }
    try {
      const response = await createTodo({ title, description });
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating todo:', error);
      show({ message: getErrorMessage(error, 'Failed to create task'), type: 'error' });
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
      show({ message: getErrorMessage(error, 'Failed to update task'), type: 'error' });
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      show({ message: getErrorMessage(error, 'Failed to delete task'), type: 'error' });
    }
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoCard}>
      <Pressable
        onPress={() => handleToggleComplete(item.id)}
        style={({ pressed }) => [styles.checkbox, item.completed && styles.checkboxCompleted, pressed && styles.buttonPressed]}
        android_ripple={{ color: '#e5e7eb' }}
      />
      <TouchableOpacity onPress={() => handleToggleComplete(item.id)} style={styles.todoContent}>
        <Text style={[styles.todoTitle, item.completed && styles.completed]}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={[styles.todoDescription, item.completed && styles.completed]}>
            {item.description}
          </Text>
        ) : null}
      </TouchableOpacity>
      <Pressable
        onPress={() => handleDeleteTodo(item.id)}
        style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
        android_ripple={{ color: '#fecaca' }}
      >
        <Text style={styles.dangerButtonText}>Delete</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.header}>ToDo</Text>
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
          <Pressable
            onPress={handleAddTodo}
            disabled={title.trim().length === 0}
            style={({ pressed }) => [
              styles.primaryButton,
              title.trim().length === 0 && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            android_ripple={{ color: '#a5b4fc' }}
          >
            <Text style={styles.primaryButtonText}>Add Task</Text>
          </Pressable>
        </View>
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          contentContainerStyle={todos.length === 0 ? styles.listEmptyContent : styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No tasks yet</Text>
              <Text style={styles.emptySubtitle}>Add your first task above.</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 16,
    color: '#111827',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  todoCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  checkboxCompleted: {
    borderColor: '#6366F1',
    backgroundColor: '#6366F1',
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  todoDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  dangerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginLeft: 12,
  },
  dangerButtonText: {
    color: '#ef4444',
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});

export default Home;

