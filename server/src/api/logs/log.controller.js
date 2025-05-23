// controllers/logController.js
const { Op } = require('sequelize');
const Log = require('./log.model');

exports.getAllLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      accion,
      medio,
      origen,
      codigo,
      fechaDesde,
      fechaHasta,
      idusuario,
    } = req.query;

    const where = {};
    if (accion) where.accion = { [Op.iLike]: `%${accion}%` };
    if (medio) where.medio = { [Op.iLike]: `%${medio}%` };
    if (origen) where.origen = { [Op.iLike]: `%${origen}%` };
    if (codigo) where.codigo = codigo;
    if (idusuario) where.idusuario = idusuario;
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) where.fecha[Op.gte] = new Date(fechaDesde);
      if (fechaHasta) where.fecha[Op.lte] = new Date(fechaHasta);
    }

    const offset = (page - 1) * limit;

    const { rows: logs } = await Log.findAndCountAll({
      where,
      order: [['fecha', 'DESC']],
      limit: +limit,
      offset,
    });

    res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs:', error);
    next(error);
  }
};

exports.getLogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await Log.findByPk(id);

    if (!log) {
      return res.status(404).json({ message: 'Log no encontrado' });
    }

    res.json(log);
  } catch (error) {
    console.error('Error al obtener log:', error);
    next(error);
  }
};

exports.createLog = async (req, res, next) => {
  try {
    const { accion, medio, origen, idusuario, codigo } = req.body;
    if (!accion || !medio || !origen || !codigo) {
      return res
        .status(400)
        .json({ message: 'Faltan datos obligatorios para crear el log' });
    }

    const newLog = await Log.create({
      accion,
      medio,
      origen,
      idusuario,
      codigo,
    });

    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error al crear log:', error);
    next(error);
  }
};

exports.deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Log.destroy({ where: { idlog: id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Log no encontrado' });
    }

    res.json({ message: 'Log eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar log:', error);
    next(error);
  }
};

exports.updateLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accion, medio, origen, idusuario, codigo } = req.body;

    const [updated] = await Log.update(
      { accion, medio, origen, idusuario, codigo },
      { where: { idlog: id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Log no encontrado o sin cambios' });
    }

    const updatedLog = await Log.findByPk(id);
    res.json(updatedLog);
  } catch (error) {
    console.error('Error al actualizar log:', error);
    next(error);
  }
};
