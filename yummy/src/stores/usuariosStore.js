import axios from "axios";
import { RutaApi } from "@/api/localApi";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null,
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
        const response = await axios.post(
          `${RutaApi.baseURL}auth/login`,
          credentials,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          const usuario = response.data;

          localStorage.setItem("usuario", JSON.stringify(usuario));
          localStorage.setItem("token", usuario.token);

          this.token = usuario.token;
          this.user = usuario;
          this.rol = usuario.rol?.rol || null;
          this.id = usuario.idusuario;
          return true;
        } else {
          this.error = "Error en el inicio de sesión";
          return false;
        }
      } catch (error) {
        this.error =
          error.response?.data?.message ||
          "Error en la solicitud de inicio de sesión";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async crearActividad(usuario, estado) {
      if (!usuario || !estado) {
        return false;
      }

      try {
        const response = await axios.post(
          `${RutaApi.baseURL}actividad/`,
          { usuario, estado },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 201) {

          return response.data;
        } else {

          return false;
        }
      } catch (error) {

        return false;
      }
    },

    logout() {
      axios
        .post(`http://localhost:5000/api/log/`, {
          accion: `Usuario ${this.id} cerró sesión`,
          medio: "auth",
          fecha: new Date(),
          origen: "usuario",
          idusuario: this.id,
          codigo: 200,
        })
        .catch(() => {});

      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    },

    async verifyToken() {
      if (!this.token) {
        return false;
      }

      try {
        const response = await axios.get(`${RutaApi.baseURL}auth/verify`, {
          headers: { Authorization: `Bearer ${this.token}` },
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
