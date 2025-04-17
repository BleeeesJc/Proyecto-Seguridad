const sequelize = require('../../config/db');

// Crear una nueva calificación
exports.crearCalificacion = async (req, res) => {
  const { puntuacion, idusuario, idplato } = req.body;
  console.log('Solicitud recibida para guardar calificación:', req.body);

  try {
    const nuevaCalificacion = await sequelize.query(
      `INSERT INTO resenia (puntuacion, fecha, idusuario, idplato)
       VALUES (:puntuacion, NOW(), :idusuario, :idplato) RETURNING *`,
      {
        replacements: { puntuacion, idusuario, idplato },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({
      message: 'Calificación creada exitosamente',
      data: nuevaCalificacion[0],
    });
  } catch (error) {
    console.error('Error al crear la calificación:', error);
    res.status(500).json({ error: 'Error al crear la calificación' });
  }
};

// Obtener todas las calificaciones
exports.obtenerCalificaciones = async (req, res) => {
  try {
    const calificaciones = await sequelize.query(
      `SELECT r.idresenia, r.puntuacion, r.fecha, r.idusuario, r.idplato,
              u.nombre AS usuario, p.nombre AS platillo
       FROM resenia r
       LEFT JOIN usuario u ON r.idusuario = u.idusuario
       LEFT JOIN platillo p ON r.idplato = p.idplato`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json(calificaciones);
  } catch (error) {
    console.error('Error al obtener las calificaciones:', error);
    res.status(500).json({ error: 'Error al obtener las calificaciones' });
  }
};

exports.actualizarCalificacion = async (req, res) => {
  const { puntuacion, idusuario, idplato } = req.body;
  console.log("Datos recibidos:", req.body); 
  try {
    const [actualizado] = await sequelize.query(
      `UPDATE resenia
       SET puntuacion = :puntuacion, fecha = NOW()
       WHERE idusuario = :idusuario AND idplato = :idplato`,
      {
        replacements: { puntuacion, idusuario, idplato },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      res.json({ message: "Calificación actualizada exitosamente" });
    } else {
      res.status(404).json({ error: "No se encontró la calificación para actualizar" });
    }
  } catch (error) {
    console.error("Error al actualizar la calificación:", error);
    res.status(500).json({ error: "Error al actualizar la calificación" });
  }
};

// Eliminar una calificación
exports.eliminarCalificacion = async (req, res) => {
  const { id } = req.params;

  try {
    const eliminado = await sequelize.query(
      `DELETE FROM resenia WHERE idresenia = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.DELETE,
      }
    );

    if (eliminado) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Calificación no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar la calificación:', error);
    res.status(500).json({ error: 'Error al eliminar la calificación' });
  }
};

exports.existeResenia = async (req, res) => {
  const { idusuario, idplato } = req.query;
  console.log("Parámetros recibidos:", { idusuario, idplato });

  try {
    if (!idusuario || !idplato) {
      return res.status(400).json({ error: "Faltan parámetros: idusuario o idplato." });
    }
    const reseña = await sequelize.query(
      `SELECT * FROM resenia WHERE idusuario = :idusuario AND idplato = :idplato`,
      {
        replacements: { idusuario, idplato },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({ existe: reseña.length > 0 });
  } catch (error) {
    console.error("Error al verificar existencia de la reseña:", error);
    res.status(500).json({ error: "Error al verificar la reseña" });
  }
};

exports.obtenerCalificacionesPorUsuario = async (req, res) => {
  const { idusuario } = req.params;

  try {
    const calificaciones = await sequelize.query(
      `SELECT r.idresenia, r.puntuacion, r.fecha, 
              r.idusuario, r.idplato,
              p.nombre AS platillo, 
              p.descripcion, 
              p.imagen 
       FROM resenia r
       JOIN platillo p ON r.idplato = p.idplato
       WHERE r.idusuario = :idusuario`,
      {
        replacements: { idusuario },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(calificaciones);
  } catch (error) {
    console.error("Error al obtener las calificaciones del usuario:", error);
    res.status(500).json({ error: "Error al obtener las calificaciones del usuario." });
  }
};
// Calificar experiencia después de un pedido
exports.calificarExperiencia = async (req, res) => {
  const { puntuacion, idusuario, fecha } = req.body;
  console.log('Solicitud recibida para calificar experiencia:', req.body);

  try {
    const nuevaCalificacion = await sequelize.query(
      `INSERT INTO resenia (puntuacion, fecha, idusuario, idplato)
       VALUES (:puntuacion, :fecha, :idusuario, NULL) RETURNING *`,
      {
        replacements: { puntuacion, idusuario, fecha },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    res.status(201).json({
      message: 'Experiencia calificada exitosamente',
      data: nuevaCalificacion[0],
    });
  } catch (error) {
    console.error('Error al calificar la experiencia:', error);
    res.status(500).json({ error: 'Error al calificar la experiencia' });
  }
};
