// src/api/rol.controller.js
const Rol = require('../rol/rol.model');

exports.getAllRoles = async (req, res, next) => {
  console.log('[Rol] Obtener todos los roles');
  try {
    const roles = await Rol.findAll();
    console.log(`[Rol] Roles obtenidos: ${roles.length}`);
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

exports.getRolById = async (req, res, next) => {
  const { id } = req.params;
  console.log(`[Rol] Obtener por ID | idrol: ${id}`);
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      console.warn(`[Rol] Rol no encontrado | idrol: ${id}`);
      return res.status(404).json({ message: 'Rol not found' });
    }
    console.log(`[Rol] Rol encontrado | idrol: ${id}`);
    res.status(200).json(rol);
  } catch (error) {
    next(error);
  }
};

exports.createRol = async (req, res, next) => {
  console.log('📥 [Rol] Crear nuevo rol | Datos:', req.body);
  try {
    const {
      rol, asignacionroles, dashboard, ofertas,
      usuarios, platillos, pedidos, reservas,
      mapainteractivo, ofertacliente, pedidocliente,
      mapacliente, menucliente
    } = req.body;

    const newRol = await Rol.create({
      rol, asignacionroles, dashboard, ofertas,
      usuarios, platillos, pedidos, reservas,
      mapainteractivo, ofertacliente, pedidocliente,
      mapacliente, menucliente
    });

    console.log(`[Rol] Rol creado | idrol: ${newRol.idrol}`);
    return res.status(201).json(newRol);
  } catch (error) {
    next(error);
  }
};

exports.updateRol = async (req, res, next) => {
  const { id } = req.params;
  console.log(`[Rol] Actualizar | idrol: ${id} | Datos:`, req.body);
  try {
    const {
      rol, asignacionroles, dashboard, ofertas,
      usuarios, platillos, pedidos, reservas,
      mapainteractivo, ofertacliente, pedidocliente,
      mapacliente, menucliente
    } = req.body;

    const [updated] = await Rol.update({
      rol, asignacionroles, dashboard, ofertas,
      usuarios, platillos, pedidos, reservas,
      mapainteractivo, ofertacliente, pedidocliente,
      mapacliente, menucliente
    }, {
      where: { idrol: id }
    });

    if (!updated) {
      console.warn(`[Rol] Rol no encontrado para actualizar | idrol: ${id}`);
      return res.status(404).json({ message: 'Rol not found' });
    }

    console.log(`[Rol] Rol actualizado | idrol: ${id}`);
    res.status(200).json({ message: 'Rol updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteRol = async (req, res, next) => {
  const { id } = req.params;
  console.log(`[Rol] Eliminar | idrol: ${id}`);
  try {
    const deleted = await Rol.destroy({ where: { idrol: id } });
    if (!deleted) {
      console.warn(`[Rol] Rol no encontrado para eliminar | idrol: ${id}`);
      return res.status(404).json({ message: 'Rol not found' });
    }
    console.log(`[Rol] Rol eliminado | idrol: ${id}`);
    res.status(200).json({ message: 'Rol deleted successfully' });
  } catch (error) {
    next(error);
  }
};
