import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { api } from '@/services/api';

export interface User {
  id: number;
  name?: string | null;
  username: string;
}

export interface RegisterPayload {
  name?: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed<boolean>(() => !!token.value);
  const userName = computed<string>(
    () => currentUser.value?.name || currentUser.value?.username || 'Utilizador'
  );

  function setSession(newToken: string | null, user: User | null): void {
    token.value = newToken;
    currentUser.value = user;

    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  function clearError(): void {
    error.value = null;
  }

  async function login(username: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post<unknown, AuthResponse>('/users/login', { username, password });
      setSession(response.token, response.user);
      return true;
    } catch (err: any) {
      return err.response?.data?.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(payload: RegisterPayload): Promise<any> {
      const response: any = await api.post('/users', payload);
      return response;   
  }

  function logout(): void {
    setSession(null, null);
    error.value = null;
  }

  function initUser(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser) as User;
      } catch {
        logout();
      }
    }
  }

  initUser();

  return {
    currentUser,
    token,
    isLoading,
    error,
    isAuthenticated,
    userName,
    clearError,
    login,
    register,
    logout
  };
});