// src/api/rol.controller.js
const sequelize = require('../../config/db');

// Crear un nuevo rol
exports.crearRol = async (req, res) => {
  const { rol } = req.body;

  try {
    await sequelize.query(
      `INSERT INTO rol (rol) VALUES (:rol)`,
      {
        replacements: { rol },
        type: sequelize.QueryTypes.INSERT,
      }
    );
    res.status(201).json({ message: 'Rol creado exitosamente' });
  } catch (error) {
    console.error("Error al crear el rol:", error);
    res.status(500).json({ error: 'Error al crear el rol', details: error.message });
  }
};

// Obtener todos los roles
exports.obtenerRoles = async (req, res) => {
  try {
    const roles = await sequelize.query(
      `SELECT * FROM rol`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(roles);
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
};

// Actualizar un rol
exports.actualizarRol = async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  try {
    const [actualizado] = await sequelize.query(
      `UPDATE rol SET rol = :rol WHERE idRol = :id`,
      {
        replacements: { id, rol },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      res.json({ message: 'Rol actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Rol no encontrado' });
    }
  } catch (error) {
    console.error("Error al actualizar el rol:", error);
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
};

// Eliminar un rol
exports.eliminarRol = async (req, res) => {
  const { id } = req.params;

  try {
    const eliminado = await sequelize.query(
      `DELETE FROM rol WHERE idRol = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.DELETE,
      }
    );

    if (eliminado) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Rol no encontrado' });
    }
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    res.status(500).json({ error: 'Error al eliminar el rol' });
  }
};

