# Fase 1 · MVP

## Alcance

La Fase 1 construye lo mínimo necesario para que una persona pueda aprender un módulo temático completo de LSC, de principio a fin, por su cuenta. No incluye tienda, no incluye canje de códigos físicos, no incluye funciones sociales: eso llega en fases posteriores. El módulo piloto sugerido es uno de saludos y presentación personal (10 a 15 señas), por ser el punto de entrada más natural para alguien que nunca ha usado la plataforma, aunque el equipo puede elegir otro tema si tiene ya contenido validado disponible para ese módulo.

## Historias de usuario

Una persona nueva entra al sitio, se registra con su correo (usando Firebase Auth) y llega directamente al módulo disponible, sin pasos previos innecesarios. Dentro del módulo, ve un video corto de una seña y debe elegir, entre varias opciones, la palabra que corresponde a esa seña; en otro tipo de ejercicio ve una palabra escrita y debe elegir, entre varios videos, cuál es la seña correcta; en un tercer tipo, se le pide reconstruir el orden de los pasos de una seña compuesta por más de un movimiento. Cada día que la persona completa al menos un ejercicio, su racha diaria sube en uno; si deja pasar un día completo sin actividad, la racha se reinicia. Por el lado del equipo del proyecto, alguien con permisos de administrador puede cargar un video nuevo de una seña, asociarlo a un módulo, y marcarlo como validado únicamente después de que una persona sorda o un intérprete certificado lo haya revisado; ese registro de validación queda guardado, no es solo una conversación interna del equipo.

## Modelo de datos

| Entidad | Campos principales | Notas |
|---|---|---|
| Usuario | id, nombre, correo, fecha_registro, racha_actual, racha_maxima | La autenticación (contraseña) la maneja Firebase, no esta tabla. |
| Modulo | id, titulo, descripcion, orden | Orden define en qué secuencia aparecen los módulos al usuario. |
| Seña | id, modulo_id, palabra, video_url, validado_por, fecha_validacion | `validado_por` identifica a la persona sorda o intérprete que validó el contenido; nunca queda vacío antes de publicarse. |
| Ejercicio | id, seña_id, tipo, contenido_json | `tipo` distingue los tres tipos de ejercicio descritos arriba. |
| ProgresoUsuario | usuario_id, ejercicio_id, completado, fecha, intentos | Un registro por intento; permite calcular la racha sin recalcular todo el historial. |

## Endpoints de la API

| Método y ruta | Qué hace |
|---|---|
| GET /api/modulos | Lista los módulos disponibles y su orden. |
| GET /api/modulos/{id}/senas | Lista las señas validadas de un módulo, con su video. |
| GET /api/modulos/{id}/ejercicios | Lista los ejercicios de un módulo, en el formato que la pantalla de lección necesita. |
| POST /api/progreso | Registra que un usuario completó (o intentó) un ejercicio; actualiza la racha si corresponde. |
| GET /api/usuario/racha | Devuelve la racha actual y la racha máxima del usuario autenticado. |
| POST /api/admin/senas | (Solo administrador) Carga una seña nueva, sin marcarla validada todavía. |
| POST /api/admin/senas/{id}/validar | (Solo administrador) Marca una seña como validada, registrando quién la validó. |

## Formato de `contenido_json` por tipo de ejercicio

`contenido_json` es un campo JSON libre en el modelo `Ejercicio`, así que su forma no la impone la base de datos — la fija el frontend (`frontend/src/pages/Leccion.tsx`) al consumirla. Al cargar un ejercicio nuevo (`POST /api/admin/senas`), debe respetar esta forma según `tipo`:

| Tipo | Forma de `contenido_json` | Notas |
|---|---|---|
| `video_a_palabra` | `{ "opciones": ["Hola", "Adiós", ...] }` | Lista de palabras candidatas; debe incluir `palabra` de la seña asociada como una de las opciones. |
| `palabra_a_video` | `{ "opciones": ["https://.../v1.mp4", ...] }` | Lista de URLs de video candidatas; debe incluir `video_url` de la seña asociada como una de las opciones. |
| `orden_pasos` | `{ "pasos": ["paso B", "paso A", ...], "orden_correcto": [1, 0] }` | `pasos` se muestra en el orden dado (ya desordenado); `orden_correcto` son los índices de `pasos` en la secuencia correcta. |

## Pantallas del frontend

Pantalla de registro e inicio de sesión (delegada en gran parte a Firebase Auth, con una interfaz simple encima). Pantalla de inicio, que muestra el módulo disponible y la racha actual de forma visible y motivante. Pantalla de lección, que reproduce el video de la seña y presenta el ejercicio correspondiente, con retroalimentación inmediata (correcto o incorrecto) sin depender de sonido para comunicarla. Pantalla de resumen al terminar un módulo, mostrando cuántas señas se aprendieron. Pantalla de perfil, con la racha actual, la racha máxima y la posibilidad de cerrar sesión.

## Definición de terminado

La Fase 1 se considera terminada cuando el flujo completo —registro, ver un video, resolver los tres tipos de ejercicio, terminar el módulo y ver la racha subir— funciona sin intervención manual del equipo, cuando al menos un módulo tiene todas sus señas validadas por una persona sorda o un intérprete certificado con el registro correspondiente en la base de datos, cuando existen pruebas automatizadas básicas para la lógica de racha y progreso en el backend, cuando la aplicación está desplegada en una URL pública (aunque sea de un nivel gratuito de hosting) y no solo corriendo en la máquina de quien la desarrolló, y cuando al menos dos o tres personas ajenas al equipo de desarrollo la usaron y dejaron algún tipo de retroalimentación, documentada por escrito.

## Evidencia a capturar para la tesis

Capturas de pantalla de cada una de las pantallas principales, el registro de validación de contenido (quién validó qué seña y cuándo), un resumen breve de la prueba de usabilidad con usuarios reales (aunque sea informal), y el enlace de la URL donde quedó desplegada la aplicación. Esta evidencia es exactamente lo que permite, más adelante, mover parte del contenido del capítulo de Recomendaciones de la tesis hacia el capítulo de Resultados, reemplazando una limitación declarada por un hallazgo real.
