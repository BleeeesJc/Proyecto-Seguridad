// src/api/usuario.controller.js
const sequelize = require('../../config/db');
const bcrypt = require('bcrypt');

// Crear un nuevo usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, apellidos, email, password } = req.body;

  try {
    console.log('Datos recibidos para registro:', { nombre, apellidos, email });

    // Paso 1: Buscar el rol de "usuario"
    const [rol] = await sequelize.query(
      `SELECT idrol FROM rol WHERE rol = 'usuario'`,
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log('Rol encontrado:', rol);

    // Verificar si el rol fue encontrado
    if (!rol || !rol.idrol) {
      return res.status(500).json({ message: 'El rol de usuario no existe en la base de datos' });
    }

    // Paso 2: Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada:', hashedPassword);

    // Paso 3: Insertar el nuevo usuario con el rol de "usuario"
    await sequelize.query(
      `INSERT INTO usuario (nombre, apellidos, correo, password, idrol)
       VALUES (:nombre, :apellidos, :email, :password, :idrol)`,
      {
        replacements: {
          nombre,
          apellidos,
          email,
          password: hashedPassword, // Contraseña encriptada
          idrol: rol.idrol, // ID del rol de "usuario"
        },
        type: sequelize.QueryTypes.INSERT,
      }
    );

    console.log('Usuario registrado exitosamente');
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

// Actualizar solo el rol de un usuario
exports.actualizarRolUsuario = async (req, res) => {
  const { id } = req.params;
  const { idRol } = req.body;

  try {
    // Ejecutar la consulta para actualizar solo el campo de rol
    const [actualizado] = await sequelize.query(
      `UPDATE usuario SET idrol = :idRol WHERE idUsuario = :id`,
      {
        replacements: { id, idRol },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      res.json({ message: 'Rol del usuario actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await sequelize.query(
      `SELECT * FROM usuario`,
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

//Obtener todos los usuarios de un rol en especifico
exports.obtenerUsuariosPorRol = async (req, res) => {
  const { rol } = req.params;

  try {
    const usuarios = await sequelize.query(
      `SELECT * FROM usuario WHERE rol = :rol`,
      {
        replacements: { rol },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios por rol:", error);
    res.status(500).json({ error: 'Error al obtener usuarios por rol' });
  }
};


// Obtener un único usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await sequelize.query(
      `SELECT * FROM usuario WHERE idUsuario = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (usuario.length > 0) {
      res.json(usuario[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Actualizar un usuario
exports.actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, correo, password, idRol } = req.body;

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
      res.json({ message: 'Usuario actualizado exitosamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// Obtener un usuario por su correo
exports.obtenerUsuarioPorCorreo = async (req, res) => {
  const { correo } = req.params;  // Obtener el correo de los parámetros de la URL

  try {
    const usuario = await sequelize.query(
      `SELECT idusuario FROM usuario WHERE correo = :correo`,
      {
        replacements: { correo },
        type: sequelize.QueryTypes.SELECT,  // Usamos SELECT para obtener datos
      }
    );

    if (usuario.length > 0) {  // Verifica si se encontró al menos un usuario
      res.json(usuario[0]);  // Devolver el primer usuario encontrado
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error("Error al obtener el usuario por correo:", error);
    res.status(500).json({ error: 'Error al obtener el usuario por correo' });
  }
};

// Actualizar solo la contraseña
exports.actualizarContrasena = async (req, res) => {
  const { id } = req.params; // Obtiene el id del usuario desde los parámetros de la URL
  const { newPassword } = req.body; // Obtiene la nueva contraseña desde el cuerpo de la solicitud

  console.log("ID recibido:", id);

  console.log("Nueva contraseña:", newPassword);
  try {
    // Asegúrate de hashear la nueva contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Ejecuta la consulta para actualizar solo el campo de la contraseña
    const [actualizado] = await sequelize.query(
      `UPDATE usuario SET password = :password WHERE idUsuario = :id`,
      {
        replacements: { id, password: hashedPassword },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (actualizado) {
      res.json({ message: 'Contraseña actualizada exitosamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
};


// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const eliminado = await sequelize.query(
      `DELETE FROM usuario WHERE idUsuario = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.DELETE,
      }
    );

    if (eliminado) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};



exports.autenticarUsuario = async (req, res) => {
  const { email, password } = req.body;
  console.log('Intento de inicio de sesión con:', { email, password }); // Depuración

  try {
    // Paso 1: Buscar el usuario por correo electrónico
    const [usuario] = await sequelize.query(
      `SELECT * FROM usuario WHERE correo = :email`,
      { replacements: { email }, type: sequelize.QueryTypes.SELECT }
    );

    console.log('Usuario encontrado:', usuario); // Depuración

    // Paso 2: Verificar si el usuario existe
    if (!usuario) {
      console.log('Usuario no encontrado'); // Depuración
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Paso 3: Verificar la contraseña
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      console.log('Contraseña incorrecta'); // Depuración
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Paso 4: Autenticación exitosa
    console.log('Autenticación exitosa'); // Depuración
    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: { id: usuario.idusuario, email: usuario.correo, rol: usuario.idrol }
    });
  } catch (error) {
    console.error('Error al autenticar al usuario:', error);
    res.status(500).json({ success: false, message: 'Error al autenticar al usuario' });
  }
};



const nodemailer = require('nodemailer');

const verificationCodes = {};//temporal

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.enviarCodigo = async (req, res) => {
  const { email } = req.body;

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);//genera codigo de 6 digitos

    // Guarda el código temporalmente (en producción, usa una base de datos o Redis)
    verificationCodes[email] = verificationCode;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de verificación',
      text: `Tu código de verificación es: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Código de verificación enviado' });
  } catch (error) {
    console.error("Error al enviar el código de verificación:", error);
    res.status(500).json({ success: false, message: 'Error al enviar el código de verificación', error: error.message });
  }
};

exports.enviarConfirmacionPedido = async (req, res) => {
  const { idUsuario, detalles, precio_total } = req.body;

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
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
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
      subject: 'Confirmación de Pedido',
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

    res.json({ success: true, message: 'Correo de confirmación enviado' });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res
      .status(500)
      .json({ success: false, message: 'Error al enviar el correo', error: error.message });
  }
};

exports.verificarCodigo = async (req, res) => {
  const { email, code } = req.body;

  try {
    console.log('Código recibido:', code);
    console.log('Código almacenado:', verificationCodes[email]);

    if (verificationCodes[email] && verificationCodes[email].toString() === code) {
      delete verificationCodes[email]; // Limpia el código después de la verificación
      res.json({ success: true, message: 'Código verificado correctamente' });
    } else {
      res.status(400).json({ success: false, message: 'Código de verificación incorrecto' });
    }
  } catch (error) {
    console.error("Error al verificar el código:", error);
    res.status(500).json({ success: false, message: 'Error al verificar el código', error: error.message });
  }
};

exports.enviarReserva = async (req, res) => {
  const { email, nombre, fecha, hora, mesa } = req.body;

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
      subject: 'Confirmación de Reserva',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Correo de confirmación enviado' });
  } catch (error) {
    console.error("Error al enviar la confirmación de reserva:", error);
    res.status(500).json({ success: false, message: 'Error al enviar la confirmación de reserva', error: error.message });
  }
};



