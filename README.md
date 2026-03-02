# 🛒 Compras Backend

Backend para la app de listas de compra compartidas en pareja.

## Stack
- **Node.js** + **Express** — API REST
- **Socket.io** — Sincronización en tiempo real
- **MongoDB** + **Mongoose** — Base de datos
- **Railway** — Despliegue

---

## 🚀 Puesta en marcha local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```
Edita `.env` y pon tu URI de MongoDB Atlas (ver abajo).

### 3. Arrancar en desarrollo
```bash
npm run dev
```

El servidor arranca en `http://localhost:3000`.

---

## 🌱 MongoDB Atlas (gratis)

1. Entra en https://cloud.mongodb.com y crea una cuenta gratuita.
2. Crea un **Cluster gratuito** (M0 Free Tier).
3. En **Database Access**, crea un usuario con contraseña.
4. En **Network Access**, añade `0.0.0.0/0` para permitir Railway.
5. Pulsa **Connect → Drivers** y copia la URI. Pégala en `.env`:

```
MONGODB_URI=mongodb+srv://tuUsuario:tuPassword@cluster0.xxxxx.mongodb.net/compras?retryWrites=true&w=majority
```

---

## 🚂 Despliegue en Railway

1. Crea cuenta en https://railway.app
2. **New Project → Deploy from GitHub repo** (sube este código a GitHub primero)
3. En **Variables**, añade:
   - `MONGODB_URI` — tu URI de Atlas
   - `PORT` — Railway lo pone solo, no hace falta
   - `CLIENT_URL` — `*` por ahora (o la URL de tu app cuando la tengas)
4. Railway detecta el `railway.json` y despliega automáticamente.
5. En **Settings → Networking**, genera un dominio público. Ese será tu `BACKEND_URL`.

---

## 📡 API Endpoints

### Parejas
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/parejas` | Crear nueva pareja → devuelve código de 6 letras |
| `GET`  | `/api/parejas/:codigo` | Unirse a pareja existente |
| `PUT`  | `/api/parejas/:codigo` | Cambiar nombre |

### Listas
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`    | `/api/listas/:codigoPareja` | Obtener todas las listas |
| `POST`   | `/api/listas/:codigoPareja` | Crear lista nueva |
| `PUT`    | `/api/listas/:listaId` | Editar lista |
| `DELETE` | `/api/listas/:listaId` | Borrar lista y sus elementos |

### Elementos
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`    | `/api/elementos/:listaId` | Obtener elementos (con filtros) |
| `POST`   | `/api/elementos/:listaId` | Añadir elemento |
| `PUT`    | `/api/elementos/:elementoId` | Editar elemento |
| `PATCH`  | `/api/elementos/:elementoId/toggle` | Marcar/desmarcar necesario |
| `DELETE` | `/api/elementos/:elementoId` | Eliminar elemento |
| `DELETE` | `/api/elementos/:listaId/limpiar` | Borrar todos los "no necesarios" |

### Otros
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/categorias` | Lista de categorías con emojis |
| `GET` | `/health` | Healthcheck |

#### Filtros en GET /api/elementos/:listaId
```
?categoria=frutas_verduras   — filtrar por categoría
?necesario=true              — solo los que hay que comprar
?necesario=false             — solo los que ya están
?buscar=leche                — búsqueda por nombre
?ordenPor=nombre             — ordenar (nombre | reciente | cantidad)
```

---

## 🔌 WebSockets (Socket.io)

### Conexión
```js
import { io } from 'socket.io-client';
const socket = io('TU_BACKEND_URL');

socket.emit('join_pareja', { codigo: 'ABC123', alias: 'María' });
```

### Eventos que escucha el cliente
```
elemento_creado          → { elemento }
elemento_actualizado     → { elemento }
elemento_toggle          → { elemento }
elemento_eliminado       → { elementoId, listaId }
no_necesarios_limpiados  → { listaId }
lista_creada             → { lista }
lista_actualizada        → { lista }
lista_eliminada          → { listaId }
pareja_conectada         → { alias }
pareja_desconectada      → { alias }
```

### Eventos que emite el cliente (tras cada operación REST)
Los mismos nombres pero en dirección inversa. El frontend llama a la API REST
y después emite el evento socket para que la pareja se entere al instante.

---

## 📁 Estructura del proyecto
```
compras-backend/
├── config/
│   └── database.js        # Conexión MongoDB
├── src/
│   ├── models/
│   │   ├── Pareja.js      # Room compartido (código de 6 letras)
│   │   ├── Lista.js       # Lista de compra
│   │   └── Elemento.js    # Ítem individual
│   ├── controllers/
│   │   ├── parejaController.js
│   │   ├── listaController.js
│   │   └── elementoController.js
│   ├── routes/
│   │   ├── parejas.js
│   │   ├── listas.js
│   │   └── elementos.js
│   ├── sockets/
│   │   └── index.js       # Lógica WebSocket
│   └── index.js           # Entry point
├── .env.example
├── .gitignore
├── package.json
└── railway.json
```
