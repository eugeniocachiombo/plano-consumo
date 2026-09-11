import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';
import cryptoService from '../services/crypto.service';

export interface Consumption {
  id: number;
  amount: number;
  description?: string | null;
  month: number;
  year: number;
  userId: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConsumptionPayload {
  amount: number;
  description?: string | null;
  month: number;
  year: number;
  categoryId: number;
}

export interface UpdateConsumptionPayload {
  amount?: number;
  description?: string | null;
  month?: number;
  year?: number;
  categoryId?: number;
}

export const useConsumptionStore = defineStore('consumption', () => {
  const loggedId = String(localStorage.getItem('userID'));
  const userId = cryptoService.encryptId(loggedId);  
  const consumptions = ref<Consumption[]>([]);
  const currentConsumption = ref<Consumption | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function clearError(): void {
    error.value = null;
  }

  async function list(): Promise<Consumption[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<unknown, Consumption[]>(`/consumptions/?userId=${userId}`);
      consumptions.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar consumos.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function find(id: number | string): Promise<Consumption> {
    isLoading.value = true;
    error.value = null;
    try {
      const catID = cryptoService.encryptId(String(id));
      const response = await api.get<unknown, Consumption>(`/consumptions/${catID}?userId=${userId}`);
      currentConsumption.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao procurar consumo.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(payload: CreateConsumptionPayload): Promise<Consumption> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post<unknown, Consumption>(`/consumptions?userId=${userId}`, payload);
      await list();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar consumo.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(id: number | string, payload: UpdateConsumptionPayload): Promise<Consumption> {
    isLoading.value = true;
    error.value = null;
    try {
      const catID = cryptoService.encryptId(String(id));
      const response = await api.put<unknown, Consumption>(`/consumptions/${catID}?userId=${userId}`, payload);
      await list();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar consumo.';
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
      const catID = cryptoService.encryptId(String(id));
      await api.delete(`/consumptions/${catID}?userId=${userId}`);
      await list();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao eliminar consumo.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    consumptions,
    currentConsumption,
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