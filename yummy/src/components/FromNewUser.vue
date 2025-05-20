<template>
  <div class="form-container">
    <h2>Agregar Usuario</h2>
    <form @submit.prevent="crearUsuario" class="modern-form">
      <div class="form-group">
        <label for="nombre"> <i class="fas fa-user"></i> Nombre </label>
        <input
          v-model="nuevoUsuario.nombre"
          id="nombre"
          type="text"
          placeholder="Nombre"
          required
        />
      </div>

      <div class="form-group">
        <label for="apellidos">
          <i class="fas fa-user-friends"></i> Apellidos
        </label>
        <input
          v-model="nuevoUsuario.apellidos"
          id="apellidos"
          type="text"
          placeholder="Apellidos"
          required
        />
      </div>

      <div class="form-group">
        <label for="correo"> <i class="fas fa-envelope"></i> Correo </label>
        <input
          v-model="nuevoUsuario.correo"
          id="correo"
          type="email"
          placeholder="Correo electrónico"
          required
        />
      </div>

      <div class="form-group">
        <label for="password"> <i class="fas fa-lock"></i> Contraseña </label>
        <div class="password-wrapper">
          <input
            :type="mostrarPassword ? 'text' : 'password'"
            v-model="nuevoUsuario.password"
            id="password"
            placeholder="Contraseña"
            required
          />
          <span
            class="toggle-password"
            @click="mostrarPassword = !mostrarPassword"
          >
            <i :class="mostrarPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="rol"> <i class="fas fa-user-tag"></i> Rol </label>
        <select v-model="nuevoUsuario.idrol" id="rol" required>
          <option v-for="rol in roles" :key="rol.idrol" :value="rol.idrol">
            {{ rol.rol }}
          </option>
        </select>
      </div>

      <button type="submit" class="submit-button">Crear Usuario</button>
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
  name: "FormNewUsuario",
  components: { SuccessModal },
  data() {
    return {
      roles: [],
      nuevoUsuario: {
        nombre: "",
        apellidos: "",
        correo: "",
        password: "yummy.2025@",
        activo: null,
        idrol: null,
      },
      successModalVisible: false,
      successMensaje: "",
      mostrarPassword: false,
    };
  },
  watch: {
    "nuevoUsuario.nombre": "actualizarCorreo",
    "nuevoUsuario.apellidos": "actualizarCorreo",
  },
  methods: {
    actualizarCorreo() {
      const nombre = this.nuevoUsuario.nombre
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
      const apellidos = this.nuevoUsuario.apellidos
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");
      if (nombre && apellidos) {
        this.nuevoUsuario.correo = `${nombre}.${apellidos}@ucb.edu.bo`;
      } else {
        this.nuevoUsuario.correo = "";
      }
    },
    async crearUsuario() {
      try {
        const payload = {
          nombre: this.nuevoUsuario.nombre,
          apellidos: this.nuevoUsuario.apellidos,
          email: this.nuevoUsuario.correo,
          password: this.nuevoUsuario.password,
          activo: this.nuevoUsuario.activo,
          idrol: this.nuevoUsuario.idrol,
        };

        const res = await axios.post(
          "http://localhost:5000/api/usuario/registrar",
          payload
        );

        this.mostrarSuccessModal("Usuario creado correctamente");
        this.resetForm();
        this.$emit("usuario-creado", res.data);
      } catch (error) {
        console.error("Error al crear usuario:", error.response?.data || error);
        this.mostrarSuccessModal("Error al crear el usuario");
      }
    },
    resetForm() {
      this.nuevoUsuario = {
        nombre: "",
        apellidos: "",
        correo: "",
        password: "yummy.2025@",
        activo: null,
        idrol: this.nuevoUsuario.idrol,
      };
      this.mostrarPassword = false;
    },
    mostrarSuccessModal(mensaje) {
      this.successMensaje = mensaje;
      this.successModalVisible = true;
    },
    closeSuccessModal() {
      this.successModalVisible = false;
    },
  },
  async mounted() {
    try {
      const res = await axios.get("http://localhost:5000/api/rol");
      this.roles = res.data; // guardamos lista completa
      // opcional: seleccionamos el primer rol como valor por defecto
      if (this.roles.length) {
        this.nuevoUsuario.idrol = this.roles[0].idrol;
      }
    } catch (error) {
      console.error("No se pudo cargar la lista de roles:", error);
    }
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

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
}

input:focus {
  border-color: #fe9900;
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

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
  padding-right: 40px;
}

.toggle-password {
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #999;
  font-size: 1.1rem;
}

.form-group select {
  width: 100%;
  padding: 10px;               
  border: 1px solid #ddd;      
  border-radius: 4px;          
  font-size: 1rem;            
  background-color: #fff;      
  appearance: none;            
  -moz-appearance: none;       
  outline: none;               
  transition: border-color 0.3s;
}

.form-group select {
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='12' height='7' viewBox='0 0 12 7' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='2' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px 7px;
  padding-right: 40px;         
}

.form-group select:focus {
  border-color: #fe9900;       
  box-shadow: 0 0 5px rgba(254,153,0,0.5);
}
</style>
