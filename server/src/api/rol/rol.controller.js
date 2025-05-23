// src/api/rol.controller.js
const Rol = require('../rol/rol.model');
const Logs = require("../logs/log.model");
const axios = require("axios");

// GET ALL ROLES
exports.getAllRoles = async (req, res, next) => {
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
      accion: `El usuario ${idUsuario} tuvo un error en el sistema al extraer todos los roles: ${error.message}`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      idusuario: idUsuario,
      codigo: 500,
    });
    next(error);
  }
};

// GET ROL BY ID
exports.getRolById = async (req, res, next) => {
  const idUsuario = req.user.id;
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      await Logs.create({
        accion: `El usuario ${idUsuario} intentó buscar rol con id ${id}, pero no fue encontrado`,
        medio: "rol",
        fecha: new Date(),
        origen: "sistema",
        idusuario: idUsuario,
        codigo: 404,
      });
      return res.status(404).json({ message: 'Rol not found' });
    }
    res.status(200).json(rol);
  } catch (error) {
    console.error('Error fetching rol:', error);
    await Logs.create({
      accion: `El usuario ${idUsuario} tuvo un error en el sistema al buscar rol por ID ${id}: ${error.message}`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      idusuario: idUsuario,
      codigo: 500,
    });
    next(error);
  }
};

// CREATE ROL
exports.createRol = async (req, res, next) => {
  const idUsuario = req.user.id;
  try {
    const {
      rol, asignacionroles, dashboard, ofertas, usuarios,
      platillos, pedidos, reservas, mapainteractivo,
      ofertacliente, pedidocliente, mapacliente, menucliente, logs
    } = req.body;

    const newRol = await Rol.create({
      rol, asignacionroles, dashboard, ofertas, usuarios,
      platillos, pedidos, reservas, mapainteractivo,
      ofertacliente, pedidocliente, mapacliente, menucliente, logs
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
    console.error('[Rol] Error creating rol:', error);
    await Logs.create({
      accion: `El usuario ${idUsuario} tuvo un error en el sistema al crear un nuevo rol "${req.body.rol}": ${error.message}`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      idusuario: idUsuario,
      codigo: 500,
    });
    next(error);
  }
};

// UPDATE ROL
exports.updateRol = async (req, res, next) => {
  const idUsuario = req.user.id;
  const { id } = req.params;
  const {
    rol, asignacionroles, dashboard, ofertas, usuarios,
    platillos, pedidos, reservas, mapainteractivo,
    ofertacliente, pedidocliente, mapacliente, menucliente, logs
  } = req.body;

  try {
    const [updated] = await Rol.update({
      rol, asignacionroles, dashboard, ofertas, usuarios,
      platillos, pedidos, reservas, mapainteractivo,
      ofertacliente, pedidocliente, mapacliente, menucliente, logs
    }, {
      where: { idrol: id }
    });

    if (!updated) {
      await Logs.create({
        accion: `El usuario ${idUsuario} intentó actualizar rol con ID ${id}, pero no fue encontrado`,
        medio: "rol",
        fecha: new Date(),
        origen: "sistema",
        idusuario: idUsuario,
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
    console.error('Error updating rol:', error);
    await Logs.create({
      accion: `El usuario ${idUsuario} tuvo un error en el sistema al actualizar rol con ID ${id}: ${error.message}`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      idusuario: idUsuario,
      codigo: 500,
    });
    next(error);
  }
};

// DELETE ROL
exports.deleteRol = async (req, res, next) => {
  const idUsuario = req.user.id;
  const { id } = req.params;

  try {
    const deleted = await Rol.destroy({ where: { idrol: id } });

    if (!deleted) {
      await Logs.create({
        accion: `El usuario ${idUsuario} intentó eliminar rol con ID ${id}, pero no fue encontrado`,
        medio: "rol",
        fecha: new Date(),
        origen: "sistema",
        idusuario: idUsuario,
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
    console.error('Error deleting rol:', error);
    await Logs.create({
      accion: `El usuario ${idUsuario} tuvo un error en el sistema al eliminar rol con ID ${id}: ${error.message}`,
      medio: "rol",
      fecha: new Date(),
      origen: "sistema",
      idusuario: idUsuario,
      codigo: 500,
    });
    next(error);
  }
};
