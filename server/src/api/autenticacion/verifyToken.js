const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      console.warn("Acceso sin token");
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(
      `Token válido - Usuario: ${decoded.correo}, Rol: ${decoded.rol}`
    );

    req.user = decoded;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError" ? "Token expirado" : "Token inválido";
    console.error(`Fallo de token: ${message} - Detalle: ${err.message}`);

    res.status(401).json({ message });
  }
};

module.exports = verifyToken;
