// src/api/dashboard/dashboardQueries.js

const db = require('../../config/db');

// Consultas específicas para el dashboard
const dashboardQueries = {

    getReseñaPorPlatos: async (month) => {
        let query = ''; // Inicializamos la consulta
        const params = [];

        if (month && month !== 0) {
            // Consulta con filtro por mes
            query = `
            SELECT 
            p.nombre AS nombre_plato,
            AVG(r.puntuacion) AS promedio_resenia,
            COUNT(r.idResenia) AS total_resenias
            FROM 
                platillo p
            JOIN 
                resenia r ON p.idPlato = r.idPlato
            WHERE EXTRACT(MONTH FROM r.fecha) = ${month}
            GROUP BY 
                p.idPlato, p.nombre
            ORDER BY 
                promedio_resenia DESC,
                total_resenias DESC
            LIMIT 5;
            `;
            params.push(month); // Pasamos el parámetro de mes
        } else {
            // Consulta sin filtro (todos los meses)
            query = `
            SELECT 
                p.nombre AS nombre_plato,
                AVG(r.puntuacion) AS promedio_resenia,
                COUNT(r.idResenia) AS total_resenias
            FROM 
                platillo p
            JOIN 
                resenia r ON p.idPlato = r.idPlato
            GROUP BY 
                p.idPlato, p.nombre
            ORDER BY 
                promedio_resenia DESC,
                total_resenias DESC
            LIMIT 5;
            `;
        }
        const [rows] = await db.query(query, params);
        return rows;
    },

    getTotalPedidos: async (month) => {
        let query = '';
        const params = [];

        if (month && month !== 0) {
            // Consulta con filtro por mes
            query = `
            SELECT 
                COUNT(idPedido) AS total_pedidos
            FROM 
                pedido
            WHERE 
                EXTRACT(MONTH FROM fecha) = ${month}
            `;
            params.push(month); // Pasamos el parámetro de mes
        } else {
            // Consulta sin filtro (todos los meses)
            query = `
                SELECT 
                    COUNT(idPedido) AS total_pedidos
                FROM 
                    pedido
                `;
        }
        const [rows] = await db.query(query, params);
        return rows;
    },

    getIngresosTotales: async (month) => {
        let query = '';
        const params = [];

        if (month && month !== 0) {
            // Consulta con filtro por mes
            query = `
            SELECT 
                COALESCE(SUM(precio_total), 0) AS ingresos_totales
            FROM 
                pedido
            WHERE 
                EXTRACT(MONTH FROM fecha) = ${month};
            `;
            params.push(month); // Pasamos el parámetro de mes
        } else {
            // Consulta sin filtro (todos los meses)
            query = `
                SELECT 
                    SUM(precio_total) AS ingresos_totales
                FROM 
                    pedido
                `;
        }
        const [rows] = await db.query(query, params);
        return rows;
    },

    getCalificacionPromedio: async (month) => {
        let query = '';
        const params = [];

        if (month && month !== 0) {
            // Consulta con filtro por mes
            query = `
            SELECT 
                COALESCE(ROUND(AVG(puntuacion), 1), 0) AS promedio_calificacion
            FROM 
                resenia
            WHERE 
                EXTRACT(MONTH FROM fecha) = ${month};
            `;
            params.push(month); // Pasamos el parámetro de mes
        } else {
            // Consulta sin filtro (todos los meses)
            query = `
                SELECT 
                    COALESCE(ROUND(AVG(puntuacion), 1), 0) AS promedio_calificacion
                FROM 
                    resenia
                `;
        }
        const [rows] = await db.query(query, params);
        return rows;
    },

    // Ingresos totales por día
    getIngresosPorDia: async (month) => {
        let query = ''; // Inicializamos la consulta
        const params = [];

        if (month && month !== 0) {
            // Consulta con filtro por mes
            query = `
            SELECT DATE(fecha) AS fecha, SUM(precio_total) AS ingresos
            FROM pedido
            WHERE EXTRACT(MONTH FROM fecha) = ${month}
            GROUP BY DATE(fecha)
            ORDER BY fecha;
            `;
            params.push(month); // Pasamos el parámetro de mes
        } else {
            // Consulta sin filtro (todos los meses)
            query = `
                SELECT DATE(fecha) AS fecha, SUM(precio_total) AS ingresos
                FROM pedido
                GROUP BY DATE(fecha)
                ORDER BY fecha;
                `;
        }
        const [rows] = await db.query(query, params);
        return rows;
    },

    // Ingresos totales por mes
    getIngresosPorMes: async () => {
        const query = `
                SELECT 
                TO_CHAR(p.fecha, 'YYYY-MM') AS mes,
                SUM(p.precio_total) AS total_ventas
            FROM 
                pedido p
            JOIN 
                detalle_pedido dp ON p.idPedido = dp.idPedido
            GROUP BY 
                TO_CHAR(p.fecha, 'YYYY-MM')
            ORDER BY 
                mes ASC;
            `;
        const [rows] = await db.query(query);
        return rows;
    },

    // Cantidad de consumo por horas
    getHorasConMasConsumo: async (month) => {
        let query = ''; // Inicializamos la consulta
        const params = [];

        if (month && month !== 0) {
            // Consulta con filtro por mes
            query = `
            SELECT 
                EXTRACT(HOUR FROM hora) AS hora,
                COUNT(idPedido) AS total_pedidos
                FROM 
                    pedido
				WHERE EXTRACT(MONTH FROM fecha) = ${month}
                GROUP BY
                    EXTRACT(HOUR FROM hora)
                ORDER BY 
                    hora;
            `;
            params.push(month); // Pasamos el parámetro de mes
        } else {
            // Consulta sin filtro (todos los meses)
            query = `
                SELECT 
                EXTRACT(HOUR FROM hora) AS hora, 
                COUNT(idPedido) AS total_pedidos 
                FROM 
                    pedido
                GROUP BY
                    EXTRACT(HOUR FROM hora)
                ORDER BY 
                    hora;
                `;
        }
        const [rows] = await db.query(query, params);
        return rows;
    },

    // Productos más vendidos
    getProductosMasVendidos: async (month) => {
        let query = ''; // Inicializamos la consulta
        const params = [];

        if (month && month !== 0) {
            // Consulta con filtro por mes
            query = `
            SELECT p.nombre, SUM(dp.cantidad) AS total_vendidos
            FROM detalle_pedido dp
            JOIN platillo p ON dp.idPlato = p.idPlato
            JOIN pedido pe ON dp.idPedido = pe.idPedido
            WHERE EXTRACT(MONTH FROM pe.fecha) = ${month}
            GROUP BY p.nombre
            ORDER BY total_vendidos DESC
            LIMIT 5;
        `;
            params.push(month); // Pasamos el parámetro de mes
        } else {
            // Consulta sin filtro (todos los meses)
            query = `
            SELECT p.nombre, SUM(dp.cantidad) AS total_vendidos
            FROM detalle_pedido dp
            JOIN platillo p ON dp.idPlato = p.idPlato
            GROUP BY p.nombre
            ORDER BY total_vendidos DESC
            LIMIT 5;
        `;
        }

        // Ejecutar la consulta
        const [rows] = await db.query(query, params);
        return rows;
    },

};

module.exports = dashboardQueries;