<script setup>
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Badge from 'primevue/badge';
import { useUserStore } from '@/stores/user.store';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

const form = reactive({
  name: '',
  username: '',
  password: ''
});

const fieldErrors = ref({
  name: '',
  username: '',
  password: ''
});

function generateUsername(name) {
  if (!name) return '';
  
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '.');
}

// Limpa o erro do campo quando o utilizador digita
function clearFieldError(field) {
  if (fieldErrors.value[field]) {
    fieldErrors.value[field] = '';
  }
}

watch(
  () => form.name,
  (newName) => {
    form.username = generateUsername(newName);
    clearFieldError('name');
    clearFieldError('username');
  }
);

watch(
  () => form.password,
  () => clearFieldError('password')
);

function getErrorMessage(errorField) {
  if (!errorField) return '';
  return Array.isArray(errorField) ? errorField[0] : errorField;
}

async function handleRegister() {
  if (userStore.isLoading) return;

  userStore.isLoading = true;
  fieldErrors.value = {};

  try {
    await userStore.register({
      name: form.name.trim(),
      username: form.username,
      password: form.password
    });

    toast.add({ 
      severity: 'success', 
      summary: 'Conta criada!', 
      detail: 'O seu registo foi concluído com sucesso. Redirecionando...',
      life: 3000 
    });
    
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    const responseData = error?.response?.data;

    if (responseData?.errors) {
      fieldErrors.value = { ...responseData.errors };
    }

    toast.add({ 
      severity: 'error', 
      summary: 'Erro no Registo', 
      detail: responseData?.message || 'Por favor, verifique os campos destacados.',
      life: 4000 
    });
  } finally {
    userStore.isLoading = false;
  }
}
</script>

<template>
  <Toast position="top-right" />

  <main class="auth-wrapper">
    <div class="auth-container">
      <Card class="auth-card" role="region" aria-labelledby="auth-title">
        <template #title>
          <header class="auth-header">
            <div class="auth-icon-badge" aria-hidden="true">
              <i class="pi pi-user-plus"></i>
            </div>
            <h1 id="auth-title">Criar Conta</h1>
            <p>Registe-se para acompanhar e otimizar o seu consumo.</p>
          </header>
        </template>
        
        <template #content>
          <form @submit.prevent="handleRegister" class="form-grid" novalidate>
            
            <!-- Campo: Nome -->
            <div class="field">
              <label for="name" class="required-label">Nome Completo</label>
              <div class="p-input-icon-left">
                <i class="pi pi-user" />
                <InputText 
                  id="name" 
                  v-model="form.name" 
                  placeholder="Ex: João Silva" 
                  class="w-full"
                  :invalid="!!fieldErrors.name"
                  :aria-invalid="!!fieldErrors.name"
                  aria-describedby="name-error"
                  autocomplete="name"
                  required
                />
              </div>
              <small id="name-error" v-if="fieldErrors.name" class="p-error-message" role="alert">
                <i class="pi pi-exclamation-circle"></i>
                <span>{{ getErrorMessage(fieldErrors.name) }}</span>
              </small>
            </div>

            <!-- Campo: Nome de Utilizador (Gerado) -->
            <div class="field">
              <div class="label-with-badge">
                <label for="username">Nome de utilizador</label>
                <Badge value="Automático" severity="secondary" class="auto-badge" />
              </div>
              <div class="p-input-icon-left">
                <i class="pi pi-at" />
                <InputText 
                  id="username" 
                  v-model="form.username" 
                  placeholder="joao.silva" 
                  class="w-full " 
                  :invalid="!!fieldErrors.username"
                  :aria-invalid="!!fieldErrors.username"
                  aria-describedby="username-error username-help"
                />
              </div>
              <small id="username-help" class="field-help">Gerado automaticamente a partir do seu nome.</small>
              <small id="username-error" v-if="fieldErrors.username" class="p-error-message" role="alert">
                <i class="pi pi-exclamation-circle"></i>
                <span>{{ getErrorMessage(fieldErrors.username) }}</span>
              </small>
            </div>
            
            <!-- Campo: Palavra-Passe -->
            <div class="field">
              <label for="password" class="required-label">Palavra-passe</label>
              <Password 
                id="password" 
                v-model="form.password" 
                toggleMask 
                promptLabel="Escolha uma palavra-passe"
                weakLabel="Fraca"
                mediumLabel="Aceitável"
                strongLabel="Forte"
                placeholder="Crie uma palavra-passe segura"
                class="w-full"
                inputClass="w-full"
                :invalid="!!fieldErrors.password"
                :aria-invalid="!!fieldErrors.password"
                aria-describedby="password-error"
                autocomplete="new-password"
                required
              >
                <template #header>
                  <div class="password-header-title">Requisitos da palavra-passe</div>
                </template>
                <template #footer>
                  <ul class="password-requirements">
                    <li>Mínimo de 8 caracteres</li>
                    <li>Inclua letras e números</li>
                  </ul>
                </template>
              </Password>
              <small id="password-error" v-if="fieldErrors.password" class="p-error-message" role="alert">
                <i class="pi pi-exclamation-circle"></i>
                <span>{{ getErrorMessage(fieldErrors.password) }}</span>
              </small>
            </div>

            <!-- Botão Principal -->
            <Button 
              type="submit" 
              label="Criar conta" 
              icon="pi pi-user-plus" 
              class="w-full submit-btn p-button-primary" 
              :loading="userStore.isLoading"
              :disabled="userStore.isLoading"
            />
          </form>

          <div class="auth-footer">
            <span>Já tem uma conta?</span>
            <Button 
              label="Iniciar sessão" 
              link 
              class="login-link-btn"
              @click="router.push('/login')" 
            />
          </div>
        </template>
      </Card>

      <p class="auth-copyright">
        Acesso seguro e controlo inteligente de consumo
      </p>
    </div>
  </main>
</template>

<style scoped>
/* Contêiner Geral com Imagem de Fundo sobre Gestão e Consumo */
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 2rem 1rem;
  
  /* Imagem temática de dashboard/dados de consumo com overlay legível */
  background-image: 
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--surface-ground, #0f172a) 75%, transparent),
      color-mix(in srgb, var(--surface-ground, #0f172a) 90%, transparent)
    ),
    url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Card Principal com Elevação */
.auth-card {
  width: 100%;
  border-radius: 16px;
  border: 1px solid var(--surface-border, rgba(229, 231, 235, 0.8));
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
  background: var(--surface-card, #ffffff);
  backdrop-filter: blur(8px);
  animation: auth-card-enter 0.4s ease-out both;
  transition: box-shadow 0.25s ease;
}

.auth-card:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.22);
}

/* Cabeçalho */
.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 0.5rem;
}

.auth-icon-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: color-mix(in srgb, var(--primary-color, #2563eb) 12%, transparent);
  color: var(--primary-color, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.auth-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.35rem 0;
  color: var(--text-color, #1f2937);
  letter-spacing: -0.025em;
}

.auth-header p {
  color: var(--text-color-secondary, #6b7280);
  font-size: 0.875rem;
  margin: 0;
}

/* Formulário & Grid */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
}

.field label {
  font-weight: 600;
  color: var(--text-color, #374151);
  font-size: 0.875rem;
}

.required-label::after {
  content: " *";
  color: var(--p-red-500, #ef4444);
}

.label-with-badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.auto-badge {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.15rem 0.4rem;
}

/* Ícones de Input no PrimeVue */
.p-input-icon-left {
  position: relative;
  width: 100%;
}

.p-input-icon-left > i {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: var(--text-color-secondary, #9ca3af);
  z-index: 1;
}

.p-input-icon-left .p-inputtext {
  padding-left: 2.5rem;
}

.disabled-input {
  background-color: var(--surface-100, #f3f4f6) !important;
  opacity: 0.85;
  cursor: not-allowed;
}

/* Mensagens de Ajuda e Erro */
.field-help {
  color: var(--text-color-secondary, #6b7280);
  font-size: 0.75rem;
}

.p-error-message {
  color: var(--p-red-500, #dc2626);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.1rem;
  word-break: break-word;
}

/* Submissão */
.submit-btn {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.submit-btn:not(:disabled):active {
  transform: translateY(0);
}

/* Rodapé */
.auth-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border, #f3f4f6);
  font-size: 0.875rem;
  color: var(--text-color-secondary, #6b7280);
}

.login-link-btn {
  padding: 0 !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
}

.auth-copyright {
  margin: 1.25rem 0 0;
  color: #ffffff;
  font-size: 0.75rem;
  opacity: 0.85;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.w-full {
  width: 100%;
}

/* Requisitos de Senha */
.password-header-title {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.password-requirements {
  margin: 0.5rem 0 0 0;
  padding-left: 1.2rem;
  font-size: 0.75rem;
  color: var(--text-color-secondary);
}

.password-requirements li {
  margin-bottom: 0.15rem;
}

/* Customizações Deep para PrimeVue Password */
:deep(.p-password) {
  width: 100%;
  display: flex;
}

:deep(.p-password-input) {
  width: 100%;
}

/* Animação de Entrada */
@keyframes auth-card-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Suporte para Dispositivos Móveis e Acessibilidade */
@media (max-width: 480px) {
  .auth-wrapper {
    background-attachment: scroll;
    padding: 1.25rem 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .auth-card {
    animation: none;
  }
  .auth-wrapper,
  .submit-btn,
  .auth-card {
    transition: none;
  }
}
</style>