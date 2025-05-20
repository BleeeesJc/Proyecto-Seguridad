const Mesa = require('./mesasModel');

// Obtener todas las mesas visibles
const obtenerMesa = async (req, res) => {
  console.log('[Mesa] Obtener todas las mesas visibles');

  try {
    const mesas = await Mesa.findAll({ where: { visible: true } });
    console.log(`Mesas obtenidas (${mesas.length} registros)`);
    res.status(200).json(mesas);
  } catch (error) {
    console.error(`Error al obtener mesas: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener las actividades' });
  }
};

// Obtener una mesa por ID
const obtenerMesaPorId = async (req, res) => {
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
    console.error(`Error al obtener la mesa | ID: ${id} | ${error.message}`);
    res.status(500).json({ error: 'Error al obtener la mesa.' });
  }
};

// Crear una nueva mesa
const crearMesa = async (req, res) => {
  const { nombre, capacidad, posx, posy } = req.body;
  console.log(`[Mesa] Crear | Nombre: ${nombre}, Capacidad: ${capacidad}, Posición: (${posx}, ${posy})`);

  try {
    const nuevaMesa = await Mesa.create({ nombre, capacidad, posx, posy });
    console.log(`Mesa creada | ID: ${nuevaMesa.idmesa}`);
    res.status(201).json(nuevaMesa);
  } catch (error) {
    console.error(`Error al crear mesa: ${error.message}`);
    res.status(500).json({ error: 'Error al crear la Mesa' });
  }
};

// Actualizar una mesa existente
const actualizarMesa = async (req, res) => {
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
    console.error(`Error al actualizar la mesa | ID: ${id} | ${error.message}`);
    res.status(500).json({ error: 'Error al actualizar la mesa' });
  }
};

// Eliminar una mesa
const borrarMesa = async (req, res) => {
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
    console.error(`Error al eliminar la mesa | ID: ${id} | ${error.message}`);
    res.status(500).json({ error: 'Error al borrar la mesa' });
  }
};

// Cambiar estado visible de una mesa
const actualizarEstadoMesa = async (req, res) => {
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
    console.error(`Error al actualizar visibilidad | ID: ${id} | ${error.message}`);
    res.status(500).json({ error: 'Error al actualizar el estado de la mesa' });
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
