<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">Bienvenido</h2>
      <form @submit.prevent="handleSubmit">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" v-model="email" required placeholder="Ingresa tu correo" />

        <label for="password">Contraseña:</label>
        <div class="password-container">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required
            placeholder="Ingresa tu contraseña" />
          <span @click="togglePasswordVisibility" class="toggle-password">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <p class="signup-text">¿No tienes una cuenta? <router-link to="/registro">Regístrate aquí</router-link></p>
        <p class="signup-text"><router-link to="/recupera">¿Olvidaste tu contraseña?</router-link></p>

        <div id="recaptcha-container" class="g-recaptcha" data-sitekey="6Lc0oi8rAAAAAIGxKd-wV2XETb6fZ3FwA6J_hMlz"
          data-callback="onCaptchaVerified"></div>

        <button type="submit" class="login-button">Listo</button>
      </form>
    </div>

    <!-- Loader Modal (se muestra cuando isLoading es true) -->
    <div v-if="isLoading" class="loader-modal">
      <div class="book">
        <div class="book__pg-shadow"></div>
        <div class="book__pg"></div>
        <div class="book__pg book__pg--2"></div>
        <div class="book__pg book__pg--3"></div>
        <div class="book__pg book__pg--4"></div>
        <div class="book__pg book__pg--5"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/usuariosStore'; // Asegúrate de importar el store correcto
import Swal from 'sweetalert2';

export default {
  name: "LogIn",
  data() {
    return {
      showPassword: false,
      email: '',
      password: '',
      error: null, // Para manejar errores
      loginAttempts: 0, // Contador de intentos fallidos
      maxAttempts: 3, // Máximo de intentos permitidos
      recaptchaToken: '', // Token de reCAPTCHA
      isLoading: false,
    };
  },
  computed: {
    loading() {
      return this.store.loading; // Usamos el estado de loading del store
    }
  },
  mounted() {
    window.onCaptchaVerified = this.onCaptchaVerified;

    const tryRenderCaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.render('recaptcha-container', {
          sitekey: '6Lc0oi8rAAAAAIGxKd-wV2XETb6fZ3FwA6J_hMlz',
          callback: this.onCaptchaVerified
        });
      } else {
        setTimeout(tryRenderCaptcha, 500); // Espera que grecaptcha se cargue
      }
    };

    tryRenderCaptcha();
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    onCaptchaVerified(token) {
      this.recaptchaToken = token;
    },

    async handleSubmit() {
      if (!this.recaptchaToken) {
        Swal.fire({
          icon: 'warning',
          title: 'Captcha requerido',
          text: 'Por favor completa el reCAPTCHA antes de continuar.',
        });
        return;
      }

      const credentials = {
        correo: this.email,
        password: this.password,
        'g-recaptcha-response': this.recaptchaToken,
      };

      this.isLoading = true;

      // Usamos el método login del store
      const success = await this.store.login(credentials);
      let estadoActividad;

      if (success) {
        this.isLoading = false; // Detiene el loader al finalizar el login
        // Reinicia los intentos fallidos al iniciar sesión correctamente
        this.loginAttempts = 0;

        // Muestra una alerta de éxito cuando el login es exitoso
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
        });

        // Redirige al Home si el login es exitoso
        this.$router.push('/');
        estadoActividad = 'exitoso';
      } else {
        this.isLoading = false;
        this.loginAttempts++;  // Incrementa el contador de intentos fallidos
        estadoActividad = 'fallido';

        if (this.loginAttempts >= this.maxAttempts) {
          Swal.fire({
            icon: 'warning',
            title: 'Cuenta bloqueada',
            text: 'Has alcanzado el máximo de intentos fallidos. Tu cuenta acaba de ser bloqueada.',
          });
        } else {
          // Si el login falla, muestra un mensaje de error
          this.error = 'Correo o contraseña incorrectos';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.error,
          });
        }
      }

      // Llama a la función crearActividad del store
      try {
        await this.store.crearActividad(this.email, estadoActividad);
      } catch (error) {
        console.error('Error al registrar la actividad:', error);
      }
    }
  },
  created() {
    this.store = useAuthStore(); // Vincula el store de Pinia a este componente
  },
  watch: {
    // Se puede escuchar el token y redirigir si ya está autenticado (opcional)
    token(newToken) {
      if (newToken) {
        this.$router.push({ name: 'Home' }); // Redirige al Home si ya está autenticado
      }
    }
  },
};
</script>

<style>
:root {
  --hue: 40;
  --bg: hsl(var(--hue), 10%, 90%);
  --fg: hsl(var(--hue), 10%, 10%);
  --primary: hsl(var(--hue), 90%, 55%);
  --primary-l: hsl(var(--hue), 90%, 65%);
  --primary-d: hsl(var(--hue), 90%, 45%);
  --white: hsl(var(--hue), 10%, 100%);
  --white-d: hsl(var(--hue), 10%, 45%);
}
</style>

<style scoped>
#recaptcha-container {
  margin-top: 20px;
  min-height: 78px;
  width: 100%;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #FFFEDC;
  /* Color de fondo */
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  box-sizing: border-box;
}

.title {
  color: #FE9900;
  /* Color naranja */
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #444;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.signup-text {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.signup-text a {
  color: #FE9900;
  /* Color naranja */
  text-decoration: none;
}

.signup-text a:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #A16F23;
  /* Color marrón */
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.login-button:hover {
  background-color: #A16F23;
  /* Color marrón más oscuro */
}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
}

/* Estilo para el loader como modal */
.loader-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.book,
.book__pg-shadow,
.book__pg {
  animation: cover 7s ease-in-out infinite;
}

.book {
  background-color: var(--primary-l);
  border-radius: 0.25em;
  box-shadow:
    0 0.25em 0.5em hsla(0, 0%, 0%, 0.3),
    0 0 0 0.25em var(--primary) inset;
  padding: 0.25em;
  perspective: 37.5em;
  position: relative;
  width: 8em;
  height: 6em;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
}

.book__pg-shadow,
.book__pg {
  position: absolute;
  left: 0.25em;
  width: calc(50% - 0.25em);
}

.book__pg-shadow {
  animation-name: shadow;
  background-image: linear-gradient(-45deg, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.3) 50%);
  filter: blur(0.25em);
  top: calc(100% - 0.25em);
  height: 3.75em;
  transform: scaleY(0);
  transform-origin: 100% 0%;
}

.book__pg {
  animation-name: pg1;
  background-color: var(--white);
  background-image: linear-gradient(90deg, hsla(var(--hue), 10%, 90%, 0) 87.5%, hsl(var(--hue), 10%, 90%));
  height: calc(100% - 0.5em);
  transform-origin: 100% 50%;
}

.book__pg--2,
.book__pg--3,
.book__pg--4 {
  background-image:
    repeating-linear-gradient(hsl(var(--hue), 10%, 10%) 0 0.125em, hsla(var(--hue), 10%, 10%, 0) 0.125em 0.5em),
    linear-gradient(90deg, hsla(var(--hue), 10%, 90%, 0) 87.5%, hsl(var(--hue), 10%, 90%));
  background-repeat: no-repeat;
  background-position: center;
  background-size: 2.5em 4.125em, 100% 100%;
}

.book__pg--2 {
  animation-name: pg2;
}

.book__pg--3 {
  animation-name: pg3;
}

.book__pg--4 {
  animation-name: pg4;
}

.book__pg--5 {
  animation-name: pg5;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: hsl(var(--hue), 10%, 30%);
    --fg: hsl(var(--hue), 10%, 90%);
  }
}

/* Animations */
@keyframes cover {

  from,
  5%,
  45%,
  55%,
  95%,
  to {
    animation-timing-function: ease-out;
    background-color: var(--primary-l);
  }

  10%,
  40%,
  60%,
  90% {
    animation-timing-function: ease-in;
    background-color: var(--primary-d);
  }
}

@keyframes shadow {

  from,
  10.01%,
  20.01%,
  30.01%,
  40.01% {
    animation-timing-function: ease-in;
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
  }

  5%,
  15%,
  25%,
  35%,
  45%,
  55%,
  65%,
  75%,
  85%,
  95% {
    animation-timing-function: ease-out;
    transform: translate3d(0, 0, 1px) scaleY(0.2) rotateY(90deg);
  }

  10%,
  20%,
  30%,
  40%,
  50%,
  to {
    animation-timing-function: ease-out;
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
  }

  50.01%,
  60.01%,
  70.01%,
  80.01%,
  90.01% {
    animation-timing-function: ease-in;
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
  }

  60%,
  70%,
  80%,
  90%,
  to {
    animation-timing-function: ease-out;
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
  }
}

@keyframes pg1 {

  from,
  to {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0.4deg);
  }

  10%,
  15% {
    animation-timing-function: ease-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }

  20%,
  80% {
    animation-timing-function: ease-in;
    background-color: var(--white-d);
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }

  85%,
  90% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }
}

@keyframes pg2 {

  from,
  to {
    animation-timing-function: ease-in;
    background-color: var(--white-d);
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }

  5%,
  10% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }

  20%,
  25% {
    animation-timing-function: ease-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }

  30%,
  70% {
    animation-timing-function: ease-in;
    background-color: var(--white-d);
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }

  75%,
  80% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }

  90%,
  95% {
    animation-timing-function: ease-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }
}

@keyframes pg3 {

  from,
  10%,
  90%,
  to {
    animation-timing-function: ease-in;
    background-color: var(--white-d);
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }

  15%,
  20% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }

  30%,
  35% {
    animation-timing-function: ease-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }

  40%,
  60% {
    animation-timing-function: ease-in;
    background-color: var(--white-d);
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }

  65%,
  70% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }

  80%,
  85% {
    animation-timing-function: ease-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }
}

@keyframes pg4 {

  from,
  20%,
  80%,
  to {
    animation-timing-function: ease-in;
    background-color: var(--white-d);
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }

  25%,
  30% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }

  40%,
  45% {
    animation-timing-function: ease-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }

  50% {
    animation-timing-function: ease-in;
    background-color: var(--white-d);
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }

  55%,
  60% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }

  70%,
  75% {
    animation-timing-function: ease-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }
}

@keyframes pg5 {

  from,
  30%,
  70%,
  to {
    animation-timing-function: ease-in;
    background-color: var(--white-d);
    transform: translate3d(0, 0, 1px) rotateY(0);
  }

  35%,
  40% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0deg);
  }

  50% {
    animation-timing-function: ease-in-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(179.6deg);
  }

  60%,
  65% {
    animation-timing-function: ease-out;
    background-color: var(--white);
    transform: translate3d(0, 0, 1px) rotateY(0);
  }
}
</style>