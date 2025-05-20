const dashboardQueries = require('./dashboardQueries');

const dashboardController = {
    async obtenerTotalPedidos(req, res) {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);
        console.log(`[Dashboard] Obtener total de pedidos | Mes: ${month}`);

        if (isNaN(monthNumber)) {
            console.warn('Parámetro inválido "month": debe ser un número.');
            return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
        }

        try {
            const data = await dashboardQueries.getTotalPedidos(monthNumber);
            console.log(`Total de pedidos obtenidos | Mes: ${monthNumber}`);
            res.json(data);
        } catch (error) {
            console.error(`Error al obtener total de pedidos | Mes: ${monthNumber} | ${error.message}`);
            res.status(500).json({ error: 'Error al obtener el total de pedidos.' });
        }
    },

    async obtenerIngresosTotales(req, res) {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);
        console.log(`[Dashboard] Obtener ingresos totales | Mes: ${month}`);

        if (isNaN(monthNumber)) {
            console.warn('Parámetro inválido "month": debe ser un número.');
            return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
        }

        try {
            const data = await dashboardQueries.getIngresosTotales(monthNumber);
            console.log(`Ingresos totales obtenidos | Mes: ${monthNumber}`);
            res.json(data);
        } catch (error) {
            console.error(`Error al obtener ingresos totales | Mes: ${monthNumber} | ${error.message}`);
            res.status(500).json({ error: 'Error al obtener los ingresos totales.' });
        }
    },

    async obtenerCalificacionPromedio(req, res) {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);
        console.log(`[Dashboard] Obtener calificación promedio | Mes: ${month}`);

        if (isNaN(monthNumber)) {
            console.warn('Parámetro inválido "month": debe ser un número.');
            return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
        }

        try {
            const data = await dashboardQueries.getCalificacionPromedio(monthNumber);
            console.log(`Calificación promedio obtenida | Mes: ${monthNumber}`);
            res.json(data);
        } catch (error) {
            console.error(`Error al obtener calificación promedio | Mes: ${monthNumber} | ${error.message}`);
            res.status(500).json({ error: 'Error al obtener la calificación promedio.' });
        }
    },

    async obtenerIngresosPorDia(req, res) {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);
        console.log(`[Dashboard] Obtener ingresos por día | Mes: ${month}`);

        if (isNaN(monthNumber)) {
            console.warn('Parámetro inválido "month": debe ser un número.');
            return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
        }

        try {
            const data = await dashboardQueries.getIngresosPorDia(monthNumber);
            console.log(`Ingresos por día obtenidos | Mes: ${monthNumber}`);
            res.json(data);
        } catch (error) {
            console.error(`Error al obtener ingresos por día | Mes: ${monthNumber} | ${error.message}`);
            res.status(500).json({ error: 'Error al obtener los ingresos por día.' });
        }
    },

    async obtenerIngresosPorMes(req, res) {
        console.log(`[Dashboard] Obtener ingresos por mes`);

        try {
            const data = await dashboardQueries.getIngresosPorMes();
            console.log(`Ingresos por mes obtenidos`);
            res.json(data);
        } catch (error) {
            console.error(`Error al obtener ingresos por mes | ${error.message}`);
            res.status(500).json({ error: 'Error al obtener los ingresos por mes.' });
        }
    },

    async obtenerConsumoPorHoras(req, res) {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);
        console.log(`[Dashboard] Obtener consumo por horas | Mes: ${month}`);

        if (isNaN(monthNumber)) {
            console.warn('Parámetro inválido "month": debe ser un número.');
            return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
        }

        try {
            const data = await dashboardQueries.getHorasConMasConsumo(monthNumber);
            console.log(`Consumo por horas obtenido | Mes: ${monthNumber}`);
            res.json(data);
        } catch (error) {
            console.error(`Error al obtener consumo por horas | Mes: ${monthNumber} | ${error.message}`);
            res.status(500).json({ error: 'Error al obtener el consumo por horas.' });
        }
    },

    async obtenerProductosMasVendidos(req, res) {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);
        console.log(`[Dashboard] Obtener productos más vendidos | Mes: ${month}`);

        if (isNaN(monthNumber)) {
            console.warn('Parámetro inválido "month": debe ser un número.');
            return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
        }

        try {
            const data = await dashboardQueries.getProductosMasVendidos(monthNumber);
            console.log(`Productos más vendidos obtenidos | Mes: ${monthNumber}`);
            res.json(data);
        } catch (error) {
            console.error(`Error al obtener productos más vendidos | Mes: ${monthNumber} | ${error.message}`);
            res.status(500).json({ error: 'Error al obtener los productos más vendidos.' });
        }
    },

    async obtenerReseñasPorPlatos(req, res) {
        const { month } = req.query;
        const monthNumber = parseInt(month, 10);
        console.log(`[Dashboard] Obtener reseñas por platos | Mes: ${month}`);

        if (isNaN(monthNumber)) {
            console.warn('Parámetro inválido "month": debe ser un número.');
            return res.status(400).json({ error: 'El parámetro "month" debe ser un número.' });
        }

        try {
            const data = await dashboardQueries.getReseñaPorPlatos(monthNumber);
            console.log(`Reseñas por platos obtenidas | Mes: ${monthNumber}`);
            res.json(data);
        } catch (error) {
            console.error(`Error al obtener reseñas por platos | Mes: ${monthNumber} | ${error.message}`);
            res.status(500).json({ error: 'Error al obtener las reseñas por platillos.' });
        }
    }
};

module.exports = dashboardController;
