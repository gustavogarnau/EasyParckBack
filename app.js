const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

const port = process.env.PORT || 4000

app.use(cors());
app.use(express.json());

//ENDPOINTS
app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/validation_email", require ("./routes/validation_email"));
app.use("/api/cars", require ("./routes/cars"));
app.use("/api/parking_lot", require ("./routes/parking_lot"));
app.use("/api/user_parking", require ("./routes/user_parking"));


app.get("/", (req, res) => {
    res.send("¡Hola Mundo!");
})

app.listen(port, () => {
    console.log(`Servidor Corriendo en http://localhost:${port}...`);
})