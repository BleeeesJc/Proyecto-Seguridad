const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("../usuario/usuario.model");
const Rol = require("../rol/rol.model");
const Logs = require("../logs/log.model");

const axios = require("axios");

console.log("se carga el authcontroller");

const login = async (req, res) => {
  const { correo, password } = req.body;
  console.log("[Auth] Intento de login | correo:", req.body.correo);
  await Logs.create({
    accion: `Intento de login con correo "${correo}"`,
    medio: "login",
    fecha: new Date(),
    origen: "sistema",
    codigo: 100,
  });
  try {
    // Obtener usuario junto a sus permisos del rol
    const user = await Usuario.findOne({
      where: { correo },
      include: {
        model: Rol,
        as: "rol",
        attributes: [
          "idrol",
          "rol",
          "asignacionroles",
          "dashboard",
          "ofertas",
          "usuarios",
          "platillos",
          "pedidos",
          "reservas",
          "mapainteractivo",
          "ofertacliente",
          "pedidocliente",
          "mapacliente",
          "menucliente",
          "logs",
        ],
      },
    });
    await Logs.create({
      accion: "Intento de Inicio de Sesion mediante correo",
      medio: "El usuario esta ingresando su correo",
      fecha: new Date(),
      origen: "usuario",
      idusuario: user.idusuario,
      codigo: 100,
    });

    if (!user) {
      console.warn(`[Auth] Usuario no encontrado | correo: ${correo}`);
      await Logs.create({
        accion: `Login fallido: no existe usuario con correo "${correo}"`,
        medio: "login",
        fecha: new Date(),
        origen: "sistema",
        codigo: 401,
      });
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    console.log(`[Auth] Usuario encontrado | idusuario: ${user.idusuario}`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn(`[Auth] Contraseña incorrecta | usuario: ${user.idusuario}`);

      await Logs.create({
        accion: `Login fallido: contraseña incorrecta para usuario ID ${user.idusuario}`,
        medio: "login",
        fecha: new Date(),
        origen: "sistema",
        codigo: 401,
      });
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    console.log(`[Auth] Contraseña validada | usuario: ${user.idusuario}`);
    // Crea el payload básico del token
    const payload = {
      id: user.idusuario,
      correo: user.correo,
      rol: user.rol.rol, // solo el nombre del rol en el JWT
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(`[Auth] Token generado | usuario: ${user.idusuario}`);

    await Logs.create({
      accion: `Login exitoso para usuario ID ${user.idusuario} (correo "${user.correo}")`,
      medio: "login",
      fecha: new Date(),
      origen: "usuario",
      idusuario: user.idusuario,
      codigo: 200,
    });;

    console.log("[Auth] Usuario autenticado:", {
      idusuario: user.idusuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol.get({ plain: true }), // Muestra la matriz de permisos
      token,
    });

    // Responde con los permisos completos
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      idusuario: user.idusuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol, // Contiene nombre y todos los permisos booleanos
    });
  } catch (error) {
    console.error(`[Auth] Error en el login | ${error.message}`);
    await Logs.create({
      accion: `Error del sistema durante login para correo "${correo}": ${error.message}`,
      medio: "login",
      fecha: new Date(),
      origen: "sistema",
      codigo: 500,
    });
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// Obtener todos los usuarios registrados
const getAllUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const users = await User.findAll();
    console.warn("[Auth] No hay usuarios registrados");
    // Si no hay usuarios, responde con un mensaje
    if (users.length === 0) {
      return res.status(404).json({ message: "No hay usuarios registrados" });
    }
    console.log(`[Auth] Usuarios obtenidos: ${users.length}`);
    // Responde con los usuarios encontrados
    res.status(200).json({ users });
  } catch (error) {
    console.error(`[Auth] Error al obtener usuarios | ${error.message}`);
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

module.exports = { login, getAllUsers };
