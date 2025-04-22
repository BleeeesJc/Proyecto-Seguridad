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
      try {
        const response = await axios.post(`${RutaApi.baseURL}auth/login`, credentials, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
    
        if (response.status === 200) {
          const usuario = response.data; // Incluye token, idusuario, rol con permisos, etc.
    
          // Guardar en localStorage todo el usuario
          localStorage.setItem('usuario', JSON.stringify(usuario));
          localStorage.setItem('token', usuario.token);
    
          // Actualizar el store
          this.token = usuario.token;
          this.user = usuario;
          this.rol = usuario.rol?.rol || null; // Solo el nombre del rol
          this.id = usuario.idusuario;
    
          console.log("Usuario autenticado:", usuario);
          return true;
        } else {
          this.error = 'Error en el inicio de sesión';
          return false;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error en la solicitud de inicio de sesión';
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