import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

export interface ConsumptionPlan {
  id: number;
  amount: number;
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

export interface CreateConsumptionPlanPayload {
  amount: number;
  month: number;
  year: number;
  categoryId: number;
}

export interface UpdateConsumptionPlanPayload {
  amount?: number;
  month?: number;
  year?: number;
  categoryId?: number;
}

export const useConsumptionPlanStore = defineStore('consumptionPlan', () => {
  const userId = Number(localStorage.getItem('user')); 
  const consumptionPlans = ref<ConsumptionPlan[]>([]);
  const currentPlan = ref<ConsumptionPlan | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function clearError(): void {
    error.value = null;
  }

  async function list(): Promise<ConsumptionPlan[]> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<unknown, ConsumptionPlan[]>(`/consumption-plans/?userId=${userId}`);
      consumptionPlans.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar planos de consumo.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function find(id: number | string): Promise<ConsumptionPlan> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get<unknown, ConsumptionPlan>(`/consumption-plans/${id}?userId=${userId}`);
      currentPlan.value = response;
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao procurar plano de consumo.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(payload: CreateConsumptionPlanPayload): Promise<ConsumptionPlan> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post<unknown, ConsumptionPlan>(`/consumption-plans?userId=${userId}`, payload);
      await list();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar plano de consumo.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(id: number | string, payload: UpdateConsumptionPlanPayload): Promise<ConsumptionPlan> {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.put<unknown, ConsumptionPlan>(`/consumption-plans/${id}?userId=${userId}`, payload);
      await list();
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar plano de consumo.';
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
      await api.delete(`/consumption-plans/${id}?userId=${userId}`);
      await list();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao eliminar plano de consumo.';
      error.value = message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    consumptionPlans,
    currentPlan,
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