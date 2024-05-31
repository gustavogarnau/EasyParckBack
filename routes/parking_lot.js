const express = require('express');
const router = express.Router();
const { jsonResponse } = require('../lib/jsonResponse');
const pool = require('../connection/pg');

// Ruta GET para obtener todos los parqueaderos
router.get('/', async (req, res) => {
  try {
    const sql = `SELECT * FROM parqueaderos`;

    const result = await pool.query(sql);

    if (result.rows.length === 0) {
      return res.status(404).json(jsonResponse(404, { message: "No hay parqueaderos registrados" }));
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener parqueaderos:", error);
    res.status(500).json(jsonResponse(500, { error: "Error al obtener parqueaderos" }));
  }
});

// Ruta POST para crear un parqueadero
router.post('/', async (req, res) => {
  try {
    const { id, cant_espacios, precio } = req.body;

    if (!cant_espacios || !precio) {
      return res.status(400).json(jsonResponse(400, { error: "Los campos 'cant_espacios' y 'precio' son requeridos" }));
    }

    const sql = `INSERT INTO parqueaderos (id, cant_espacios, precio) VALUES ($1, $2, $3)`;

    const result = await pool.query(sql, [id, cant_espacios, precio]);

    if (result.rowCount === 0) {
      return res.status(500).json(jsonResponse(500, { error: "Error al crear el parqueadero" }));
    }

    const parqueaderoCreado = result.rows[0];

    res.status(201).json(jsonResponse(201, { message: "Parqueadero creado exitosamente", parqueadero: parqueaderoCreado }));
  } catch (error) {
    console.error("Error al crear parqueadero:", error);
    res.status(500).json(jsonResponse(500, { error: "Error al crear el parqueadero" }));
  }
});

module.exports = router;
