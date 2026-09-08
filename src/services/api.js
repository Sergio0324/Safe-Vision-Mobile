import axios from 'axios';

const API_BASE = 'https://safevision-backend-v2.onrender.com/api/v1';

// Crear instancia de axios con timeout
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logs
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message, error.config?.url);
    return Promise.reject(error);
  }
);

// 1. CREAR INSPECCIÓN (con FormData y Axios)
export async function crearInspeccion(datosInspeccion) {
  try {
    console.log('📤 Preparando envío de inspección...');
    
    const formData = new FormData();
    formData.append('sede_id', String(datosInspeccion.sede_id));
    formData.append('categoria', String(datosInspeccion.categoria));
    formData.append('ubicacion_descripcion', String(datosInspeccion.ubicacion_descripcion));
    
    // Si estás usando Expo SDK reciente, puedes importar File de expo-file-system
    // O bien pasar el objeto de archivo adaptado para evitar el error de parsing:
    formData.append('foto', {
      uri: datosInspeccion.photoUri,
      type: 'image/jpeg',
      name: 'inspeccion.jpg',
    });

    // Forzamos el uso de la API global original desactivando cualquier envoltorio si lo hubiera,
    // o usando XMLHttpRequest tradicional que nunca falla con multipart en React Native:
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.open('POST', `${API_BASE}/inspecciones`);
      xhr.onload = () => {
        try {
          const responseData = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('✅ Inspección creada con éxito');
            resolve({ success: true, data: responseData });
          } else {
            reject(new Error(responseData.detail || 'Error al crear la inspección'));
          }
        } catch (e) {
          reject(new Error('Respuesta inválida del servidor'));
        }
      };
      xhr.onerror = () => reject(new Error('Error de red al intentar conectar con el servidor'));
      
      // XMLHttpRequest en React Native maneja FormData nativo perfectamente sin errores de "FormDataPart"
      xhr.send(formData);
    });

  } catch (error) {
    console.error('❌ Error al crear inspección:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// 2. LISTAR INSPECCIONES (ver todas)
export const listarInspecciones = async (sedeId) => {
  try {
    console.log('📥 Obteniendo lista de inspecciones...');

    const response = await api.get('/inspecciones', {
      params: {
        sede_id: sedeId,
      },
    });

    console.log('✅ Inspecciones obtenidas:', response.data.length);

    return {
      success: true,
      data: response.data || [],
    };
  } catch (error) {
    console.error('❌ Error al listar inspecciones:', error.message);
    return {
      success: false,
      error: error.message || 'Error de conexión',
      data: [],
    };
  }
};

// 3. OBTENER DETALLE DE UNA INSPECCIÓN
export const obtenerInspeccion = async (id) => {
  try {
    console.log('📥 Obteniendo detalles de inspección:', id);

    const response = await api.get(`/inspecciones/${id}`);

    console.log('✅ Detalle obtenido:', response.data.id);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('❌ Error al obtener inspección:', error.message);
    return {
      success: false,
      error: error.message || 'Error de conexión',
    };
  }
};

// 4. ACTUALIZAR INSPECCIÓN (cambiar estado, agregar notas)
export const actualizarInspeccion = async (id, datos) => {
  try {
    console.log('📝 Actualizando inspección:', id);

    const response = await api.put(`/inspecciones/${id}`, datos);

    console.log('✅ Inspección actualizada');

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('❌ Error al actualizar inspección:', error.message);
    return {
      success: false,
      error: error.message || 'Error de conexión',
    };
  }
};

// 5. CONECTAR AL BACKEND (verificar que esté disponible)
export const verificarConexion = async () => {
  try {
    console.log('🔗 Verificando conexión a:', API_BASE);

    const response = await api.get('/health');

    console.log('✅ Backend disponible');

    return true;
  } catch (error) {
    console.error('❌ Backend no disponible:', API_BASE);
    console.error('   Error:', error.message);
    return false;
  }
};

export default api;