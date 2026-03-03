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

    passInput.type =
      passInput.type === "password" ? "text" : "password";

    btnVer.textContent =
      passInput.type === "password" ? "👁" : "🙈";
  });

  // ============================
  // BLOQUEO POR INTENTOS
  // ============================

  function bloquearLogin() {

    bloqueado = true;
    tiempoRestante = 180;

    if (intervalo) clearInterval(intervalo);

    intervalo = setInterval(() => {

      let min = Math.floor(tiempoRestante / 60);
      let seg = tiempoRestante % 60;

      mostrar(
        `🚫 Has fallado 3 veces. Espera ${min}:${seg < 10 ? "0" : ""}${seg}...`
      );

      tiempoRestante--;

      if (tiempoRestante < 0) {
        clearInterval(intervalo);
        intentos = 0;
        bloqueado = false;
        mostrar("✅ Ya puedes intentar nuevamente.", "success");
      }

    }, 1000);
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo, password })
      });

      const data = await respuesta.json();

      if (respuesta.ok) {

        localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));

        mostrar("✅ Login correcto", "success");

        setTimeout(() => {
          window.location.href = "inicio.html";
        }, 1500);

      } else {

        intentos++;
        mostrar(data.mensaje || "❌ Credenciales incorrectas.");

        if (intentos >= 3) {
          bloquearLogin();
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

let menu = document.getElementById("menuAccesibilidad");
let boton = document.getElementById("botonAccesibilidad");

if (boton && menu) {
  boton.addEventListener("click", () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  });
}

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
  let vozActiva = new SpeechSynthesisUtterance(texto);
  speechSynthesis.speak(vozActiva);
}

function detenerLectura() {
  speechSynthesis.cancel();
}

function guardarConfig(){
  localStorage.setItem("configAccesibilidad", JSON.stringify({
    oscuro: document.body.classList.contains("dark-mode"),
    contraste: document.body.classList.contains("alto-contraste"),
    mayuscula: document.body.classList.contains("mayusculas"),
  }));
}

window.onload = function(){
  let config = JSON.parse(localStorage.getItem("configAccesibilidad"));

  if(config){
    if(config.oscuro) document.body.classList.add("dark-mode");
    if(config.contraste) document.body.classList.add("alto-contraste");
    if(config.mayuscula) document.body.classList.add("mayusculas");
  }
};