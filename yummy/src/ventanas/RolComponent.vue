<template>
  <div>
    <HeaderAdminTitle
      icon="fas fa-user-tag"
      title="Rol"
      subtitle="Visualiza la Matriz de Roles"
    />
    <ConfirmationModal
      v-if="modalVisible"
      :mensaje="`¿Seguro que desea eliminar el Rol ${rolAEliminar.rol}?`"
      @onCancel="cerrarModal"
      @onConfirm="eliminarRol"
    />

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>IdRol</th>
            <th>Rol</th>
            <th>Asignacion de Roles</th>
            <th>Dashboard</th>
            <th>Ofertas</th>
            <th>Usuario</th>
            <th>Platillos</th>
            <th>Pedidos</th>
            <th>Reservas</th>
            <th>Mapa Interactivo</th>
            <th>Oferta Cliente</th>
            <th>Pedido Cliente</th>
            <th>Mapa Cliente</th>
            <th>Menu Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rol, index) in roles" :key="rol.idrol">
            <td>{{ rol.idrol }}</td>
            <td v-if="index === filaEnEdicion">
              <input v-model="rolEditado.rol" />
            </td>
            <td v-else>{{ rol.rol }}</td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.asignacionroles" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.asignacionroles ? 'fa-check' : 'fa-times',
                  rol.asignacionroles ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.dashboard" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.dashboard ? 'fa-check' : 'fa-times',
                  rol.dashboard ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.ofertas" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.ofertas ? 'fa-check' : 'fa-times',
                  rol.ofertas ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.usuarios" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.usuarios ? 'fa-check' : 'fa-times',
                  rol.usuarios ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.platillos" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.platillos ? 'fa-check' : 'fa-times',
                  rol.platillos ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.pedidos" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.pedidos ? 'fa-check' : 'fa-times',
                  rol.pedidos ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.reservas" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.reservas ? 'fa-check' : 'fa-times',
                  rol.reservas ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.mapainteractivo" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.mapainteractivo ? 'fa-check' : 'fa-times',
                  rol.mapainteractivo ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.ofertacliente" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.ofertacliente ? 'fa-check' : 'fa-times',
                  rol.ofertacliente ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.pedidocliente" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.pedidocliente ? 'fa-check' : 'fa-times',
                  rol.pedidocliente ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.mapacliente" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.mapacliente ? 'fa-check' : 'fa-times',
                  rol.mapacliente ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.menucliente" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.menucliente ? 'fa-check' : 'fa-times',
                  rol.menucliente ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td class="botones">
              <button
                v-if="index !== filaEnEdicion"
                class="action-button edit-button"
                @click="seleccionarRolParaEditar(index, rol)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                v-if="index !== filaEnEdicion"
                class="action-button delete-button"
                @click="mostrarModalEliminar(rol)"
              >
                <i class="fas fa-trash"></i>
              </button>
              <button
                v-if="index === filaEnEdicion"
                class="action-button button-save"
                @click="guardarCambios"
              >
                <i class="fa-solid fa-floppy-disk"></i>
              </button>
              <button
                v-if="index === filaEnEdicion"
                class="action-button button-cancel"
                @click="cancelarCambios"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <FormNewRol @rol-creado="addRol" />
    </div>

    <SuccessModal
      v-if="successModalVisible"
      :mensaje="successMensaje"
      @onClose="closeSuccessModal"
    />
  </div>
</template>

<script>
import axios from "axios";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import FormNewRol from "@/components/FormNewRol.vue";
import SuccessModal from "@/components/SuccessModal.vue";
import HeaderAdminTitle from "@/components/HeaderAdminTitle.vue";

export default {
  name: "RolesTable",
  components: {
    FormNewRol,
    ConfirmationModal,
    SuccessModal,
    HeaderAdminTitle,
  },
  data() {
    return {
      roles: [],
      filaEnEdicion: null,
      rolEditado: {},
      rolAEliminar: {},
      modalVisible: false,
      successModalVisible: false,
      successMensaje: "",
    };
  },
  mounted() {
    this.obtenerRoles();
  },
  methods: {
    async obtenerRoles() {
      try {
        const response = await axios.get("http://localhost:5000/api/rol");
        this.roles = response.data;
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    },
    addRol(nuevoRol) {
      this.roles.push(nuevoRol);
      this.mostrarSuccessModal("Rol agregado correctamente");
    },
    seleccionarRolParaEditar(index, rol) {
      this.filaEnEdicion = index;
      this.rolEditado = { ...rol };
    },
    async guardarCambios() {
      try {
        await axios.put(
          `http://localhost:5000/api/rol/${this.rolEditado.idrol}`,
          this.rolEditado
        );
        this.roles.splice(this.filaEnEdicion, 1, { ...this.rolEditado });
        this.filaEnEdicion = null;
        this.mostrarSuccessModal("Rol actualizado correctamente");
      } catch (error) {
        console.error("Error al guardar cambios:", error);
        this.mostrarSuccessModal("Error al actualizar el rol");
      }
    },
    cancelarCambios() {
      this.filaEnEdicion = null;
      this.rolEditado = {};
    },
    mostrarModalEliminar(rol) {
      this.rolAEliminar = rol;
      this.modalVisible = true;
    },
    cerrarModal() {
      this.modalVisible = false;
    },
    async eliminarRol() {
      try {
        await axios.delete(
          `http://localhost:5000/api/rol/${this.rolAEliminar.idrol}`
        );
        this.roles = this.roles.filter(
          (r) => r.idrol !== this.rolAEliminar.idrol
        );
        this.cerrarModal();
        this.mostrarSuccessModal("Rol eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
        this.mostrarSuccessModal("Error al eliminar el rol");
      }
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
.table-container {
  overflow-x: auto;
  margin: 20px 0;
}

.table {
  margin-left: 5px;
  width: 96%;
  table-layout: fixed;
}

.table th {
  background-color: #fffda4;
  color: #322209;
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: normal;
  max-width: 120px; 
}

.table td {
  text-align: center;
  padding: 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-width: 120px; 
}

.true-icon {
  color: #4caf50;
}

.false-icon {
  color: #f44336;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  margin: 5px;
}

.edit-button {
  color: #4caf50;
}

.delete-button {
  color: #f44336;
}

.button-save {
  color: #2f0cf5;
}

.button-cancel {
  color: #f44336;
}
</style>
