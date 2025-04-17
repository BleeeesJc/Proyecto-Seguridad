<template>
    <div>
        <!--<HeaderAdminTitle 
        icon="fa fa-cutlery" 
        title="Platillos" 
        subtitle="Visualiza los platillos que ofrese tu restaurante"
      />-->
      <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>IdRol</th>
            <th>Rol</th>
            <th>Pagos</th>
            <th>Pedidos</th>
            <th>Reservas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rol, index) in roles" :key="rol.idrol">
            <td>{{ rol.idrol }}</td>
            <td>{{ rol.rol }}</td>
            <td>
              <i :class="['fas', rol.pagos ? 'fa-check' : 'fa-times', rol.pagos ? 'true-icon' : 'false-icon']"></i>
            </td>
            <td>
              <i :class="['fas', rol.pedidos ? 'fa-check' : 'fa-times', rol.pedidos ? 'true-icon' : 'false-icon']"></i>
            </td>
            <td>
              <i :class="['fas', rol.reservas ? 'fa-check' : 'fa-times', rol.reservas ? 'true-icon' : 'false-icon']"></i>
            </td>
            <td class="botones">
              <button class="action-button edit-button" @click="editarRol(index)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-button delete-button" @click="eliminarRol(index)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RolesTable',
  data() {
    return {
      roles: [
        { idrol: 1, rol: 'Administrador', pagos: true,  pedidos: true,  reservas: true  },
        { idrol: 2, rol: 'Camarero',      pagos: false, pedidos: true,  reservas: true  },
        { idrol: 3, rol: 'Cocinero',      pagos: false, pedidos: true,  reservas: false },
        { idrol: 4, rol: 'Cliente',       pagos: true,  pedidos: true,  reservas: false }
      ]
    }
  },
}
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  margin: 20px 0;
}

.table {
  margin-left: 10px;
  width: 90%;
  table-layout: fixed;
}

.table th {
  background-color: #FFFDA4;
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
</style>