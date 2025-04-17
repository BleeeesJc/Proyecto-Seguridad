<template>
    <div>
        <div v-if="data && data.length > 0">
            <canvas ref="chartCanvas"></canvas>
        </div>
        <div v-else>
            <p>No hay datos disponibles para esta fecha.</p>
        </div>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import * as Utils from '@/utils/utils';

export default {
    name: 'PieChartProductos',
    props: {
        data: {
            type: Array,
            required: true,
        },
        chartTitle: {
            type: String,
            default: 'Productos Mas Vendidos',
        },
    },
    data() {
        return {
            chart: null,
        };
    },
    mounted() {
        Chart.register(...registerables);
        this.createChart();

        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }

        window.removeEventListener('resize', this.handleResize);
    },
    watch: {
        data: {
            handler(newData) {
                if (!newData || newData.length === 0) {
                    console.warn('Datos vacíos detectados.');
                    if (this.chart) {
                        this.chart.destroy(); // Destruye el gráfico existente
                        this.chart = null; // Limpia la referencia
                    }
                    return;
                }

                if (this.chart) {
                    // Actualiza el gráfico si ya existe
                    this.chart.data.labels = newData.map(item => item.x); // Actualiza etiquetas
                    this.chart.data.datasets[0].data = newData.map(item => item.y); // Actualiza datos
                    this.chart.update();
                } else {
                    // Crea el gráfico si no existe
                    this.createChart();
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        createChart() {
            if (!this.data || this.data.length === 0) {
                console.warn('No hay datos para crear el gráfico.');
                return;
            }

            this.$nextTick(() => {
                const ctx = this.$refs.chartCanvas?.getContext('2d');
                if (!ctx) {
                    console.error('No se pudo obtener el contexto del canvas.');
                    return;
                }

                this.chart = new Chart(ctx, {
                    type: 'pie', // Tipo de gráfico
                    data: {
                        labels: this.data.map(item => item.x),
                        datasets: [
                            {
                                label: 'Cantidad consumida: ',
                                data: this.data.map(item => item.y),
                                backgroundColor: Object.values(Utils.CHART_COLORS),
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: this.chartTitle,
                            },
                        },
                    },
                });
            });
        },
    },
};
</script>

<style scoped>
canvas {
    width: 100%;
    height: calc(100vh - 100px);
}
</style>