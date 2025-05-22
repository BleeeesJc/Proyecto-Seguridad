const sequelize = require('../../config/db');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Crear una nueva oferta
exports.crearOferta = async (req, res) => {
    try {
        const { titulo, requerimiento, descripcion, fecha_inicio, fecha_fin, descuento, idPlato } = req.body;
        const src = req.file ? req.file.path : null; // Ruta relativa de la imagen

        // Valida los datos requeridos
        if (!titulo || !requerimiento || !descripcion || !fecha_inicio || !fecha_fin || !descuento || !idPlato || !src) {
            console.warn('[Oferta] Datos incompletos en creación');
            return res.status(400).json({ error: "Todos los campos son requeridos." });
        }

        // Inserta la oferta en la base de datos
        await sequelize.query(
            `INSERT INTO oferta (src, titulo, requerimiento, descripcion, fecha_inicio, fecha_fin, descuento, idplato)
         VALUES (:src, :titulo, :requerimiento, :descripcion, :fecha_inicio, :fecha_fin, :descuento, :idPlato)`,
            {
                replacements: { src, titulo, requerimiento, descripcion, fecha_inicio, fecha_fin, descuento, idPlato },
                type: sequelize.QueryTypes.INSERT,
            }
        );
        console.log('[Oferta] Registro insertado en BD');
        // Obtener todos los usuarios con rol 1
        const usuarios = await sequelize.query(
            `SELECT correo FROM usuario WHERE idRol = 1`,
            { type: sequelize.QueryTypes.SELECT }
        );
        console.log(`[Oferta] Enviando correos a ${usuarios.length} usuarios con rol 1`);
        const emailPromises = usuarios.map(usuario => {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: usuario.correo,
                subject: 'Nueva Oferta Disponible',
                html: `
                    <h1>¡Nueva Oferta Disponible!</h1>
                    <p>¡No te pierdas esta oportunidad! Hemos lanzado una nueva oferta:</p>
                    <ul>
                        <li><strong>Título:</strong> ${titulo}</li>
                        <li><strong>Requisito:</strong> ${requerimiento}</li>
                        <li><strong>Descripción:</strong> ${descripcion}</li>
                        <li><strong>Descuento:</strong> ${descuento}%</li>
                        <li><strong>Fecha de Inicio:</strong> ${fecha_inicio}</li>
                        <li><strong>Fecha de Expiración:</strong> ${fecha_fin}</li>
                    </ul>
                    <p>¡Aprovecha antes de que expire!</p>
                `,
            };
            return transporter.sendMail(mailOptions);
        });

        // Esperar que todos los correos sean enviados
        await Promise.all(emailPromises);
        console.log('[Oferta] Correos enviados correctamente');
        res.status(201).json({ message: "Oferta creada y correos enviados a los usuarios con rol 1." });
    } catch (error) {
        next(error);
    }
};

// Obtener todas las ofertas
exports.obtenerOfertas = async (req, res) => {
    try {
        const ofertas = await sequelize.query(
            `SELECT * FROM oferta`,
            { type: sequelize.QueryTypes.SELECT }
        );
        console.log(`[Oferta] Ofertas obtenidas: ${ofertas.length}`);
        res.json(ofertas);
    } catch (error) {
        next(error);
    }
};

// Actualizar una oferta
exports.actualizarOferta = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, requerimiento, descripcion, fecha_inicio, fecha_fin, descuento, idPlato } = req.body;

        // Usa la nueva imagen si se proporciona
        const src = req.file ? req.file.path : null;
        console.log(`[Oferta] Actualizar | ID: ${id}, Título: "${titulo}", Descuento: ${descuento}%`);
        if (!titulo || !requerimiento || !descripcion || !fecha_inicio || !fecha_fin || !descuento || !idPlato) {
            return res.status(400).json({ error: "Todos los campos son requeridos." });
        }

        // Construir la consulta condicionalmente
        const replacements = { id, src, titulo, requerimiento, descripcion, fecha_inicio, fecha_fin, descuento, idPlato };
        let query = `UPDATE oferta SET 
                        titulo = :titulo,
                        requerimiento = :requerimiento,
                        descripcion = :descripcion,
                        fecha_inicio = :fecha_inicio,
                        fecha_fin = :fecha_fin,
                        descuento = :descuento,
                        idPlato = :idPlato
                     WHERE idOferta = :id`;

        if (src) {
            console.log(`[Oferta] Imagen actualizada | Ruta: ${src}`);
            query = `UPDATE oferta SET 
                        src = :src,
                        titulo = :titulo,
                        requerimiento = :requerimiento,
                        descripcion = :descripcion,
                        fecha_inicio = :fecha_inicio,
                        fecha_fin = :fecha_fin,
                        descuento = :descuento,
                        idPlato = :idPlato
                     WHERE idOferta = :id`;
        }

        // Ejecuta la consulta
        const [actualizado] = await sequelize.query(query, { replacements, type: sequelize.QueryTypes.UPDATE });

        if (!actualizado) {
            console.warn(`[Oferta] No se encontró oferta con ID: ${id}`);
            return res.status(404).json({ error: "Oferta no encontrada." });
        }
        console.log(`[Oferta] Registro actualizado | ID: ${id}`);
        // Envía correos si es necesario (maneja errores dentro de esta lógica)
        try {
            const usuarios = await sequelize.query(
                `SELECT correo FROM usuario WHERE idRol = 1`,
                { type: sequelize.QueryTypes.SELECT }
            );
            console.log(`[Oferta] Reenvío de correos a ${usuarios.length} usuarios`);
            const emailPromises = usuarios.map(usuario => {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: usuario.correo,
                    subject: "Oferta Actualizada",
                    html: `
                        <h1>¡Oferta Actualizada!</h1>
                        <p>¡Hemos actualizado una de nuestras ofertas:</p>
                        <ul>
                            <li><strong>Título:</strong> ${titulo}</li>
                            <li><strong>Requisito:</strong> ${requerimiento}</li>
                            <li><strong>Descripción:</strong> ${descripcion}</li>
                            <li><strong>Descuento:</strong> ${descuento}%</li>
                            <li><strong>Fecha de Inicio:</strong> ${fecha_inicio}</li>
                            <li><strong>Fecha de Expiración:</strong> ${fecha_fin}</li>
                        </ul>
                        <p>¡No te lo pierdas!</p>
                    `,
                };
                return transporter.sendMail(mailOptions);
            });

            await Promise.all(emailPromises);
            console.log('[Oferta] Correos de actualización enviados');
        } catch (error) {
            next(error);
        }

        // Envía respuesta de éxito
        return res.json({ message: "Oferta actualizada correctamente y correos enviados." });
    } catch (error) {
        next(error);
    }
};


// Eliminar una oferta
exports.eliminarOferta = async (req, res) => {
    const { id } = req.params;
    console.log(`[Oferta] Eliminar | ID: ${id}`);
    try {
        const eliminado = await sequelize.query(
            `DELETE FROM oferta WHERE idOferta = :id`,
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            }
        );

        if (eliminado) {
            console.log(`[Oferta] Oferta eliminada | ID: ${id}`);
            return res.status(204).json();
        } else {
            console.warn(`[Oferta] No se encontró oferta para eliminar | ID: ${id}`);
            return res.status(404).json({ error: 'Oferta no encontrada' });
        }
    } catch (error) {
        console.error(`[Oferta] Error al eliminar la oferta | ${error.message}`);
        res.status(500).json({ error: 'Error al eliminar la oferta' });
    }
};  