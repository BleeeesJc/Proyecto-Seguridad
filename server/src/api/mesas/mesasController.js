const Mesa = require('./mesasModel');

// Obtener todas las mesas visibles
const obtenerMesa = async (req, res, next) => {
  console.log('[Mesa] Obtener todas las mesas visibles');

  try {
    const mesas = await Mesa.findAll({ where: { visible: true } });
    console.log(`Mesas obtenidas (${mesas.length} registros)`);
    res.status(200).json(mesas);
  } catch (error) {
    next(error);
  }
};

// Obtener una mesa por ID
const obtenerMesaPorId = async (req, res, next) => {
  const { id } = req.params;
  console.log(`[Mesa] Buscar por ID | ID: ${id}`);

  try {
    const mesa = await Mesa.findOne({ where: { idmesa: id, visible: true } });

    if (!mesa) {
      console.warn(`Mesa no encontrada o no visible | ID: ${id}`);
      return res.status(404).json({ error: 'Mesa no encontrada o no está visible.' });
    }

    console.log(`Mesa encontrada | ID: ${id}`);
    res.status(200).json(mesa);
  } catch (error) {
    next(error);
  }
};

// Crear una nueva mesa
const crearMesa = async (req, res, next) => {
  const { nombre, capacidad, posx, posy } = req.body;
  console.log(`[Mesa] Crear | Nombre: ${nombre}, Capacidad: ${capacidad}, Posición: (${posx}, ${posy})`);

  try {
    const nuevaMesa = await Mesa.create({ nombre, capacidad, posx, posy });
    console.log(`Mesa creada | ID: ${nuevaMesa.idmesa}`);
    res.status(201).json(nuevaMesa);
  } catch (error) {
    next(error);
  }
};

// Actualizar una mesa existente
const actualizarMesa = async (req, res, next) => {
  const { id } = req.params;
  const { capacidad, nombre, posx, posy } = req.body;
  console.log(`🔧 [Mesa] Actualizar | ID: ${id}`);

  try {
    const mesa = await Mesa.findByPk(id);

    if (!mesa) {
      console.warn(`Mesa no encontrada | ID: ${id}`);
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    mesa.capacidad = capacidad ?? mesa.capacidad;
    mesa.nombre = nombre ?? mesa.nombre;
    mesa.posx = posx ?? mesa.posx;
    mesa.posy = posy ?? mesa.posy;

    await mesa.save();
    console.log(`Mesa actualizada | ID: ${id}`);
    res.status(200).json(mesa);
  } catch (error) {
    next(error);
  }
};

// Eliminar una mesa
const borrarMesa = async (req, res, next) => {
  const { id } = req.params;
  console.log(`[Mesa] Eliminar | ID: ${id}`);

  try {
    const mesa = await Mesa.findByPk(id);

    if (!mesa) {
      console.warn(`Mesa no encontrada | ID: ${id}`);
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    await mesa.destroy();
    console.log(`Mesa eliminada con éxito | ID: ${id}`);
    res.status(200).json({ message: 'Mesa eliminada con éxito' });
  } catch (error) {
    next(error);
  }
};

// Cambiar estado visible de una mesa
const actualizarEstadoMesa = async (req, res, next) => {
  const { id } = req.params;
  const { visible } = req.body;
  console.log(`[Mesa] Cambiar visibilidad | ID: ${id} → Visible: ${visible}`);

  try {
    const mesa = await Mesa.findByPk(id);

    if (!mesa) {
      console.warn(`Mesa no encontrada para actualizar visibilidad | ID: ${id}`);
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }

    mesa.visible = visible;
    await mesa.save();

    console.log(`Visibilidad actualizada | ID: ${id}, Visible: ${visible}`);
    res.status(200).json({ message: 'Estado de la mesa actualizado con éxito', mesa });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerMesa,
  crearMesa,
  actualizarMesa,
  borrarMesa,
  actualizarEstadoMesa,
  obtenerMesaPorId,
};
