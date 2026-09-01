<template>
  <main class="auth-wrapper">
    <Card class="auth-card">
      <template #title>
        <div class="auth-header">
          <h1>Bem-vindo de volta</h1>
          <p>Entre com as suas credenciais para continuar.</p>
        </div>
      </template>
      
      <template #content>
        <form @submit.prevent="handleLogin" class="form-grid">
          <div class="field">
            <label for="username">Nome de utilizador</label>
            <InputText 
              id="username" 
              v-model="form.username" 
              placeholder="Ex: joao.silva" 
              class="w-full" 
            />
          </div>
          
          <div class="field">
            <label for="password">Palavra-passe</label>
            <Password 
              id="password" 
              v-model="form.password" 
              :feedback="false" 
              toggleMask 
              placeholder="Insira a sua palavra-passe"
              input-class="w-full"
              class="w-full" 
            />
          </div>

          <Button 
            type="submit" 
            label="Entrar" 
            icon="pi pi-sign-in" 
            class="w-full submit-btn" 
            :loading="isLoading"
          />
        </form>

        <div class="auth-footer">
          <span>Não tem uma conta?</span>
          <Button 
            label="Cadastre-se" 
            link 
            @click="$router.push('/cadastro')" 
          />
        </div>
      </template>
    </Card>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const router = useRouter();
const isLoading = ref(false);

const form = reactive({
  username: '',
  password: ''
});

async function handleLogin() {
  if (!form.username || !form.password) return;
  
  isLoading.value = true;
  // TODO: Implementar chamada à API (POST /api/login)
  console.log('Login credentials:', form);
  
  setTimeout(() => {
    isLoading.value = false;
    router.push('/'); // Redireciona para o dashboard
  }, 1000);
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--surface-ground, #f8f9fa);
  padding: 1rem;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.auth-header {
  text-align: center;
  margin-bottom: 1rem;
}

.auth-header h1 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.auth-header p {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.w-full {
  width: 100%;
}

.submit-btn {
  margin-top: 0.5rem;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

/* Força o input do Password a ocupar 100% da largura do contêiner */
:deep(.p-password-input) {
  width: 100%;
}
</style>