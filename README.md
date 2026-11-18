# CampoRed Frontend

Aplicación React para la plataforma CampoRed — conecta productores del Oriente Antioqueño con compradores comerciales.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Desarrollo local

El servidor de desarrollo levanta un proxy de Vite que reenvía `/api/*` al backend, evitando CORS en local.

1. Copia el archivo de entorno:

```bash
cp .env.example .env.local
```

El valor por defecto (`VITE_API_BASE_URL=/api`) apunta al proxy. No lo cambies en dev.

2. Levanta el servidor:

```bash
npm run dev
```

## Producción (Vercel)

Agrega la variable de entorno en el dashboard de Vercel:

```
VITE_API_BASE_URL=https://campored-backend.onrender.com/api
```

> **Importante:** el proxy de Vite solo aplica en desarrollo local. En producción,
> las llamadas van directo al backend. El backend debe tener habilitado CORS
> para el dominio del frontend en Vercel (`https://<tu-proyecto>.vercel.app`).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run lint` | Verificación de ESLint |
| `npm run preview` | Preview del build de producción |

## Estructura

```
src/
  api/          Módulos de comunicación con el backend (client, auth, usuarios, ofertas)
  components/   Componentes compartidos (NavBar, MenuUsuario, ImagenProducto, TarjetaOferta, FormOferta, Campo, rutas protegidas)
  constants/    Enums centralizados (municipios, productos y su imagen, tipos de negocio, roles)
  context/      AuthContext: sesión, token, usuario, expiración automática
  pages/        Landing, Catálogo, Detalle de oferta, Login, Registro, Perfil, Mis ofertas, Nueva y Editar oferta
```

## Imágenes de productos

El catálogo tiene 23 productos (`PRODUCTOS` en `src/constants/enums.js`, en orden alfabético y con `OTRO` al final). Cada valor tiene su foto en `public/img/productos/<valor en minúsculas>.webp`, de 800×600 y máximo 100 KB.

- Para mostrar la foto de un producto usa `<ImagenProducto producto={...} productoOtro={...} alt={...} />`: si la foto falla muestra `otro.webp` y, si esa también falla, un ícono del mismo tamaño.
- En las ofertas `OTRO`, `imagenProducto()` reconoce el nombre libre cuando coincide con un producto del catálogo o con los alias `cafe`, `papa` y `limon`; lo demás usa `otro.webp`.
- Para agregar un producto: súmalo al enum del backend, a `PRODUCTOS` y agrega su `.webp`. En Vercel una ruta de imagen inexistente devuelve `index.html`, así que no debe quedar un valor sin archivo.

## Créditos de imágenes
- Fotografías agrícolas y de paisajes del Oriente Antioqueño obtenidas bajo licencia libre de Unsplash y Pexels.
- Procesamiento y optimización a formato WebP realizado localmente con Sharp.

