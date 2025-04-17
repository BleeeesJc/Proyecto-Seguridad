const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

// Rutas del Dashboard
router.get('/total-pedidos', dashboardController.obtenerTotalPedidos); // Número total de pedidos
router.get('/ingresos-totales', dashboardController.obtenerIngresosTotales); // Ingresos totales generados
router.get('/calificacion-promedio', dashboardController.obtenerCalificacionPromedio); // Promedio de calificación
router.get('/ingresos-dia', dashboardController.obtenerIngresosPorDia); // Ingresos totales por día
router.get('/ingresos-mes', dashboardController.obtenerIngresosPorMes); // Ingresos totales por mes
router.get('/consumo-hora', dashboardController.obtenerConsumoPorHoras); // Cantidad de consumo por hora
router.get('/productos-mas-vendidos', dashboardController.obtenerProductosMasVendidos); // Productos más vendidos
router.get('/resenias-plato', dashboardController.obtenerReseñasPorPlatos); // Reseñas por platillos

module.exports = router;
