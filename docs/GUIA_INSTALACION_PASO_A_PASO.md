# 🚀 GUÍA COMPLETA: Instalar SAFEVISION AI (Nueva Version)

## 📋 Requisitos Previos

- **Node.js** >= 20.19.4 (descarga en https://nodejs.org/)
- **Expo Go** instalado en tu teléfono (Google Play o App Store)
- **Git** (opcional, para clonar)
- **Backend corriendo** en `http://TU_IP:8000`

---

## PASO 1: Limpiar el Proyecto Anterior (IMPORTANTE)

Si ya tienes un proyecto `safevision-mobile`, limpia todo primero:

```bash
cd safevision-mobile

# Windows:
rmdir /s /q node_modules
del package-lock.json
rmdir /s /q .expo
rmdir /s /q src
del App.js

# Mac/Linux:
rm -rf node_modules package-lock.json .expo src App.js
```

Si no tienes proyecto, crea una carpeta nueva:
```bash
mkdir safevision-mobile
cd safevision-mobile
```

---

## PASO 2: Copiar Archivos NUEVOS

Descarga TODOS estos archivos de `/mnt/user-data/outputs/` (hay 8 archivos):

```
NUEVA_App.js                    →  App.js
NUEVA_package.json              →  package.json
NUEVA_colors.js                 →  src/styles/colors.js
NUEVA_api.js                    →  src/services/api.js
NUEVA_PrincipalScreen.js        →  src/screens/PrincipalScreen.js
NUEVA_CapturaScreen.js          →  src/screens/CapturaScreen.js
NUEVA_ListaScreen.js            →  src/screens/ListaScreen.js
NUEVA_DetalleScreen.js          →  src/screens/DetalleScreen.js
```

**Estructura final debe ser:**
```
safevision-mobile/
├── App.js
├── package.json
├── node_modules/ (se crea automáticamente)
└── src/
    ├── screens/
    │   ├── PrincipalScreen.js
    │   ├── CapturaScreen.js
    │   ├── ListaScreen.js
    │   └── DetalleScreen.js
    ├── services/
    │   └── api.js
    └── styles/
        └── colors.js
```

---

## PASO 3: Instalar Dependencias

En la terminal (dentro de `safevision-mobile`):

```bash
npm install
```

Si hay warnings de peer dependencies:
```bash
npm install --legacy-peer-deps
```

⏳ Esto tarda 2-3 minutos la primera vez.

---

## PASO 4: Configurar IP del Backend

**IMPORTANTE:** El backend debe estar en tu PC o servidor.

1. **Obtén tu IP local:**

```bash
# En Windows, abre terminal y ejecuta:
ipconfig

# Busca algo como: 192.168.1.100 o 10.25.40.252
# (NO uses 127.0.0.1 o localhost)
```

2. **Edita** `src/services/api.js` línea 5:

```javascript
// CAMBIAR ESTO:
const API_BASE = 'http://10.25.40.252:8000/api/v1';

// POR TU IP:
const API_BASE = 'http://192.168.1.100:8000/api/v1';
// Ejemplo (reemplaza con tu IP real)
```

3. **Guarda** el archivo.

---

## PASO 5: Verificar que el Backend Esté Corriendo

En OTRA terminal (no cierres la app):

```bash
cd safevision-backend-v2

# Windows:
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Mac/Linux:
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

## PASO 6: Ejecutar la App

En la terminal del proyecto (safevision-mobile):

```bash
npm start
```

Espera a que aparezca un QR. Verás algo como:

```
 ⚠️  Server is listening on all configured host addresses, and unfortunately this is 
 ⚠️  Server is listening on all configured host addresses, and unfortunately this is 
 ⚠️  not supported by Expo. You may want to limit this to a single host.

│ Metro │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100% (FastRefresh)
│
› Press 'a' to open Android Emulator
› Press 'i' to open iOS Simulator
› Press 'w' to open in web
› Press 'r' to reload
› Press 'm' to toggle menu
› Press 'q' to quit
```

---

## PASO 7: Abrir en tu Teléfono

1. **Abre Expo Go** en tu teléfono
2. **Escanea el QR** que aparece en la terminal
3. **Espera a que compile** (1-2 minutos)

Deberías ver:
```
✅ SAFEVISION AI en tu teléfono
🏠 Tab de Inicio
📋 Tab de Inspecciones
```

---

## PASO 8: Prueba Funcional

1. **Haz clic en "Nueva Inspección"**
   - Debería ir a la pantalla de cámara
   
2. **Selecciona una categoría** (ej: Extintores)
   - Modal con 10 opciones
   
3. **Haz clic en "Galería"**
   - Elige una foto cualquiera
   
4. **Haz clic en "Analizar IA"**
   - Espera 5-10 segundos
   - Debería conectar al backend
   - Debería mostrar detalles

5. **Haz clic en tab "Inspecciones"**
   - Debería mostrar lista de inspecciones
   - Haz clic en una → Detalle

---

## 🔧 Si algo no funciona

### ❌ "Cannot connect to backend"
```
✓ Verifica que backend está corriendo
✓ Verifica la IP en src/services/api.js
✓ Verifica que PC y teléfono están en mismo WiFi
✓ Desactiva firewall temporalmente
✓ Usa `ipconfig` (NO localhost)
```

### ❌ "TypeError: Cannot read property..."
```
✓ Borra node_modules: rm -rf node_modules
✓ Limpia cache: npm start -- --clear
✓ Vuelve a instalar: npm install --legacy-peer-deps
```

### ❌ "Metro bundler error"
```
✓ Presiona 'r' en la terminal de Expo
✓ O presiona Ctrl+C y vuelve a `npm start`
✓ O borra .expo: rm -rf .expo
```

### ❌ "Cannot read property 'id' of undefined"
```
✓ Verifica que pasas un objeto con ID
✓ Verifica que ListaScreen pasa inspeccion completa
✓ Ya está arreglado en esta versión
```

---

## 📋 Checklist Final

- [ ] Node.js >= 20.19.4
- [ ] Proyecto limpio (sin archivos antiguos)
- [ ] Archivos NUEVOS copiados correctamente
- [ ] npm install ejecutado
- [ ] IP del backend configurada en api.js
- [ ] Backend corriendo en puerto 8000
- [ ] PC y teléfono en mismo WiFi
- [ ] Expo Go instalado
- [ ] QR escaneado y app cargando

---

## 🚀 ¡Listo!

La app debería funcionar perfectamente. Si hay algún error:

1. Revisa los logs en la terminal
2. Busca el error específico en este documento
3. Si persiste, regenera los archivos

---

## 📞 Soporte Rápido

| Error | Solución |
|-------|----------|
| "Do you have a screen named..." | Ya está arreglado en App.js |
| "Cannot read property 'rojo'..." | Ya está arreglado, usa NUEVA_App.js |
| "Cannot read property 'id'..." | Ya está arreglado en DetalleScreen |
| Network connection error | Verifica IP y WiFi |
| Metro bundler error | Presiona 'r' o reinicia con --clear |

---

**¡La app está lista para producción!** 🎉
