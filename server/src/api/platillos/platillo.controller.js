// src/api/platillos/platillo.controller.js
const sequelize = require('../../config/db');

// Crear un nuevo platillo
exports.crearPlatillo = async (req, res) => {
  const { nombre, descripcion, precio, idCategoria, imagenExterna } = req.body;
  const imagen = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : imagenExterna || null;
  const estado = 1;

  console.log(`[Platillo] Crear | Nombre: "${nombre}", Categoría: ${idCategoria}, Precio: ${precio}, Imagen: ${imagen ? '✔️' : '❌'}`);

  try {
      await sequelize.query(
          `INSERT INTO platillo (nombre, descripcion, precio, idCategoria, imagen, estado)
           VALUES (:nombre, :descripcion, :precio, :idCategoria, :imagen, :estado)`,
          {
              replacements: { nombre, descripcion, precio, idCategoria, imagen, estado },
              type: sequelize.QueryTypes.INSERT,
          }
      );
      console.log(`[Platillo] Creado exitosamente | Nombre: "${nombre}"`);
      res.status(201).json({ message: 'Platillo creado exitosamente' });
  } catch (error) {
      console.error(`[Platillo] Error al crear | Nombre: "${nombre}" | ${error.message}`);
      res.status(500).json({ error: 'Error al crear el platillo', details: error.message });
  }
};

// Obtener todos los platillos
exports.obtenerPlatillos = async (req, res) => {
    console.log('[Platillo] Obtener todos (estado != 0)');
    try {
        const platillos = await sequelize.query(
            `SELECT * FROM platillo where estado != 0`,
            { type: sequelize.QueryTypes.SELECT }
        );
        console.log(`[Platillo] Obtenidos: ${platillos.length}`);
        res.json(platillos);
    } catch (error) {
        console.error(`[Platillo] Error al obtener | ${error.message}`);
        res.status(500).json({ error: 'Error al obtener los platillos' });
    }
};

// Actualizar un platillo
exports.actualizarPlatillo = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, idCategoria, imagen } = req.body;
    console.log(`[Platillo] Actualizar | ID: ${id}, Nombre: "${nombre}"`);

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
            console.log(`[Platillo] Actualizado | ID: ${id}`);
            res.json({ message: 'Platillo actualizado exitosamente' });
        } else {
            console.warn(`[Platillo] No encontrado al actualizar | ID: ${id}`);
            res.status(404).json({ error: 'Platillo no encontrado' });
        }
    } catch (error) {
        console.error(`[Platillo] Error al actualizar | ID: ${id} | ${error.message}`);
        res.status(500).json({ error: 'Error al actualizar el platillo', details: error.message });
    }
};

// Eliminar un platillo
exports.eliminarPlatillo = async (req, res) => {
    const { id } = req.params;
    console.log(`[Platillo] Eliminar | ID: ${id}`);

    try {
        const eliminado = await sequelize.query(
            `DELETE FROM platillo WHERE idplato = :id`,
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            }
        );

        if (eliminado) {
            console.log(`[Platillo] Eliminado | ID: ${id}`);
            res.status(204).json();
        } else {
            console.warn(`[Platillo] No encontrado al eliminar | ID: ${id}`);
            res.status(404).json({ error: 'Platillo no encontrado' });
        }
    } catch (error) {
        console.error(`[Platillo] Error al eliminar | ID: ${id} | ${error.message}`);
        res.status(500).json({ error: 'Error al eliminar el platillo', details: error.message });
    }
};

// Cambiar el estado de un platillo a "desactivado" (de 1 a 0)
exports.cambiarDesactivado = async (req, res) => {
    const { id } = req.params;
    console.log(`[Platillo] Desactivar | ID: ${id}`);

    try {
      const [actualizado] = await sequelize.query(
        `UPDATE platillo SET estado = 0 WHERE idplato = :id`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.UPDATE,
        }
      );
  
      if (actualizado) {
        console.log(`[Platillo] Desactivado | ID: ${id}`);
        res.json({ message: 'Platillo desactivado correctamente' });
      } else {
        console.warn(`[Platillo] No encontrado al desactivar | ID: ${id}`);
        res.status(404).json({ error: 'Platillo no encontrado' });
      }
    } catch (error) {
      console.error(`[Platillo] Error al desactivar | ID: ${id} | ${error.message}`);
      res.status(500).json({ error: 'Error al desactivar el platillo', details: error.message });
    }
};
  
// Cambiar el estado de un platillo entre destacado (2) y no destacado (1)
exports.toggleDestacado = async (req, res) => {
  const { id } = req.params;
  console.log(`[Platillo] Toggle destacado | ID: ${id}`);

  try {
    const [platillo] = await sequelize.query(
      `SELECT estado FROM platillo WHERE idplato = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!platillo) {
      console.warn(`[Platillo] No encontrado al togglear destacado | ID: ${id}`);
      return res.status(404).json({ error: 'Platillo no encontrado' });
    }

    const nuevoEstado = platillo.estado === 2 ? 1 : 2;
    console.log(`[Platillo] Estado actual: ${platillo.estado} → Nuevo: ${nuevoEstado}`);

    const [actualizado] = await sequelize.query(
      `UPDATE platillo SET estado = :nuevoEstado WHERE idplato = :id`,
      {
        replacements: { id, nuevoEstado },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      console.log(`[Platillo] Destacado toggled | ID: ${id}, Estado: ${nuevoEstado}`);
      res.json({ message: 'Estado del platillo actualizado', nuevoEstado });
    } else {
      console.warn(`[Platillo] Falló toggle destacado | ID: ${id}`);
      res.status(404).json({ error: 'Error al actualizar el estado del platillo' });
    }
  } catch (error) {
    console.error(`[Platillo] Error al togglear destacado | ID: ${id} | ${error.message}`);
    res.status(500).json({ error: 'Error al cambiar el estado del platillo', details: error.message });
  }
};
  
// Obtener platillos con sus ofertas
exports.obtenerPlatillosOfertas = async (req, res) => {
  console.log('[Platillo] Obtener con ofertas');
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
      console.log(`[Platillo] Con ofertas obtenidos: ${platillos.length}`);
      res.json(platillos);
  } catch (error) {
      console.error(`[Platillo] Error al obtener con ofertas | ${error.message}`);
      res.status(500).json({ error: 'Error al obtener los platillos con ofertas' });
  }
};
