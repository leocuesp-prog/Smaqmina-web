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

function guardar3() {
    const tipo_mantenimiento = document.getElementById('tipo_mantenimiento').value;
    const fecha_mantenimiento = document.getElementById('Fecha mantenimiento').value;
    const observacion = document.getElementById('Observacion').value;
    const maquina_apto = document.getElementById('Maquina apta').value;
    const realizo_mantenimiento = document.getElementById('Realizo mantenimiento').value;
    const reviso_mantenimiento = document.getElementById('Reviso Mantenimiento').value;
    const novedad = document.getElementById('Novedad').value;
    const id_maquina = document.getElementById('Maquina').value;

    if (!tipo_mantenimiento || tipo_mantenimiento === 'TM' || !fecha_mantenimiento || !observacion || !maquina_apto || maquina_apto === 'Maquina apta' || !realizo_mantenimiento || !reviso_mantenimiento || !novedad || !id_maquina || id_maquina === 'Seleccione una máquina') {
        alert('Por favor, complete todos los campos correctamente.');
        return;
    }

    fetch('http://localhost:3000/mantenimiento/maquina', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tipo_mantenimiento,
            fecha_mantenimiento,
            observacion,
            maquina_apto,
            realizo_mantenimiento,
            reviso_mantenimiento,
            novedad,
            id_maquina
        })
    })

    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);// Opcional: limpiar formulario
        document.querySelector('form').reset();
        document.getElementById('tipo_mantenimiento').value = 'TM';
        document.getElementById('Maquina apto').value = 'Maquina apto';
        document.getElementById('Maquina').innerHTML = '<option disabled selected>Seleccione una máquina</option>';
        cargarMaquinas(); // Recargar máquinas si es necesario
    })
    .catch(error => console.error('Error:', error));
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