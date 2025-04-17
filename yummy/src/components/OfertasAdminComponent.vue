<template>
  <div>
    <h2>Ofertas</h2>
    <div class="table-container">
      <table class="offers-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Requisito</th>
            <th>Descripcion</th>
            <th>Descuento</th>
            <th>Fecha Inicio</th>
            <th>Fecha Expiracion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(oferta, index) in ofertas" :key="index">
            <td>{{ oferta.idoferta }}</td>
            <td>{{ oferta.requerimiento }}</td>
            <td>{{ oferta.descripcion }}</td>
            <td>{{ oferta.descuento }}%</td>
            <td>{{ oferta.fecha_inicio }}</td>
            <td>{{ oferta.fecha_fin }}</td>
            <td>
              <button class="action-button edit-button"><i class="fas fa-edit"></i></button>
              <button class="action-button delete-button"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2>Agregar Oferta</h2>
    
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "OfertasAdminComponent",
  data() {
    return {
      ofertas: [],
    };
  },
  mounted() {
    this.obtenerOfertas();
  },
  methods: {
    async obtenerOfertas() {
      try {
        const response = await axios.get('http://localhost:5000/api/ofertas');
        const data = response.data;

        this.ofertas = Array.isArray(data) ? data : [data];
      } catch (error) {
        console.error("Error al obtener las ofertas:", error);
        if (error.response) {
          console.error("Error en la respuesta:", error.response);
        } else if (error.request) {
          console.error("No se recibió respuesta del servidor:", error.request);
        } else {
          console.error("Error al configurar la solicitud:", error.message);
        }
      }
    }
  }
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.offers-table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

.offers-table th, .offers-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.offers-table th {
  background-color: #f2f2f2;
  color: #333;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 5px;
}

.edit-button {
  color: #4caf50;
}

.delete-button {
  color: #f44336;
}
</style>
