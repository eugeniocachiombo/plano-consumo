<template>
  <main class="auth-wrapper">
    <div class="auth-container">
      <Card class="auth-card">
        <template #content>
          <div class="auth-content">
            <!-- Header -->
            <header class="auth-header">
              <div class="brand-mark" aria-hidden="true">
                <i class="pi pi-chart-line"></i>
              </div>

              <div class="auth-heading">
                <h1>Bem-vindo de volta</h1>
                <p>Entre para gerir os seus planos de consumo.</p>
              </div>
            </header>

            <!-- Login Form -->
            <form
              @submit.prevent="handleLogin"
              class="auth-form"
              novalidate
            >
              <!-- Username -->
              <div class="field">
                <label for="username">
                  Nome de utilizador
                </label>

                <div class="input-wrapper">
                  <i class="pi pi-user input-icon" aria-hidden="true"></i>

                  <InputText
                    id="username"
                    v-model="form.username"
                    type="text"
                    autocomplete="username"
                    placeholder="Ex: joao.silva"
                    class="auth-input"
                    :disabled="isLoading"
                    aria-required="true"
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="field">
                <label for="password">
                  Palavra-passe
                </label>

                <div class="password-wrapper">
                  <Password
                    id="password"
                    v-model="form.password"
                    :feedback="false"
                    toggleMask
                    autocomplete="current-password"
                    placeholder="Insira a sua palavra-passe"
                    input-class="auth-password-input"
                    class="auth-password"
                    :disabled="isLoading"
                    aria-required="true"
                  />
                </div>
              </div>

              <!-- Submit -->
              <Button
                type="submit"
                label="Entrar na Conta"
                icon="pi pi-sign-in"
                class="submit-btn"
                :loading="isLoading"
                :disabled="isLoading"
              />
            </form>

            <!-- Register -->
            <div class="auth-footer">
              <span>Não tem uma conta?</span>

              <Button
                label="Cadastre-se"
                link
                class="register-link"
                :disabled="isLoading"
                @click="$router.push('/cadastro')"
              />
            </div>
          </div>
        </template>
      </Card>

      <p class="auth-copyright">
        Acesso seguro à sua gestão de consumo
      </p>
    </div>
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
    router.push('/');
  }, 1000);
}
</script>

<style scoped>
/* =========================================
   AUTH LAYOUT
========================================= */

.auth-wrapper {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 2rem 1rem;

  /* --- MUDANÇA AQUI: Imagem de Fundo --- */
  /* Utilizando uma imagem do Unsplash sobre finanças/planejamento */
  background-image:
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--surface-ground) 80%, transparent),
      color-mix(in srgb, var(--surface-ground) 95%, transparent)
    ),
    url('https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1920&auto=format&fit=crop');
  
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* Efeito Parallax suave */
  /* ------------------------------------- */

  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

.auth-container {
  width: 100%;
  max-width: 430px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* =========================================
   CARD
========================================= */

.auth-card {
  width: 100%;

  border: 1px solid var(--surface-border);
  border-radius: 16px;

  /* Garante que o card seja opaco sobre a imagem */
  background: var(--surface-card);

  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15); /* Sombra um pouco mais forte para destacar do fundo */

  overflow: hidden;

  animation: auth-card-enter 0.45s ease-out both;

  transition:
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.auth-card:hover {
  box-shadow:
    0 24px 50px rgba(0, 0, 0, 0.2);
}

.auth-content {
  padding: 0.5rem;
}

/* =========================================
   HEADER
========================================= */

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  margin-bottom: 2rem;
}

.brand-mark {
  width: 52px;
  height: 52px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 1.25rem;

  border-radius: 14px;

  color: var(--primary-color);
  background: color-mix(
    in srgb,
    var(--primary-color) 10%,
    transparent
  );

  font-size: 1.25rem;

  transition:
    transform 0.25s ease,
    background-color 0.25s ease;
}

.brand-mark:hover {
  transform: translateY(-2px);
  background: color-mix(
    in srgb,
    var(--primary-color) 15%,
    transparent
  );
}

.auth-heading h1 {
  margin: 0;

  color: var(--text-color);

  font-size: clamp(1.4rem, 3vw, 1.65rem);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.auth-heading p {
  max-width: 320px;

  margin: 0.65rem auto 0;

  color: var(--text-color-secondary);

  font-size: 0.9rem;
  line-height: 1.55;
}

/* =========================================
   FORM
========================================= */

.auth-form {
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
  color: var(--text-color);

  font-size: 0.875rem;
  font-weight: 600;

  cursor: pointer;
}

/* =========================================
   INPUTS
========================================= */

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;

  top: 50%;
  left: 0.9rem;

  z-index: 1;

  color: var(--text-color-secondary);

  font-size: 0.9rem;

  transform: translateY(-50%);

  pointer-events: none;

  transition: color 0.2s ease;
}

.auth-input {
  width: 100%;

  min-height: 44px;

  padding-left: 2.6rem;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-wrapper:focus-within .input-icon {
  color: var(--primary-color);
}

/* =========================================
   PASSWORD
========================================= */

.password-wrapper {
  width: 100%;
}

.auth-password {
  width: 100%;
}

:deep(.auth-password-input) {
  width: 100%;
  min-height: 44px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

/* =========================================
   SUBMIT
========================================= */

.submit-btn {
  width: 100%;

  min-height: 44px;

  margin-top: 0.25rem;

  justify-content: center;

  font-weight: 600;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.submit-btn:not(:disabled):active {
  transform: translateY(0);
}

/* =========================================
   FOOTER
========================================= */

.auth-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  gap: 0.25rem;

  margin-top: 1.75rem;

  color: var(--text-color-secondary);

  font-size: 0.875rem;
  line-height: 1.5;
}

.register-link {
  padding: 0.15rem 0.25rem;

  font-weight: 600;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.register-link:not(:disabled):hover {
  transform: translateX(1px);
}

/* =========================================
   COPYRIGHT / SECURITY
========================================= */

.auth-copyright {
  margin: 1.25rem 0 0;

  color: white; /* Alterado para branco para ler melhor sobre o fundo */

  font-size: 0.75rem;

  opacity: 0.85;

  text-align: center;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5); /* Sombra no texto para garantir leitura */
}

/* =========================================
   FOCUS
========================================= */

:deep(.p-inputtext:focus),
:deep(.p-password-input:focus) {
  box-shadow:
    0 0 0 3px color-mix(
      in srgb,
      var(--primary-color) 14%,
      transparent
    );
}

/* =========================================
   ANIMATION
========================================= */

@keyframes auth-card-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================================
   MOBILE
========================================= */

@media (max-width: 480px) {
  .auth-wrapper {
    align-items: flex-start;

    padding: 1.25rem 0.85rem;
    background-attachment: scroll; /* Melhora performance em mobile */
  }

  .auth-container {
    max-width: 100%;
  }

  .auth-card {
    border-radius: 14px;
  }

  .auth-content {
    padding: 0.25rem;
  }

  .auth-header {
    margin-bottom: 1.5rem;
  }

  .brand-mark {
    width: 48px;
    height: 48px;

    margin-bottom: 1rem;
  }

  .auth-heading h1 {
    font-size: 1.4rem;
  }

  .auth-heading p {
    font-size: 0.85rem;
  }

  .auth-form {
    gap: 1.1rem;
  }

  .auth-footer {
    margin-top: 1.5rem;
  }
}

/* =========================================
   REDUCED MOTION
========================================= */

@media (prefers-reduced-motion: reduce) {
  .auth-card {
    animation: none;
  }

  .auth-wrapper {
    background-attachment: scroll;
  }

  .auth-wrapper,
  .auth-card,
  .brand-mark,
  .submit-btn,
  .register-link,
  .auth-input,
  :deep(.auth-password-input) {
    transition: none;
  }
}
</style>