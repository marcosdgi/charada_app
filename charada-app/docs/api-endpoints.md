# API Endpoints – Charada App

Documentación alineada con la colección Postman **Charada-app**. La base URL debe incluir `/api/v1` (ej: `https://tu-dominio.com/api/v1`). Todas las rutas que no sean de auth se envían con `Authorization: Bearer <token>`.

---

## Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registro. Body: `username`, `email`, `password`, `password_confirmation`, `rolId` (opcional). |
| POST | `/auth/login` | Login. Body: `email`, `password`. Respuesta: `user` y `token` (objeto con `token.token` = JWT). |
| GET | `/auth/me` | Usuario actual. Requiere Bearer token. |
| POST | `/auth/logout` | Cerrar sesión. Requiere Bearer token. |

---

## Lists (list-play)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/lists` | Crea una lista asociada al usuario autenticado. No requiere body. |
| GET | `/lists/boss/:bossId` | Lista de un boss con sus jugadas. Reemplazar `:bossId` por el ID real. |

---

## Plays (list-play)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/plays` | Crea una jugada. Body: `listId`, `typePlayId`, `fijo`, `corrido` (opc.), `parle` (opc.), `amount`, `date` (YYYY-MM-DD). |
| PUT | `/plays/:id` | Actualiza jugada por ID. Body: `fijo`, `corrido`, `parle`, `amount` (null para opcionales). |
| DELETE | `/plays/:id` | Elimina jugada por ID. |
| GET | `/plays/date/:date?page=1` | Jugadas paginadas por fecha (YYYY-MM-DD). |
| GET | `/plays/list/:listId?page=1` | Jugadas paginadas de una lista. |

**Tipos de jugada (typePlayId):** 1 = fijo, 2 = corrido, 3 = parle.
