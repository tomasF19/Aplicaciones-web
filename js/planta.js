const fichaPlanta = document.getElementById("fichaPlanta");

function crearFicha(planta) {
  const etiquetas = planta.etiquetas && planta.etiquetas.length > 0
    ? planta.etiquetas.join(", ")
    : "Sin etiquetas";
  return `
    <div class="ficha-galeria">
      <img src="${planta.foto}" alt="${planta.nombre}" onerror="this.src='img/helecho.jpg'">
    </div>
    <div class="ficha-info">
      <h2>${planta.nombre}</h2>
      <p class="cientifico">${planta.nombreCientifico}</p>
      <p class="precio">$${planta.precio}</p>
      <table class="tabla-datos">
        <tr><th>Categoría</th><td>${planta.categoria}</td></tr>
        <tr><th>Luz</th><td>${planta.luz}</td></tr>
        <tr><th>Riego</th><td>${planta.riego}</td></tr>
        <tr><th>Stock</th><td>${planta.stock} unidades</td></tr>
        <tr><th>Ingreso</th><td>${planta.fechaIngreso}</td></tr>
        <tr><th>Apta mascotas</th><td>${planta.aptaMascotas ? "Sí" : "No"}</td></tr>
        <tr><th>Etiquetas</th><td>${etiquetas}</td></tr>
      </table>
      <div class="cuidados">
        <h3>Cuidados</h3>
        <p>${planta.notas}</p>
      </div>
      <a class="boton" href="catalogo.html">Volver al catálogo</a>
    </div>`;
}

async function mostrarFicha() {
  // El id viene en la URL: planta.html?id=3
  const id = new URLSearchParams(window.location.search).get("id");
  fichaPlanta.innerHTML = "<p>Cargando planta...</p>";
  try {
    const planta = await obtenerPlantaDetalle(id);
    if (planta === null) {
      fichaPlanta.innerHTML = `<p class="mensaje-error" style="display:block">No encontramos esa planta.</p>
        <a class="boton" href="catalogo.html">Volver al catálogo</a>`;
    } else {
      fichaPlanta.innerHTML = crearFicha(planta);
      document.title = planta.nombre + " - Vivero Raíz";
    }
  } catch (error) {
    fichaPlanta.innerHTML = `<p class="mensaje-error" style="display:block">No pudimos cargar la planta. Intentá de nuevo más tarde.</p>`;
  }
}

mostrarFicha();
