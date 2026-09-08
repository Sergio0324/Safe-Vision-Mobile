# ⚡ INSTALACIÓN RÁPIDA (5 minutos)

## Para personas que no tienen tiempo

### ✅ 1. Abre terminal en `safevision-mobile`

```bash
cd safevision-mobile
```

### ✅ 2. Limpia proyecto anterior (si existe)

```bash
# Windows:
rmdir /s /q node_modules
del package-lock.json
rmdir /s /q src
del App.js

# Mac/Linux:
rm -rf node_modules package-lock.json src App.js
```

### ✅ 3. Descarga 8 archivos de `/mnt/user-data/outputs/`

```
NUEVA_App.js              → App.js
NUEVA_package.json        → package.json
NUEVA_colors.js           → src/styles/colors.js
NUEVA_api.js              → src/services/api.js
NUEVA_PrincipalScreen.js  → src/screens/PrincipalScreen.js
NUEVA_CapturaScreen.js    → src/screens/CapturaScreen.js
NUEVA_ListaScreen.js      → src/screens/ListaScreen.js
NUEVA_DetalleScreen.js    → src/screens/DetalleScreen.js
```

### ✅ 4. Edita `src/services/api.js` línea 5

```javascript
// Obtén tu IP:
// Windows: ipconfig
// Mac: ifconfig

// Reemplaza esto:
const API_BASE = 'http://10.25.40.252:8000/api/v1';

// Con tu IP (ej):
const API_BASE = 'http://192.168.1.100:8000/api/v1';
```

### ✅ 5. Instala

```bash
npm install
```

### ✅ 6. Corre backend (otra terminal)

```bash
cd safevision-backend-v2
.\venv\Scripts\Activate.ps1  # Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### ✅ 7. Corre app

```bash
npm start
```

### ✅ 8. Escanea QR con Expo Go

¡Listo! ✅

---

## Si falla algo

| Error | Fix |
|-------|-----|
| Can't find module | Ejecuta: `npm install --legacy-peer-deps` |
| Can't connect to backend | Revisa IP en api.js y que backend esté corriendo |
| Metro error | Presiona 'r' en terminal o `npm start -- --clear` |
| "Cannot read property..." | Cierra app, limpia caché, reinicia |

---

**¿Necesitas ayuda detallada?** Lee `GUIA_INSTALACION_PASO_A_PASO.md`

**¿Qué cambios hubo?** Lee `PROBLEMAS_RESUELTOS_NUEVA_VERSION.md`

---

## Links útiles

- 📖 [Documentación Expo](https://docs.expo.dev/)
- 🧭 [React Navigation](https://reactnavigation.org/)
- 🔌 [Axios docs](https://axios-http.com/)
- 📞 Soporte: Copia el error exacto y búscalo en los docs arriba

---

**Tiempo esperado:** 5-10 minutos ⏱️

**Si tarda más:** Probablemente instalando node_modules (2-3 min es normal)

¡Éxito! 🚀
