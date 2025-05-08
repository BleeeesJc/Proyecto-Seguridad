<template>
  <div class="form-container">
    <h2>Agregar Rol</h2>
    <form @submit.prevent="crearRol" class="modern-form">
      <div class="form-group">
        <label for="rol">
          <i class="fas fa-user-tag"></i> Nombre del rol
        </label>
        <input
          v-model="nuevoRol.rol"
          id="rol"
          type="text"
          placeholder="Nombre del rol"
          required
        />
      </div>
      <div class="form-row">
        <div class="form-group" v-for="permiso in permisos" :key="permiso.key">
          <label>
            <input type="checkbox" v-model="nuevoRol[permiso.key]" />
            {{ permiso.label }}
          </label>
        </div>
      </div>

      <button type="submit" class="submit-button">Crear Rol</button>
    </form>

    <SuccessModal
      v-if="successModalVisible"
      :mensaje="successMensaje"
      @onClose="closeSuccessModal"
    />
  </div>
</template>

<script>
import axios from "axios";
import SuccessModal from "./SuccessModal.vue";

export default {
  name: "FormNewRol",
  components: { SuccessModal },
  data() {
    return {
      nuevoRol: {
        rol: "",
        asignacionroles: false,
        dashboard: false,
        ofertas: false,
        usuarios: false,
        platillos: false,
        pedidos: false,
        reservas: false,
        mapainteractivo: false,
        ofertacliente: false,
        pedidocliente: false,
        mapacliente: false,
        menucliente: false,
      },
      permisos: [
        { key: "asignacionroles", label: "Asignación de Roles" },
        { key: "dashboard", label: "Dashboard" },
        { key: "mapacliente", label: "Mapa Interactivo Cliente" },
        { key: "mapainteractivo", label: "Mapa Interactivo" },
        { key: "menucliente", label: "Menú Cliente" },
        { key: "pedidocliente", label: "Reservas Cliente" },
        { key: "ofertacliente", label: "Oferta Cliente" },
        { key: "ofertas", label: "Ofertas" },
        { key: "pedidos", label: "Pedidos" },
        { key: "platillos", label: "Platillos" },
        { key: "reservas", label: "Reservas" },
        { key: "usuarios", label: "Usuarios" },
      ],
      successModalVisible: false,
      successMensaje: "",
    };
  },
  methods: {
    async crearRol() {
      const nombreRaw = this.nuevoRol.rol;
      const nombre = typeof nombreRaw === "string" ? nombreRaw.trim() : "";
      if (!nombre) {
        alert("El nombre del rol es obligatorio.");
        return;
      }
      this.nuevoRol.rol = nombre;

      try {
        const response = await axios.post(
          "http://localhost:5000/api/rol",
          this.nuevoRol
        );
        this.$emit("rol-creado", response.data);
        this.mostrarSuccessModal("Rol creado correctamente");
        this.resetForm();
      } catch (error) {
        console.error("Error al crear rol:", error.response?.data || error);
        this.mostrarSuccessModal("Error al crear el rol");
      }
    },
    resetForm() {
      Object.keys(this.nuevoRol).forEach((key) => {
        this.nuevoRol[key] =
          typeof this.nuevoRol[key] === "boolean" ? false : "";
      });
    },
    mostrarSuccessModal(mensaje) {
      this.successMensaje = mensaje;
      this.successModalVisible = true;
    },
    closeSuccessModal() {
      this.successModalVisible = false;
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.modern-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
}

input[type="checkbox"] {
  transform: scale(1.2);
  margin-right: 6px;
}

input:focus {
  border-color: #fe9900;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.form-row .form-group {
  flex: 1 1 45%;
}

.submit-button {
  background-color: #fe9900;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #e08b00;
}
</style>