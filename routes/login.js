const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const pool = require("../connection/pg"); // Reemplazar con la ruta a tu archivo de conexión PostgreSQL
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { correo, password } = req.body;
    
    if (!correo || !password) {
      return res.status(400).json(jsonResponse(400, { error: "Los campos son requeridos" }));
    }

    // Buscar al usuario en la base de datos
    const query = `SELECT *  FROM usuarios  WHERE correo = $1 AND activo = 1 `;
    const result = await pool.query(query, [correo.toUpperCase()]);

    if (result.rows.length === 0) {
      return res.status(401).json(jsonResponse(401, { error: "Usuario no encontrado" }));
    }
    
    const user = result.rows[0];


    // Validar la contraseña
    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json(jsonResponse(401, { error: "Contraseña incorrecta" }));
    }

    // Generar token
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "12h" });

    return res.status(200).json(jsonResponse(200, { user, token }));
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json(jsonResponse(500, { error: "Error al iniciar sesión" }));
  }
});

module.exports = router;