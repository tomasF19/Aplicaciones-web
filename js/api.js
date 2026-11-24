const API_URL = "https://6ae0a63fbe3bc8fead97a7c0.mockapi.io/api/plantas";

const CLAVE_PLANTAS = "plantasEditadas";
let usandoRespaldo = false;

// Trae las plantas. Si la API falla, usa el array de respaldo de datos.js.
// Si ya hubo altas/ediciones/bajas desde la intranet, se usan esas (la API solo permite GET).
async function obtenerPlantas() {
  const guardadas = localStorage.getItem(CLAVE_PLANTAS);
  if (guardadas) {
    return JSON.parse(guardadas);
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error " + response.status);
    }
    const datos = await response.json();
    return Array.isArray(datos) ? datos : datos.plantas;
  } catch (error) {
    console.log("No se pudo usar la API, se usan los datos de respaldo", error);
    usandoRespaldo = true;
    return plantasRespaldo;
  }
}

async function obtenerPlantaDetalle(id) {
  const plantas = await obtenerPlantas();
  for (let i = 0; i < plantas.length; i++) {
    if (String(plantas[i].id) === String(id)) {
      return plantas[i];
    }
  }
  return null;
}

// ABM: como la API es de solo lectura, los cambios se guardan en localStorage.
function guardarPlantas(plantas) {
  localStorage.setItem(CLAVE_PLANTAS, JSON.stringify(plantas));
}

async function crearPlanta(planta) {
  const plantas = await obtenerPlantas();
  let maxId = 0;
  for (let i = 0; i < plantas.length; i++) {
    if (Number(plantas[i].id) > maxId) {
      maxId = Number(plantas[i].id);
    }
  }
  planta.id = maxId + 1;
  plantas.push(planta);
  guardarPlantas(plantas);
}

async function actualizarPlanta(planta) {
  const plantas = await obtenerPlantas();
  for (let i = 0; i < plantas.length; i++) {
    if (String(plantas[i].id) === String(planta.id)) {
      plantas[i] = planta;
    }
  }
  guardarPlantas(plantas);
}

async function eliminarPlanta(id) {
  const plantas = await obtenerPlantas();
  const restantes = [];
  for (let i = 0; i < plantas.length; i++) {
    if (String(plantas[i].id) !== String(id)) {
      restantes.push(plantas[i]);
    }
  }
  guardarPlantas(restantes);
}

function restablecerPlantas() {
  localStorage.removeItem(CLAVE_PLANTAS);
}
