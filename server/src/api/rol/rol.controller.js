// src/api/rol.controller.js
const Rol = require('../rol/rol.model');
const Logs = require("../logs/log.model");
const axios = require("axios");

// GET ALL ROLES
exports.getAllRoles = async (req, res) => {
  const idUsuario = req.user.id;
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
    await Logs.create({
      accion: `Usuario ${idUsuario} consultó todos los roles`,
      medio: "rol",
      fecha: new Date(),
      origen: "usuario",
      idusuario: idUsuario,
      codigo: 200,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    await Logs.create({
      accion: `Error del sistema al extraer todos los roles`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      codigo: 500,
    });
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ROL BY ID
exports.getRolById = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      await Logs.create({
        accion: `Rol con id ${id} no encontrado al buscar por ID`,
        medio: "rol",
        fecha: new Date(),
        origen: "sistema",
        codigo: 404,
      });
      return res.status(404).json({ message: 'Rol not found' });
    }
    res.status(200).json(rol);
  } catch (error) {
    console.error('Error fetching rol:', error);
    await Logs.create({
      accion: `Error del sistema al buscar rol por ID: ${id}`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      codigo: 500,
    });
    res.status(500).json({ message: 'Internal server error' });
  }
};

// CREATE ROL
exports.createRol = async (req, res) => {
  const idUsuario = req.user.id;
  try {
    const {
      rol, asignacionroles, dashboard, ofertas, usuarios,
      platillos, pedidos, reservas, mapainteractivo,
      ofertacliente, pedidocliente, mapacliente, menucliente
    } = req.body;

    const newRol = await Rol.create({
      rol, asignacionroles, dashboard, ofertas, usuarios,
      platillos, pedidos, reservas, mapainteractivo,
      ofertacliente, pedidocliente, mapacliente, menucliente
    });

    await Logs.create({
      accion: `Usuario ${idUsuario} creó un nuevo rol: "${rol}" con ID ${newRol.idrol}`,
      medio: "rol",
      fecha: new Date(),
      origen: "usuario",
      idusuario: idUsuario,
      codigo: 201,
    });

    return res.status(201).json(newRol);
  } catch (error) {
    console.error(`[Rol] Error creating rol`);
    await Logs.create({
      accion: `Error del sistema al crear un nuevo rol con nombre "${req.body.rol}"`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      codigo: 500,
    });
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE ROL
exports.updateRol = async (req, res) => {
  const idUsuario = req.user.id;
  const { id } = req.params;
  const {
    rol, asignacionroles, dashboard, ofertas, usuarios,
    platillos, pedidos, reservas, mapainteractivo,
    ofertacliente, pedidocliente, mapacliente, menucliente
  } = req.body;

  try {
    const [updated] = await Rol.update({
      rol, asignacionroles, dashboard, ofertas, usuarios,
      platillos, pedidos, reservas, mapainteractivo,
      ofertacliente, pedidocliente, mapacliente, menucliente
    }, {
      where: { idrol: id }
    });

    if (!updated) {
      await Logs.create({
        accion: `Error: Rol con ID ${id} no encontrado para actualizar`,
        medio: "rol",
        fecha: new Date(),
        origen: "sistema",
        codigo: 404,
      });
      return res.status(404).json({ message: 'Rol not found' });
    }

    await Logs.create({
      accion: `Usuario ${idUsuario} actualizó el rol con ID ${id} a nombre "${rol}"`,
      medio: "rol",
      fecha: new Date(),
      origen: "usuario",
      idusuario: idUsuario,
      codigo: 200,
    });

    res.status(200).json({ message: 'Rol updated successfully' });
  } catch (error) {
    await Logs.create({
      accion: `Error del sistema al actualizar rol con ID ${id}`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      codigo: 500,
    });
    console.error('Error updating rol:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE ROL
exports.deleteRol = async (req, res) => {
  const idUsuario = req.user.id;
  const { id } = req.params;

  try {
    const deleted = await Rol.destroy({ where: { idrol: id } });

    if (!deleted) {
      await Logs.create({
        accion: `Rol con ID ${id} no encontrado para eliminar`,
        medio: "rol",
        fecha: new Date(),
        origen: "sistema",
        codigo: 404,
      });
      return res.status(404).json({ message: 'Rol not found' });
    }

    await Logs.create({
      accion: `Usuario ${idUsuario} eliminó el rol con ID ${id}`,
      medio: "rol",
      fecha: new Date(),
      origen: "usuario",
      idusuario: idUsuario,
      codigo: 200,
    });

    res.status(200).json({ message: 'Rol deleted successfully' });
  } catch (error) {
    await Logs.create({
      accion: `Error del sistema al eliminar rol con ID ${id}`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      codigo: 500,
    });
    console.error('Error deleting rol:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
