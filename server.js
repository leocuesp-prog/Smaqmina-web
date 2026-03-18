const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// app.use(express.static("public"));
// 🔌 CONEXIÓN MYSQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1055313199", // pon tu contraseña si tienes
    database: "smaqmina1"
});

db.connect(err => {
    if (err) {
        console.log("Error de conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

//  REGISTRO
app.post("/register", async (req, res) => {// Usar async para manejar bcrypt con await

    const { nombre, correo, telefono, password } = req.body;

    if (!nombre || !correo || !telefono || !password) {
        return res.status(400).json({ mensaje: "Campos incompletos" });// Validación básica de campos vacíos
    }

    const hashedPassword = await bcrypt.hash(password, 10);// Hashear la contraseña con bcrypt y salt rounds de 10

    const sql = "INSERT INTO usuario (nombre, correo, telefono, password) VALUES (?, ?, ?, ?)";// Ingresa los parametros el sql

    db.query(sql, [nombre, correo, telefono, hashedPassword], (err, result) => {// Manejar la respuesta de la base de datos
        if (err) {
            return res.status(500).json({ mensaje: "Error al registrar usuario" });// Manejo de error genérico
        }

        res.json({ mensaje: "Usuario registrado correctamente" });
    });

});

//  LOGIN
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
// POST y GET para sujecion
app.post("/herramientas/sujecion", (req, res) => {

    const { nombre, buena, regular, mala } = req.body;

    const sql = `INSERT INTO herramienta_sujecion (nombre_herramienta_sujecion, cantidad_buena_sujecion, cantidad_regular_sujecion, cantidad_mala_sujecion) VALUES (?, ?, ?, ?)`;// Usar parámetros para evitar SQL Injection

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error al guardar sujeción" });
        }
        res.json({ mensaje: "Herramienta de sujeción guardada correctamente" });
    });
});

app.get("/herramientas/sujecion", (req, res) => {

    const sql = "SELECT * FROM herramienta_sujecion";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error al obtener sujeción" });
        }

        res.json(results);
    });

});

// POST y GET para corte
app.post("/herramientas/corte", (req, res) => {

    const { nombre, buena, regular, mala } = req.body;

    const sql = `INSERT INTO herramienta_corte (nombre_herramienta_corte, cantidad_buena_corte, cantidad_regular_corte, cantidad_mala_corte) VALUES (?, ?, ?, ?)`;

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al guardar corte" });
        }

        res.json({ mensaje: "Herramienta de corte guardada correctamente" });
    });
});

app.get("/herramientas/corte", (req, res) => {

    const sql = "SELECT * FROM herramienta_corte";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener herramientas de corte" });
        }

        res.json(results);
    });
});

// POST y GET para impacto
app.post("/herramientas/impacto", (req, res) => {

    const { nombre, buena, regular, mala } = req.body;

    const sql = `INSERT INTO herramienta_impacto (nombre_herramienta_impacto, cantidad_buena_impacto, cantidad_regular_impacto, cantidad_mala_impacto) VALUES (?, ?, ?, ?)`;

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al guardar impacto" });
        }
        res.json({ mensaje: "Herramienta de impacto guardada correctamente" });
    });
});

app.get("/herramientas/impacto", (req, res) => {

    const sql = "SELECT * FROM herramienta_impacto";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener herramientas de impacto" });
        }

        res.json(results);
    });
});

// POST y GET para medicion
app.post("/herramientas/medicion", (req, res) => {

    const { nombre, buena, regular, mala } = req.body;

    const sql = `INSERT INTO herramienta_medicion (nombre_herramienta_medicion, cantidad_buena_medicion, cantidad_regular_medicion, cantidad_mala_medicion) VALUES (?, ?, ?, ?)`;

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al guardar medición" });
        }
        res.json({ mensaje: "Herramienta de medición guardada correctamente" });
    });
});

app.get("/herramientas/medicion", (req, res) => {

    const sql = "SELECT * FROM herramienta_medicion";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener herramientas de medición" });
        }

        res.json(results);
    });
});
app.get("/equipo", (req, res) => {
    const sql = "SELECT * FROM equipo";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener equipos" });
        }
        res.json(results);
    });
});
app.get("/maquina", (req, res) => {
    const sql = "SELECT * FROM maquina";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener máquinas" });
        }
        res.json(results);
    });
});
app.post("/mantenimiento/equipo", (req, res) => {
    const { tipo_mantenimiento_equipo, fecha_mantenimiento_equipo, observacion_equipo, equipo_apto_equipo, realizo_mantenimiento_equipo, reviso_mantenimiento_equipo, novedad_equipo, id_equipo } = req.body;
    
    // Verificar si los datos llegaron correctamente
    if (!tipo_mantenimiento_equipo || !fecha_mantenimiento_equipo || !observacion_equipo || !equipo_apto_equipo || !realizo_mantenimiento_equipo || !reviso_mantenimiento_equipo || !novedad_equipo || !id_equipo) {
        return res.status(400).json({ mensaje: "Faltan datos: " + JSON.stringify(req.body) });
    }
    
    const sql = `INSERT INTO mantenimiento_equipo (tipo_mantenimiento_equipo, fecha_mantenimiento_equipo, observacion_equipo, equipo_apto_equipo, realizo_mantenimiento_equipo, reviso_mantenimiento_equipo, novedad_equipo, id_equipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [tipo_mantenimiento_equipo, fecha_mantenimiento_equipo, observacion_equipo, equipo_apto_equipo, realizo_mantenimiento_equipo, reviso_mantenimiento_equipo, novedad_equipo, id_equipo], (err, result) => {
        if (err) {
            console.error("Error en BD:", err);
            return res.status(500).json({ mensaje: "Error al guardar mantenimiento de equipo: " + err.message });
        }
        res.json({ mensaje: "Mantenimiento de equipo guardado correctamente" });
    });
});
app.get("/mantenimiento/equipos", (req, res) => {
    const sql = "SELECT * FROM mantenimiento_equipo";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener mantenimientos de equipos" });
        }
        res.json(results);
    });
});
app.delete("/mantenimiento/equipos/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM mantenimiento_equipo WHERE codigo_mantenimiento_equipo = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar mantenimiento de equipo" });
        }
        res.json({ mensaje: "Mantenimiento de equipo eliminado correctamente" });
    });
});

app.post("/mantenimiento/maquina", (req, res) => {
    const { tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina } = req.body;
    
    // Verificar si los datos llegaron correctamente
    if (!tipo_mantenimiento_maquina || !fecha_mantenimiento_maquina || !observacion_maquina || !equipo_apto_maquina || !realizo_mantenimiento_maquina || !reviso_mantenimiento_maquina || !novedad_maquina || !id_maquina) {
        return res.status(400).json({ mensaje: "Faltan datos: " + JSON.stringify(req.body) });
    }
    
    const sql = `INSERT INTO mantenimiento_maquina (tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina], (err, result) => {
        if (err) {
            console.error("Error en BD:", err);
            return res.status(500).json({ mensaje: "Error al guardar mantenimiento de máquina: " + err.message });
        }
        res.json({ mensaje: "Mantenimiento de máquina guardado correctamente" });
    });
});
app.get("/mantenimiento/maquinas", (req, res) => {
    const sql = "SELECT * FROM mantenimiento_maquina";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener mantenimientos de máquinas" });
        }
        res.json(results);
    });
});
// 🗑️ DELETE para corte
app.delete("/herramientas/corte/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM herramienta_corte WHERE id_herramienta_corte = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar herramienta de corte" });
        }
        res.json({ mensaje: "Herramienta de corte eliminada correctamente" });
    });
});
app.delete("/mantenimiento/maquinas/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM mantenimiento_maquina WHERE codigo_mantenimiento_maquina = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar mantenimiento de máquina" });
        }
        res.json({ mensaje: "Mantenimiento de máquina eliminado correctamente" });
    });
});

// 🗑️ DELETE para sujeción
app.delete("/herramientas/sujecion/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM herramienta_sujecion WHERE id_herramienta_sujecion = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar herramienta de sujeción" });
        }
        res.json({ mensaje: "Herramienta de sujeción eliminada correctamente" });
    });
});

// 🗑️ DELETE para impacto
app.delete("/herramientas/impacto/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM herramienta_impacto WHERE id_herramienta_impacto = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar herramienta de impacto" });
        }
        res.json({ mensaje: "Herramienta de impacto eliminada correctamente" });
    });
});

// 🗑️ DELETE para medición
app.delete("/herramientas/medicion/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM herramienta_medicion WHERE id_herramienta_medicion = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar herramienta de medición" });
        }
        res.json({ mensaje: "Herramienta de medición eliminada correctamente" });
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});