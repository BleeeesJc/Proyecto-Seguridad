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
      // 1) Si no hay valor, devolvemos vacío o 'N/A'
      if (!fecha) return '';

      // 2) Parseamos según tipo
      const date = typeof fecha === 'string'
        ? parseISO(fecha)
        : new Date(fecha);

      // 3) Validamos
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
.table-container {
  overflow-x: auto;
  margin: 20px 0;
}

.table {
  width: 100%;
  table-layout: fixed; /* columnas de ancho fijo */
}

.table th,
.table td {
  padding: 8px;
  border: 1px solid #ddd;
  white-space: normal;     /* permitir saltos de línea */
  word-wrap: break-word;   /* romper palabras largas */
  word-break: break-word;  /* compatibilidad */
  text-align: center;      /* ¡centrar texto! */
  vertical-align: middle;  /* centrar verticalmente si hay varias líneas */
}

.table th {
  background-color: #f0f0f0;
  color: #333;
}

.table tbody tr:nth-child(even) {
  background-color: #fafafa;
}
</style>
