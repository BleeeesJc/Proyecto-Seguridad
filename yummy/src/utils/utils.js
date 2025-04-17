// Colores predefinidos para gráficos
export const CHART_COLORS = {
    red: 'rgba(255, 99, 132, 0.6)',
    blue: 'rgba(54, 162, 235, 0.6)',
    green: 'rgba(75, 192, 192, 0.6)',
    yellow: 'rgba(255, 206, 86, 0.6)',
    purple: 'rgba(153, 102, 255, 0.6)',
    orange: 'rgba(255, 159, 64, 0.6)',
};

// Ejemplo de una función de utilidad
export function formatCurrency(value) {
    return `$${value.toFixed(2)}`;
}
