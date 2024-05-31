const express = require('express');
const router = express.Router();
const { jsonResponse } = require('../lib/jsonResponse');
const pool = require('../connection/pg');

router.get('/:UserId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      const sql = `SELECT autos.id, placa, caracteristicas, usuarios_id FROM autos INNER JOIN usuarios ON autos.usuarios_id = usuarios.id WHERE usuarios.id = $1`;
  
      const result = await pool.query(sql, [userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json(jsonResponse(404, { error: "Usuario no encontrado" }));
      }
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener los autos del usuario:", error);
      res.status(500).json(jsonResponse(500, { error: "Error al obtener los autos" }));
    }
  });
  

//ruta para crear un auto
router.post("/", async (req, res) => {
    try {
        const { placa, caracteristicas, usuario } = req.body;
        if (!!!placa || !!!caracteristicas || !!!usuario) {
            return res.status(400).json(jsonResponse(400, { error: "Los campos son requeridos" }));
        }

        const query = `INSERT INTO autos (placa, caracteristicas, usuarios_id) VALUES ($1, $2, $3)`;
        const result = await pool.query(query, [placa, caracteristicas.toUpperCase(), usuario]);




        const auto = result.rows[0];


        res.status(200).json(jsonResponse(200, { message: "auto creado exitosamente", auto }))


    } catch (error) {
        console.error("Error al registrar auto:", error);
        return res.status(500).json(jsonResponse(500, { error: "Error al registrar el auto" }));
    }
});

module.exports = router;