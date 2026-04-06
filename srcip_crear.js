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
