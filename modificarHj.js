document.addEventListener("DOMContentLoaded", function () {

    const lapices = document.querySelectorAll(".icon");
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    const options = document.getElementById("opciones");
    const estadoSeleccionado = localStorage.getItem("estadoSeleccionado");

    // Cargar el estado guardado siempre, haya o no usuario
    if (estadoSeleccionado) {
        options.value = estadoSeleccionado;
    }

    if (usuarioActivo) {
        // Usuario activo: puede editar
        lapices.forEach(btn => btn.style.display = "inline-block");
        options.disabled = false;

        // Guardar en localStorage cada vez que cambie
        options.addEventListener("change", function () {
            localStorage.setItem("estadoSeleccionado", this.value);
            alert("Estado guardado: " + this.value);
        });

    } else {
        // Sin usuario: solo lectura
        lapices.forEach(btn => btn.style.display = "none");
        options.disabled = true;
    }
});
// Espera a que la página cargue completamente
document.addEventListener("DOMContentLoaded", function () {

    // Selecciona TODOS los botones con clase "icon"
    let botones = document.querySelectorAll(".icon");

    // Recorre cada botón
    for (let i = 0; i < botones.length; i++) {

        // Agrega evento click a cada botón
        botones[i].addEventListener("click", function () {

            // Busca el <main> más cercano al botón presionado
            let contenedor = this.parentElement;

            // Selecciona todos los <span> dentro de ese main
            let campos = contenedor.querySelectorAll("span");

            // Recorre cada campo encontrado
            for (let j = 0; j < campos.length; j++) {

                // Obtiene el id del campo
                let idCampo = campos[j].id;

                // Si el campo no tiene id, lo ignora
                if (idCampo === "") {
                    continue;
                }

                // Busca el texto del <strong> que está en el mismo <li>
                let etiqueta = campos[j].parentElement.querySelector("strong").innerText;

                // Pide el nuevo valor mostrando el nombre del campo
                let nuevoValor = prompt("Editar " + etiqueta, campos[j].innerText);

                // Si el usuario no cancela
                if (nuevoValor !== null) {

                    // Cambia el texto del campo
                    campos[j].innerText = nuevoValor;

                    // Guarda el nuevo valor en localStorage usando el id como clave
                    localStorage.setItem(idCampo, nuevoValor);
                }
            }
        });
    }

    // -------- CARGAR DATOS GUARDADOS --------

    // Selecciona todos los span de la página
    let todosLosSpans = document.querySelectorAll("span");

    // Recorre cada span
    for (let k = 0; k < todosLosSpans.length; k++) {

        // Obtiene el id del span
        let id = todosLosSpans[k].id;

        // Si no tiene id lo ignora
        if (id === "") {
            continue;
        }

        // Busca si existe un valor guardado en localStorage
        let valorGuardado = localStorage.getItem(id);

        // Si existe un valor guardado
        if (valorGuardado !== null) {

            // Lo coloca en el span
            todosLosSpans[k].innerText = valorGuardado;
        }
    }

});
window.addEventListener("load", function () {
    if (localStorage.getItem("fotoPerfil")) {
        const icono = document.getElementById("iconoNavbar");
        if (icono) icono.src = localStorage.getItem("fotoPerfil");
    }
});


