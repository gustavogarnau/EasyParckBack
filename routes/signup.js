const express = require('express');
const router = express.Router();
const pool = require("../connection/pg")
const { jsonResponse } = require('../lib/jsonResponse');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const uuid = require("uuid");

// Configuración del servidor de correo electrónico
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ggarnauarrieta@gmail.com",
    pass: "yfqa utlw dypl wusn", 
  },
});

//ruta para obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const sql = "SELECT * FROM usuarios";
        const result = await pool.query(sql);
        res.json(result.rows);
        
    } catch (error) {
        console.error("Error al obtener los usuarios", error);
    res.status(500).json(jsonResponse(500, { error: "Error al obtener los usuarios" }));
    }
})


//ruta para crear un usuario
router.post("/", async (req, res) => {
    try {
      const { id, cedula, nombre, apellido, correo, telefono, password, direccion, ciudad} = req.body;
      if ( !!!cedula || !!!nombre || !!!apellido || !!!correo || !!!telefono || !!!password || !!!direccion || !!!ciudad){
        return res.status(400).json(jsonResponse(400, { error: "Los campos son requeridos" }));
      }

      const token = uuid.v4();
      const hash = bcrypt.hashSync(password, 10);
  
      const query = `INSERT INTO usuarios (id, cedula, nombre, apellido, correo, password, telefono, direccion, ciudad, token_verificacion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
      const result = await pool.query(query, [id, cedula , nombre.toUpperCase(), apellido.toUpperCase(), correo.toUpperCase(), hash, telefono, direccion.toUpperCase(), ciudad.toUpperCase(), token ]);
    
  
  
      // Convertir el resultado de la consulta en un objeto iterable
      const usuario = result.rows[0]; 

      const mensaje = `
      Hola ${nombre.toUpperCase()},

      Gracias por registrarte en el sistema de gestion de recursos cidetic. Para verificar tu cuenta, haz clic en el siguiente enlace:

      ${process.env.FRONTEND_URL}#/confirm-email/${correo.toUpperCase()}/${token}

      Este enlace es válido por 24 horas. Si no lo activas en ese tiempo, tendrás que solicitar un nuevo correo electrónico de verificación.

      Si tienes algún problema para verificar tu cuenta, por favor contacta con nuestro equipo de soporte.

      Atentamente,

      El equipo de Easy-Park
    `;

    res.status(200).json(jsonResponse(200, { message: "Usuario creado exitosamente", usuario }));

    await transporter.sendMail({
      from: "fenixbgsas@gestionderecursos.com",
      to: correo.toLowerCase(),
      subject: "Verifica tu cuenta de gestion de recursos cidetic",
      text: mensaje,
    });


    } catch (error) {
      console.error("Error al registrar Usuario:", error);
      return res.status(500).json(jsonResponse(500, { error: "Error al registrar el Usuario" }));
    }
  });

  module.exports = router;