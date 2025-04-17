import axios from 'axios';
import { RutaApi } from '@/api/localApi';
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null, // Puedes almacenar más información del usuario si es necesario
    loading: false,
    rol: null,
    id: null,
    error: null,
  }),
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      console.log(credentials);
      try {
        // Realizar la solicitud POST con datos en formato JSON
        const response = await axios.post(
          `${RutaApi.baseURL}auth/login`,
          credentials,
          {
            headers: {
              'Content-Type': 'application/json' // Asegura que se envíen los datos como JSON
            }
          }
        );

        if (response.status === 200) {
          // Extrae el token del response
          const { token } = response.data;
          // Decodificar el token para obtener el rol
          const decodedToken = jwtDecode(token);
          const { rol } = decodedToken;
          const { id } = decodedToken;

          // Almacenar el token en el estado y en localStorage
          this.token = token;
          this.rol = rol;
          this.id = id;
          // Almacenar el token en localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('rol', rol);
          localStorage.setItem('id', id);
          console.log("Token almacenado:", localStorage.getItem('token'));

          console.log('Inicio de sesión exitoso');

          return true;
        } else {
          this.error = 'Error en el inicio de sesión';
          console.error('Error en el inicio de sesión, código de estado:', response.status);
          return false;
        }
      } catch (error) {
        // Maneja el error de la solicitud
        this.error = error.response?.data?.message || 'Error en la solicitud de inicio de sesión';
        console.error('Error en la solicitud de inicio de sesión:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async crearActividad(usuario, estado) {
      if (!usuario || !estado) {
        console.error('Usuario y estado son obligatorios');
        return false;
      }

      try {
        const response = await axios.post(`${RutaApi.baseURL}actividad/`, {
          usuario: usuario,
          estado: estado,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 201) {
          console.log('Actividad creada exitosamente:', response.data);
          return response.data; // Devuelve los datos de la actividad creada
        } else {
          console.error('Error al crear la actividad');
          return false;
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
        return false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      console.log('Sesión cerrada');
    },
    // Opcional: Método para verificar el token al iniciar la aplicación
    async verifyToken() {
      if (!this.token) return false;
      try {
        const response = await axios.get(`${RutaApi.baseURL}auth/verify`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
        if (response.status === 200) {
          this.user = response.data.user;
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        this.logout();
        return false;
      }
    },
  },
});