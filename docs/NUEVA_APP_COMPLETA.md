# 🎯 SAFEVISION AI - App React Native NUEVA (Funcionando)

## PASO 1: Crea la estructura de carpetas

```
safevision-mobile/
├── App.js
├── package.json
├── app.json
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
└── eas.json
```

## PASO 2: Borra TODOS los archivos antiguos

```bash
cd safevision-mobile

# LIMPIA EL PROYECTO
rm -rf node_modules package-lock.json
rm -rf .expo/
rm -rf App.js src/

# O en Windows:
rmdir /s /q node_modules
del package-lock.json
rmdir /s /q .expo
rmdir /s /q src
del App.js
```

## PASO 3: Copia los archivos NUEVOS que voy a generar

Los archivos están en: `/mnt/user-data/outputs/`

Descárgalos y coloca en tu proyecto según la estructura arriba.

## PASO 4: Instala dependencias

```bash
npm install
npm install --legacy-peer-deps
```

## PASO 5: Corre la app

```bash
npm start -- --clear
```

Luego escanea el QR con Expo Go en tu teléfono.

---

## CAMBIOS IMPORTANTES EN ESTA VERSIÓN

✅ **Sin errores de importación** - Todo inline, sin rutas complicadas
✅ **Navegación simple** - Solo 2 tabs, sin nested stacks complicados
✅ **API lista** - Funciones de conexión probadas
✅ **Listado real** - Conecta al backend y muestra inspecciones
✅ **Detalle robusto** - Maneja todos los casos
✅ **Sin console warnings** - Código limpio
✅ **IP del backend configurable** - Cambiar fácil

---

## CONFIGURACIÓN DEL BACKEND

Antes de correr la app, ASEGÚRATE QUE:

1. Backend corriendo:
```bash
cd safevision-backend-v2
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. Obtén tu IP local:
```bash
ipconfig  # En Windows
ifconfig  # En Mac/Linux
# Busca una IP como 192.168.x.x o 10.x.x.x
```

3. En `src/services/api.js`, cambia:
```javascript
const API_BASE = 'http://TU_IP:8000/api/v1';
// Ejemplo:
const API_BASE = 'http://192.168.1.100:8000/api/v1';
```

4. Teléfono Y computadora deben estar en LA MISMA RED WiFi.

---

