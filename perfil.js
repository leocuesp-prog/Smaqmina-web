// =====================================================
// perfil.js — Incluir en TODAS las páginas del sistema
// Maneja: mostrar/ocultar navbar, overlay perfil,
//         editar perfil, cerrar sesión, foto de perfil.
// =====================================================

(function () {

    // ── 1. INYECTAR HTML DEL OVERLAY EN CADA PÁGINA ──────────────────────────
    const overlayHTML = `
    <!-- OVERLAY VER PERFIL -->
    <div class="perfil-overlay" id="perfilOverlay">
        <div class="perfil-box">
            <span class="cerrar-perfil" onclick="cerrarPerfil()">✖</span>
            <div class="perfil-contenido">
                <div class="perfil-foto">
                    <img id="fotoPerfil" src="imagenes/Usuario.webp" alt="Usuario">
                    <h3 id="nombrePerfil"></h3>
                    <p id="rolPerfil">Administrador</p>
                    <button class="btn-editar" onclick="abrirEditarPerfil()">Editar perfil</button>
                </div>
                <div class="perfil-info">
                    <h4>Información de contacto</h4>
                    <p><b>Correo:</b> <span id="correoPerfil"></span></p>
                    <p><b>Extensión:</b> <span id="extensionPerfil"></span></p>
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
            <label>Foto de perfil</label>
            <input type="file" id="inputFoto" accept="image/*">
            <button type="button" onclick="borrarFoto()">Eliminar foto</button>
            <label>Nombre</label>
            <input type="text" id="inputNombre">
            <label>Rol</label>
            <input type="text" id="inputRol">
            <label>Correo</label>
            <input type="email" id="inputCorreo">
            <label>Extensión</label>
            <input type="text" id="inputExtension">
            <label>Departamento</label>
            <input type="text" id="inputDepto">
            <button onclick="guardarPerfil()">Guardar cambios</button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", overlayHTML);


    // ── 2. MOSTRAR/OCULTAR NAVBAR (login vs foto perfil) ─────────────────────

    window.addEventListener("load", function () {

        const usuarioGuardado = localStorage.getItem("usuarioActivo");
        const linkLogin    = document.getElementById("linkLogin");
        const perfilNavbar = document.getElementById("perfilNavbar");

        if (usuarioGuardado) {
            // ✅ Sesión activa → ocultar "Iniciar sesión", mostrar ícono de perfil
            const usuario = JSON.parse(usuarioGuardado);

            if (linkLogin)    linkLogin.style.display    = "none";
            if (perfilNavbar) perfilNavbar.style.display = "block";

            // Cargar datos del usuario en el overlay
            const nombrePerfil    = document.getElementById("nombrePerfil");
            const correoPerfil    = document.getElementById("correoPerfil");
            const extensionPerfil = document.getElementById("extensionPerfil");

            if (nombrePerfil)
                nombrePerfil.textContent = localStorage.getItem("nombrePerfil") || usuario.nombre || "";
            if (correoPerfil)
                correoPerfil.textContent = localStorage.getItem("correoPerfil") || usuario.correo || "";
            if (extensionPerfil)
                extensionPerfil.textContent = localStorage.getItem("extensionPerfil") || usuario.telefono || "";

            const rolEl   = document.getElementById("rolPerfil");
            const deptoEl = document.getElementById("deptoPerfil");
            if (rolEl   && localStorage.getItem("rolPerfil"))   rolEl.textContent   = localStorage.getItem("rolPerfil");
            if (deptoEl && localStorage.getItem("deptoPerfil")) deptoEl.textContent = localStorage.getItem("deptoPerfil");

            // Fecha de último acceso
            const accesoEl = document.getElementById("accesoPerfil");
            if (accesoEl) accesoEl.textContent = new Date().toLocaleString("es-CO");

        } else {
            // ❌ Sin sesión → mostrar "Iniciar sesión", ocultar ícono de perfil
            if (linkLogin)    linkLogin.style.display    = "inline-block";
            if (perfilNavbar) perfilNavbar.style.display = "none";
        }

        // Cargar foto guardada
        const fotoGuardada = localStorage.getItem("fotoPerfil");
        if (fotoGuardada) {
            const foto  = document.getElementById("fotoPerfil");
            const icono = document.getElementById("iconoNavbar");
            if (foto)  foto.src  = fotoGuardada;
            if (icono) icono.src = fotoGuardada;
        }
    });


    // ── 3. FUNCIONES DEL OVERLAY ──────────────────────────────────────────────

    window.abrirPerfil = function () {
        const overlay = document.getElementById("perfilOverlay");
        if (overlay) overlay.style.display = "flex";
    };

    window.cerrarPerfil = function () {
        const overlay = document.getElementById("perfilOverlay");
        if (overlay) overlay.style.display = "none";
    };

    window.abrirEditarPerfil = function () {
        const editarOverlay = document.getElementById("editarOverlay");
        if (!editarOverlay) return;

        window.cerrarPerfil(); // Cierra el overlay de ver perfil primero

        editarOverlay.style.display = "flex";

        // Pre-rellenar inputs con valores actuales del overlay
        const mapa = {
            nombrePerfil:    "inputNombre",
            rolPerfil:       "inputRol",
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
        const editarOverlay = document.getElementById("editarOverlay");
        if (editarOverlay) editarOverlay.style.display = "none";
    };

    window.guardarPerfil = function () {
        const mapa = {
            inputNombre:    "nombrePerfil",
            inputRol:       "rolPerfil",
            inputCorreo:    "correoPerfil",
            inputExtension: "extensionPerfil",
            inputDepto:     "deptoPerfil"
        };

        Object.entries(mapa).forEach(([inputId, spanId]) => {
            const input = document.getElementById(inputId);
            const span  = document.getElementById(spanId);
            if (input && span) {
                span.textContent = input.value;
                localStorage.setItem(spanId, input.value);
            }
        });

        // Guardar foto si se seleccionó una nueva
        const fileInput = document.getElementById("inputFoto");
        if (fileInput && fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const foto  = document.getElementById("fotoPerfil");
                const icono = document.getElementById("iconoNavbar");
                if (foto)  foto.src  = e.target.result;
                if (icono) icono.src = e.target.result;
                localStorage.setItem("fotoPerfil", e.target.result);
            };
            reader.readAsDataURL(fileInput.files[0]);
        }

        alert("Perfil actualizado correctamente ✅");
        window.cerrarEditar();
    };

    window.borrarFoto = function () {
        const imagenDefault = "imagenes/Usuario.webp";
        const foto  = document.getElementById("fotoPerfil");
        const icono = document.getElementById("iconoNavbar");
        if (foto)  foto.src  = imagenDefault;
        if (icono) icono.src = imagenDefault;
        localStorage.removeItem("fotoPerfil");
        alert("Foto eliminada correctamente 🗑️");
    };

    window.cerrarSesion = function () {
        localStorage.removeItem("usuarioActivo");
        alert("Sesión cerrada correctamente 👋");
        window.location.href = "index.html";
    };

    // Cerrar overlays al hacer clic en el fondo oscuro
    document.addEventListener("click", function (e) {
        const perfilOverlay = document.getElementById("perfilOverlay");
        const editarOverlay = document.getElementById("editarOverlay");
        if (e.target === perfilOverlay)  window.cerrarPerfil();
        if (e.target === editarOverlay)  window.cerrarEditar();
    });

})();
