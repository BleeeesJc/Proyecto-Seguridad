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
            <th>Pagos</th>
            <th>Reservas</th>
            <th>Menu</th>
            <th>Ofertas</th>
            <th>Usuarios</th>
            <th>Platillos</th>
            <th>Mesas</th>
            <th>Administrador</th>
            <th>Roles</th>
            <th>Reportes</th>
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
              <input type="checkbox" v-model="rolEditado.pagos" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.pagos ? 'fa-check' : 'fa-times',
                  rol.pagos ? 'true-icon' : 'false-icon',
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
              <input type="checkbox" v-model="rolEditado.menu" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.menu ? 'fa-check' : 'fa-times',
                  rol.menu ? 'true-icon' : 'false-icon',
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
              <input type="checkbox" v-model="rolEditado.mesas" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.mesas ? 'fa-check' : 'fa-times',
                  rol.mesas ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.paneladmin" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.paneladmin ? 'fa-check' : 'fa-times',
                  rol.paneladmin ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.roles" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.roles ? 'fa-check' : 'fa-times',
                  rol.roles ? 'true-icon' : 'false-icon',
                ]"
              />
            </td>
            <td v-if="index === filaEnEdicion">
              <input type="checkbox" v-model="rolEditado.reportes" />
            </td>
            <td v-else>
              <i
                :class="[
                  'fas',
                  rol.reportes ? 'fa-check' : 'fa-times',
                  rol.reportes ? 'true-icon' : 'false-icon',
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
  white-space: nowrap;
}

.table td {
  text-align: center;
  padding: 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
