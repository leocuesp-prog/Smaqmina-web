// =====================================================
// perfil.js — Incluir en TODAS las páginas del sistema
// Maneja: mostrar/ocultar navbar, overlay perfil,
//         editar perfil, cerrar sesión, foto de perfil.
// =====================================================

(function () {

    // ── HELPER: clave única por usuario ──────────────────────────────────────
    // Usa el correo del usuario activo como prefijo de cada clave en localStorage
    // para que cada cuenta tenga sus propios datos guardados.
    function claveUsuario(campo) {
        const raw = localStorage.getItem("usuarioActivo");
        if (!raw) return campo;
        try {
            const u = JSON.parse(raw);
            const id = u.correo || u.id || u.nombre || "default";
            return id + "_" + campo;
        } catch (_) {
            return campo;
        }
    }

    function getPerfilItem(campo) {
        return localStorage.getItem(claveUsuario(campo));
    }

    function setPerfilItem(campo, valor) {
        localStorage.setItem(claveUsuario(campo), valor);
    }

    function removePerfilItem(campo) {
        localStorage.removeItem(claveUsuario(campo));
    }


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
            <button class="btn-eliminar-cuenta" onclick="eliminarCuenta()">Eliminar cuenta</button>
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

    document.body.insertAdjacentHTML("beforeend", overlayHTML); // Agregar el HTML del overlay al final del body para que esté disponible en todas las páginas


    // ── 2. MOSTRAR/OCULTAR NAVBAR (login vs foto perfil) ─────────────────────

    window.addEventListener("load", function () { // Esperar a que la página cargue para manipular el DOM

        const usuarioGuardado = localStorage.getItem("usuarioActivo"); // Verificar si hay un usuario activo guardado en localStorage
        const linkLogin    = document.getElementById("linkLogin"); //   Obtener referencia al enlace de "Iniciar sesión" en la navbar
        const perfilNavbar = document.getElementById("perfilNavbar"); // Obtener referencia al ícono de perfil en la navbar

        if (usuarioGuardado) { //
            // ✅ Sesión activa → ocultar "Iniciar sesión", mostrar ícono de perfil
            const usuario = JSON.parse(usuarioGuardado);

            if (linkLogin)    linkLogin.style.display    = "none"; // Ocultar enlace de "Iniciar sesión"
            if (perfilNavbar) perfilNavbar.style.display = "block"; // Mostrar ícono de perfil

            // Cargar datos del usuario usando claves únicas por cuenta
            const nombrePerfil    = document.getElementById("nombrePerfil");
            const correoPerfil    = document.getElementById("correoPerfil");
            const extensionPerfil = document.getElementById("extensionPerfil");

            if (nombrePerfil)
                nombrePerfil.textContent = getPerfilItem("nombrePerfil") || usuario.nombre || "";
            if (correoPerfil)
                correoPerfil.textContent = getPerfilItem("correoPerfil") || usuario.correo || "";
            if (extensionPerfil)
                extensionPerfil.textContent = getPerfilItem("extensionPerfil") || usuario.telefono || "";

            const rolEl   = document.getElementById("rolPerfil");
            const deptoEl = document.getElementById("deptoPerfil");
            if (rolEl   && getPerfilItem("rolPerfil"))   rolEl.textContent   = getPerfilItem("rolPerfil");
            if (deptoEl && getPerfilItem("deptoPerfil")) deptoEl.textContent = getPerfilItem("deptoPerfil");

            // Fecha de último acceso
            const accesoEl = document.getElementById("accesoPerfil"); // Obtener referencia al elemento que muestra el último acceso del perfil en el overlay
            if (accesoEl) accesoEl.textContent = new Date().toLocaleString("es-CO"); // Mostrar la fecha y hora actual como último acceso (esto se puede mejorar guardando la fecha real del último acceso en el login)

        } else {
            // ❌ Sin sesión → mostrar "Iniciar sesión", ocultar ícono de perfil
            if (linkLogin)    linkLogin.style.display    = "inline-block"; //   Mostrar enlace de "Iniciar sesión"
            if (perfilNavbar) perfilNavbar.style.display = "none"; // Ocultar ícono de perfil
        }

        // Cargar foto guardada para ESTE usuario específicamente
        const fotoGuardada = getPerfilItem("fotoPerfil");
        if (fotoGuardada) {
            const foto  = document.getElementById("fotoPerfil");
            const icono = document.getElementById("iconoNavbar");
            if (foto)  foto.src  = fotoGuardada;
            if (icono) icono.src = fotoGuardada;
        }
    });


    // ── 3. FUNCIONES DEL OVERLAY ──────────────────────────────────────────────

    window.abrirPerfil = function () { // Abre el overlay de ver perfil
        const overlay = document.getElementById("perfilOverlay"); // Obtener referencia al overlay
        if (overlay) overlay.style.display = "flex"; // Mostrar el overlay
    };

    window.cerrarPerfil = function () { // Cierra el overlay de ver perfil
        const overlay = document.getElementById("perfilOverlay");
        if (overlay) overlay.style.display = "none";
    };

    window.abrirEditarPerfil = function () { // Abre el overlay de edición y pre-rellena los campos con los datos actuales
        const editarOverlay = document.getElementById("editarOverlay"); // Obtener referencia al overlay de edición
        if (!editarOverlay) return;

        window.cerrarPerfil();

        editarOverlay.style.display = "flex"; // Mostrar el overlay de edición

        // Pre-rellenar inputs con valores actuales del overlay
        const mapa = {
            nombrePerfil:    "inputNombre",
            rolPerfil:       "inputRol",
            correoPerfil:    "inputCorreo",
            extensionPerfil: "inputExtension",
            deptoPerfil:     "inputDepto"
        };

        Object.entries(mapa).forEach(([spanId, inputId]) => { // Iterar sobre el mapa para asignar valores a los inputs
            const span  = document.getElementById(spanId); // Obtener referencia al span que muestra el dato actual
            const input = document.getElementById(inputId); // Obtener referencia al input correspondiente
            if (span && input) input.value = span.textContent; // Asignar el valor del span al input
        });
    };

    window.cerrarEditar = function () { // Cierra el overlay de edición
        const editarOverlay = document.getElementById("editarOverlay"); // Obtener referencia al overlay de edición
        if (editarOverlay) editarOverlay.style.display = "none"; // Ocultar el overlay de edición
    };

    window.guardarPerfil = function () { // Guarda los cambios del perfil, actualiza el overlay y localStorage
        const mapa = { // Mapa de IDs para actualizar tanto el overlay como el localStorage
            inputNombre:    "nombrePerfil",
            inputRol:       "rolPerfil",
            inputCorreo:    "inputCorreo",  // nota: el span de correo tiene id "correoPerfil"
            inputExtension: "extensionPerfil",
            inputDepto:     "deptoPerfil"
        };

        // Mapa corregido input → span
        const mapaSpans = {
            inputNombre:    "nombrePerfil",
            inputRol:       "rolPerfil",
            inputCorreo:    "correoPerfil",
            inputExtension: "extensionPerfil",
            inputDepto:     "deptoPerfil"
        };

        Object.entries(mapaSpans).forEach(([inputId, spanId]) => {
            const input = document.getElementById(inputId);
            const span  = document.getElementById(spanId);
            if (input && span) {
                span.textContent = input.value;
                setPerfilItem(spanId, input.value); // ← clave única por usuario
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
                setPerfilItem("fotoPerfil", e.target.result); // ← clave única por usuario
            };
            reader.readAsDataURL(fileInput.files[0]); // Leer el archivo seleccionado como una URL de datos para poder mostrarlo directamente en la página
        }

        alert("Perfil actualizado correctamente");
        window.cerrarEditar();
    };

    window.borrarFoto = function () {
        const imagenDefault = "imagenes/Usuario.webp";
        const foto  = document.getElementById("fotoPerfil");
        const icono = document.getElementById("iconoNavbar");
        if (foto)  foto.src  = imagenDefault;
        if (icono) icono.src = imagenDefault;
        removePerfilItem("fotoPerfil"); // ← elimina solo la foto de ESTE usuario
        alert("Foto eliminada correctamente");
    };

    window.cerrarSesion = function () {
        localStorage.removeItem("usuarioActivo");
        alert("Sesión cerrada correctamente");
        window.location.href = "index.html";
    };

    window.eliminarCuenta = async function () {

        const raw = localStorage.getItem("usuarioActivo");
        if (!raw) return;

        const usuario = JSON.parse(raw);
        const correo = usuario.correo;

        const confirmacion = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
        if (!confirmacion) return;

        try {
            const respuesta = await fetch("http://localhost:3000/usuario", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: correo })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                // Limpiar todos los datos del usuario en localStorage
                const prefijo = correo + "_";
                ["nombrePerfil", "correoPerfil", "extensionPerfil", "rolPerfil", "deptoPerfil", "fotoPerfil"].forEach(campo => {
                    localStorage.removeItem(prefijo + campo);
                });
                localStorage.removeItem("usuarioActivo");

                alert("Cuenta eliminada correctamente");
                window.location.href = "index.html";
            } else {
                alert(data.mensaje || "Error al eliminar la cuenta");
            }

        } catch (error) {
            alert("Error conectando al servidor");
        }
    };

    // Cerrar overlays al hacer clic en el fondo oscuro
    document.addEventListener("click", function (e) { // Agregar un event listener al documento para detectar clics y cerrar los overlays si se hace clic fuera de las cajas de contenido
        const perfilOverlay = document.getElementById("perfilOverlay"); // Obtener referencia al overlay de ver perfil
        const editarOverlay = document.getElementById("editarOverlay"); //  Obtener referencia al overlay de edición
        if (e.target === perfilOverlay)  window.cerrarPerfil(); // Si se hizo clic en el fondo del overlay de ver perfil, cerrarlo
        if (e.target === editarOverlay)  window.cerrarEditar(); // Si se hizo clic en el fondo del overlay de edición, cerrarlo
    });

})();
