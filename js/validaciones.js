function correoValido(correo) {
  const arroba = correo.indexOf("@");
  const punto = correo.lastIndexOf(".");
  return arroba > 0 && punto > arroba + 1 && punto < correo.length - 1;
}

// Muestra la lista de errores dentro de la página. Devuelve true si no hay errores.
function mostrarErrores(idCaja, errores) {
  const caja = document.getElementById(idCaja);
  if (errores.length === 0) {
    caja.style.display = "none";
    caja.innerHTML = "";
    return true;
  }
  let html = "<ul>";
  for (let i = 0; i < errores.length; i++) {
    html += `<li>${errores[i]}</li>`;
  }
  caja.innerHTML = html + "</ul>";
  caja.style.display = "block";
  return false;
}

function validarContacto(nombre, correo, mensaje) {
  const errores = [];
  if (nombre === "") {
    errores.push("El nombre es obligatorio.");
  }
  if (correo === "") {
    errores.push("El correo es obligatorio.");
  } else if (!correoValido(correo)) {
    errores.push("El correo no tiene un formato válido.");
  }
  if (mensaje === "") {
    errores.push("El mensaje no puede estar vacío.");
  }
  return errores;
}

function validarLogin(correo, clave) {
  const errores = [];
  if (correo === "") {
    errores.push("Ingresá tu correo.");
  } else if (!correoValido(correo)) {
    errores.push("El correo no tiene un formato válido.");
  }
  if (clave === "") {
    errores.push("Ingresá tu contraseña.");
  }
  return errores;
}

function validarRegistro(nombre, correo, clave, clave2, terminos) {
  const errores = validarContacto(nombre, correo, "-");
  if (clave.length < 4) {
    errores.push("La contraseña debe tener al menos 4 caracteres.");
  }
  if (clave !== clave2) {
    errores.push("Las contraseñas no coinciden.");
  }
  if (!terminos) {
    errores.push("Tenés que aceptar los términos y condiciones.");
  }
  return errores;
}

// Se reutiliza en planta-form.js
function validarPlanta(planta) {
  const errores = [];
  if (planta.nombre === "") {
    errores.push("El nombre es obligatorio.");
  }
  if (planta.nombreCientifico === "") {
    errores.push("El nombre científico es obligatorio.");
  }
  if (planta.categoria === "") {
    errores.push("Elegí una categoría.");
  }
  if (planta.luz === "") {
    errores.push("Elegí una opción de luz.");
  }
  if (planta.riego === "") {
    errores.push("Elegí un riego.");
  }
  if (isNaN(planta.precio) || planta.precio <= 0) {
    errores.push("El precio tiene que ser un número mayor a 0.");
  }
  if (isNaN(planta.stock) || planta.stock < 0 || planta.stock % 1 !== 0) {
    errores.push("El stock tiene que ser un número entero, 0 o más.");
  }
  if (planta.fechaIngreso === "") {
    errores.push("La fecha de ingreso es obligatoria.");
  }
  if (planta.foto === "") {
    errores.push("La foto es obligatoria (URL o ruta de la imagen).");
  }
  return errores;
}

// Menú hamburguesa (celular)
const botonMenu = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
if (botonMenu && menu) {
  botonMenu.addEventListener("click", () => {
    if (menu.className === "nav") {
      menu.className = "nav abierto";
    } else {
      menu.className = "nav";
    }
  });
}

const formContacto = document.getElementById("formContacto");
if (formContacto) {
  formContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const errores = validarContacto(nombre, correo, mensaje);
    if (mostrarErrores("errores", errores)) {
      Swal.fire("¡Gracias!", "Recibimos tu consulta, te respondemos pronto.", "success");
      formContacto.reset();
    }
  });
}

const formLogin = document.getElementById("formLogin");
if (formLogin) {
  formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value;
    const recordar = document.getElementById("recordar").checked;
    const errores = validarLogin(correo, clave);
    if (errores.length === 0 && !iniciarSesion(correo, clave, recordar)) {
      errores.push("Correo o contraseña incorrectos.");
    }
    if (mostrarErrores("errores", errores)) {
      window.location.href = "listado.html";
    }
  });
}

const formRegistro = document.getElementById("formRegistro");
if (formRegistro) {
  formRegistro.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value;
    const clave2 = document.getElementById("clave2").value;
    const terminos = document.getElementById("terminos").checked;
    const errores = validarRegistro(nombre, correo, clave, clave2, terminos);
    if (mostrarErrores("errores", errores)) {
      registrarUsuario(nombre, correo, clave);
      Swal.fire("¡Registro exitoso!", "Ya podés iniciar sesión.", "success").then(() => {
        window.location.href = "login.html";
      });
    }
  });
}
