// Login simulado: no hay API de usuarios, se valida contra un usuario escrito en el código
// (o contra los usuarios que se registraron en registro.html).
const USUARIO_DEMO = { nombre: "Admin", correo: "admin@vivero.com", clave: "1234" };

function obtenerUsuariosRegistrados() {
  const guardados = localStorage.getItem("usuarios");
  return guardados ? JSON.parse(guardados) : [];
}

function registrarUsuario(nombre, correo, clave) {
  const usuarios = obtenerUsuariosRegistrados();
  usuarios.push({ nombre: nombre, correo: correo, clave: clave });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function buscarUsuario(correo, clave) {
  if (correo === USUARIO_DEMO.correo && clave === USUARIO_DEMO.clave) {
    return USUARIO_DEMO;
  }
  const usuarios = obtenerUsuariosRegistrados();
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo === correo && usuarios[i].clave === clave) {
      return usuarios[i];
    }
  }
  return null;
}

// Si marcó "mantener sesión" se guarda en localStorage (sigue al cerrar el navegador),
// si no, en sessionStorage (se pierde al cerrar la pestaña).
function iniciarSesion(correo, clave, recordar) {
  const usuario = buscarUsuario(correo, clave);
  if (usuario === null) {
    return false;
  }
  const sesion = JSON.stringify({ nombre: usuario.nombre, correo: usuario.correo });
  if (recordar) {
    localStorage.setItem("sesion", sesion);
  } else {
    sessionStorage.setItem("sesion", sesion);
  }
  return true;
}

function obtenerSesion() {
  const datos = localStorage.getItem("sesion") || sessionStorage.getItem("sesion");
  return datos ? JSON.parse(datos) : null;
}

function cerrarSesion() {
  localStorage.removeItem("sesion");
  sessionStorage.removeItem("sesion");
  window.location.href = "index.html";
}

// El header cambia según haya usuario o no.
function mostrarUsuarioEnHeader() {
  const zona = document.getElementById("zonaUsuario");
  if (!zona) {
    return;
  }
  const sesion = obtenerSesion();
  if (sesion) {
    zona.innerHTML = `
      <a href="listado.html">Intranet</a>
      <span class="saludo">Hola, ${sesion.nombre}</span>
      <button type="button" class="boton" id="btnSalir">Cerrar sesión</button>`;
    document.getElementById("btnSalir").addEventListener("click", cerrarSesion);
  } else {
    zona.innerHTML = `<a href="login.html" class="boton">Ingresar</a>`;
  }
}

mostrarUsuarioEnHeader();

// Las páginas de la intranet tienen <body data-protegida="si">
if (document.body.dataset.protegida === "si" && obtenerSesion() === null) {
  window.location.replace("login.html");
}
