const express = require('express');
const router = express.Router();
const { jsonResponse } = require('../lib/jsonResponse');
const pool = require('../connection/pg');

// Ruta GET para obtener los parqueaderos de un usuario específico
router.get('/', async (req, res) => {
  try {

    const sql = `SELECT * FROM parqueaderos_usuarios`;

    const results = await pool.query(sql);

    res.json(results.rows);

  } catch (error) {
    res.status(500).json(jsonResponse(500, { error: "Error al obtener parqueaderos" }));
  }
});

// Ruta POST para crear un parqueadero para un usuario
router.post('/', async (req, res) => {
  try {
    const { usuarioId, parqueaderoId } = req.body;

    if (!usuarioId || !parqueaderoId) {
      return res.status(400).json(jsonResponse(400, { error: "Los campos son requeridos" }));
    }

    const sql = `
      INSERT INTO parqueaderos_usuarios (usuarios_id, parqueaderos_id) VALUES ($1, $2)`;

    const result = await pool.query(sql, [usuarioId, parqueaderoId]);

    if (result.rowCount === 0) {
      return res.status(500).json(jsonResponse(500, { error: "Error al crear la asignación" }));
    }

    res.status(201).json(jsonResponse(201, { message: "Asignación creada exitosamente" }));
  } catch (error) {
    console.error("Error al crear asignación de parqueadero:", error);
    res.status(500).json(jsonResponse(500, { error: "Error al crear la asignación" }));
  }
});

module.exports = router;
