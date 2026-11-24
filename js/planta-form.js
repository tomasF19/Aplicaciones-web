const formPlanta = document.getElementById("formPlanta");
const tituloForm = document.getElementById("tituloForm");
const idEditar = new URLSearchParams(window.location.search).get("id");

// Si viene un id en la URL, el formulario se abre precargado (edición)
async function precargarFormulario() {
  const planta = await obtenerPlantaDetalle(idEditar);
  if (planta === null) {
    Swal.fire("Error", "No encontramos esa planta.", "error").then(() => {
      window.location.href = "listado.html";
    });
    return;
  }
  tituloForm.textContent = "Editar planta";
  document.getElementById("nombre").value = planta.nombre;
  document.getElementById("nombreCientifico").value = planta.nombreCientifico;
  document.getElementById("categoria").value = planta.categoria;
  document.getElementById("riego").value = planta.riego;
  document.getElementById("precio").value = planta.precio;
  document.getElementById("stock").value = planta.stock;
  document.getElementById("fechaIngreso").value = planta.fechaIngreso;
  document.getElementById("aptaMascotas").checked = planta.aptaMascotas;
  document.getElementById("foto").value = planta.foto;
  document.getElementById("notas").value = planta.notas;

  const luces = document.getElementsByName("luz");
  for (let i = 0; i < luces.length; i++) {
    luces[i].checked = luces[i].value === planta.luz;
  }
  const etiquetasPlanta = planta.etiquetas || [];
  const etiquetas = document.getElementsByName("etiquetas");
  for (let i = 0; i < etiquetas.length; i++) {
    etiquetas[i].checked = etiquetasPlanta.includes(etiquetas[i].value);
  }
}

function leerFormulario() {
  const luzElegida = document.querySelector('input[name="luz"]:checked');
  const etiquetasElegidas = [];
  const etiquetas = document.getElementsByName("etiquetas");
  for (let i = 0; i < etiquetas.length; i++) {
    if (etiquetas[i].checked) {
      etiquetasElegidas.push(etiquetas[i].value);
    }
  }
  return {
    nombre: document.getElementById("nombre").value.trim(),
    nombreCientifico: document.getElementById("nombreCientifico").value.trim(),
    categoria: document.getElementById("categoria").value,
    luz: luzElegida ? luzElegida.value : "",
    riego: document.getElementById("riego").value,
    precio: parseFloat(document.getElementById("precio").value),
    stock: parseInt(document.getElementById("stock").value),
    fechaIngreso: document.getElementById("fechaIngreso").value,
    aptaMascotas: document.getElementById("aptaMascotas").checked,
    etiquetas: etiquetasElegidas,
    foto: document.getElementById("foto").value.trim(),
    notas: document.getElementById("notas").value.trim()
  };
}

formPlanta.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const planta = leerFormulario();
  // Se reutiliza la validación de validaciones.js
  const errores = validarPlanta(planta);
  if (!mostrarErrores("errores", errores)) {
    return;
  }
  try {
    if (idEditar) {
      planta.id = idEditar;
      await actualizarPlanta(planta);
    } else {
      await crearPlanta(planta);
    }
    await Swal.fire("¡Listo!", "La planta se guardó correctamente.", "success");
    window.location.href = "listado.html";
  } catch (error) {
    Swal.fire("Error", "No se pudo guardar la planta.", "error");
  }
});

if (idEditar) {
  precargarFormulario();
}
