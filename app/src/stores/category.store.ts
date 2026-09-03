import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

export interface Category {
  id: number;
  name: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
}

export const useCategoryStore = defineStore('category', () => {
  const userId = Number(localStorage.getItem('user'));
  const categories = ref<Category[]>([]);
  const currentCategory = ref<Category | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function clearError(): void {
    error.value = null;
  }

  async function list(): Promise<Category[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<unknown, Category[]>(`/categories/?userId=${userId}`);
      categories.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar categorias.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function find(id: number | string): Promise<Category> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<unknown, Category>(`/categories/${id}?userId=${userId}`);
      currentCategory.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao procurar categoria.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(payload: CreateCategoryPayload): Promise<Category> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post<unknown, Category>(`/categories?userId=${userId}`, payload);
      await list();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar categoria.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(id: number | string, payload: UpdateCategoryPayload): Promise<Category> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.put<unknown, Category>(`/categories/${id}?userId=${userId}`, payload);
      await list();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar categoria.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function remove(id: number | string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      await api.delete(`/categories/${id}?userId=${userId}`);
      await list();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao eliminar categoria.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    categories,
    currentCategory,
    isLoading,
    error,
    clearError,
    list,
    find,
    create,
    update,
    remove
  };
});