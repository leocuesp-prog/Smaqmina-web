// ===============================
// ELEMENTOS DEL DOM
// ===============================

const togglePass = document.getElementById('togglePass');
const inputPass = document.getElementById('contrasena');
const inputConfirm = document.getElementById('confirmarContrasena');
const inputUsuario = document.getElementById('usuario');
const inputCorreo = document.getElementById('correo');
const inputTelefono = document.getElementById('telefono');
const globalAlert = document.getElementById('globalAlert');
const form = document.getElementById('loginForm');


// ===============================
// MOSTRAR / OCULTAR CONTRASEÑA
// ===============================

if (togglePass) {
    togglePass.addEventListener('click', () => {

        const visible = inputPass.type === 'text';

        inputPass.type = visible ? 'password' : 'text';
        inputConfirm.type = visible ? 'password' : 'text';

        togglePass.textContent = visible ? '👁' : '🙈';
    });
}


// ===============================
// ALERTAS
// ===============================

function showAlert(msg, type = 'error') {

    globalAlert.textContent = msg;
    globalAlert.className = 'alert ' + (type === 'success' ? 'success' : '');
    globalAlert.style.display = 'block';
}

function hideAlert() {
    globalAlert.style.display = 'none';
}

function showError(input) {
    input.classList.add('invalid');
}

function clearErrors() {

    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('invalid'));
    hideAlert();
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', clearErrors);
});


// ===============================
// REGISTRO
// ===============================

form.addEventListener('submit', async function(e) {

    e.preventDefault();

    const usuario = inputUsuario.value.trim();
    const correo = inputCorreo.value.trim();
    const telefono = inputTelefono.value.trim();
    const contrasena = inputPass.value.trim();
    const confirmacion = inputConfirm.value.trim();

    // VALIDACIÓN CAMPOS VACÍOS
    if (!usuario || !correo || !telefono || !contrasena || !confirmacion) {
        showAlert("Completa todos los campos");
        return;
    }

    // VALIDACIÓN CONTRASEÑAS
    if (contrasena !== confirmacion) {
        showAlert("Las contraseñas no coinciden");
        return;
    }

    // 🔵 AQUÍ VA EL FETCH 🔵 
    try {

        const respuesta = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: usuario,
                correo: correo,
                telefono: telefono,
                password: contrasena
            })
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            showAlert("⏳ Solicitud enviada. Tu cuenta está esperando permiso para ser creada. El administrador debe aprobarla antes de que puedas iniciar sesión.", "success");
            form.reset();
        } else {
            showAlert(data.mensaje);
        }

    } catch (error) {
        showAlert("Error conectando al servidor");
    }

});

// ===============================
// ACCESIBILIDAD
// ===============================
let menu = document.getElementById("menuAccesibilidad");
let boton = document.getElementById("botonAccesibilidad");

if (menu && boton) {

    boton.addEventListener("click", () => {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });

}
let tamañoActual = localStorage.getItem("tamañoTexto") || 16;

document.body.style.fontSize = tamañoActual + "px";
function resetTamañoTexto() {
    tamañoActual = 16;
    document.body.style.fontSize = "16px";
    localStorage.removeItem("tamañoTexto");
}
function aumentarTexto() {
    if (tamañoActual < 20) {
    tamañoActual = parseInt(tamañoActual) + 2;
    document.body.style.fontSize = tamañoActual + "px";
    localStorage.setItem("tamañoTexto", tamañoActual);
    }
}

function disminuirTexto() {
    if (tamañoActual > 12) {
        tamañoActual = parseInt(tamañoActual) - 2;
        document.body.style.fontSize = tamañoActual + "px";
        localStorage.setItem("tamañoTexto", tamañoActual);
    }
}
function toggleOscuro() {
    document.body.classList.toggle("dark-mode");
    guardarConfig();
}

function leerPagina() {
    
    if (speechSynthesis.speaking) return;

    let texto = document.body.innerText.substring(0, 5000);

    let vozActiva = new SpeechSynthesisUtterance(texto);

    speechSynthesis.speak(vozActiva);
}

function detenerLectura() {
    speechSynthesis.cancel();
}
function mayusculas() {
    document.body.classList.toggle("mayusculas");
    guardarConfig();
}

function resetEstilos() {
    document.body.classList.remove("dark-mode", "mayusculas");
    resetTamañoTexto();
    localStorage.removeItem("configAccesibilidad");
}
function guardarConfig() {

    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        mayuscula: document.body.classList.contains("mayusculas"),
        aumentarTexto: document.body.classList.contains("aumentarTexto"),
        disminuirTexto: document.body.classList.contains("disminuirTexto")
    }));

}
