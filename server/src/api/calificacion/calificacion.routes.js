const express = require('express');
const router = express.Router();
const calificacionesController = require('./calificacion.controller');

// Define las rutas
router.post("/", calificacionesController.crearCalificacion);
router.get("/", calificacionesController.obtenerCalificaciones);
router.put("/actualizar", calificacionesController.actualizarCalificacion);
router.delete("/:id", calificacionesController.eliminarCalificacion);
router.get("/existe", calificacionesController.existeResenia);
router.get('/usuario/:idusuario', calificacionesController.obtenerCalificacionesPorUsuario);
router.post("/calificar-experiencia", calificacionesController.calificarExperiencia);

module.exports = router;
