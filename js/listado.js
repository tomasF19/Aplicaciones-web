const tablaPlantas = document.getElementById("tablaPlantas");
const estadoListado = document.getElementById("estadoListado");
const botonRestablecer = document.getElementById("restablecer");
let graficoStock = null;

function crearFila(planta) {
  return `
    <tr>
      <td>${planta.id}</td>
      <td>${planta.nombre}</td>
      <td>${planta.categoria}</td>
      <td>$${planta.precio}</td>
      <td>${planta.stock}</td>
      <td class="acciones">
        <a class="boton" href="planta-form.html?id=${planta.id}">Editar</a>
        <button type="button" class="boton peligro" data-id="${planta.id}">Eliminar</button>
      </td>
    </tr>`;
}

function renderizarTabla(plantas) {
  tablaPlantas.innerHTML = plantas.map(planta => crearFila(planta)).join("");
  if (plantas.length === 0) {
    estadoListado.textContent = "No hay plantas cargadas.";
  }
}

// Gráfico de stock por categoría
function dibujarGrafico(plantas) {
  const stockPorCategoria = {};
  for (let i = 0; i < plantas.length; i++) {
    const categoria = plantas[i].categoria;
    stockPorCategoria[categoria] = (stockPorCategoria[categoria] || 0) + Number(plantas[i].stock);
  }

  if (graficoStock !== null) {
    graficoStock.destroy();
  }
  graficoStock = new Chart(document.getElementById("graficoStock"), {
    type: "bar",
    data: {
      labels: Object.keys(stockPorCategoria),
      datasets: [{
        label: "Stock",
        data: Object.values(stockPorCategoria),
        backgroundColor: "#2e5339"
      }]
    }
  });
}

async function cargarListado() {
  estadoListado.textContent = "Cargando plantas...";
  try {
    const plantas = await obtenerPlantas();
    estadoListado.textContent = "";
    renderizarTabla(plantas);
    dibujarGrafico(plantas);
  } catch (error) {
    estadoListado.textContent = "No pudimos cargar las plantas. Intentá de nuevo más tarde.";
  }
}

// Un solo listener en la tabla para todos los botones Eliminar
tablaPlantas.addEventListener("click", async (evento) => {
  const id = evento.target.dataset.id;
  if (!id) {
    return;
  }
  const respuesta = await Swal.fire({
    title: "¿Eliminar planta?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });
  if (respuesta.isConfirmed) {
    try {
      await eliminarPlanta(id);
      await cargarListado();
      Swal.fire("Eliminada", "La planta se eliminó correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la planta.", "error");
    }
  }
});

botonRestablecer.addEventListener("click", async () => {
  restablecerPlantas();
  await cargarListado();
  Swal.fire("Listo", "Se volvió a los datos originales.", "info");
});

cargarListado();
