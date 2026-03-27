document.addEventListener('DOMContentLoaded', function() {
    cargarEquipos();
});

async function cargarEquipos() {
    try {
        const response = await fetch('http://localhost:3000/equipo');
        
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor: ' + response.status);
        }
        
        const data = await response.json();
        const select = document.getElementById('Equipo');
        
        if (data.length === 0) {
            alert('No hay equipos registrados en la base de datos.');
            return;
        }
        
        data.forEach(equipo => {
            const option = document.createElement('option');
            option.value = equipo.id_equipo;
            option.textContent = equipo.nombre_equipo;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando equipos:', error);
        alert('Error al cargar equipos: ' + error.message + '. Asegúrate de que el servidor esté corriendo.');
    }
}

async function guardar3() {
    // Obtener valores de los campos
    let tipo_mantenimiento = document.getElementById('tipo_mantenimiento').value.trim();
    let fecha_mantenimiento = document.getElementById('Fecha mantenimiento').value.trim();
    let observacion = document.getElementById('Observacion').value.trim();
    let equipo_apto = document.getElementById('Equipo apto').value.trim();
    let realizo_mantenimiento = document.getElementById('Realizo mantenimiento').value.trim();
    let reviso_mantenimiento = document.getElementById('Reviso Mantenimiento').value.trim();
    let novedad = document.getElementById('Novedad').value.trim();
    let id_equipo = document.getElementById('Equipo').value.trim();

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
    if (!equipo_apto || equipo_apto === 'Equipo apto') {
        alert('❌ Selecciona si el equipo está apto o no.');
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
    if (!id_equipo || id_equipo === 'Seleccione un equipo') {
        alert('❌ Debes seleccionar un equipo.');
        return;
    }

    // Preparar datos para enviar
    const datosEnvio = {
        tipo_mantenimiento_equipo: tipo_mantenimiento,
        fecha_mantenimiento_equipo: fecha_mantenimiento,
        observacion_equipo: observacion,
        equipo_apto_equipo: equipo_apto,
        realizo_mantenimiento_equipo: realizo_mantenimiento,
        reviso_mantenimiento_equipo: reviso_mantenimiento,
        novedad_equipo: novedad,
        id_equipo: id_equipo
    };
    try {
        // Enviar datos al servidor
        const response = await fetch('http://localhost:3000/mantenimiento/equipo', {
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
        document.getElementById('Equipo apto').value = 'Equipo apto';
        document.getElementById('Equipo').innerHTML = '<option disabled selected>Seleccione un equipo</option>';
        
        // Recargar equipos
        cargarEquipos();

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