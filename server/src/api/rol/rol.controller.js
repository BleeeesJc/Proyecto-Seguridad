// src/api/rol.controller.js
const Rol = require('../rol/rol.model');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRolById = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol not found' });
    }
    res.status(200).json(rol);
  } catch (error) {
    console.error('Error fetching rol:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createRol = async (req, res) => {
  try {
    const {
      rol, pagos, reservas, menu, ofertas,
      usuarios, platillos, mesas, paneladmin, roles, reportes
    } = req.body;

    const newRol = await Rol.create({
      rol, pagos, reservas, menu, ofertas,
      usuarios, platillos, mesas, paneladmin, roles, reportes
    });
    return res.status(201).json(newRol);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateRol = async (req, res) => {
  const { id } = req.params;
  const { rol, pagos, reservas, menu, ofertas, usuarios, platillos, mesas, paneladmin, roles, reportes } = req.body;
  try {
    const [updated] = await Rol.update({ rol, pagos, reservas, menu, ofertas, usuarios, platillos, mesas, paneladmin, roles, reportes }, {
      where: { idrol: id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Rol not found' });
    }
    res.status(200).json({ message: 'Rol updated successfully' });
  } catch (error) {
    console.error('Error updating rol:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteRol = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Rol.destroy({
      where: { idrol: id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Rol not found' });
    }
    res.status(200).json({ message: 'Rol deleted successfully' });
  } catch (error) {
    console.error('Error deleting rol:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};