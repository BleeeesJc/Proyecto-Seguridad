const dashboardQueries = require('./dashboardQueries');

const dashboardController = {
    async obtenerTotalPedidos(req, res) {
        try {
            const { month } = req.query;
            const monthNumber = parseInt(month, 10); // Convertir a número
            if (isNaN(monthNumber)) {
                return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
            }

            const data = await dashboardQueries.getTotalPedidos(monthNumber);
            res.json(data);
        } catch (error) {
            console.error('Error al obtener el total de pedidos:', error);
            res.status(500).json({ error: 'Error al obtener el total de pedidos.' });
        }
    },

    async obtenerIngresosTotales(req, res) {
        try {
            const { month } = req.query;
            const monthNumber = parseInt(month, 10); // Convertir a número
            if (isNaN(monthNumber)) {
                return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
            }

            const data = await dashboardQueries.getIngresosTotales(monthNumber);
            res.json(data);
        } catch (error) {
            console.error('Error al obtener los ingresos totales:', error);
            res.status(500).json({ error: 'Error al obtener los ingresos totales.' });
        }
    },

    async obtenerCalificacionPromedio(req, res) {
        try {
            const { month } = req.query;
            const monthNumber = parseInt(month, 10); // Convertir a número
            if (isNaN(monthNumber)) {
                return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
            }

            const data = await dashboardQueries.getCalificacionPromedio(monthNumber);
            res.json(data);
        } catch (error) {
            console.error('Error al obtener la calificación promedio:', error);
            res.status(500).json({ error: 'Error al obtener la calificación promedio.' });
        }
    },

    async obtenerIngresosPorDia(req, res) {
        try {
            const { month } = req.query;
            const monthNumber = parseInt(month, 10); // Convertir a número
            if (isNaN(monthNumber)) {
                return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
            }

            const data = await dashboardQueries.getIngresosPorDia(monthNumber);
            res.json(data);
        } catch (error) {
            console.error('Error al obtener los ingresos por día:', error);
            res.status(500).json({ error: 'Error al obtener los ingresos por día.' });
        }
    },

    async obtenerIngresosPorMes(req, res) {
        try {
            const data = await dashboardQueries.getIngresosPorMes();
            res.json(data);
        } catch (error) {
            console.error('Error al obtener los ingresos por mes:', error);
            res.status(500).json({ error: 'Error al obtener los ingresos por mes.' });
        }
    },

    async obtenerConsumoPorHoras(req, res) {
        try {
            const { month } = req.query;
            const monthNumber = parseInt(month, 10); // Convertir a número

            if (isNaN(monthNumber)) {
                return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
            }

            const data = await dashboardQueries.getHorasConMasConsumo(monthNumber);
            res.json(data);
        } catch (error) {
            console.error('Error al obtener el consumo por horas:', error);
            res.status(500).json({ error: 'Error al obtener el consumo por horas.' });
        }
    },

    async obtenerProductosMasVendidos(req, res) {
        try {
            const { month } = req.query;
            const monthNumber = parseInt(month, 10); // Convertir a número
            if (isNaN(monthNumber)) {
                return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
            }

            const data = await dashboardQueries.getProductosMasVendidos(monthNumber);
            res.json(data);
        } catch (error) {
            console.error('Error al obtener los productos más vendidos:', error);
            res.status(500).json({ error: 'Error al obtener los productos más vendidos.' });
        }
    },


    async obtenerReseñasPorPlatos(req, res) {
        try {
            const { month } = req.query;
            const monthNumber = parseInt(month, 10); // Convertir a número
            if (isNaN(monthNumber)) {
                return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
            }

            const data = await dashboardQueries.getReseñaPorPlatos(monthNumber);
            res.json(data);
        } catch (error) {
            console.error('Error al obtener las reseñas por platillos:', error);
            res.status(500).json({ error: 'Error al obtener las reseñas por platillos.' });
        }
    },
};

module.exports = dashboardController;
