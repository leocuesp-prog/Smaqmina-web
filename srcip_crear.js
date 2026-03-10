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
            showAlert("✅ Usuario registrado correctamente", "success");
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

const menu = document.getElementById("menuAccesibilidad");
const boton = document.getElementById("botonAccesibilidad");

if (boton && menu) {
    boton.addEventListener("click", () => {
        menu.style.display = menu.style.display === "flex" ? "none" : "flex";
    });
}

function toggleOscuro(){
    document.body.classList.toggle("dark-mode");
    guardarConfig();
}

function toggleContraste(){
    document.body.classList.toggle("alto-contraste");
    guardarConfig();
}

function mayusculas(){
    document.body.classList.toggle("mayusculas");
    guardarConfig();
}

function resetEstilos(){
    document.body.classList.remove("dark-mode", "alto-contraste", "mayusculas");
    localStorage.removeItem("configAccesibilidad");
}

function leerPagina(){
    if (speechSynthesis.speaking) return;

    let texto = document.body.innerText;
    let vozActiva = new SpeechSynthesisUtterance(texto);

    speechSynthesis.speak(vozActiva);
}

function detenerLectura() {
    speechSynthesis.cancel();
}

function guardarConfig(){
    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        contraste: document.body.classList.contains("alto-contraste"),
        mayuscula: document.body.classList.contains("mayusculas"),
    }));
}

window.onload = function(){

    let config = JSON.parse(localStorage.getItem("configAccesibilidad"));

    if(config){
        if(config.oscuro) document.body.classList.add("dark-mode");
        if(config.contraste) document.body.classList.add("alto-contraste");
        if(config.mayuscula) document.body.classList.add("mayusculas");
    }
}