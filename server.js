const express = require("express");
const mysql   = require("mysql2");
const cors    = require("cors");
const bcrypt  = require("bcryptjs");
const { exec } = require("child_process");
const fs      = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// ── CONEXIÓN MYSQL ────────────────────────────────────────────────────────────
const db = mysql.createConnection({
    host:     "localhost",
    user:     "root",
    password: "1055313199",
    database: "smaqmina1"
});

db.connect(err => {
    if (err) console.log("Error de conexión:", err);
    else     console.log("Conectado a MySQL");
});

// ── MIDDLEWARE: verificar superadmin ─────────────────────────────────────────
function soloSuperadmin(req, res, next) {
    const correo_admin = req.headers["correo_admin"];
    if (!correo_admin) return res.status(401).json({ mensaje: "No autorizado" });

    db.query("SELECT id_cuenta FROM super_cuenta WHERE correo_cuenta = ?", [correo_admin], (err, results) => {
        if (err || results.length === 0)
            return res.status(403).json({ mensaje: "Acceso denegado" });
        next();
    });
}

// ── REGISTRO ─────────────────────────────────────────────────────────────────
app.post("/register", async (req, res) => {
    const { nombre, correo, telefono, password } = req.body;

    if (!nombre || !correo || !telefono || !password)
        return res.status(400).json({ mensaje: "Campos incompletos" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO usuario (nombre, correo, telefono, password, estado) VALUES (?, ?, ?, ?, 'pendiente')";
    db.query(sql, [nombre, correo, telefono, hashedPassword], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al registrar usuario" });
        res.json({ mensaje: "Solicitud enviada. Espera a que el administrador apruebe tu cuenta." });
    });
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
// Busca primero en super_cuenta, luego en usuario
app.post("/login", (req, res) => {
    const { correo, password } = req.body;

    // 1. Buscar en super_cuenta
    db.query("SELECT * FROM super_cuenta WHERE correo_cuenta = ?", [correo], async (err, superResultados) => {
        if (err) return res.status(500).json({ mensaje: "Error servidor" });

        if (superResultados.length > 0) {
            const su = superResultados[0];
            let passwordCorrecta = false;

            // Si está en texto plano, comparar y migrar a bcrypt
            if (!su.password.startsWith("$2a$") && !su.password.startsWith("$2b$")) {
                if (su.password === password) {
                    passwordCorrecta = true;
                    const hash = await bcrypt.hash(password, 10);
                    db.query("UPDATE super_cuenta SET password = ? WHERE correo_cuenta = ?", [hash, correo]);
                }
            } else {
                passwordCorrecta = await bcrypt.compare(password, su.password);
            }

            if (!passwordCorrecta)
                return res.status(400).json({ mensaje: "Contraseña incorrecta" });

            return res.json({
                mensaje: "Login exitoso",
                usuario: {
                    id:       su.id_cuenta,
                    nombre:   su.nombre_cuenta,
                    correo:   su.correo_cuenta,
                    telefono: su.telefono_cuenta,
                    rol:      "superadmin"
                }
            });
        }

        // 2. Buscar en usuario normal
        db.query("SELECT * FROM usuario WHERE correo = ?", [correo], async (err2, results) => {
            if (err2) return res.status(500).json({ mensaje: "Error servidor" });
            if (results.length === 0) return res.status(400).json({ mensaje: "Usuario no encontrado" });

            const usuario = results[0];

            if (usuario.estado === "pendiente")
                return res.status(403).json({ mensaje: "Tu cuenta aún no ha sido aprobada por el administrador" });
            if (usuario.estado === "inactivo")
                return res.status(403).json({ mensaje: "Tu cuenta ha sido desactivada. Contacta al administrador" });

            const passwordCorrecta = await bcrypt.compare(password, usuario.password);
            if (!passwordCorrecta)
                return res.status(400).json({ mensaje: "Contraseña incorrecta" });

            db.query("UPDATE usuario SET ultimo_acceso = NOW() WHERE correo = ?", [correo]);

            res.json({
                mensaje: "Login exitoso",
                usuario: {
                    id:       usuario.id,
                    nombre:   usuario.nombre,
                    correo:   usuario.correo,
                    telefono: usuario.telefono,
                    rol:      "usuario",
                    estado:   usuario.estado
                }
            });
        });
    });
});

// ── ELIMINAR CUENTA DE USUARIO ────────────────────────────────────────────────
app.delete("/usuario", (req, res) => {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ mensaje: "Correo requerido" });

    db.query("DELETE FROM usuario WHERE correo = ?", [correo], (err, result) => {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar usuario" });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.json({ mensaje: "Cuenta eliminada correctamente" });
    });
});

// ── HERRAMIENTAS: SUJECIÓN ────────────────────────────────────────────────────
app.post("/herramientas/sujecion", (req, res) => {
    const { nombre, buena, regular, mala } = req.body;
    const sql = `INSERT INTO herramienta_sujecion (nombre_herramienta_sujecion, cantidad_buena_sujecion, cantidad_regular_sujecion, cantidad_mala_sujecion) VALUES (?, ?, ?, ?)`;
    db.query(sql, [nombre, buena, regular, mala], (err) => {
        if (err) { console.log(err); return res.status(500).json({ mensaje: "Error al guardar sujeción" }); }
        res.json({ mensaje: "Herramienta de sujeción guardada correctamente" });
    });
});
app.get("/herramientas/sujecion", (req, res) => {
    db.query("SELECT * FROM herramienta_sujecion", (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener sujeción" });
        res.json(results);
    });
});
app.delete("/herramientas/sujecion/:id", (req, res) => {
    db.query("DELETE FROM herramienta_sujecion WHERE id_herramienta_sujecion = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar herramienta de sujeción" });
        res.json({ mensaje: "Herramienta de sujeción eliminada correctamente" });
    });
});

// ── HERRAMIENTAS: CORTE ───────────────────────────────────────────────────────
app.post("/herramientas/corte", (req, res) => {
    const { nombre, buena, regular, mala } = req.body;
    const sql = `INSERT INTO herramienta_corte (nombre_herramienta_corte, cantidad_buena_corte, cantidad_regular_corte, cantidad_mala_corte) VALUES (?, ?, ?, ?)`;
    db.query(sql, [nombre, buena, regular, mala], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al guardar corte" });
        res.json({ mensaje: "Herramienta de corte guardada correctamente" });
    });
});
app.get("/herramientas/corte", (req, res) => {
    db.query("SELECT * FROM herramienta_corte", (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener herramientas de corte" });
        res.json(results);
    });
});
app.delete("/herramientas/corte/:id", (req, res) => {
    db.query("DELETE FROM herramienta_corte WHERE id_herramienta_corte = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar herramienta de corte" });
        res.json({ mensaje: "Herramienta de corte eliminada correctamente" });
    });
});

// ── HERRAMIENTAS: IMPACTO ─────────────────────────────────────────────────────
app.post("/herramientas/impacto", (req, res) => {
    const { nombre, buena, regular, mala } = req.body;
    const sql = `INSERT INTO herramienta_impacto (nombre_herramienta_impacto, cantidad_buena_impacto, cantidad_regular_impacto, cantidad_mala_impacto) VALUES (?, ?, ?, ?)`;
    db.query(sql, [nombre, buena, regular, mala], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al guardar impacto" });
        res.json({ mensaje: "Herramienta de impacto guardada correctamente" });
    });
});
app.get("/herramientas/impacto", (req, res) => {
    db.query("SELECT * FROM herramienta_impacto", (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener herramientas de impacto" });
        res.json(results);
    });
});
app.delete("/herramientas/impacto/:id", (req, res) => {
    db.query("DELETE FROM herramienta_impacto WHERE id_herramienta_impacto = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar herramienta de impacto" });
        res.json({ mensaje: "Herramienta de impacto eliminada correctamente" });
    });
});

// ── HERRAMIENTAS: MEDICIÓN ────────────────────────────────────────────────────
app.post("/herramientas/medicion", (req, res) => {
    const { nombre, buena, regular, mala } = req.body;
    const sql = `INSERT INTO herramienta_medicion (nombre_herramienta_medicion, cantidad_buena_medicion, cantidad_regular_medicion, cantidad_mala_medicion) VALUES (?, ?, ?, ?)`;
    db.query(sql, [nombre, buena, regular, mala], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al guardar medición" });
        res.json({ mensaje: "Herramienta de medición guardada correctamente" });
    });
});
app.get("/herramientas/medicion", (req, res) => {
    db.query("SELECT * FROM herramienta_medicion", (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener herramientas de medición" });
        res.json(results);
    });
});
app.delete("/herramientas/medicion/:id", (req, res) => {
    db.query("DELETE FROM herramienta_medicion WHERE id_herramienta_medicion = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar herramienta de medición" });
        res.json({ mensaje: "Herramienta de medición eliminada correctamente" });
    });
});

// ── EQUIPOS Y MÁQUINAS ────────────────────────────────────────────────────────
app.get("/equipo", (req, res) => {
    db.query("SELECT * FROM equipo", (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener equipos" });
        res.json(results);
    });
});
app.get("/maquina", (req, res) => {
    db.query("SELECT * FROM maquina", (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener máquinas" });
        res.json(results);
    });
});

// ── MANTENIMIENTO EQUIPO ──────────────────────────────────────────────────────
app.post("/mantenimiento/equipo", (req, res) => {
    const { tipo_mantenimiento_equipo, fecha_mantenimiento_equipo, observacion_equipo, equipo_apto_equipo, realizo_mantenimiento_equipo, reviso_mantenimiento_equipo, novedad_equipo, id_equipo } = req.body;
    if (!tipo_mantenimiento_equipo || !fecha_mantenimiento_equipo || !observacion_equipo || !equipo_apto_equipo || !realizo_mantenimiento_equipo || !reviso_mantenimiento_equipo || !novedad_equipo || !id_equipo)
        return res.status(400).json({ mensaje: "Faltan datos: " + JSON.stringify(req.body) });

    const sql = `INSERT INTO mantenimiento_equipo (tipo_mantenimiento_equipo, fecha_mantenimiento_equipo, observacion_equipo, equipo_apto_equipo, realizo_mantenimiento_equipo, reviso_mantenimiento_equipo, novedad_equipo, id_equipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [tipo_mantenimiento_equipo, fecha_mantenimiento_equipo, observacion_equipo, equipo_apto_equipo, realizo_mantenimiento_equipo, reviso_mantenimiento_equipo, novedad_equipo, id_equipo], (err) => {
        if (err) { console.error("Error en BD:", err); return res.status(500).json({ mensaje: "Error al guardar mantenimiento de equipo: " + err.message }); }
        res.json({ mensaje: "Mantenimiento de equipo guardado correctamente" });
    });
});
app.get("/mantenimiento/equipos", (req, res) => {
    db.query("SELECT * FROM mantenimiento_equipo", (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener mantenimientos de equipos" });
        res.json(results);
    });
});
app.delete("/mantenimiento/equipos/:id", (req, res) => {
    db.query("DELETE FROM mantenimiento_equipo WHERE codigo_mantenimiento_equipo = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar mantenimiento de equipo" });
        res.json({ mensaje: "Mantenimiento de equipo eliminado correctamente" });
    });
});

// ── MANTENIMIENTO MÁQUINA ─────────────────────────────────────────────────────
app.post("/mantenimiento/maquina", (req, res) => {
    const { tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina } = req.body;
    if (!tipo_mantenimiento_maquina || !fecha_mantenimiento_maquina || !observacion_maquina || !equipo_apto_maquina || !realizo_mantenimiento_maquina || !reviso_mantenimiento_maquina || !novedad_maquina || !id_maquina)
        return res.status(400).json({ mensaje: "Faltan datos: " + JSON.stringify(req.body) });

    const sql = `INSERT INTO mantenimiento_maquina (tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [tipo_mantenimiento_maquina, fecha_mantenimiento_maquina, observacion_maquina, equipo_apto_maquina, realizo_mantenimiento_maquina, reviso_mantenimiento_maquina, novedad_maquina, id_maquina], (err) => {
        if (err) { console.error("Error en BD:", err); return res.status(500).json({ mensaje: "Error al guardar mantenimiento de máquina: " + err.message }); }
        res.json({ mensaje: "Mantenimiento de máquina guardado correctamente" });
    });
});
app.get("/mantenimiento/maquinas", (req, res) => {
    db.query("SELECT * FROM mantenimiento_maquina", (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener mantenimientos de máquinas" });
        res.json(results);
    });
});
app.delete("/mantenimiento/maquinas/:id", (req, res) => {
    db.query("DELETE FROM mantenimiento_maquina WHERE codigo_mantenimiento_maquina = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar mantenimiento de máquina" });
        res.json({ mensaje: "Mantenimiento de máquina eliminado correctamente" });
    });
});

// ════════════════════════════════════════════════════
// ENDPOINTS SUPERADMIN
// ════════════════════════════════════════════════════

// 📋 Historial de todos los usuarios
app.get("/superadmin/usuarios", soloSuperadmin, (req, res) => {
    const sql = "SELECT id, nombre, correo, telefono, estado, fecha_registro, ultimo_acceso FROM usuario ORDER BY fecha_registro DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ mensaje: "Error al obtener usuarios" });
        res.json(results);
    });
});

// ✅ Aprobar cuenta
app.put("/superadmin/aprobar/:correo", soloSuperadmin, (req, res) => {
    db.query("UPDATE usuario SET estado = 'activo' WHERE correo = ?", [req.params.correo], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al aprobar cuenta" });
        res.json({ mensaje: "Cuenta aprobada correctamente" });
    });
});

// ❌ Rechazar cuenta pendiente
app.delete("/superadmin/rechazar/:correo", soloSuperadmin, (req, res) => {
    db.query("DELETE FROM usuario WHERE correo = ? AND estado = 'pendiente'", [req.params.correo], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al rechazar cuenta" });
        res.json({ mensaje: "Solicitud rechazada" });
    });
});

// 🔄 Activar / desactivar cuenta
app.put("/superadmin/estado/:correo", soloSuperadmin, (req, res) => {
    const { estado } = req.body;
    if (!["activo", "inactivo"].includes(estado))
        return res.status(400).json({ mensaje: "Estado inválido" });
    db.query("UPDATE usuario SET estado = ? WHERE correo = ?", [estado, req.params.correo], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al cambiar estado" });
        res.json({ mensaje: "Estado actualizado correctamente" });
    });
});

// 🗑️ Eliminar cualquier usuario (superadmin)
app.delete("/superadmin/usuario/:correo", soloSuperadmin, (req, res) => {
    db.query("DELETE FROM usuario WHERE correo = ?", [req.params.correo], (err, result) => {
        if (err) return res.status(500).json({ mensaje: "Error al eliminar usuario" });
        if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.json({ mensaje: "Usuario eliminado correctamente" });
    });
});

// 🔑 Cambiar contraseña de cualquier usuario
app.put("/superadmin/password/:correo", soloSuperadmin, async (req, res) => {
    const { nueva_password } = req.body;
    if (!nueva_password) return res.status(400).json({ mensaje: "Contraseña requerida" });
    const hash = await bcrypt.hash(nueva_password, 10);
    db.query("UPDATE usuario SET password = ? WHERE correo = ?", [hash, req.params.correo], (err) => {
        if (err) return res.status(500).json({ mensaje: "Error al cambiar contraseña" });
        res.json({ mensaje: "Contraseña actualizada correctamente" });
    });
});

// 💾 Backup de la base de datos
app.get("/superadmin/backup", soloSuperadmin, (req, res) => {
    const fecha   = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
    const archivo = `backup_smaqmina1_${fecha}.sql`;
    const ruta    = `./${archivo}`;
    const cmd     = `mysqldump -u root -p1234567 smaqmina1 > "${ruta}"`;

    exec(cmd, (err) => {
        if (err) { console.error(err); return res.status(500).json({ mensaje: "Error al generar backup" }); }
        res.download(ruta, archivo, () => fs.unlink(ruta, () => {}));
    });
});

// ♻️ Restaurar backup
app.post("/superadmin/restaurar", soloSuperadmin, (req, res) => {
    const { sql_content } = req.body;
    if (!sql_content) return res.status(400).json({ mensaje: "Contenido SQL requerido" });

    const rutaTmp = `./restore_tmp_${Date.now()}.sql`;
    fs.writeFileSync(rutaTmp, sql_content);

    exec(`mysql -u root -p1234567 smaqmina1 < "${rutaTmp}"`, (err) => {
        fs.unlink(rutaTmp, () => {});
        if (err) { console.error(err); return res.status(500).json({ mensaje: "Error al restaurar backup" }); }
        res.json({ mensaje: "Base de datos restaurada correctamente" });
    });
});

// ── SERVIDOR ──────────────────────────────────────────────────────────────────
app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});