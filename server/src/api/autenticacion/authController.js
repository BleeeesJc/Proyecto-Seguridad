const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../usuario/usuario.model');

console.log("se carga el authcontroller")


const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Verifica si el usuario existe
    const user = await Usuario.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verifica la contraseña ingresada con la hasheada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Genera el token JWT
    const payload = { id: user.idusuario, correo: user.correo, rol: user.idrol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Responde con el token
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
// Obtener todos los usuarios registrados
const getAllUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios
    const users = await User.findAll();

    // Si no hay usuarios, responde con un mensaje
    if (users.length === 0) {
      return res.status(404).json({ message: 'No hay usuarios registrados' });
    }

    // Responde con los usuarios encontrados
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { login, getAllUsers };
