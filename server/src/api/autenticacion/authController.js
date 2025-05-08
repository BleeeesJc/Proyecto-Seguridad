const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../usuario/usuario.model');
const Rol = require('../rol/rol.model'); 

const axios = require('axios');

console.log("se carga el authcontroller")


const login = async (req, res) => {
  const { correo, password } = req.body;

  //Verificacion de reCAPTCHA de GOOGLE
  const captchaToken = req.body['g-recaptcha-response'];
  try {
    const captchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY, // 🔐 Mejor que esté en .env
        response: captchaToken
      }
    });

    if (!captchaResponse.data.success) {
      return res.status(400).json({ message: 'Error en CAPTCHA. Intenta de nuevo.' });
    }
  } catch (error) {
    console.error('Error al verificar CAPTCHA:', error);
    return res.status(500).json({ message: 'Error al verificar CAPTCHA' });
  }

  //Validacion de usuario y contraseña
  try {
    // Obtener usuario junto a sus permisos del rol
    const user = await Usuario.findOne({
      where: { correo },
      include: {
        model: Rol,
        as: 'rol',
        attributes: [
          'idrol',
          'rol',
          'asignacionroles',
          'dashboard',
          'ofertas',
          'usuarios',
          'platillos',
          'pedidos',
          'reservas',
          'mapainteractivo',
          'ofertacliente',
          'pedidocliente',
          'mapacliente',
          'menucliente'
        ]
        
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crea el payload básico del token
    const payload = {
      id: user.idusuario,
      correo: user.correo,
      rol: user.rol.rol // solo el nombre del rol en el JWT
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('🧾 Usuario autenticado:', {
      idusuario: user.idusuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol.get({ plain: true }), // Muestra la matriz de permisos
      token
    });
    

    // Responde con los permisos completos
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      idusuario: user.idusuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol // Contiene nombre y todos los permisos booleanos
    });

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
