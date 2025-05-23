<template>
  <div>
    <HeaderAdminTitle 
      icon="fas fa-clipboard-list" 
      title="Logs" 
      subtitle="Visualiza los registros de actividad" 
    />

    <!-- Filtros -->
    <div class="filters">
      <label>
        Origen:
        <select v-model="filterOrigen">
          <option value="">Todos</option>
          <option value="usuario">Usuario</option>
          <option value="sistema">Sistema</option>
        </select>
      </label>
      <label>
        Código:
        <input type="number" v-model="filterCodigo" placeholder="e.g. 200" />
      </label>
      <button @click="obtenerLogs">Aplicar filtros</button>
      <button @click="resetFiltros">Limpiar filtros</button>
    </div>

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
            <td>{{ formatFecha(log.fecha) || '–' }}</td>
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
import { format, parseISO, isValid } from 'date-fns';

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
      // filtros
      filterOrigen: '',
      filterCodigo: '',
    };
  },
  mounted() {
    this.obtenerLogs();
  },
  methods: {
    async obtenerLogs() {
      try {
        const token = localStorage.getItem('token');
        const params = {};
        if (this.filterOrigen) params.origen = this.filterOrigen;
        if (this.filterCodigo) params.codigo = this.filterCodigo;

        const { data } = await axios.get(
          'http://localhost:5000/api/log',
          { 
            headers: { Authorization: `Bearer ${token}` },
            params,
          }
        );
        this.logs = data;
      } catch (error) {
        console.error('Error al obtener los logs:', error);
        this.successMensaje = 'Error al cargar los registros';
        this.successModalVisible = true;
      }
    },
    resetFiltros() {
      this.filterOrigen = '';
      this.filterCodigo = '';
      this.obtenerLogs();
    },
    formatFecha(fecha) {
      if (!fecha) return '';
      const date = typeof fecha === 'string'
        ? parseISO(fecha)
        : new Date(fecha);
      if (!isValid(date)) {
        console.warn('Fecha inválida en log:', fecha);
        return '';
      }

      return format(date, 'dd/MM/yyyy HH:mm:ss');
    },
  },
};
</script>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  align-items: center;
}

.filters label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
}

.filters button {
  padding: 6px 12px;
  border: none;
  background-color: #3490dc;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.filters button:hover {
  background-color: #2779bd;
}

.table-container {
  overflow-x: auto;
  margin: 20px 0;
}

.table {
  width: 100%;
  table-layout: fixed; 
}

.table th,
.table td {
  padding: 8px;
  border: 1px solid #ddd;
  white-space: normal;     
  word-wrap: break-word;   
  word-break: break-word;  
  text-align: center;      
  vertical-align: middle;  
}

.table th {
  background-color: #f0f0f0;
  color: #333;
}

.table tbody tr:nth-child(even) {
  background-color: #fafafa;
}
</style>
