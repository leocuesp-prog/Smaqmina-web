document.addEventListener('DOMContentLoaded', function() {
    cargarMaquinas();
});

function cargarMaquinas() {
    fetch('http://localhost:3000/maquina')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById('Maquina');
            if (data.length === 0) {
                alert('No hay máquinas registradas en la base de datos.');
                return;
            }
            data.forEach(maquina => {
                const option = document.createElement('option');
                option.value = maquina.id_maquina;
                option.textContent = maquina.nombre_maquina;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando máquinas:', error);
            alert('Error al cargar máquinas: ' + error.message + '. Asegúrate de que el servidor esté corriendo.');
        });
}

async function guardar3() {
    // Obtener valores de los campos
    let tipo_mantenimiento = document.getElementById('tipo_mantenimiento').value.trim();
    let fecha_mantenimiento = document.getElementById('Fecha mantenimiento').value.trim();
    let observacion = document.getElementById('Observacion').value.trim();
    let maquina_apta = document.getElementById('Maquina apta').value.trim();
    let realizo_mantenimiento = document.getElementById('Realizo mantenimiento').value.trim();
    let reviso_mantenimiento = document.getElementById('Reviso Mantenimiento').value.trim();
    let novedad = document.getElementById('Novedad').value.trim();
    let id_maquina = document.getElementById('Maquina').value.trim();

    // Validar campos vacíos
    if (!tipo_mantenimiento || tipo_mantenimiento === 'TM') {
        alert('❌ Tipo de mantenimiento es requerido.');
        return;
    }
    if (!fecha_mantenimiento) {
        alert('❌ Fecha de mantenimiento es requerida.');
        return;
    }
    if (!observacion) {
        alert('❌ Observación es requerida.');
        return;
    }
    if (!maquina_apta || maquina_apta === 'Maquina apta') {
        alert('❌ Selecciona si la máquina está apta o no.');
        return;
    }
    if (!realizo_mantenimiento) {
        alert('❌ Nombre de quien realizó es requerido.');
        return;
    }
    if (!reviso_mantenimiento) {
        alert('❌ Nombre de quien revisó es requerido.');
        return;
    }
    if (!novedad) {
        alert('❌ Novedad es requerida.');
        return;
    }
    if (!id_maquina || id_maquina === 'Seleccione una máquina') {
        alert('❌ Debes seleccionar una máquina.');
        return;
    }

    // Preparar datos para enviar
    const datosEnvio = {
        tipo_mantenimiento_maquina: tipo_mantenimiento,
        fecha_mantenimiento_maquina: fecha_mantenimiento,
        observacion_maquina: observacion,
        equipo_apto_maquina: maquina_apta,
        realizo_mantenimiento_maquina: realizo_mantenimiento,
        reviso_mantenimiento_maquina: reviso_mantenimiento,
        novedad_maquina: novedad,
        id_maquina: id_maquina
    };

    console.log('📤 Enviando datos:', datosEnvio);

    try {
        // Enviar datos al servidor
        const response = await fetch('http://localhost:3000/mantenimiento/maquina', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosEnvio)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Respuesta del servidor:', data);
        alert('✅ ' + data.mensaje);
        
        // Limpiar el formulario
        document.querySelector('form').reset();
        document.getElementById('tipo_mantenimiento').value = 'TM';
        document.getElementById('Maquina apta').value = 'Maquina apta';
        document.getElementById('Maquina').innerHTML = '<option disabled selected>Seleccione una máquina</option>';
        
        // Recargar máquinas
        cargarMaquinas();

    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error al guardar: ' + error.message);
    }
}
let menu = document.getElementById("menuAccesibilidad");
let boton = document.getElementById("botonAccesibilidad");
/* Abrir / cerrar menú */
boton.addEventListener("click", () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
});

/* FUNCIONES */

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
    vozActiva = new SpeechSynthesisUtterance(texto);

    speechSynthesis.speak(vozActiva);
}
function detenerLectura() {
    speechSynthesis.cancel();
}
/* GUARDAR CONFIGURACIÓN */

function guardarConfig(){
    localStorage.setItem("configAccesibilidad", JSON.stringify({
        oscuro: document.body.classList.contains("dark-mode"),
        contraste: document.body.classList.contains("alto-contraste"),
        mayuscula: document.body.classList.contains("mayusculas"),
    }));
}

/* CARGAR CONFIGURACIÓN */

window.onload = function(){
    let config = JSON.parse(localStorage.getItem("configAccesibilidad"));

    if(config){
        if(config.oscuro) document.body.classList.add("dark-mode");
        if(config.contraste) document.body.classList.add("alto-contraste");
        if(config.mayuscula) document.body.classList.add("mayusculas");
    }
}