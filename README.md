# CERDEX - Catálogo Web de Accesorios para Pintar

Interfaz interactiva y catálogo e-commerce para productos de **CERDEX** (brochas, rodillos, esmaltes en aerosol, lijas, herramientas y kits). Exportado desde Figma Make y construido con React 19, Vite y Tailwind CSS v4.

---

## 📋 Requisitos Previos

En cualquier computadora donde vayas a abrir el proyecto, necesitas tener instalado:

- **[Node.js](https://nodejs.org/)** (versión 18, 20 o 22 LTS recomendada).
- *(Opcional)* **pnpm** o simplemente el **npm** que viene con Node.js.

---

## 🚀 Cómo ejecutar el proyecto en otra PC

Cuando descargues o clones este repositorio en otra computadora, sigue estos 3 pasos:

### 1. Clonar o descargar el repositorio
```bash
git clone <URL_DE_TU_REPOSITORIO>
cd "E-commerce Catalog Interface"
```

### 2. Instalar las dependencias
En Node.js/React, el archivo `package.json` equivale al `requirements.txt` de Python. Para instalar todo automáticamente, ejecuta en la terminal:

```bash
npm install
```
*(o si usas pnpm: `pnpm install`)*

> **Nota:** La carpeta `node_modules` no se sube a GitHub porque pesa mucho; este comando la reconstruye por completo en unos segundos.

### 3. Iniciar el servidor local
```bash
npm run dev
```

Una vez iniciado, abre tu navegador en:
👉 **http://localhost:8443** (o la URL que indique la consola).

En Windows también puedes simplemente hacer doble clic en el archivo `dev.bat`.

---

## 🛠️ Scripts disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo local con recarga rápida (HMR). |
| `npm run build` | Compila el código optimizado para producción en la carpeta `/dist`. |
| `npm run preview` | Previsualiza localmente la versión de producción compilada. |

---

## 📁 Estructura del Proyecto

- `src/App.tsx`: Lógica principal del catálogo, categorías, carrito y asistente virtual.
- `src/products.ts`: Listado con la base de datos de productos CERDEX.
- `src/index.css`: Estilos globales y Tailwind CSS v4.
- `vite.config.ts`: Configuración del servidor y empaquetador Vite.
