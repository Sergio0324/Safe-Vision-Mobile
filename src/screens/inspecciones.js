// src/utils/inspecciones.js
//
// La API/BD guarda varios campos como JSON (resultado_ia, resultado_reglas,
// hallazgo_texto) y usa nombres distintos a los que se usaban antes en las
// pantallas (creado_en en vez de fecha_creacion, fotos_urls en vez de
// foto_url, etc). Estas funciones leen el campo real donde esté, y si no lo
// encuentran prueban el nombre "plano" antiguo por si la API ya lo entrega
// así. Así el front no se rompe sin importar cuál de las dos formas use tu
// backend.

function parseJSON(campo) {
  let valor = campo;
  let intentos = 0;
  while (typeof valor === 'string' && intentos < 3) {
    try {
      valor = JSON.parse(valor);
    } catch (e) {
      return null;
    }
    intentos++;
  }
  return valor && typeof valor === 'object' ? valor : null;
}

export function getResultadoIA(item) {
  return parseJSON(item.resultado_ia) || {};
}

export function getResultadoReglas(item) {
  return parseJSON(item.resultado_reglas) || {};
}

export function getHallazgo(item) {
  return parseJSON(item.hallazgo_texto) || {};
}

export function getCategoria(item) {
  return item.categoria || getResultadoIA(item).categoria || null;
}

// El detalle específico de la categoría (tipo_extintor, manometro,
// senalizacion, observaciones, etc). Cambia de forma según la categoría.
export function getDatosIA(item) {
  return getResultadoIA(item).datos || null;
}

export function getFotoUrl(item) {
  if (item.foto_url) return item.foto_url;
  const fotos = parseJSON(item.fotos_urls);
  if (Array.isArray(fotos) && fotos.length > 0) return fotos[0];
  return null;
}

export function getFecha(item) {
  return item.fecha_creacion || item.creado_en || null;
}

export function getNivelRiesgo(item) {
  return (
    item.nivel_riesgo ||
    item.nivelRiesgo ||
    getHallazgo(item).nivel_riesgo ||
    getResultadoReglas(item).nivel_riesgo ||
    null
  );
}

export function getIncumplimientos(item) {
  if (Array.isArray(item.incumplimientos)) return item.incumplimientos;
  const h = getHallazgo(item);
  return Array.isArray(h.incumplimientos) ? h.incumplimientos : [];
}

export function getAccionesSugeridas(item) {
  const h = getHallazgo(item);
  if (Array.isArray(h.acciones_sugeridas)) return h.acciones_sugeridas;
  if (item.plan_accion) return [item.plan_accion];
  return [];
}

// Confianza del modelo de IA, como porcentaje (0-100). OJO: esto NO es un
// puntaje de riesgo — es qué tan seguro está el modelo de su propio
// análisis. Confianza baja = conviene revisar manualmente el resultado.
export function getConfianza(item) {
  const valor = getResultadoIA(item).confianza_general;
  return typeof valor === 'number' ? Math.round(valor * 100) : null;
}

export function getConfianzaColor(valor, colors) {
  if (valor === null || valor === undefined) return colors.gray[500];
  if (valor >= 80) return colors.risk.bajo;
  if (valor >= 50) return colors.risk.medio;
  return colors.risk.critico;
}

// Etiquetas legibles para las llaves técnicas que devuelve la IA en "datos"
const ETIQUETAS = {
  existe: 'Existe',
  tipo_extintor: 'Tipo de extintor',
  estado_fisico: 'Estado físico',
  senalizacion: 'Señalización',
  manometro: 'Manómetro',
  manometro_cargado: 'Manómetro cargado',
  pasador_seguridad: 'Pasador de seguridad',
  sello_inviolabilidad: 'Sello de inviolabilidad',
  fecha_vencimiento: 'Fecha de vencimiento',
  vencido: 'Vencido',
};

export function formatEtiqueta(clave) {
  return (
    ETIQUETAS[clave] ||
    clave.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())
  );
}

export function formatValor(valor) {
  if (valor === null || valor === undefined) return 'No visible';
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  if (Array.isArray(valor)) return valor.join(', ');
  return String(valor);
}