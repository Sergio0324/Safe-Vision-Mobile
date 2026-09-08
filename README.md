# 🚀 SAFEVISION AI - App React Native Nueva Versión

## ⚡ Instalación Rápida (5 minutos)

1. **Descomprime** este ZIP
2. **Lee** → `docs/INSTALACION_RAPIDA_5MIN.md`
3. **Edita IP** → `src/services/api.js` línea 5
4. **Ejecuta:**
   ```bash
   npm install
   npm start
   ```
5. **Escanea** QR con Expo Go

## 📁 Estructura

```
safevision-mobile-NUEVA/
├── README.md
├── App.js
├── package.json
├── src/
│   ├── screens/
│   │   ├── PrincipalScreen.js
│   │   ├── CapturaScreen.js
│   │   ├── ListaScreen.js
│   │   └── DetalleScreen.js
│   ├── services/
│   │   └── api.js
│   └── styles/
│       └── colors.js
└── docs/
    ├── INSTALACION_RAPIDA_5MIN.md ← EMPIEZA AQUÍ
    ├── GUIA_INSTALACION_PASO_A_PASO.md
    ├── NUEVA_APP_COMPLETA.md
    ├── PROBLEMAS_RESUELTOS_NUEVA_VERSION.md
    └── INDICE_ARCHIVOS_NUEVOS.md
```

## ✅ Características

- ✅ 0 errores de compilación
- ✅ Conecta al backend
- ✅ Lista de inspecciones funcional
- ✅ 10 categorías de inspección
- ✅ Detalles sin bugs
- ✅ Código limpio
- ✅ Sin warnings

## 📖 Pasos para Instalar

### Paso 1: Leer
Abre: `docs/INSTALACION_RAPIDA_5MIN.md`

### Paso 2: Preparar
- Abre terminal en esta carpeta
- Asegúrate que Node.js >= 20.19.4 está instalado

### Paso 3: Configurar IP
Edita `src/services/api.js` línea 5:
```javascript
const API_BASE = 'http://TU_IP:8000/api/v1';
// Reemplaza TU_IP con tu IP real (ej: 192.168.1.100)
```

Obtén tu IP:
- Windows: `ipconfig` en terminal
- Mac/Linux: `ifconfig` en terminal
- Busca algo como: 192.168.x.x o 10.x.x.x

### Paso 4: Instalar dependencias
```bash
npm install
```

### Paso 5: Ejecutar
```bash
npm start
```

### Paso 6: Abrir en teléfono
- Abre Expo Go
- Escanea el QR que aparece en terminal
- Espera a que compile

## 🎯 Prueba Funcional

1. Abre app → ves 2 tabs
2. Clic "Nueva Inspección" → pantalla de cámara
3. Selecciona categoría → modal con 10 opciones
4. Toma foto o elige galería
5. Clic "Analizar IA" → va a DetalleScreen
6. Clic tab "Inspecciones" → lista desde backend

## 🔧 Requisitos

- ✅ Node.js >= 20.19.4
- ✅ Expo Go (descarga en Play Store o App Store)
- ✅ Backend SAFEVISION corriendo en puerto 8000
- ✅ PC y teléfono en MISMO WiFi

## ⚠️ IMPORTANTE

**EDITA LA IP ANTES DE INSTALAR**

Sin editar la IP, la app no conectará al backend.

## 📞 Si algo no funciona

1. Lee: `docs/GUIA_INSTALACION_PASO_A_PASO.md`
2. Busca tu error en la sección "Si algo no funciona"
3. Sigue los pasos indicados

## 📚 Documentación Completa

Todos estos archivos están en `docs/`:

- `INSTALACION_RAPIDA_5MIN.md` → Para apurados
- `GUIA_INSTALACION_PASO_A_PASO.md` → Detallada
- `NUEVA_APP_COMPLETA.md` → Información general
- `PROBLEMAS_RESUELTOS_NUEVA_VERSION.md` → Qué cambió
- `INDICE_ARCHIVOS_NUEVOS.md` → Referencia completa

## 🎉 ¡Listo!

Si sigues los pasos, la app funcionará perfectamente.

**Versión:** 1.0.0 Nueva (Generada 2026-09-02)

---

¿Preguntas? Consulta la documentación en `docs/`

¡Que disfrutes SAFEVISION AI! 🚀
