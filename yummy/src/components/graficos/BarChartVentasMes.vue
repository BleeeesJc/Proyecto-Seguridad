<template>
    <div>
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

export default {
    name: 'BarChartVentasMes',
    props: {
        data: {
            type: Array,
            required: true,
        },
        chartTitle: {
            type: String,
            default: 'Ingresos Totales por Mes',
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
                // Espera a que los datos estén disponibles
                return;
            }
            const ctx = this.$refs.chartCanvas.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'bar',
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
                                parser: 'yyyy-MM', // Corregir el formato del parser
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM',
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