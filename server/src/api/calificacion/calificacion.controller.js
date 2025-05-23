const sequelize = require('../../config/db');

// Crear una nueva calificación
exports.crearCalificacion = async (req, res, next) => {
  const { puntuacion, idusuario, idplato } = req.body;
  console.log(`Crear calificación | Usuario: ${idusuario}, Plato: ${idplato}, Puntuación: ${puntuacion}`);

  try {
    const nuevaCalificacion = await sequelize.query(
      `INSERT INTO resenia (puntuacion, fecha, idusuario, idplato)
       VALUES (:puntuacion, NOW(), :idusuario, :idplato) RETURNING *`,
      {
        replacements: { puntuacion, idusuario, idplato },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    console.log(`Calificación creada con éxito para Usuario ${idusuario}, Plato ${idplato}`);
    res.status(201).json({
      message: 'Calificación creada exitosamente',
      data: nuevaCalificacion[0],
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las calificaciones
exports.obtenerCalificaciones = async (req, res, next) => {
  console.log('Obtener todas las calificaciones');

  try {
    const calificaciones = await sequelize.query(
      `SELECT r.idresenia, r.puntuacion, r.fecha, r.idusuario, r.idplato,
              u.nombre AS usuario, p.nombre AS platillo
       FROM resenia r
       LEFT JOIN usuario u ON r.idusuario = u.idusuario
       LEFT JOIN platillo p ON r.idplato = p.idplato`,
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log(`${calificaciones.length} calificaciones obtenidas`);
    res.json(calificaciones);
  } catch (error) {
    next(error);
  }
};

// Actualizar calificación
exports.actualizarCalificacion = async (req, res, next) => {
  const { puntuacion, idusuario, idplato } = req.body;
  console.log(`Actualizar calificación | Usuario: ${idusuario}, Plato: ${idplato}, Nueva puntuación: ${puntuacion}`);

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
      console.log(`Calificación actualizada | Usuario: ${idusuario}, Plato: ${idplato}`);
      res.json({ message: "Calificación actualizada exitosamente" });
    } else {
      console.warn(`No se encontró calificación para actualizar | Usuario: ${idusuario}, Plato: ${idplato}`);
      res.status(404).json({ error: "No se encontró la calificación para actualizar" });
    }
  } catch (error) {
    next(error);
  }
};

// Eliminar calificación
exports.eliminarCalificacion = async (req, res, next) => {
  const { id } = req.params;
  console.log(`Eliminar calificación | ID: ${id}`);

  try {
    const eliminado = await sequelize.query(
      `DELETE FROM resenia WHERE idresenia = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.DELETE,
      }
    );

    if (eliminado) {
      console.log(`Calificación eliminada | ID: ${id}`);
      res.status(204).json();
    } else {
      console.warn(`Calificación no encontrada para eliminar | ID: ${id}`);
      res.status(404).json({ error: 'Calificación no encontrada' });
    }
  } catch (error) {
    next(error);
  }
};

// Verificar existencia de reseña
exports.existeResenia = async (req, res, next) => {
  const { idusuario, idplato } = req.query;
  console.log(`Verificar reseña | Usuario: ${idusuario}, Plato: ${idplato}`);

  try {
    if (!idusuario || !idplato) {
      console.warn(" Faltan parámetros en la verificación de reseña");
      return res.status(400).json({ error: "Faltan parámetros: idusuario o idplato." });
    }

    const reseña = await sequelize.query(
      `SELECT * FROM resenia WHERE idusuario = :idusuario AND idplato = :idplato`,
      {
        replacements: { idusuario, idplato },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(`Verificación completada | Existe: ${reseña.length > 0}`);
    res.json({ existe: reseña.length > 0 });
  } catch (error) {
    next(error);
  }
};

// Obtener calificaciones por usuario
exports.obtenerCalificacionesPorUsuario = async (req, res, next) => {
  const { idusuario } = req.params;
  console.log(`Obtener calificaciones del usuario | ID: ${idusuario}`);

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

    console.log(`Calificaciones del usuario ${idusuario} obtenidas: ${calificaciones.length}`);
    res.json(calificaciones);
  } catch (error) {
    next(error);
  }
};


exports.calificarExperiencia = async (req, res, next) => {
  const { puntuacion, idusuario, fecha } = req.body;
  console.log(`Calificar experiencia | Usuario: ${idusuario}, Fecha: ${fecha}, Puntuación: ${puntuacion}`);

  try {
    const nuevaCalificacion = await sequelize.query(
      `INSERT INTO resenia (puntuacion, fecha, idusuario, idplato)
       VALUES (:puntuacion, :fecha, :idusuario, NULL) RETURNING *`,
      {
        replacements: { puntuacion, idusuario, fecha },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    console.log(`Experiencia calificada exitosamente | Usuario: ${idusuario}`);
    res.status(201).json({
      message: 'Experiencia calificada exitosamente',
      data: nuevaCalificacion[0],
    });
  } catch (error) {
    next(error);
  }
};
