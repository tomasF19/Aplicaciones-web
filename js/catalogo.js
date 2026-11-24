const listaPlantas = document.getElementById("listaPlantas");
const estado = document.getElementById("estado");
const contador = document.getElementById("contador");
const sinResultados = document.getElementById("sinResultados");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const ordenar = document.getElementById("ordenar");
const botonLimpiar = document.getElementById("limpiar");

let todasLasPlantas = [];

// Arma el HTML de una tarjeta
function crearTarjeta(planta) {
  return `
    <article class="tarjeta">
      <img src="${planta.foto}" alt="${planta.nombre}" onerror="this.src='img/helecho.jpg'">
      <h3>${planta.nombre}</h3>
      <p class="cientifico">${planta.nombreCientifico}</p>
      <p class="precio">$${planta.precio}</p>
      <a class="boton" href="planta.html?id=${planta.id}">Ver ficha</a>
    </article>`;
}

// Arma la lista completa
function renderizarCatalogo(plantas, contenedor) {
  contenedor.innerHTML = plantas.map(planta => crearTarjeta(planta)).join("");
}

function aplicarFiltros() {
  const texto = buscador.value.toLowerCase().trim();
  const categoria = filtroCategoria.value;
  const resultado = [];

  for (let i = 0; i < todasLasPlantas.length; i++) {
    const planta = todasLasPlantas[i];
    const coincideNombre = planta.nombre.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "" || planta.categoria === categoria;
    if (coincideNombre && coincideCategoria) {
      resultado.push(planta);
    }
  }

  const orden = ordenar.value;
  if (orden === "precio-menor") {
    resultado.sort((a, b) => a.precio - b.precio);
  } else if (orden === "precio-mayor") {
    resultado.sort((a, b) => b.precio - a.precio);
  } else if (orden === "nombre") {
    resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  renderizarCatalogo(resultado, listaPlantas);
  contador.textContent = resultado.length + " planta(s) encontradas";
  sinResultados.style.display = resultado.length === 0 ? "block" : "none";
}

function limpiarFiltros() {
  buscador.value = "";
  filtroCategoria.value = "";
  ordenar.value = "";
  aplicarFiltros();
}

async function iniciarCatalogo() {
  estado.textContent = "Cargando plantas...";
  try {
    todasLasPlantas = await obtenerPlantas();
    estado.textContent = usandoRespaldo
      ? "No pudimos conectar con la API, mostramos datos de respaldo."
      : "";
    aplicarFiltros();
  } catch (error) {
    estado.textContent = "No pudimos cargar las plantas. Intentá de nuevo más tarde.";
  }
}

buscador.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);
ordenar.addEventListener("change", aplicarFiltros);
botonLimpiar.addEventListener("click", limpiarFiltros);

iniciarCatalogo();
