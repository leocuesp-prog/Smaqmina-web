let mantenimiento1=JSON.parse(localStorage.getItem("mantenimiento1"))||[] // Obtiene los mantenimientos guardados o crea un arreglo vacío
let tabla=document.getElementById("tableman") // Obtiene la tabla donde se mostrarán los datos
const usuarioActivo = localStorage.getItem("usuarioActivo"); // Verifica si hay un usuario activo (sesión iniciada)
let accion=document.getElementById("accion") // Obtiene la columna o encabezado de acciones

function guardar2(){ // Función para guardar los cambios en localStorage
    localStorage.setItem("mantenimiento1",JSON.stringify(mantenimiento1)) // Guarda el arreglo actualizado en formato JSON
}

function cargetable(){ // Función que carga la tabla con los datos
    tabla.innerHTML = ""; // Limpia la tabla antes de volver a llenarla

    for(let a=0; a<mantenimiento1.length;a++){ // Recorre el arreglo mantenimiento1
        let fila=tabla.insertRow() // Inserta una nueva fila
        fila.insertCell(0).innerText = a + 1; // Inserta el número consecutivo
        let tipo_manCell = fila.insertCell(1); // Crea celda para tipo de mantenimiento
        tipo_manCell.innerText = mantenimiento1[a].tipo_mantenimiento; // Muestra el tipo de mantenimiento
        let fechaCell = fila.insertCell(2); // Crea celda para la fecha
        fechaCell.innerText = mantenimiento1[a].fecha; // Muestra la fecha
        let observacionCell = fila.insertCell(3); // Crea celda para observación
        observacionCell.innerText = mantenimiento1[a].observacion; // Muestra la observación
        let eq_apCell = fila.insertCell(4); // Crea celda para equipo apto
        eq_apCell.innerText = mantenimiento1[a].equipo_apto; // Muestra si el equipo está apto
        let realizoCell = fila.insertCell(5); // Crea celda para quien realizó
        realizoCell.innerText = mantenimiento1[a].realizo_mantenimiento; // Muestra quien realizó
        let revisoCell = fila.insertCell(6); // Crea celda para quien revisó
        revisoCell.innerText = mantenimiento1[a].reviso_Mantenimiento; // Muestra quien revisó
        let novedadCell = fila.insertCell(7); // Crea celda para novedad
        novedadCell.innerText = mantenimiento1[a].novedad; // Muestra la novedad         

        if(usuarioActivo){ // Si hay sesión iniciada muestra la columna de acciones
            let celdaAccion = fila.insertCell(8); // Inserta celda para botones
            let botonModificar = document.createElement("button"); // Crea botón modificar
            botonModificar.innerText = "✏️"; // Texto del botón
            botonModificar.style.backgroundColor="white"; // Color de fondo

            botonModificar.addEventListener("click", function(){ // Evento al hacer clic en modificar
                let nuevotipo = prompt("Nuevo tipo mantenimiento:", mantenimiento1[a].tipo_mantenimiento); // Pide nuevo tipo
                let nuevafecha = prompt("Nueva fecha:", mantenimiento1[a].fecha); // Pide nueva fecha
                let nuevoobservacion = prompt("Nueva observacion:", mantenimiento1[a].observacion); // Pide nueva observación
                let nuevoeq = prompt("equipo apto:", mantenimiento1[a].equipo_apto); // Pide nuevo estado equipo
                let nuevorealizo = prompt("Realizo mantenimiento:", mantenimiento1[a].realizo_mantenimiento); // Pide nuevo realizó
                let nuevoreviso = prompt("Reviso mantenimiento:", mantenimiento1[a].reviso_Mantenimiento); // Pide nuevo revisó
                let nuevonovedad = prompt("Nueva novedad:", mantenimiento1[a].novedad); // Pide nueva novedad

                if(nuevotipo !== null){ // Si no cancela
                    mantenimiento1[a].tipo_mantenimiento = nuevotipo; // Actualiza tipo
                    mantenimiento1[a].fecha = nuevafecha; // Actualiza fecha
                    mantenimiento1[a].observacion = nuevoobservacion; // Actualiza observación
                    mantenimiento1[a].equipo_apto = nuevoeq; // Actualiza equipo apto
                    mantenimiento1[a].realizo_mantenimiento=nuevorealizo // Actualiza realizó
                    mantenimiento1[a].reviso_Mantenimiento=nuevoreviso // Actualiza revisó
                    mantenimiento1[a].novedad=nuevonovedad // Actualiza novedad
                }

                guardar2(); // Guarda cambios
                cargetable(); // Recarga tabla
            });

            celdaAccion.appendChild(botonModificar); // Agrega botón modificar

            let botonEliminar = document.createElement("button"); // Crea botón eliminar
            botonEliminar.innerText = "🗑️"; // Texto del botón
            botonEliminar.style.backgroundColor = "white"; // Color blanco

            botonEliminar.addEventListener("click", function(){ // Evento al hacer clic en eliminar
                mantenimiento1.splice(a, 1); // Elimina el registro
                guardar2(); // Guarda cambios
                cargetable(); // Recarga tabla
            });

            celdaAccion.appendChild(botonEliminar); // Agrega botón eliminar
        }
        else{ // Si NO hay sesión iniciada
            accion.style.display="none" // Oculta la columna de acciones
        }
    }
}

cargetable() // Llama la función para cargar la tabla al iniciar
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

