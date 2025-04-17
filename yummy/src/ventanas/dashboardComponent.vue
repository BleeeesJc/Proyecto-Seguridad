<template>
  <div>
    <header class="dashboard-header">
      <h1>
        <i class="fas fa-chart-line"></i>
        Dashboard
      </h1>
      <p>Visualiza las métricas clave de tu negocio</p>
    </header>
    <div>
      <label for="month-filter">Filtrar por mes: </label>
      <select id="month-filter" v-model="selectedMonth" @change="fetchAllData">
        <option value="00">General</option>
        <option value="01">Enero</option>
        <option value="02">Febrero</option>
        <option value="03">Marzo</option>
        <option value="04">Abril</option>
        <option value="05">Mayo</option>
        <option value="06">Junio</option>
        <option value="07">Julio</option>
        <option value="08">Agosto</option>
        <option value="09">Septiembre</option>
        <option value="10">Octubre</option>
        <option value="11">Noviembre</option>
        <option value="12">Diciembre</option>
      </select>
    </div>

    <!-- Contenedores principales -->
    <div class="first-data-container">
      <div class="info-card cantidad-container">
        <i class="fas fa-shopping-cart"></i>
        <h2>Pedidos Realizados</h2>
        <p>{{ totalPedidos }}</p>
      </div>
      <div class="info-card ingresos-container">
        <i class="fas fa-dollar-sign"></i>
        <h2>Ingresos Totales</h2>
        <p>{{ ingresosTotales }} Bs</p>
      </div>
      <div class="info-card resenia-container">
        <i class="fas fa-star"></i>
        <h2>Calificación Promedio</h2>
        <p>{{ calificacionPromedio }} ★</p>
      </div>
    </div>

    <!-- Contenedor para los gráficos -->
    <div class="charts-container">
      <LineChartDia :data="dataG1" :chart-title="`Ingresos Totales por Día en ${getMonthName()}`" />
      <BarChartMes :data="dataG2" chart-title="Ingresos Totales por Mes" />
      <RadarChartConsumo :data="dataG3" :chart-title="`Consumo por Horas en ${getMonthName()}`" />
      <PieChartProductos :data="dataG4" :chart-title="`Productos mas vendidos en ${getMonthName()}`" />
      <BarChartResenia :data="dataG5" :chart-title="`Reseñas por Platillos en ${getMonthName()}`" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LineChartDia from '../components/graficos/LineChartVentas.vue';
import BarChartMes from '../components/graficos/BarChartVentasMes.vue';
import RadarChartConsumo from '../components/graficos/RadarChartConsumo.vue';
import PieChartProductos from '../components/graficos/PieChartProductos.vue';
import BarChartResenia from '../components/graficos/BarChartResenia.vue';

export default {
  components: {
    LineChartDia,
    BarChartMes,
    RadarChartConsumo,
    PieChartProductos,
    BarChartResenia,
  },
  data() {
    return {
      selectedMonth: '00',
      dataG0: [],
      dataG1: [],
      dataG2: [],
      dataG3: [],
      dataG4: [],
      dataG5: [],
      totalPedidos: 0,
      ingresosTotales: 0,
      calificacionPromedio: 0,
    };
  },
  mounted() {
    this.fetchIngresosPorDia(); // Vuelve a cargar los datos al entrar
    this.fetchIngresosPorMes();
    this.fetchConsumoPorHoras();
    this.fetchProductosMasVendidos();
    this.fetchReseniaPorPlatos();
    this.fetchnumeros();
  },
  methods: {
    async fetchnumeros() {
      try {
        const response1 = await axios.get('http://localhost:5000/api/dashboard/total-pedidos', {
          params: { month: this.selectedMonth },
        });

        const response2 = await axios.get('http://localhost:5000/api/dashboard/ingresos-totales', {
          params: { month: this.selectedMonth },
        });

        const response3 = await axios.get('http://localhost:5000/api/dashboard/calificacion-promedio', {
          params: { month: this.selectedMonth },
        });

        this.totalPedidos = response1.data[0]?.total_pedidos || 0;
        this.ingresosTotales = response2.data[0]?.ingresos_totales || 0;
        this.calificacionPromedio = response3.data[0]?.promedio_calificacion || 0;

      } catch (error) {
        console.error('Error al obtener los ingresos por día:', error);
      }
    },

    getMonthName() {
      const monthNames = [
        "General",
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ];
      const monthIndex = parseInt(this.selectedMonth, 10);
      return monthNames[monthIndex] || "General";
    },
    async fetchAllData() {
      await this.fetchIngresosPorDia();
      await this.fetchnumeros();
      await this.fetchConsumoPorHoras();
      await this.fetchProductosMasVendidos();
      await this.fetchReseniaPorPlatos();
    },
    async fetchIngresosPorDia() {
      try {
        this.dataG1 = [];
        const response = await axios.get('http://localhost:5000/api/dashboard/ingresos-dia', {
          params: { month: this.selectedMonth },
        });
        const apiData = response.data;

        // Formatea los datos en el formato {x, y}
        this.dataG1 = apiData.map((item) => ({
          x: item.fecha,
          y: item.ingresos
        }));
      } catch (error) {
        console.error('Error al obtener los ingresos por día:', error);
      }
    },

    async fetchIngresosPorMes() {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/ingresos-mes');
        const apiData = response.data;

        // Formatea los datos en el formato {x, y}
        this.dataG2 = apiData.map((item) => ({
          x: item.mes,
          y: item.total_ventas
        }));
      } catch (error) {
        console.error('Error al obtener los ingresos por día:', error);
      }
    },

    async fetchConsumoPorHoras() {
      try {
        this.dataG3 = [];

        const response = await axios.get('http://localhost:5000/api/dashboard/consumo-hora', {
          params: { month: this.selectedMonth },
        });
        const apiData = response.data;

        console.log("DATOS POR HORA: ", apiData)

        // Formatea los datos en el formato {x, y}
        this.dataG3 = apiData.map((item) => ({
          x: item.hora,
          y: item.total_pedidos
        }));
      } catch (error) {
        console.error('Error al obtener los ingresos por día:', error);
      }
    },

    async fetchProductosMasVendidos() {
      try {
        this.dataG4 = [];

        const response = await axios.get('http://localhost:5000/api/dashboard/productos-mas-vendidos', {
          params: { month: this.selectedMonth },
        });

        const apiData = response.data;

        // Formatea los datos en el formato {x, y}
        this.dataG4 = apiData.map((item) => ({
          x: item.nombre,
          y: item.total_vendidos
        }));
      } catch (error) {
        console.error('Error al obtener los ingresos por día:', error);
      }
    },

    async fetchReseniaPorPlatos() {
      try {
        this.dataG5 = [];

        const response = await axios.get('http://localhost:5000/api/dashboard/resenias-plato', {
          params: { month: this.selectedMonth },
        });
        const apiData = response.data;

        this.dataG5 = apiData.map((item) => ({
          nombre_plato: item.nombre_plato,
          promedio_resenia: item.promedio_resenia,
          total_resenias: item.total_resenias,
        }));

        console.log("RESENIA: ", this.dataG5)

      } catch (error) {
        console.error('Error al obtener reseñas por platos:', error);
      }
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  width: 100vw;
  box-sizing: border-box;
}

label {
  font-size: 1.2em;
  margin-right: 10px;
}

select {
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.dashboard-header {

  text-align: center;
  background: linear-gradient(180deg, #ff9900, #ffcc00);
  color: white;
  padding: 20px 10px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}

/* Estilo del título principal */
.dashboard-header h1 {
  font-size: 3em;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Estilo del icono */
.dashboard-header h1 i {
  font-size: 0.8em;
  color: #ffd700;
  /* Icono dorado */
  animation: bounce 1s infinite;
}

/* Subtítulo */
.dashboard-header p {
  font-size: 1.2em;
  margin-top: 10px;
  color: #dcdcdc;
  font-style: italic;
}

/* Animación del icono */
@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Contenedores principales */
.first-data-container {
  display: flex;
  justify-content: center;
  gap: 5em;
  flex-wrap: wrap;
  margin: 20px;
}

.info-card {
  width: 200px;
  height: 150px;
  background: linear-gradient(135deg, #ff9900, #ffcc00);
  color: white;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card i {
  font-size: 2em;
  margin-bottom: 10px;
}

.info-card h2 {
  font-size: 1.2em;
  margin: 0;
}

.info-card p {
  font-size: 1.8em;
  font-weight: bold;
  margin: 5px 0 0;
}

/* Animación al pasar el mouse */
.info-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
}

/* Contenedor de gráficos */
.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1.5em;
  padding: 1em;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.charts-container>*:nth-child(5) {
  grid-column: span 2;
}

.charts-container>* {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1em;
  max-width: calc(100% - 2em);
  box-sizing: border-box;
}
</style>
