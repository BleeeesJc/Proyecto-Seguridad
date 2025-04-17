<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">Bienvenido</h2>
      <form @submit.prevent="handleSubmit">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" v-model="email" required placeholder="Ingresa tu correo" />

        <label for="password">Contraseña:</label>
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            required
            placeholder="Ingresa tu contraseña"
          />
          <span @click="togglePasswordVisibility" class="toggle-password">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>

        <p class="signup-text">¿No tienes una cuenta? <router-link to="/registro">Regístrate aquí</router-link></p>
        <p class="signup-text"><router-link to="/recupera">¿Olvidaste tu contraseña?</router-link></p>

        <button type="submit" class="login-button">Listo</button>
      </form>
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
    };
  },
  computed: {
    loading() {
      return this.store.loading; // Usamos el estado de loading del store
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    async handleSubmit() {
      const credentials = {
        correo: this.email,
        password: this.password,
      };

      // Usamos el método login del store
      const success = await this.store.login(credentials);
      let estadoActividad;

      if (success) {
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
        // Incrementa el contador de intentos fallidos
        this.loginAttempts++;
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

  
  <style scoped>
  
  
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #FFFEDC; /* Color de fondo */
  }
  
  .login-card {
    width: 320px;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .title {
    color: #FE9900; /* Color naranja */
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
    color: #FE9900; /* Color naranja */
    text-decoration: none;
  }
  
  .signup-text a:hover {
    text-decoration: underline;
  }
  
  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #A16F23; /* Color marrón */
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .login-button:hover {
    background-color: #A16F23; /* Color marrón más oscuro */
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
  </style>
  
