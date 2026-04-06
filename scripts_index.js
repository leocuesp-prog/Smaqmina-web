// ============================
// REFERENCIAS DEL DOM
// ============================

const form = document.getElementById("formLogin");
const userInput = document.getElementById("userInput");
const passInput = document.getElementById("passInput");
const alerta = document.getElementById("alertaSesion");
const btnVer = document.getElementById("btnVerPass");
const checkRecordar = document.getElementById("checkRecordar");

// ============================
// VARIABLES DE SEGURIDAD
// ============================

let intentos = 0;
let bloqueado = false;
let tiempoRestante = 180;
let intervalo = null;

// ============================
// SI EXISTE EL FORM
// ============================

if (form) {

  // Recordar usuario
  const usuarioGuardado = localStorage.getItem("usuarioRecordado");
  if (usuarioGuardado) {
    userInput.value = usuarioGuardado;
    checkRecordar.checked = true;
  }

  // ============================
  // FUNCIÓN MOSTRAR ALERTA
  // ============================

  function mostrar(texto, tipo = "error") {
    alerta.style.display = "block";
    alerta.textContent = texto;

    if (tipo === "success") {
      alerta.style.backgroundColor = "#d4edda";
      alerta.style.color = "#155724";
    } else {
      alerta.style.backgroundColor = "#f8d7da";
      alerta.style.color = "#721c24";
    }
  }

  // ============================
  // MOSTRAR / OCULTAR PASSWORD
  // ============================

  btnVer.addEventListener("click", function (e) {
    e.preventDefault();
    passInput.type = passInput.type === "password" ? "text" : "password";
    btnVer.textContent = passInput.type === "password" ? "👁" : "🙈";
  });

  // ============================
  // BLOQUEO POR INTENTOS (persiste al recargar)
  // ============================

  function guardarBloqueo() {
    localStorage.setItem("loginBloqueo", JSON.stringify({
      bloqueado: bloqueado,
      intentos: intentos,
      tiempoRestante: tiempoRestante,
      timestamp: Date.now()
    }));
  }

  function limpiarBloqueo() {
    localStorage.removeItem("loginBloqueo");
    intentos = 0;
    bloqueado = false;
    tiempoRestante = 180;
  }

  function bloquearLogin() {
    bloqueado = true;
    tiempoRestante = 180;
    guardarBloqueo();

    if (intervalo) clearInterval(intervalo);

    intervalo = setInterval(() => {
      tiempoRestante--;
      guardarBloqueo();

      let min = Math.floor(tiempoRestante / 60);
      let seg = tiempoRestante % 60;
      mostrar(`🚫 Has fallado 3 veces. Espera ${min}:${seg < 10 ? "0" : ""}${seg}...`);

      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        limpiarBloqueo();
        mostrar("✅ Ya puedes intentar nuevamente.", "success");
      }
    }, 1000);
  }

  // Recuperar bloqueo guardado al cargar la página
  const bloqueoGuardado = localStorage.getItem("loginBloqueo");
  if (bloqueoGuardado) {
    const datos = JSON.parse(bloqueoGuardado);

    if (datos.bloqueado) {
      // Calcular cuánto tiempo pasó desde que se guardó
      const segundosPasados = Math.floor((Date.now() - datos.timestamp) / 1000);
      const tiempoRestanteReal = datos.tiempoRestante - segundosPasados;

      if (tiempoRestanteReal > 0) {
        // Aún está en bloqueo
        bloqueado = true;
        intentos = datos.intentos;
        tiempoRestante = tiempoRestanteReal;

        if (intervalo) clearInterval(intervalo);
        intervalo = setInterval(() => {
          tiempoRestante--;
          guardarBloqueo();

          let min = Math.floor(tiempoRestante / 60);
          let seg = tiempoRestante % 60;
          mostrar(`🚫 Has fallado 3 veces. Espera ${min}:${seg < 10 ? "0" : ""}${seg}...`);

          if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            limpiarBloqueo();
            mostrar("✅ Ya puedes intentar nuevamente.", "success");
          }
        }, 1000);
      } else {
        // Ya pasó el tiempo de bloqueo
        limpiarBloqueo();
      }
    } else {
      intentos = datos.intentos || 0;
    }
  }

  // ============================
  // LOGIN CON BACKEND
  // ============================

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (bloqueado) return;

    const correo = userInput.value.trim();
    const password = passInput.value.trim();

    if (!correo || !password) {
      mostrar("⚠ Completa todos los campos.");
      return;
    }

    if (checkRecordar.checked) {
      localStorage.setItem("usuarioRecordado", correo);
    } else {
      localStorage.removeItem("usuarioRecordado");
    }

    try {

      const respuesta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        limpiarBloqueo();
        localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));
        mostrar("✅ Login correcto", "success");
        setTimeout(() => { window.location.href = "inicio.html"; }, 1500);

      } else {

        // Cuenta pendiente o desactivada: no contar como intento fallido
        if (respuesta.status === 403) {
          mostrar("⏳ " + data.mensaje);
        } else {
          intentos++;
          guardarBloqueo();
          mostrar(data.mensaje || "❌ Credenciales incorrectas.");
          if (intentos >= 3) {
            bloquearLogin();
          }
        }
      }

    } catch (error) {
      mostrar("Error conectando al servidor");
    }

  });

}

// ============================
// ACCESIBILIDAD
// ============================


