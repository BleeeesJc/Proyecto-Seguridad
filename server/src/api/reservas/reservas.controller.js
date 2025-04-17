// src/api/reserva.controller.js
const sequelize = require('../../config/db');
const nodemailer = require('nodemailer');
const Mesa = require('../mesas/mesasModel');
const Usuario = require('../usuario/usuario.model')

// Configurar transporter de nodemailer (ajústalo con tu configuración)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASS, // Tu contraseña o app password
    },
});

exports.crearReserva = async (req, res) => {
    const { idusuario, idmesa, fecha, hora, estado } = req.body; // Extraer datos del body
    console.log("Datos recibidos para crear reserva:", req.body);

    // Validar que todos los campos requeridos estén presentes
    if (!idusuario || !idmesa || !fecha || !hora || estado === undefined) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Ejecutar la consulta para crear la reserva
        const nuevaReserva = await sequelize.query(
            `INSERT INTO reserva (idusuario, idmesa, fecha, hora, estado)
             VALUES (:idusuario, :idmesa, :fecha, :hora, :estado)`,
            {
                replacements: { idusuario, idmesa, fecha, hora, estado },
                type: sequelize.QueryTypes.INSERT,
            }
        );

        // Obtener información del usuario
        const usuario = await Usuario.findOne({ where: { idusuario: idusuario } });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Obtener información de la mesa
        const mesa = await Mesa.findOne({ where: { idmesa: idmesa, visible: true } });
        if (!mesa) {
            return res.status(404).json({ error: 'Mesa no encontrada o no está visible.' });
        }

        // Configurar contenido del correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuario.correo, // Correo del usuario
            subject: 'Reserva Confirmada',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                    <h2>¡Gracias por tu reserva!</h2>
                    <p>Tu reserva ha sido realizada con éxito.</p>
                    <p><strong>Detalles de la Reserva:</strong></p>
                    <ul style="list-style: none; padding: 0; text-align: left;">
                        <li><strong>Fecha:</strong> ${fecha}</li>
                        <li><strong>Hora:</strong> ${hora}</li>
                        <li><strong>Mesa:</strong> ${mesa.nombre}</li>
                    </ul>
                    <p>Gracias por elegirnos. ¡Te esperamos!</p>
                </div>
            `,
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);

        // Responder con éxito
        res.status(201).json({ 
            message: 'Reserva creada y correo enviado exitosamente', 
            data: nuevaReserva 
        });
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
};

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
    try {
        const reservas = await sequelize.query(
            `SELECT r.idreserva, r.idusuario, r.idmesa, r.fecha, r.hora, r.estado, u.nombre AS nombre
             FROM reserva r
             JOIN usuario u ON r.idusuario = u.idusuario`,
            { type: sequelize.QueryTypes.SELECT }
        );
        res.json(reservas);
    } catch (error) {
        console.error("Error al obtener las reservas:", error);
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

// Actualizar una reserva
exports.actualizarReserva = async (req, res) => {
    const { id } = req.params;
    const { fecha, hora, estado, idusuario, idmesa } = req.body;

    console.log("Datos antes de la consulta SQL:", {
        id,
        fecha,
        hora,
        estado: typeof estado, // Debe ser number
        idusuario: typeof idusuario, // Debe ser number
        idmesa: typeof idmesa, // Debe ser number
      });
      
    console.log("Datos recibidos en el backend para actualizar:", {
        id,
        fecha,
        hora,
        estado,
        idusuario,
        idmesa
    });

    try {
        const [actualizado] = await sequelize.query(
            `UPDATE reserva 
             SET fecha = :fecha, hora = :hora, estado = :estado, idusuario = :idusuario, idmesa = :idmesa
             WHERE idreserva = :id`,
            {
                replacements: { id, fecha, hora, estado: estado, idusuario, idmesa },
                type: sequelize.QueryTypes.UPDATE,
            }
        );

        if (actualizado) {
            res.json({ message: 'Reserva actualizada exitosamente' });
        } else {
            res.status(404).json({ error: 'Reserva no encontrada' });
        }
    } catch (error) {
        console.error("Error al actualizar la reserva:", error);
        res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
};


// Eliminar una reserva
exports.eliminarReserva = async (req, res) => {
    const { id } = req.params;

    try {
        const eliminado = await sequelize.query(
            `DELETE FROM reserva WHERE idreserva = :id`,
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            }
        );

        if (eliminado) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Reserva no encontrada' });
        }
    } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
};
exports.verificarDisponibilidad = async (req, res) => {
    const { idmesa, fecha, hora, idreserva } = req.query;
    console.log("Parámetros recibidos:", { idmesa, fecha, hora, idreserva });
    if (!idmesa || !fecha || !hora) {
        return res.status(400).json({ error: 'Parámetros inválidos o incompletos.' });
    }
    try {
        const reservasConflicto = await sequelize.query(
            `SELECT * 
             FROM reserva 
             WHERE idmesa = :idmesa 
             AND fecha = :fecha 
             AND estado = 1
             AND ABS(EXTRACT(EPOCH FROM (hora::time - :hora::time)) / 60) <= 90
             AND (idreserva != :idreserva OR :idreserva IS NULL)`, // Excluye la reserva actual
            {
                replacements: { idmesa, fecha, hora, idreserva: idreserva || null },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (reservasConflicto.length > 0) {
            return res.json({ disponible: false });
        }
        res.json({ disponible: true });
    } catch (error) {
        console.error("Error al verificar disponibilidad:", error);
        res.status(500).json({ error: 'Error al verificar disponibilidad' });
    }
};

// Controlador para verificar si el usuario está registrado
exports.verificarUsuario = async (req, res) => {
    const { idusuario } = req.query;

    try {
        const [usuario] = await sequelize.query(
            `SELECT * FROM usuario WHERE idusuario = :idusuario`,
            {
                replacements: { idusuario },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (!usuario) {
            return res.json({ registrado: false });
        }

        res.json({ registrado: true });
    } catch (error) {
        console.error("Error al verificar usuario:", error);
        res.status(500).json({ error: "Error al verificar usuario" });
    }
};

exports.enviarRecordatorios = async () => {
    try {
        const ahora = new Date();
        const seisHorasDespues = new Date(ahora.getTime() + 6 * 60 * 60 * 1000);

        // Buscar reservas con estado activo que ocurran en las próximas 6 horas
        const reservas = await sequelize.query(
            `SELECT r.*, u.correo
             FROM reserva r
             JOIN usuario u ON r.idusuario = u.idusuario
             WHERE r.estado = 1 AND r.fecha = :fecha AND r.hora BETWEEN :horaInicio AND :horaFin`,
            {
                replacements: {
                    fecha: seisHorasDespues.toISOString().split('T')[0], // Fecha en formato YYYY-MM-DD
                    horaInicio: ahora.toTimeString().split(' ')[0],     // Hora actual en HH:MM:SS
                    horaFin: seisHorasDespues.toTimeString().split(' ')[0], // Hora + 6 horas
                },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        // Enviar correo por cada reserva encontrada
        for (const reserva of reservas) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: reserva.correo,
                subject: 'Recordatorio de tu reserva',
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                        <h2>¡Recordatorio de tu reserva!</h2>
                        <p>Te recordamos que tienes una reserva próxima en nuestro restaurante.</p>
                        <p><strong>Detalles de la Reserva:</strong></p>
                        <ul style="list-style: none; padding: 0; text-align: left;">
                            <li><strong>Fecha:</strong> ${reserva.fecha}</li>
                            <li><strong>Hora:</strong> ${reserva.hora}</li>
                        </ul>
                        <p>Por favor, no dudes en contactarnos si necesitas modificar o cancelar tu reserva.</p>
                        <p>¡Te esperamos!</p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Recordatorio enviado a ${reserva.email}`);
        }

        console.log('Todos los recordatorios han sido enviados.');
    } catch (error) {
        console.error('Error al enviar recordatorios:', error);
    }
};


exports.obtenerReservasPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;
    if (!idUsuario) {
        return res.status(400).json({ error: 'El idUsuario es obligatorio.' });
    }

    try {
        const reservas = await sequelize.query(
            `SELECT * FROM reserva WHERE idusuario = :idUsuario`,
            {
                replacements: { idUsuario },
                type: sequelize.QueryTypes.SELECT,
            }
        );
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas por usuario:', error);
        res.status(500).json({ error: 'Error al obtener reservas.' });
    }
};



