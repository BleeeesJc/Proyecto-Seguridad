// src/api/platillos/platillo.controller.js
const sequelize = require('../../config/db');

// Crear un nuevo platillo
// Crear un nuevo platillo
exports.crearPlatillo = async (req, res) => {
  const { nombre, descripcion, precio, idCategoria, imagenExterna } = req.body;

  // Determina la ruta de la imagen
  const imagen = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` // URL completa para imágenes subidas
      : imagenExterna || null; // Usa la URL externa si existe o deja nulo

  const estado = 1; // Establecemos el estado siempre en 1

  try {
      await sequelize.query(
          `INSERT INTO platillo (nombre, descripcion, precio, idCategoria, imagen, estado)
           VALUES (:nombre, :descripcion, :precio, :idCategoria, :imagen, :estado)`,
          {
              replacements: { nombre, descripcion, precio, idCategoria, imagen, estado },
              type: sequelize.QueryTypes.INSERT,
          }
      );
      res.status(201).json({ message: 'Platillo creado exitosamente' });
  } catch (error) {
      console.error("Error al crear el platillo:", error);
      res.status(500).json({ error: 'Error al crear el platillo', details: error.message });
  }
};

// Obtener todos los platillos
exports.obtenerPlatillos = async (req, res) => {
    try {
        const platillos = await sequelize.query(
            `SELECT * FROM platillo where estado != 0`,
            { type: sequelize.QueryTypes.SELECT }
        );
        res.json(platillos);
    } catch (error) {
        console.error("Error al obtener los platillos:", error);
        res.status(500).json({ error: 'Error al obtener los platillos' });
    }
};

// Actualizar un platillo
exports.actualizarPlatillo = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, idCategoria, imagen } = req.body;

    try {
        const [actualizado] = await sequelize.query(
            `UPDATE platillo SET nombre = :nombre, descripcion = :descripcion, 
             precio = :precio, idcategoria = :idCategoria, imagen = :imagen
             WHERE idplato = :id`,
            {
                replacements: { id, nombre, descripcion, precio, idCategoria, imagen },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        if (actualizado) {
            res.json({ message: 'Platillo actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Platillo no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar el platillo:", error);
        res.status(500).json({ error: 'Error al actualizar el platillo', details: error.message });
    }
};

// Eliminar un platillo
exports.eliminarPlatillo = async (req, res) => {
    const { id } = req.params;

    try {
        const eliminado = await sequelize.query(
            `DELETE FROM platillo WHERE idplato = :id`, // Cambia idPlatillo a idplato
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            }
        );

        if (eliminado) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Platillo no encontrado' });
        }
    } catch (error) {
        console.error("Error al eliminar el platillo:", error);
        res.status(500).json({ error: 'Error al eliminar el platillo', details: error.message });
    }
};

// Cambiar el estado de un platillo a "desactivado" (de 1 a 0)
// Cambiar estado a desactivado
exports.cambiarDesactivado = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [actualizado] = await sequelize.query(
        `UPDATE platillo SET estado = 0 WHERE idplato = :id`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
  
      if (actualizado) {
        res.json({ message: 'Platillo desactivado correctamente' });
      } else {
        res.status(404).json({ error: 'Platillo no encontrado' });
      }
    } catch (error) {
      console.error("Error al desactivar el platillo:", error);
      res.status(500).json({ error: 'Error al desactivar el platillo', details: error.message });
    }
  };
  
// Cambiar el estado de un platillo entre destacado (2) y no destacado (1)
exports.toggleDestacado = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Obtén el estado actual del platillo
    const [platillo] = await sequelize.query(
      `SELECT estado FROM platillo WHERE idplato = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!platillo) {
      return res.status(404).json({ error: 'Platillo no encontrado' });
    }

    // Alterna el estado: si es 1 -> 2, si es 2 -> 1
    const nuevoEstado = platillo.estado === 2 ? 1 : 2;

    // Actualiza el estado en la base de datos
    const [actualizado] = await sequelize.query(
      `UPDATE platillo SET estado = :nuevoEstado WHERE idplato = :id`,
      {
        replacements: { id, nuevoEstado },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      res.json({ message: 'Estado del platillo actualizado', nuevoEstado });
    } else {
      res.status(404).json({ error: 'Error al actualizar el estado del platillo' });
    }
  } catch (error) {
    console.error("Error al cambiar el estado del platillo:", error);
    res.status(500).json({ error: 'Error al cambiar el estado del platillo', details: error.message });
  }
};
  
exports.obtenerPlatillosOfertas = async (req, res) => {
  try {
      const platillos = await sequelize.query(
          `
          SELECT p.idplato, p.nombre, p.descripcion, p.precio,
          p.idCategoria, p.imagen, p.estado, o.descuento
          FROM platillo p
          LEFT JOIN oferta o  
          ON p.idplato = o.idPlato 
          WHERE p.estado != 0
          `,
          { type: sequelize.QueryTypes.SELECT }
      );

      // Mapeamos la respuesta para incluir "Oferta del #descuento# %" si aplica
      const resultado = platillos.map((platillo) => ({
          ...platillo
      }));

      res.json(resultado);
  } catch (error) {
      console.error("Error al obtener los platillos con ofertas:", error);
      res.status(500).json({ error: 'Error al obtener los platillos con ofertas' });
  }
};
