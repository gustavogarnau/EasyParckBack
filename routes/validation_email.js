const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const pool = require("../connection/pg"); // Assuming a configured PostgreSQL pool

router.patch("/", async (req, res) => {
  try {
    const { correo, token } = req.body;

    // Validate required fields
    if (!correo || !token) {
      return res.status(400).json(jsonResponse(400, { error: "Los campos correo y token son requeridos" }));
    }

    // Fetch user and check existence
    const query = "SELECT * FROM empleado WHERE correo = $1 AND token_verificacion = $2";
    const { rows: user } = await pool.query(query, [correo.toUpperCase(), token]);

    if (user.length === 0) {
      return res.status(404).json(jsonResponse(404, { error: "Usuario no encontrado" }));
    }

    // Update user activation status
    const updateQuery = "UPDATE empleado SET activo = 1 WHERE correo = $1";
    const result = await pool.query(updateQuery, [correo.toUpperCase()]);

    if (result.rowCount === 1) {
      res.status(200).json(jsonResponse(200, { message: "Su solicitud de validación de cuenta ha sido recibida. En breve, un miembro de nuestro equipo revisará su información y le notificará por correo electrónico si su cuenta es aprobada. Durante este proceso, no podrá acceder a su cuenta. Le agradecemos su paciencia y comprensión." }));
    } else {
      console.error("Error al actualizar el estado del usuario:", error);
      res.status(500).json(jsonResponse(500, { error: "Error al activar la cuenta" }));
    }
  } catch (error) {
    console.error("Error al activar la cuenta:", error);
    res.status(500).json(jsonResponse(500, { error: "Error al activar la cuenta" }));
  }
});

module.exports = router;