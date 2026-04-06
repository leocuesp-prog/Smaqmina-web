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
        const listadoResp = await fetch("http://localhost:3000/herramientas/impacto");
        if (listadoResp.ok) {
            let lista = await listadoResp.json();
            let duplicado = lista.some(h => h.nombre_herramienta_impacto.toLowerCase() === nombre.toLowerCase());
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

        const respuestaServidor = await fetch("http://localhost:3000/herramientas/impacto", {
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
