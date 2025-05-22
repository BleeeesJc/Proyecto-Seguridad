<template>
  <div>
    <HeaderAdminTitle 
      icon="fas fa-clipboard-list" 
      title="Logs" 
      subtitle="Visualiza los registros de actividad" 
    />

    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>IdLog</th>
            <th>Acción</th>
            <th>Medio</th>
            <th>Fecha</th>
            <th>Origen</th>
            <th>IdUsuario</th>
            <th>Código</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.idlog">
            <td>{{ log.idlog }}</td>
            <td>{{ log.accion }}</td>
            <td>{{ log.medio }}</td>
            <td>{{ formatFecha(log.fecha) }}</td>
            <td>{{ log.origen }}</td>
            <td>{{ log.idusuario }}</td>
            <td>{{ log.codigo }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <SuccessModal 
      v-if="successModalVisible" 
      :mensaje="successMensaje" 
      @onClose="successModalVisible = false" 
    />
  </div>
</template>

<script>
import axios from 'axios';
import HeaderAdminTitle from '@/components/HeaderAdminTitle.vue';
import SuccessModal from '@/components/SuccessModal.vue';
import { format } from 'date-fns';

export default {
  name: 'LogsTable',
  components: {
    HeaderAdminTitle,
    SuccessModal,
  },
  data() {
    return {
      logs: [],
      successModalVisible: false,
      successMensaje: '',
    };
  },
  mounted() {
    this.obtenerLogs();
  },
  methods: {
    async obtenerLogs() {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          'http://localhost:5000/api/log',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        this.logs = data;
      } catch (error) {
        console.error('Error al obtener los logs:', error);
        this.successMensaje = 'Error al cargar los registros';
        this.successModalVisible = true;
      }
    },
    formatFecha(fecha) {
      return format(new Date(fecha), 'dd/MM/yyyy HH:mm:ss');
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
  width: 100%;
  table-layout: fixed;
}

.table th, .table td {
  text-align: center;
  padding: 8px;
  border: 1px solid #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table th {
  background-color: #f0f0f0;
  color: #333;
}

.table tbody tr:nth-child(even) {
  background-color: #fafafa;
}
</style>
