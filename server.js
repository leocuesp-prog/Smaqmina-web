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

    const { correo, password } = req.body;// Obtener correo y contraseña del cuerpo de la solicitud

    const sql = "SELECT * FROM usuario WHERE correo = ?";// Usar parámetros para evitar SQL Injection

    db.query(sql, [correo], async (err, results) => {// Usar async para manejar bcrypt con await

        if (err) return res.status(500).json({ mensaje: "Error servidor" });// Manejo de error genérico

        if (results.length === 0) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });// Validación de usuario existente
        }

        const usuario = results[0];// Obtener el primer resultado (debería ser único por correo)

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);// Comparar la contraseña ingresada con la almacenada usando bcrypt

        if (!passwordCorrecta) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });// Validación de contraseña correcta
        }

        res.json({// Respuesta exitosa con datos del usuario (sin contraseña)
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
app.post("/herramientas/sujecion", (req, res) => {// POST para sujeción

    const { nombre, buena, regular, mala } = req.body;// Obtener datos del cuerpo de la solicitud

    const sql = `INSERT INTO herramienta_sujecion (nombre_herramienta_sujecion, cantidad_buena_sujecion, cantidad_regular_sujecion, cantidad_mala_sujecion) VALUES (?, ?, ?, ?)`;// Usar parámetros para evitar SQL Injection

    db.query(sql, [nombre, buena, regular, mala], (err, result) => {// Manejar la respuesta de la base de datos

        if (err) {
            console.log(err);
            return res.status(500).json({ mensaje: "Error al guardar sujeción" });// Manejo de error genérico
        }
        res.json({ mensaje: "Herramienta de sujeción guardada correctamente" });// Respuesta exitosa
    });
});

app.get("/herramientas/sujecion", (req, res) => {

    const sql = "SELECT * FROM herramienta_sujecion";// Consulta para obtener todas las herramientas de sujeción

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);// Log del error para depuración
            return res.status(500).json({ mensaje: "Error al obtener sujeción" });// Manejo de error genérico
        }

        res.json(results);// Respuesta exitosa con los resultados de la consulta
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
        return res.status(400).json({ mensaje: "Faltan datos: " + JSON.stringify(req.body) }); // Validación básica de campos vacíos con mensaje detallado
    }
    
    const sql = `INSERT INTO mantenimiento_equipo (tipo_mantenimiento_equipo, fecha_mantenimiento_equipo, observacion_equipo, equipo_apto_equipo, realizo_mantenimiento_equipo, reviso_mantenimiento_equipo, novedad_equipo, id_equipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`; // Usar parámetros para evitar SQL Injection
    db.query(sql, [tipo_mantenimiento_equipo, fecha_mantenimiento_equipo, observacion_equipo, equipo_apto_equipo, realizo_mantenimiento_equipo, reviso_mantenimiento_equipo, novedad_equipo, id_equipo], (err, result) => { // Manejar la respuesta de la base de datos
        if (err) {
            console.error("Error en BD:", err); // Log del error para depuración
            return res.status(500).json({ mensaje: "Error al guardar mantenimiento de equipo: " + err.message }); //    Manejo de error genérico con mensaje detallado
        }
        res.json({ mensaje: "Mantenimiento de equipo guardado correctamente" }); // Respuesta exitosa
    });
});
app.get("/mantenimiento/equipos", (req, res) => { // GET para mantenimientos de equipos
    const sql = "SELECT * FROM mantenimiento_equipo"; // Consulta para obtener todos los mantenimientos de equipos
    db.query(sql, (err, results) => { // Manejar la respuesta de la base de datos
        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener mantenimientos de equipos" }); // Manejo de error genérico
        }
        res.json(results); // Respuesta exitosa con los resultados de la consulta
    });
});
app.delete("/mantenimiento/equipos/:id", (req, res) => {// DELETE para mantenimiento de equipo
    const { id } = req.params;
    const sql = "DELETE FROM mantenimiento_equipo WHERE codigo_mantenimiento_equipo = ?";// Usar parámetros para evitar SQL Injection
    
    db.query(sql, [id], (err, result) => {// Manejar la respuesta de la base de datos
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar mantenimiento de equipo" });// Manejo de error genérico
        }
        res.json({ mensaje: "Mantenimiento de equipo eliminado correctamente" });// Respuesta exitosa
    });
});

app.post("/mantenimiento/maquina", (req, res) => { // POST para mantenimiento de máquina
    const { tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina } = req.body; // Obtener datos del cuerpo de la solicitud
    
    // Verificar si los datos llegaron correctamente
    if (!tipo_mantenimiento_maquina || !fecha_mantenimiento_maquina || !observacion_maquina || !equipo_apto_maquina || !realizo_mantenimiento_maquina || !reviso_mantenimiento_maquina || !novedad_maquina || !id_maquina) { // Validación básica de campos vacíos con mensaje detallado
        return res.status(400).json({ mensaje: "Faltan datos: " + JSON.stringify(req.body) }); // Validación básica de campos vacíos con mensaje detallado
    }
    
    const sql = `INSERT INTO mantenimiento_maquina (tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`; // Usar parámetros para evitar SQL Injection
    db.query(sql, [tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina], (err, result) => { // Manejar la respuesta de la base de datos
        if (err) {
            console.error("Error en BD:", err); // Log del error para depuración
            return res.status(500).json({ mensaje: "Error al guardar mantenimiento de máquina: " + err.message }); // Manejo de error genérico con mensaje detallado
        }
        res.json({ mensaje: "Mantenimiento de máquina guardado correctamente" }); // Respuesta exitosa
    });
});
app.get("/mantenimiento/maquinas", (req, res) => { // GET para mantenimientos de máquinas
    const sql = "SELECT * FROM mantenimiento_maquina"; // Consulta para obtener todos los mantenimientos de máquinas
    db.query(sql, (err, results) => { // Manejar la respuesta de la base de datos
        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener mantenimientos de máquinas" }); // Manejo de error genérico
        }
        res.json(results); // Respuesta exitosa con los resultados de la consulta
    });
});
// 🗑️ DELETE para corte
app.delete("/herramientas/corte/:id", (req, res) => { // DELETE para herramienta de corte
    const { id } = req.params; // Obtener el ID de la herramienta de corte a eliminar desde los parámetros de la URL
    const sql = "DELETE FROM herramienta_corte WHERE id_herramienta_corte = ?"; // Usar parámetros para evitar SQL Injection
    
    db.query(sql, [id], (err, result) => { // Manejar la respuesta de la base de datos
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar herramienta de corte" }); // Manejo de error genérico
        }
        res.json({ mensaje: "Herramienta de corte eliminada correctamente" }); // Respuesta exitosa
    });
});
app.delete("/mantenimiento/maquinas/:id", (req, res) => { // DELETE para mantenimiento de máquina
    const { id } = req.params; // Obtener el ID del mantenimiento de máquina a eliminar desde los parámetros de la URL
    const sql = "DELETE FROM mantenimiento_maquina WHERE codigo_mantenimiento_maquina = ?"; // Usar parámetros para evitar SQL Injection
    
    db.query(sql, [id], (err, result) => { // Manejar la respuesta de la base de datos
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar mantenimiento de máquina" }); // Manejo de error genérico
        }
        res.json({ mensaje: "Mantenimiento de máquina eliminado correctamente" }); // Respuesta exitosa
    });
});

// 🗑️ DELETE para sujeción
app.delete("/herramientas/sujecion/:id", (req, res) => { // DELETE para herramienta de sujeción
    const { id } = req.params; // Obtener el ID de la herramienta de sujeción a eliminar desde los parámetros de la URL
    const sql = "DELETE FROM herramienta_sujecion WHERE id_herramienta_sujecion = ?"; // Usar parámetros para evitar SQL Injection
    
    db.query(sql, [id], (err, result) => {// Manejar la respuesta de la base de datos
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar herramienta de sujeción" }); // Manejo de error genérico
        }
        res.json({ mensaje: "Herramienta de sujeción eliminada correctamente" }); // Respuesta exitosa
    });
});

// 🗑️ DELETE para impacto
app.delete("/herramientas/impacto/:id", (req, res) => { // DELETE para herramienta de impacto
    const { id } = req.params; // Obtener el ID de la herramienta de impacto a eliminar desde los parámetros de la URL
    const sql = "DELETE FROM herramienta_impacto WHERE id_herramienta_impacto = ?"; // Usar parámetros para evitar SQL Injection
    
    db.query(sql, [id], (err, result) => { // Manejar la respuesta de la base de datos
        if (err) { // Manejo de error genérico
            return res.status(500).json({ mensaje: "Error al eliminar herramienta de impacto" }); // Manejo de error genérico    
        }
        res.json({ mensaje: "Herramienta de impacto eliminada correctamente" }); // Respuesta exitosa
    });
});

// 🗑️ DELETE para medición
app.delete("/herramientas/medicion/:id", (req, res) => { // DELETE para herramienta de medición
    const { id } = req.params; // Obtener el ID de la herramienta de medición a eliminar desde los parámetros de la URL
    const sql = "DELETE FROM herramienta_medicion WHERE id_herramienta_medicion = ?"; // Usar parámetros para evitar SQL Injection
    
    db.query(sql, [id], (err, result) => { // Manejar la respuesta de la base de datos
        if (err) { // Manejo de error genérico
            return res.status(500).json({ mensaje: "Error al eliminar herramienta de medición" }); // Manejo de error genérico
        }
        res.json({ mensaje: "Herramienta de medición eliminada correctamente" }); // Respuesta exitosa
    });
});

// 🗑️ DELETE para eliminar cuenta de usuario
app.delete("/usuario", (req, res) => {

    const { correo } = req.body;

    if (!correo) {
        return res.status(400).json({ mensaje: "Correo requerido" });
    }

    const sql = "DELETE FROM usuario WHERE correo = ?"
    ;

    db.query(sql, [correo], (err, result) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al eliminar usuario" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Cuenta eliminada correctamente" });
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});