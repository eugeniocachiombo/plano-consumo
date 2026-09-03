import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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

  /**
   * Atualiza a sessão na memória, LocalStorage e nos cabeçalhos HTTP do Axios
   */
  function setSession(newToken: string | null, user: User | null): void {
    token.value = newToken;
    currentUser.value = user;

    if (newToken) {
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
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

  async function login(username: string, password: string): Promise<boolean | string> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post<unknown, AuthResponse>('/users/login', { username, password });
      
      if (response && response.token) {
        setSession(response.token, response.user);
        return true;
      }
      
      return 'Resposta inválida do servidor.';
    } catch (err: any) {
      const message = err.response?.data?.message || 'Nome de utilizador ou palavra-passe incorretos.';
      error.value = message;
      return message;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(payload: RegisterPayload): Promise<User> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.post<unknown, User>('/users', payload);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao realizar o cadastro.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function logout(): void {
    setSession(null, null);
    error.value = null;
  }

  /**
   * Inicializa o estado do utilizador e configura o Token no arranque da aplicação
   */
  function initUser(): void {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        currentUser.value = JSON.parse(savedUser) as User;
        token.value = savedToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch {
        logout();
      }
    } else {
      logout();
    }
  }

  // Executa a verificação ao instanciar a store
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
    logout,
    initUser
  };
});