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
VITE_API_BASE_URL=https://campored-backend-production.up.railway.app/api
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
  api/          Módulos de comunicación con el backend (client, auth, usuarios)
  components/   Componentes compartidos (NavBar, Campo, rutas protegidas)
  constants/    Enums centralizados (municipios, tipos de negocio, roles)
  context/      AuthContext: sesión, token, usuario, expiración automática
  pages/        Landing, Login, Registro, Perfil
```
