const Actividad = require('./actividadModel');

// Obtener todas las actividades
const obtenerActividades = async (req, res) => {
  console.log('[Actividad] Obtener todas');
  try {
    const actividades = await Actividad.findAll();
    console.log(`[Actividad] Actividades obtenidas: ${actividades.length}`);
    res.status(200).json(actividades);
  } catch (error) {
    console.error(`[Actividad] Error al obtener actividades | ${error.message}`);
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
};

// Crear una nueva actividad
const crearActividad = async (req, res) => {
  const { usuario, estado } = req.body;
  console.log(`[Actividad] Crear | Usuario: ${usuario}, Estado: ${estado}`);

  if (!usuario || !estado) {
    console.warn('[Actividad] Datos incompletos en creación');
    return res.status(400).json({ error: 'Se requieren los campos usuario y estado' });
  }

  try {
    const nuevaActividad = await Actividad.create({ usuario, estado });
    console.log(`[Actividad] Actividad creada | ID: ${nuevaActividad.id}`);
    res.status(201).json(nuevaActividad);
  } catch (error) {
    console.error(`[Actividad] Error al crear actividad | ${error.message}`);
    res.status(500).json({ error: 'Error al crear la actividad' });
  }
};

module.exports = {
  obtenerActividades,
  crearActividad,
};
