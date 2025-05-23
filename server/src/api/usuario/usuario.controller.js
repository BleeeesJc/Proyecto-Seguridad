// src/api/usuario.controller.js
const sequelize = require("../../config/db");
const emailExistence = require("email-existence");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const HistoricoContrasenas = require("../historico_contrasenas/historico_contrasenas.model");

const verificationCodes = {}; // temporal

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// Crear un nuevo usuario
exports.registrarUsuario = async (req, res, next) => {
  const { nombre, apellidos, email, password, idrol } = req.body;
  console.log(
    `[Usuario] Registrar | ${nombre} ${apellidos}, email: ${email}, rol recibido: ${idrol}`
  );

  try {
    let rolId = idrol;
    if (!rolId) {
      console.log('[Usuario] Buscando rol por defecto "usuario"');
      const [rolUsuario] = await sequelize.query(
        `SELECT idrol FROM rol WHERE rol = 'usuario'`,
        { type: sequelize.QueryTypes.SELECT }
      );
      rolId = rolUsuario?.idrol;
    }

    if (!rolId) {
      console.error("[Usuario] No se pudo determinar rol válido");
      return res
        .status(500)
        .json({
          message: "No se pudo determinar un rol válido para el usuario",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("[Usuario] Contraseña hasheada");
    await sequelize.query(
      `INSERT INTO usuario (nombre, apellidos, correo, password, idrol)
       VALUES (:nombre, :apellidos, :email, :password, :idrol)`,
      {
        replacements: {
          nombre,
          apellidos,
          email,
          password: hashedPassword,
          idrol: rolId,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    console.log(`[Usuario] Registrado exitosamente | rol: ${rolId}`);
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Actualizar solo el rol de un usuario
exports.actualizarRolUsuario = async (req, res, next) => {
  const { id } = req.params;
  const { idRol } = req.body;
  console.log(
    `[Usuario] Actualizar rol | idUsuario: ${id}, nuevo rol: ${idRol}`
  );

  try {
    const [actualizado] = await sequelize.query(
      `UPDATE usuario SET idrol = :idRol WHERE idUsuario = :id`,
      { replacements: { id, idRol }, type: sequelize.QueryTypes.UPDATE }
    );
    if (!actualizado) {
      console.warn(
        `[Usuario] No encontrado para actualizar rol | idUsuario: ${id}`
      );
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.log(`[Usuario] Rol actualizado | idUsuario: ${id}`);
    res.json({ message: "Rol del usuario actualizado exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res, next) => {
  console.log("[Usuario] Obtener todos");
  try {
    const usuarios = await sequelize.query(`SELECT * FROM usuario`, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log(`[Usuario] Usuarios obtenidos: ${usuarios.length}`);
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

//Obtener todos los usuarios de un rol en especifico
exports.obtenerUsuariosPorRol = async (req, res, next) => {
  const { rol } = req.params;
  console.log(`[Usuario] Obtener por rol | rol: ${rol}`);
  try {
    const usuarios = await sequelize.query(
      `SELECT * FROM usuario WHERE rol = :rol`,
      { replacements: { rol }, type: sequelize.QueryTypes.SELECT }
    );
    console.log(`[Usuario] Usuarios con rol "${rol}": ${usuarios.length}`);
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

// Obtener un único usuario por ID
exports.obtenerUsuarioPorId = async (req, res, next) => {
  const { id } = req.params;
  console.log(`🔍 [Usuario] Obtener por ID | idUsuario: ${id}`);
  try {
    const usuario = await sequelize.query(
      `SELECT * FROM usuario WHERE idUsuario = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (usuario.length > 0) {
      console.log(`[Usuario] Usuario encontrado | idUsuario: ${id}`);
      res.json(usuario[0]);
    } else {
      console.warn(`[Usuario] No encontrado | idUsuario: ${id}`);
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    next(error);
  }
};

// Actualizar un usuario
exports.actualizarUsuario = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, apellidos, correo, password, idRol } = req.body;
  console.log(`[Usuario] Actualizar | idUsuario: ${id}`);
  try {
    const [actualizado] = await sequelize.query(
      `UPDATE usuario SET nombre = :nombre, apellidos = :apellidos, 
       correo = :correo, password = :password, idRol = :idRol
       WHERE idUsuario = :id`,
      {
        replacements: { id, nombre, apellidos, correo, password, idRol },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      console.log(`[Usuario] Actualizado | idUsuario: ${id}`);
      res.json({ message: "Usuario actualizado exitosamente" });
    } else {
      console.warn(
        `[Usuario] No encontrado para actualizar | idUsuario: ${id}`
      );
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    next(error);
  }
};

// Obtener un usuario por su correo
exports.obtenerUsuarioPorCorreo = async (req, res, next) => {
  const { correo } = req.params;
  console.log(`[Usuario] Obtener por correo | correo: ${correo}`);
  try {
    const usuario = await sequelize.query(
      `SELECT idusuario FROM usuario WHERE correo = :correo`,
      { replacements: { correo }, type: sequelize.QueryTypes.SELECT }
    );
    if (usuario.length === 0) {
      console.warn(`[Usuario] No encontrado por correo | ${correo}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.log(`[Usuario] Encontrado por correo | ${correo}`);
    res.json(usuario[0]);
  } catch (error) {
    next(error);
  }
};

// Actualizar contraseña con validación de histórico
exports.actualizarContrasena = async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  console.log(`[Usuario] Actualizar contraseña | idUsuario: ${id}`);

  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log("[Usuario] Nueva contraseña hasheada");
    const [usuarioActual] = await sequelize.query(
      `SELECT password FROM usuario WHERE idusuario = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!usuarioActual) {
      console.warn(
        `[Usuario] No encontrado al buscar contraseña actual | idUsuario: ${id}`
      );
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordActual = usuarioActual.password;
    const esMismaActual = await bcrypt.compare(newPassword, passwordActual);
    if (esMismaActual) {
      console.warn("[Usuario] Contraseña nueva igual a la actual");
      return res
        .status(400)
        .json({ message: "No puedes usar tu contraseña actual nuevamente." });
    }
    const historicos = await HistoricoContrasenas.findAll({
      where: { idusuario: id },
    });

    for (const registro of historicos) {
      const coincide = await bcrypt.compare(newPassword, registro.password);
      if (coincide) {
        console.warn("[Usuario] Contraseña ya usada anteriormente");
        return res
          .status(400)
          .json({
            message:
              "No puedes usar una contraseña que ya hayas usado anteriormente.",
          });
      }
    }
    await HistoricoContrasenas.create({
      idusuario: id,
      password: passwordActual,
      fecha_cambio: new Date(),
    });
    console.log("[Usuario] Contraseña anterior guardada en histórico");
    await sequelize.query(
      `UPDATE usuario SET password = :password WHERE idusuario = :id`,
      {
        replacements: { password: hashedNewPassword, id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    console.log("[Usuario] Contraseña actualizada");
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res, next) => {
  const { id } = req.params;
  console.log(`[Usuario] Eliminar | idUsuario: ${id}`);
  try {
    const eliminado = await sequelize.query(
      `DELETE FROM usuario WHERE idUsuario = :id`,
      { replacements: { id }, type: sequelize.QueryTypes.DELETE }
    );
    if (!eliminado) {
      console.warn(`[Usuario] No encontrado para eliminar | idUsuario: ${id}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    console.log(`[Usuario] Usuario eliminado | idUsuario: ${id}`);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

exports.autenticarUsuario = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(`[Auth] Intento login | email: ${email}`); // Depuración

  try {
    const [usuario] = await sequelize.query(
      `SELECT * FROM usuario WHERE correo = :email`,
      { replacements: { email }, type: sequelize.QueryTypes.SELECT }
    );

    console.log("[Auth] Usuario encontrado:", usuario); // Depuración

    // Paso 2: Verificar si el usuario existe
    if (!usuario) {
      cconsole.warn(`⚠️ [Auth] Usuario no encontrado | email: ${email}`); // Depuración
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Paso 3: Verificar la contraseña
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      console.warn(`[Auth] Contraseña incorrecta | email: ${email}`); // Depuración
      return res
        .status(401)
        .json({ success: false, message: "Contraseña incorrecta" });
    }

    // Paso 4: Autenticación exitosa
    console.log("[Auth] Autenticación exitosa"); // Depuración
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        id: usuario.idusuario,
        email: usuario.correo,
        rol: usuario.idrol,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.enviarCodigo = (req, res, next) => {
  const { email } = req.body;
  console.log(`[Auth] Enviar código | email: ${email}`);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    console.warn("[Auth] Formato de correo inválido");
    return res.status(400).json({
      success: false,
      message: "Formato de correo inválido.",
    });
  }

  emailExistence.check(email, async (err, exists) => {
    if (err) {
      console.error(
        `[Auth] Error al verificar existencia de email | ${err.message}`
      );
      return res
        .status(500)
        .json({
          success: false,
          message: "No fue posible verificar el correo.",
        });
    }
    if (!exists) {
      console.warn(`[Auth] Email no existe o inaccesible | email: ${email}`);
      return res
        .status(404)
        .json({
          success: false,
          message: "El correo no existe o no se puede alcanzar.",
        });
    }

    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      verificationCodes[email] = verificationCode;
      console.log(`[Auth] Código generado | ${verificationCode}`);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Código de verificación",
        text: `Tu código de verificación es: ${verificationCode}`,
      });

      console.log(`[Auth] Código enviado por email | email: ${email}`);
      res.json({ success: true, message: "Código de verificación enviado." });
    } catch (error) {
      next(error);
    }
  });
};

exports.enviarConfirmacionPedido = async (req, res, next) => {
  const { idUsuario, detalles, precio_total } = req.body;
  console.log(`[Pedido] Enviar confirmación | idUsuario: ${idUsuario}`);
  try {
    // Obtener el usuario por ID
    const usuario = await sequelize.query(
      `SELECT * FROM usuario WHERE idUsuario = :id`,
      {
        replacements: { id: idUsuario },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (usuario.length === 0) {
      console.warn(`[Pedido] Usuario no encontrado | idUsuario: ${idUsuario}`);
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const email = usuario[0].correo; // Extrae el email del usuario

    // Generar HTML para los detalles del pedido
    const detallesHtml = detalles
      .map(
        (detalle) =>
          `<tr>
             <td>${detalle.nombre}</td>
             <td>${detalle.cantidad}</td>
             <td>${detalle.precio} Bs.</td>
             <td>${detalle.cantidad * detalle.precio} Bs.</td>
           </tr>`
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmación de Pedido",
      html: `
        <h1>Pedido Confirmado</h1>
        <p>Gracias por realizar tu pedido. Ya estamos trabajando en él.</p>
        <h2>Detalles del Pedido:</h2>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Platillo</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${detallesHtml}
          </tbody>
        </table>
        <h3>Total: ${precio_total} Bs.</h3>
        <p><b>Si cree que hubo un error en su pedido contactese con caja.</b></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`[Pedido] Confirmación enviada | email: ${email}`);
    res.json({ success: true, message: "Correo de confirmación enviado" });
  } catch (error) {
    next(error);
  }
};

exports.verificarCodigo = async (req, res, next) => {
  const { email, code } = req.body;
  console.log(
    `[Auth] Verificar código | email: ${email}, código enviado: ${code}`
  );
  try {
    if (
      verificationCodes[email] &&
      verificationCodes[email].toString() === code
    ) {
      delete verificationCodes[email];
      console.log("[Auth] Código verificado correctamente"); // Limpia el código después de la verificación
      res.json({ success: true, message: "Código verificado correctamente" });
    } else {
      console.warn("[Auth] Código incorrecto");
      res
        .status(400)
        .json({ success: false, message: "Código de verificación incorrecto" });
    }
  } catch (error) {
    next(error);
  }
};

exports.enviarReserva = async (req, res, next) => {
  const { email, nombre, fecha, hora, mesa } = req.body;
  console.log(`[Reserva] Enviar confirmación | email: ${email}, mesa: ${mesa}`);
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
        <h2 style="text-align: center; color: #4CAF50;">Reserva Confirmada</h2>
        <p style="font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
        <p style="font-size: 16px;">Gracias por elegirnos. Tu reserva ha sido confirmada con éxito. Aquí están los detalles de tu reserva:</p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Fecha:</strong> ${fecha}</li>
          <li><strong>Hora:</strong> ${hora}</li>
          <li><strong>Mesa:</strong> ${mesa}</li>
        </ul>
        <p style="font-size: 16px;">¡Esperamos verte pronto!</p>
        <p style="font-size: 14px; color: #888;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://tu-sitio-web.com" style="text-decoration: none; color: white; background-color: #4CAF50; padding: 10px 20px; border-radius: 5px;">Visítanos</a>
        </div>
        <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
          © 2024 Tu Restaurante. Todos los derechos reservados.
        </footer>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirmación de Reserva",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[Pedido] Confirmación enviada | email: ${email}`);
      return res.json({
        success: true,
        message: "Correo de confirmación enviado",
      });
    } catch (err) {
      console.error(
        `[Pedido] Error enviando correo: ${err.code} – ${err.response}`
      );
      return res.status(500).json({
        success: false,
        message:
          "No se pudo enviar el correo: límite diario excedido en Gmail.",
      });
    }
  } catch (error) {
    next(error);
  }
};
