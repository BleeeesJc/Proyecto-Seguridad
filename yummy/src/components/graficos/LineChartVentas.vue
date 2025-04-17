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
import 'chartjs-adapter-date-fns';

export default {
    name: 'LineChartVentas',
    props: {
        data: {
            type: Array,
            required: true,
        },
        chartTitle: {
            type: String,
            default: 'Ingresos Totales por Día',
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
                    this.chart.data.datasets[0].data = newData;
                    this.chart.update();
                } else {
                    // Crea el gráfico si aún no existe
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
                const ctx = this.$refs.chartCanvas.getContext('2d');
                if (!ctx) {
                    console.error('No se pudo obtener el contexto del canvas.');
                    return;
                }
                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [
                            {
                                label: 'Ingresos (Bs)',
                                data: this.data,
                                backgroundColor: 'rgba(255, 153, 0, 0.2)',
                                borderColor: 'rgba(255, 153, 0, 1)',
                                borderWidth: 2,
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                            },
                            title: {
                                display: true,
                                text: this.chartTitle,
                            },
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    parser: 'yyyy-MM-dd', // Corregir el formato del parser
                                    unit: 'day',
                                    displayFormats: {
                                        day: 'yyyy MMM dd',
                                    },
                                },
                                title: {
                                    display: true,
                                    text: 'Fecha',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Ingresos (Bs)',
                                },
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