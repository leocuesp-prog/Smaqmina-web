const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// 🔌 CONEXIÓN MYSQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234567", // pon tu contraseña si tienes
    database: "smaqmina1"
});

db.connect(err => {
    if (err) {
        console.log("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

// 🔵 REGISTRO
app.post("/register", async (req, res) => {

    const { nombre, correo, telefono, password } = req.body;

    if (!nombre || !correo || !telefono || !password) {
        return res.status(400).json({ mensaje: "Campos incompletos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO usuario (nombre, correo, telefono, password) VALUES (?, ?, ?, ?)";

    db.query(sql, [nombre, correo, telefono, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al registrar usuario" });
        }

        res.json({ mensaje: "Usuario registrado correctamente" });
    });

});

// 🔵 LOGIN
app.post("/login", (req, res) => {

    const { correo, password } = req.body;

    const sql = "SELECT * FROM usuario WHERE correo = ?";

    db.query(sql, [correo], async (err, results) => {

        if (err) return res.status(500).json({ mensaje: "Error servidor" });

        if (results.length === 0) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        }

        const usuario = results[0];

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrecta) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        res.json({
            mensaje: "Login exitoso",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    });

});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});

app.post("/herramientas/sujecion", (req, res) => {

    const { nombre, buena, regular, mala } = req.body;

    const sql = `
        INSERT INTO herramienta_sujecion
        (nombre_herramienta_sujecion,
         cantidad_buena_sujecion,
         cantidad_regular_sujecion,
         cantidad_mala_sujecion)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error al guardar sujeción" });
        }

        res.json({ mensaje: "Herramienta de sujeción guardada correctamente" });
    });
});
app.post("/herramientas/corte", (req, res) => {

    const { nombre, buena, regular, mala } = req.body;

    const sql = `
        INSERT INTO herramienta_corte
        (nombre_herramienta_corte,
         cantidad_buena_corte,
         cantidad_regular_corte,
         cantidad_mala_corte)
        VALUES (?, ?, ?, ?)
    `;

    app.get("/herramientas/corte", (req, res) => {

    const sql = "SELECT * FROM herramienta_corte";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al obtener herramientas"
            });
        }

        res.json(results);
    });
});

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al guardar corte" });
        }

        res.json({ mensaje: "Herramienta de corte guardada correctamente" });
    });
});

app.post("/herramientas/impacto", (req, res) => {

    const { nombre, buena, regular, mala } = req.body;

    const sql = `
        INSERT INTO herramienta_impacto
        (nombre_herramienta_impacto,
         cantidad_buena_impacto,
         cantidad_regular_impacto,
         cantidad_mala_impacto)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al guardar impacto" });
        }

        res.json({ mensaje: "Herramienta de impacto guardada correctamente" });
    });
});


app.post("/herramientas/medicion", (req, res) => {

    const { nombre, buena, regular, mala } = req.body;

    const sql = `
        INSERT INTO herramienta_medicion
        (nombre_herramienta_medicion,
         cantidad_buena_medicion,
         cantidad_regular_medicion,
         cantidad_mala_medicion)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al guardar medición" });
        }

        res.json({ mensaje: "Herramienta de medición guardada correctamente" });
    });
});