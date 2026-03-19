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

            // Cargar datos del usuario en el overlay
            const nombrePerfil    = document.getElementById("nombrePerfil"); // Obtener referencia al elemento que muestra el nombre del perfil en el overlay
            const correoPerfil    = document.getElementById("correoPerfil"); // Obtener referencia al elemento que muestra el correo del perfil en el overlay
            const extensionPerfil = document.getElementById("extensionPerfil"); // Obtener referencia al elemento que muestra la extensión del perfil en el overlay

            if (nombrePerfil)
                nombrePerfil.textContent = localStorage.getItem("nombrePerfil") || usuario.nombre || ""; // Mostrar el nombre del perfil, dando prioridad al valor guardado en localStorage (en caso de edición), luego al nombre del usuario obtenido del login, y finalmente una cadena vacía si no hay ninguno de los dos
            if (correoPerfil)
                correoPerfil.textContent = localStorage.getItem("correoPerfil") || usuario.correo || ""; // Mostrar el correo del perfil, dando prioridad al valor guardado en localStorage (en caso de edición), luego al correo del usuario obtenido del login, y finalmente una cadena vacía si no hay ninguno de los dos
            if (extensionPerfil)
                extensionPerfil.textContent = localStorage.getItem("extensionPerfil") || usuario.telefono || ""; // Mostrar la extensión del perfil, dando prioridad al valor guardado en localStorage (en caso de edición), luego al teléfono del usuario obtenido del login, y finalmente una cadena vacía si no hay ninguno de los dos

            const rolEl   = document.getElementById("rolPerfil"); // Obtener referencia al elemento que muestra el rol del perfil en el overlay
            const deptoEl = document.getElementById("deptoPerfil"); //  Obtener referencia al elemento que muestra el departamento del perfil en el overlay
            if (rolEl   && localStorage.getItem("rolPerfil"))   rolEl.textContent   = localStorage.getItem("rolPerfil"); // Mostrar el rol del perfil si hay un valor guardado en localStorage (en caso de edición)
            if (deptoEl && localStorage.getItem("deptoPerfil")) deptoEl.textContent = localStorage.getItem("deptoPerfil"); // Mostrar el departamento del perfil si hay un valor guardado en localStorage (en caso de edición)

            // Fecha de último acceso
            const accesoEl = document.getElementById("accesoPerfil"); // Obtener referencia al elemento que muestra el último acceso del perfil en el overlay
            if (accesoEl) accesoEl.textContent = new Date().toLocaleString("es-CO"); // Mostrar la fecha y hora actual como último acceso (esto se puede mejorar guardando la fecha real del último acceso en el login)

        } else {
            // ❌ Sin sesión → mostrar "Iniciar sesión", ocultar ícono de perfil
            if (linkLogin)    linkLogin.style.display    = "inline-block"; //   Mostrar enlace de "Iniciar sesión"
            if (perfilNavbar) perfilNavbar.style.display = "none"; // Ocultar ícono de perfil
        }

        // Cargar foto guardada
        const fotoGuardada = localStorage.getItem("fotoPerfil"); // Obtener la foto de perfil guardada en localStorage (en caso de edición)
        if (fotoGuardada) { // Si hay una foto guardada, actualizar tanto la foto del perfil en el overlay como el ícono de perfil en la navbar
            const foto  = document.getElementById("fotoPerfil"); // Obtener referencia a la imagen del perfil en el overlay
            const icono = document.getElementById("iconoNavbar"); // Obtener referencia al ícono de perfil en la navbar
            if (foto)  foto.src  = fotoGuardada; // Actualizar la imagen del perfil con la foto guardada
            if (icono) icono.src = fotoGuardada; // Actualizar el ícono de perfil en la navbar con la foto guardada
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

        window.cerrarPerfil(); // Cierra el overlay de ver perfil primero

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
            inputCorreo:    "correoPerfil",
            inputExtension: "extensionPerfil",
            inputDepto:     "deptoPerfil"
        };

        Object.entries(mapa).forEach(([inputId, spanId]) => { // Iterar sobre el mapa para actualizar los spans y localStorage
            const input = document.getElementById(inputId); //  Obtener referencia al input que contiene el nuevo valor
            const span  = document.getElementById(spanId); // Obtener referencia al span que muestra el dato en el overlay de ver perfil
            if (input && span) { // Si ambos elementos existen, actualizar el texto del span y guardar en localStorage
                span.textContent = input.value; // Actualizar el texto del span con el nuevo valor del input
                localStorage.setItem(spanId, input.value); // Guardar el nuevo valor en localStorage usando el ID del span como clave
            }
        });

        // Guardar foto si se seleccionó una nueva
        const fileInput = document.getElementById("inputFoto"); // Obtener referencia al input de archivo para la foto de perfil
        if (fileInput && fileInput.files.length > 0) { // Si se seleccionó un archivo, procesarlo para mostrarlo y guardarlo
            const reader = new FileReader(); // Crear un FileReader para leer el archivo seleccionado
            reader.onload = function (e) { // Cuando se haya leído el archivo, actualizar la foto en el overlay y el ícono de navbar, y guardar en localStorage
                const foto  = document.getElementById("fotoPerfil"); // Obtener referencia a la imagen del perfil en el overlay
                const icono = document.getElementById("iconoNavbar"); // Obtener referencia al ícono de perfil en la navbar
                if (foto)  foto.src  = e.target.result; // Actualizar la imagen del perfil con el nuevo archivo leído
                if (icono) icono.src = e.target.result; // Actualizar el ícono de perfil en la navbar con el nuevo archivo leído
                localStorage.setItem("fotoPerfil", e.target.result); // Guardar la nueva foto en localStorage para que persista en futuras visitas o recargas de página
            };
            reader.readAsDataURL(fileInput.files[0]); // Leer el archivo seleccionado como una URL de datos para poder mostrarlo directamente en la página
        }

        alert("Perfil actualizado correctamente ✅"); // Mostrar una alerta de éxito al guardar los cambios
        window.cerrarEditar(); // Cerrar el overlay de edición después de guardar los cambios
    };

    window.borrarFoto = function () { // Elimina la foto de perfil, actualiza el overlay y localStorage
        const imagenDefault = "imagenes/Usuario.webp"; // Ruta de la imagen por defecto para el perfil (puede ser una imagen genérica de usuario)
        const foto  = document.getElementById("fotoPerfil"); // Obtener referencia a la imagen del perfil en el overlay
        const icono = document.getElementById("iconoNavbar"); // Obtener referencia al ícono de perfil en la navbar
        if (foto)  foto.src  = imagenDefault; // Actualizar la imagen del perfil con la imagen por defecto        
        if (icono) icono.src = imagenDefault; // Actualizar el ícono de perfil en la navbar con la imagen por defecto
        localStorage.removeItem("fotoPerfil"); // Eliminar la foto guardada en localStorage para que no se muestre en futuras visitas o recargas de página
        alert("Foto eliminada correctamente "); // Mostrar una alerta de éxito al eliminar la foto
    };

    window.cerrarSesion = function () { // Cierra la sesión del usuario, limpia localStorage y redirige al login
        localStorage.removeItem("usuarioActivo"); // Eliminar el usuario activo de localStorage para cerrar la sesión
        alert("Sesión cerrada correctamente 👋"); // Mostrar una alerta de éxito al cerrar la sesión
        window.location.href = "index.html"; // Redirigir al login después de cerrar la sesión
    };

    // Cerrar overlays al hacer clic en el fondo oscuro
    document.addEventListener("click", function (e) { // Agregar un event listener al documento para detectar clics y cerrar los overlays si se hace clic fuera de las cajas de contenido
        const perfilOverlay = document.getElementById("perfilOverlay"); // Obtener referencia al overlay de ver perfil
        const editarOverlay = document.getElementById("editarOverlay"); //  Obtener referencia al overlay de edición
        if (e.target === perfilOverlay)  window.cerrarPerfil(); // Si se hizo clic en el fondo del overlay de ver perfil, cerrarlo
        if (e.target === editarOverlay)  window.cerrarEditar(); // Si se hizo clic en el fondo del overlay de edición, cerrarlo
    });

})();
