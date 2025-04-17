const Actividad = require('./actividadModel'); // Asegúrate de que la ruta al modelo sea correcta


// Función para obtener todas las actividades
const obtenerActividades = async (req, res) => {
  try {
    const actividades = await Actividad.findAll();
    res.status(200).json(actividades);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
};

// Función para crear una nueva actividad
const crearActividad = async (req, res) => {
  try {
    const { usuario, estado } = req.body;

    // Validación de datos (opcional)
    if (!usuario || !estado) {
      return res.status(400).json({ error: 'Se requieren los campos usuario y estado' });
    }

    const nuevaActividad = await Actividad.create({ usuario, estado });
    res.status(201).json(nuevaActividad);
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({ error: 'Error al crear la actividad' });
  }
};

module.exports = {
  obtenerActividades,
  crearActividad,
};
