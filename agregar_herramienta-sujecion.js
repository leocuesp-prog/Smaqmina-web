async function guardar(){

    let nombre = document.getElementById("Nombre").value.trim();

    let cantidadBuena = parseInt(document.getElementById("Cantidad_buena").value) || 0;
    let cantidadRegular = parseInt(document.getElementById("Cantidad_regular").value) || 0;
    let cantidadMala = parseInt(document.getElementById("Cantidad_mala").value) || 0;

   if (nombre === "") {
        alert("Ingrese el nombre de la herramienta");
        return;
    }

    if (cantidadBuena < 0 || cantidadRegular < 0 || cantidadMala < 0) {
        alert("Los valores no pueden ser negativos");
        return;
    }
    try {
        const listadoResp = await fetch("http://localhost:3000/herramientas/sujecion");
        if (listadoResp.ok) {
            const lista = await listadoResp.json();
            const duplicado = lista.some(h => h.nombre_herramienta_sujecion.toLowerCase() === nombre.toLowerCase());
            if (duplicado) {
                alert("El nombre ya existe");
                return;
            }
        }
    } catch (e) {
        // si falla la consulta, dejamos que el servidor haga la validación
        console.warn("No se pudo comprobar duplicados en cliente", e);
    }

    try {

        const respuestaServidor = await fetch("http://localhost:3000/herramientas/sujecion", {
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
