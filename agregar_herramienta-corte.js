async function guardar() {

    let nombre = document.getElementById("Nombre").value.trim();
    let cantidadBuena = parseInt(document.getElementById("Cantidad_buena").value) || 0;
    let cantidadRegular = parseInt(document.getElementById("Cantidad_regular").value) || 0;
    let cantidadMala = parseInt(document.getElementById("Cantidad_mala").value) || 0;

    // VALIDACIONES
    if (nombre === "") {
        alert("Ingrese el nombre de la herramienta");
        return;
    }

    if (cantidadBuena < 0 || cantidadRegular < 0 || cantidadMala < 0) {
        alert("Los valores no pueden ser negativos");
        return;
    }

    try {

        const respuestaServidor = await fetch("http://localhost:3000/herramientas/corte", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                buena: cantidadBuena,
                regular: cantidadRegular,
                mala: cantidadMala
            })
        });

        const datos = await respuestaServidor.json();

        if (respuestaServidor.ok) {
            alert("✅ Herramienta guardada correctamente");

            // Limpiar campos
            document.getElementById("Nombre").value = "";
            document.getElementById("Cantidad_buena").value = "";
            document.getElementById("Cantidad_regular").value = "";
            document.getElementById("Cantidad_mala").value = "";

        } else {
            alert(datos.mensaje);
        }

    } catch (error) {
        console.error(error);
        alert("Error conectando con el servidor");
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