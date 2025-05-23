const dashboardQueries = require('./dashboardQueries');

const dashboardController = {
    async obtenerTotalPedidos(req, res, next) {
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
            next(error);
        }
    },

    async obtenerIngresosTotales(req, res, next) {
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
            next(error);
        }
    },

    async obtenerCalificacionPromedio(req, res, next) {
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
            next(error);
        }
    },

    async obtenerIngresosPorDia(req, res, next) {
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
            next(error);
        }
    },

    async obtenerIngresosPorMes(req, res, next) {
        console.log(`[Dashboard] Obtener ingresos por mes`);

        try {
            const data = await dashboardQueries.getIngresosPorMes();
            console.log(`Ingresos por mes obtenidos`);
            res.json(data);
        } catch (error) {
            next(error);
        }
    },

    async obtenerConsumoPorHoras(req, res, next) {
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
            next(error);
        }
    },

    async obtenerProductosMasVendidos(req, res, next) {
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
            next(error);
        }
    },

    async obtenerReseñasPorPlatos(req, res, next) {
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
            next(error);
        }
    }
};

module.exports = dashboardController;
