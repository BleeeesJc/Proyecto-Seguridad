<template>
    <div class="login-container">
      <div class="login-card">
        <h2 class="title">Bienvenido</h2>
        <form @submit.prevent="changePassword">
          <label for="password">Nueva contraseña:</label>
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
  
          <p class="signup-text">¿Ya tienes una cuenta? <router-link to="/iniciarsesion">Inicia sesión aquí</router-link></p>
  
          <button type="submit" class="login-button">Listo</button>
        </form>
  
        <!-- Modal para ingresar el código de verificación -->
        <div v-if="showVerificationModal" class="modal">
          <div class="modal-content">
            <h3>Verifica tu correo</h3>
            <p>Ingresa el código que enviamos a {{ email }}.</p>
            <input type="text" v-model="verificationCode" placeholder="Código de verificación" />
            <button @click="verifyCode" class="login-button">Verificar</button>
            <button @click="closeModal" class="cancel-button">Cancelar</button>
          </div>
        </div>
  
        <!-- Modal de error -->
        <div v-if="showErrorModal" class="modal">
          <div class="modal-content">
            <h3>Error en el registro</h3>
            <p>{{ errorMessage }}</p>
            <button @click="closeModal" class="cancel-button">Intentar de nuevo</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'RegistroUsuario',
  data() {
    return {
      password: '',
      showPassword: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async changePassword() {
        // Modificamos la expresión regular para que requiera mayúsculas, caracteres especiales y números
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!passwordRegex.test(this.password)) {
            // Mostrar un SweetAlert si la contraseña no cumple los requisitos
            Swal.fire({
            icon: 'error',
            title: 'Contraseña inválida',
            text: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.',
            });
            return;
        }

        try {
            const userId = this.$route.params.id; // Obtener el ID del usuario desde los parámetros de la URL
            const response = await axios.put(`/api/usuario/actualizar-contrasena/${userId}`, {
            newPassword: this.password,
            });

            if (response.data.message) {
            // Contraseña actualizada correctamente
            Swal.fire({
                icon: 'success',
                title: '¡Contraseña actualizada!',
                text: 'Tu contraseña ha sido cambiada con éxito.',
            });
            this.$router.push('/iniciarsesion'); // Redirige al login si la contraseña se actualiza correctamente
            }
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar la contraseña.',
            });
        }
        },

  },
};
</script>
  
  <style scoped>
  /* Estilos del modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 4px;
    width: 300px;
    text-align: center;
  }
  
  .cancel-button {
    background-color: #ccc;
    color: #333;
    padding: 0.75rem;
    margin-top: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-button:hover {
    background-color: #aaa;
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
  .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #FFFEDC; /* Color de fondo */
      }
      
      .login-card {
        width: 65%;
        padding: 2rem;
        background: white;
        border-radius: 3vh;
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
        border-radius: 1.5vh;
        cursor: pointer;
        font-weight: bold;
      }
      
      .login-button:hover {
        background-color: #A16F23; /* Color marrón más oscuro */
      }
  </style>
  