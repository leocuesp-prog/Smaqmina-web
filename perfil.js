// =====================================================
// perfil.js — Incluir en TODAS las páginas del sistema
// Maneja: navbar, overlay perfil, editar perfil,
//         cerrar sesión, foto de perfil, superadmin.
// =====================================================

(function () {

    // ── HELPERS: clave única por usuario en localStorage ─────────────────────
    function claveUsuario(campo) {
        const raw = localStorage.getItem("usuarioActivo");
        if (!raw) return campo;
        try {
            const u = JSON.parse(raw);
            const id = u.correo || u.id || u.nombre || "default";
            return id + "_" + campo;
        } catch (_) { return campo; }
    }

    function getPerfilItem(campo)        { return localStorage.getItem(claveUsuario(campo)); }
    function setPerfilItem(campo, valor) { localStorage.setItem(claveUsuario(campo), valor); }
    function removePerfilItem(campo)     { localStorage.removeItem(claveUsuario(campo)); }


    // ── 1. INYECTAR HTML DE LOS OVERLAYS ─────────────────────────────────────
    const overlayHTML = `
    <!-- OVERLAY VER PERFIL -->
    <div class="perfil-overlay" id="perfilOverlay">
        <div class="perfil-box">
            <span class="cerrar-perfil" onclick="cerrarPerfil()">✖</span>
            <div class="perfil-contenido">
                <div class="perfil-foto">
                    <img id="fotoPerfil" src="imagenes/Usuario.webp" alt="Usuario">
                    <h3 id="nombrePerfil"></h3>
                    <p id="rolPerfil"></p>
                    <button class="btn-editar" onclick="abrirEditarPerfil()">Editar perfil</button>
                    <button class="btn-superadmin" id="btnPanelSuperadmin" style="display:none" onclick="abrirSuperadmin()">&#9881;&#65039; Panel Superadmin</button>
                </div>
                <div class="perfil-info">
                    <h4>Información de contacto</h4>
                    <p><b>Correo:</b> <span id="correoPerfil"></span></p>
                    <p><b>Teléfono:</b> <span id="extensionPerfil"></span></p>
                    <p><b>Departamento:</b> <span id="deptoPerfil"></span></p>
                    <p><b>Último acceso:</b> <span id="accesoPerfil"></span></p>
                </div>
            </div>
        </div>
    </div>

    <!-- OVERLAY EDITAR PERFIL -->
    <div class="editar-overlay" id="editarOverlay">
        <div class="editar-box">
            <span class="cerrar-perfil" onclick="cerrarEditar()">✖</span>
            <button class="btn-cerrar-sesion" onclick="cerrarSesion()">Cerrar sesión</button>
            <button class="btn-eliminar-cuenta" id="btnEliminarCuenta" onclick="eliminarCuenta()">Eliminar cuenta</button>
            <label>Foto de perfil</label>
            <input type="file" id="inputFoto" accept="image/*">
            <button type="button" onclick="borrarFoto()">Eliminar foto</button>
            <label>Nombre</label>
            <input type="text" id="inputNombre">
            <label>Correo</label>
            <input type="email" id="inputCorreo">
            <label>Teléfono</label>
            <input type="text" id="inputExtension">
            <label>Departamento</label>
            <input type="text" id="inputDepto">
            <button onclick="guardarPerfil()">Guardar cambios</button>
        </div>
    </div>

    <!-- OVERLAY SUPERADMIN -->
    <div class="superadmin-overlay" id="superadminOverlay">
        <div class="superadmin-box">
            <span class="cerrar-perfil" onclick="cerrarSuperadmin()">✖</span>
            <h2>Panel Superadministrador</h2>

            <div class="superadmin-body">
            <div class="sa-tabs">
                <button class="sa-tab active" onclick="saTab('pendientes')">Pendientes</button>
                <button class="sa-tab" onclick="saTab('usuarios')">Usuarios</button>
                <button class="sa-tab" onclick="saTab('backup')">Backup</button>
            </div>

            <div class="sa-panel" id="sa-pendientes">
                <h4>Solicitudes pendientes de aprobación</h4>
                <div id="listaPendientes">Cargando...</div>
            </div>

            <div class="sa-panel" id="sa-usuarios" style="display:none">
                <h4>Historial de cuentas</h4>
                <div id="listaUsuarios">Cargando...</div>
            </div>

            <div class="sa-panel" id="sa-backup" style="display:none">
                <h4>Backup de la base de datos</h4>
                <button class="btn-backup" onclick="descargarBackup()">Descargar backup</button>
                <hr style="margin:20px 0">
                <h4>Restaurar backup</h4>
                <input type="file" id="inputBackup" accept=".sql">
                <button class="btn-restaurar" onclick="restaurarBackup()">Restaurar</button>
                <p id="mensajeBackup"></p>
            </div>

            <div id="modalPassword" style="display:none">
                <h4>Cambiar contraseña de: <span id="correoPasswordTarget"></span></h4>
                <input type="password" id="inputNuevaPassword" placeholder="Nueva contraseña">
                <div style="display:flex;gap:10px;margin-top:10px">
                    <button onclick="confirmarCambioPassword()">Guardar</button>
                    <button class="btn-cancelar" onclick="document.getElementById('modalPassword').style.display='none'">Cancelar</button>
                </div>
            </div>
            </div><!-- /superadmin-body -->
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", overlayHTML);


    // ── 2. MOSTRAR/OCULTAR NAVBAR ─────────────────────────────────────────────
    window.addEventListener("load", function () {

        const usuarioGuardado = localStorage.getItem("usuarioActivo");
        const linkLogin    = document.getElementById("linkLogin");
        const perfilNavbar = document.getElementById("perfilNavbar");

        if (usuarioGuardado) {
            const usuario = JSON.parse(usuarioGuardado);

            if (linkLogin)    linkLogin.style.display    = "none";
            if (perfilNavbar) perfilNavbar.style.display = "block";

            const nombreEl   = document.getElementById("nombrePerfil");
            const correoEl   = document.getElementById("correoPerfil");
            const telefonoEl = document.getElementById("extensionPerfil");
            const rolEl      = document.getElementById("rolPerfil");
            const deptoEl    = document.getElementById("deptoPerfil");
            const accesoEl   = document.getElementById("accesoPerfil");

            if (nombreEl)   nombreEl.textContent   = getPerfilItem("nombrePerfil")    || usuario.nombre   || "";
            if (correoEl)   correoEl.textContent   = getPerfilItem("correoPerfil")    || usuario.correo   || "";
            if (telefonoEl) telefonoEl.textContent = getPerfilItem("extensionPerfil") || usuario.telefono || "";
            if (deptoEl && getPerfilItem("deptoPerfil")) deptoEl.textContent = getPerfilItem("deptoPerfil");
            if (accesoEl)   accesoEl.textContent   = new Date().toLocaleString("es-CO");

            if (rolEl) {
                rolEl.textContent = usuario.rol === "superadmin"
                    ? "Superadministrador"
                    : (getPerfilItem("rolPerfil") || "Usuario");
            }

            if (usuario.rol === "superadmin") {
                const btnSA = document.getElementById("btnPanelSuperadmin");
                if (btnSA) btnSA.style.display = "block";
                const btnEliminar = document.getElementById("btnEliminarCuenta");
                if (btnEliminar) btnEliminar.style.display = "none";
            }

            const fotoGuardada = getPerfilItem("fotoPerfil");
            if (fotoGuardada) {
                const foto  = document.getElementById("fotoPerfil");
                const icono = document.getElementById("iconoNavbar");
                if (foto)  foto.src  = fotoGuardada;
                if (icono) icono.src = fotoGuardada;
            }

        } else {
            if (linkLogin)    linkLogin.style.display    = "inline-block";
            if (perfilNavbar) perfilNavbar.style.display = "none";
        }
    });


    // ── 3. FUNCIONES OVERLAY PERFIL ───────────────────────────────────────────

    window.abrirPerfil = function () {
        const o = document.getElementById("perfilOverlay");
        if (o) o.style.display = "flex";
    };

    window.cerrarPerfil = function () {
        const o = document.getElementById("perfilOverlay");
        if (o) o.style.display = "none";
    };

    window.abrirEditarPerfil = function () {
        const o = document.getElementById("editarOverlay");
        if (!o) return;
        window.cerrarPerfil();
        o.style.display = "flex";

        const mapa = {
            nombrePerfil:    "inputNombre",
            correoPerfil:    "inputCorreo",
            extensionPerfil: "inputExtension",
            deptoPerfil:     "inputDepto"
        };
        Object.entries(mapa).forEach(([spanId, inputId]) => {
            const span  = document.getElementById(spanId);
            const input = document.getElementById(inputId);
            if (span && input) input.value = span.textContent;
        });
    };

    window.cerrarEditar = function () {
        const o = document.getElementById("editarOverlay");
        if (o) o.style.display = "none";
    };

    window.guardarPerfil = function () {
        const mapa = {
            inputNombre:    "nombrePerfil",
            inputCorreo:    "correoPerfil",
            inputExtension: "extensionPerfil",
            inputDepto:     "deptoPerfil"
        };
        Object.entries(mapa).forEach(([inputId, spanId]) => {
            const input = document.getElementById(inputId);
            const span  = document.getElementById(spanId);
            if (input && span) {
                span.textContent = input.value;
                setPerfilItem(spanId, input.value);
            }
        });

        const fileInput = document.getElementById("inputFoto");
        if (fileInput && fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const foto  = document.getElementById("fotoPerfil");
                const icono = document.getElementById("iconoNavbar");
                if (foto)  foto.src  = e.target.result;
                if (icono) icono.src = e.target.result;
                setPerfilItem("fotoPerfil", e.target.result);
            };
            reader.readAsDataURL(fileInput.files[0]);
        }

        alert("Perfil actualizado correctamente");
        window.cerrarEditar();
    };

    window.borrarFoto = function () {
        const def   = "imagenes/Usuario.webp";
        const foto  = document.getElementById("fotoPerfil");
        const icono = document.getElementById("iconoNavbar");
        if (foto)  foto.src  = def;
        if (icono) icono.src = def;
        removePerfilItem("fotoPerfil");
        alert("Foto eliminada correctamente");
    };

    window.cerrarSesion = function () {
        localStorage.removeItem("usuarioActivo");
        window.location.href = "index.html";
    };

    window.eliminarCuenta = async function () {
        const raw = localStorage.getItem("usuarioActivo");
        if (!raw) return;
        const usuario = JSON.parse(raw);
        if (!confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) return;

        try {
            const res  = await fetch("http://localhost:3000/usuario", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: usuario.correo })
            });
            const data = await res.json();
            if (res.ok) {
                const p = usuario.correo + "_";
                ["nombrePerfil","correoPerfil","extensionPerfil","rolPerfil","deptoPerfil","fotoPerfil"]
                    .forEach(c => localStorage.removeItem(p + c));
                localStorage.removeItem("usuarioActivo");
                alert("Cuenta eliminada correctamente");
                window.location.href = "index.html";
            } else {
                alert(data.mensaje || "Error al eliminar la cuenta");
            }
        } catch { alert("Error conectando al servidor"); }
    };


    // ── 4. FUNCIONES SUPERADMIN ───────────────────────────────────────────────

    function getCorreoAdmin() {
        const raw = localStorage.getItem("usuarioActivo");
        return raw ? JSON.parse(raw).correo : null;
    }

    function headersSA() {
        return { "Content-Type": "application/json", "correo_admin": getCorreoAdmin() };
    }

    window.abrirSuperadmin = function () {
        window.cerrarPerfil();
        const o = document.getElementById("superadminOverlay");
        if (o) { o.style.display = "flex"; saTab("pendientes"); }
    };

    window.cerrarSuperadmin = function () {
        const o = document.getElementById("superadminOverlay");
        if (o) o.style.display = "none";
    };

    window.saTab = function (tab) {
        ["pendientes","usuarios","backup"].forEach(t => {
            document.getElementById("sa-" + t).style.display = t === tab ? "block" : "none";
        });
        document.querySelectorAll(".sa-tab").forEach((btn, i) => {
            btn.classList.toggle("active", ["pendientes","usuarios","backup"][i] === tab);
        });
        document.getElementById("modalPassword").style.display = "none";
        if (tab === "pendientes") cargarPendientes();
        if (tab === "usuarios")   cargarUsuarios();
    };

    async function cargarPendientes() {
        const div = document.getElementById("listaPendientes");
        div.innerHTML = "Cargando...";
        try {
            const res   = await fetch("http://localhost:3000/superadmin/usuarios", { headers: headersSA() });
            const lista = await res.json();
            const pend  = lista.filter(u => u.estado === "pendiente");
            if (pend.length === 0) {
                div.innerHTML = "<p class='sa-vacio'>No hay solicitudes pendientes.</p>";
                return;
            }
            div.innerHTML = pend.map(u => `
                <div class="sa-card">
                    <div class="sa-card-info">
                        <b>${u.nombre}</b><br>
                        <small>${u.correo} &nbsp;|&nbsp; Tel: ${u.telefono || "-"} &nbsp;|&nbsp; Registrado: ${formatFecha(u.fecha_registro)}</small>
                    </div>
                    <div class="sa-card-acciones">
                        <button class="btn-aprobar" onclick="aprobarUsuario('${u.correo}')">Aprobar</button>
                        <button class="btn-rechazar" onclick="rechazarUsuario('${u.correo}')">Rechazar</button>
                    </div>
                </div>`).join("");
        } catch { div.innerHTML = "<p style='color:crimson'>Error cargando pendientes.</p>"; }
    }

    async function cargarUsuarios() {
        const div = document.getElementById("listaUsuarios");
        div.innerHTML = "Cargando...";
        try {
            const res   = await fetch("http://localhost:3000/superadmin/usuarios", { headers: headersSA() });
            const lista = await res.json();
            const users = lista.filter(u => u.estado !== "pendiente");
            if (users.length === 0) {
                div.innerHTML = "<p class='sa-vacio'>No hay usuarios registrados.</p>";
                return;
            }
            div.innerHTML = users.map(u => `
                <div class="sa-card">
                    <div class="sa-card-info">
                        <b>${u.nombre}</b>
                        <span class="sa-badge ${u.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'}">${u.estado}</span><br>
                        <small>
                            ${u.correo} &nbsp;|&nbsp; Tel: ${u.telefono || "-"}<br>
                            Registrado: ${formatFecha(u.fecha_registro)} &nbsp;|&nbsp; Último acceso: ${formatFecha(u.ultimo_acceso)}
                        </small>
                    </div>
                    <div class="sa-card-acciones">
                        <button onclick="toggleEstado('${u.correo}','${u.estado}')">
                            ${u.estado === "activo" ? "Desactivar" : "Activar"}
                        </button>
                        <button onclick="abrirCambioPassword('${u.correo}')">Contraseña</button>
                        <button class="btn-rechazar" onclick="eliminarUsuarioAdmin('${u.correo}')">Eliminar</button>
                    </div>
                </div>`).join("");
        } catch { div.innerHTML = "<p style='color:crimson'>Error cargando usuarios.</p>"; }
    }

    window.aprobarUsuario = async function (correo) {
        try {
            const res  = await fetch(`http://localhost:3000/superadmin/aprobar/${encodeURIComponent(correo)}`,
                { method: "PUT", headers: headersSA() });
            const data = await res.json();
            alert(data.mensaje);
            cargarPendientes();
        } catch { alert("Error conectando al servidor"); }
    };

    window.rechazarUsuario = async function (correo) {
        if (!confirm("¿Rechazar la solicitud de " + correo + "?")) return;
        try {
            const res  = await fetch(`http://localhost:3000/superadmin/rechazar/${encodeURIComponent(correo)}`,
                { method: "DELETE", headers: headersSA() });
            const data = await res.json();
            alert(data.mensaje);
            cargarPendientes();
        } catch { alert("Error conectando al servidor"); }
    };

    window.toggleEstado = async function (correo, estadoActual) {
        const nuevo = estadoActual === "activo" ? "inactivo" : "activo";
        if (!confirm((nuevo === "activo" ? "Activar" : "Desactivar") + " la cuenta de " + correo + "?")) return;
        try {
            const res  = await fetch(`http://localhost:3000/superadmin/estado/${encodeURIComponent(correo)}`, {
                method: "PUT",
                headers: headersSA(),
                body: JSON.stringify({ estado: nuevo })
            });
            const data = await res.json();
            alert(data.mensaje);
            cargarUsuarios();
        } catch { alert("Error conectando al servidor"); }
    };

    window.eliminarUsuarioAdmin = async function (correo) {
        if (!confirm("Eliminar permanentemente la cuenta de " + correo + "?")) return;
        try {
            const res  = await fetch(`http://localhost:3000/superadmin/usuario/${encodeURIComponent(correo)}`,
                { method: "DELETE", headers: headersSA() });
            const data = await res.json();
            alert(data.mensaje);
            cargarUsuarios();
        } catch { alert("Error conectando al servidor"); }
    };

    window.abrirCambioPassword = function (correo) {
        const modal = document.getElementById("modalPassword");
        document.getElementById("correoPasswordTarget").textContent = correo;
        document.getElementById("inputNuevaPassword").value = "";
        modal.dataset.correo = correo;
        modal.style.display  = "block";
        modal.scrollIntoView({ behavior: "smooth" });
    };

    window.confirmarCambioPassword = async function () {
        const correo = document.getElementById("modalPassword").dataset.correo;
        const nueva  = document.getElementById("inputNuevaPassword").value.trim();
        if (!nueva) { alert("Escribe una contraseña"); return; }
        try {
            const res  = await fetch(`http://localhost:3000/superadmin/password/${encodeURIComponent(correo)}`, {
                method: "PUT",
                headers: headersSA(),
                body: JSON.stringify({ nueva_password: nueva })
            });
            const data = await res.json();
            alert(data.mensaje);
            document.getElementById("modalPassword").style.display = "none";
        } catch { alert("Error conectando al servidor"); }
    };

    window.descargarBackup = async function () {
        try {
            const res = await fetch("http://localhost:3000/superadmin/backup", { headers: headersSA() });
            if (!res.ok) { alert("Error al generar backup"); return; }
            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement("a");
            a.href     = url;
            a.download = "backup_smaqmina1_" + new Date().toISOString().slice(0,10) + ".sql";
            a.click();
            URL.revokeObjectURL(url);
        } catch { alert("Error conectando al servidor"); }
    };

    window.restaurarBackup = async function () {
        const file = document.getElementById("inputBackup").files[0];
        if (!file) { alert("Selecciona un archivo .sql"); return; }
        if (!confirm("Esto sobreescribira la base de datos actual. Continuar?")) return;
        const msg = document.getElementById("mensajeBackup");
        msg.style.color = "var(--gris-texto)";
        msg.textContent = "Restaurando...";
        try {
            const texto = await file.text();
            const res   = await fetch("http://localhost:3000/superadmin/restaurar", {
                method: "POST",
                headers: headersSA(),
                body: JSON.stringify({ sql_content: texto })
            });
            const data = await res.json();
            msg.textContent = data.mensaje;
            msg.style.color = res.ok ? "var(--verde-barra)" : "crimson";
        } catch {
            msg.textContent = "Error conectando al servidor";
            msg.style.color = "crimson";
        }
    };

    function formatFecha(fecha) {
        if (!fecha) return "Nunca";
        return new Date(fecha).toLocaleString("es-CO");
    }


    // ── 5. CERRAR OVERLAYS AL HACER CLIC EN EL FONDO ─────────────────────────
    document.addEventListener("click", function (e) {
        const po = document.getElementById("perfilOverlay");
        const eo = document.getElementById("editarOverlay");
        const so = document.getElementById("superadminOverlay");
        if (e.target === po) window.cerrarPerfil();
        if (e.target === eo) window.cerrarEditar();
        if (e.target === so) window.cerrarSuperadmin();
    });

})();
