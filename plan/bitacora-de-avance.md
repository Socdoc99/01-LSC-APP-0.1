# Bitácora de avance — LOVE UN IDIOMA UNIVERSAL

Registro cronológico del avance real del desarrollo, sesión por sesión. Es evidencia
directa para los anexos del documento de tesis: solo se anota lo que efectivamente se
implementó y se probó, con su resultado; lo que queda pendiente se deja explícito en
vez de omitirse.

## 2026-09-26

Se construyó la base de la Fase 1 (MVP): estructura inicial del proyecto (Django +
DRF en el backend, Ionic/React en el frontend), los modelos de datos (`Usuario`,
`Modulo`, `Sena`, `Ejercicio`, `ProgresoUsuario`), los endpoints de la API y la
autenticación vía Firebase (verificación de ID token en el backend). Se agregaron 9
pruebas automatizadas de racha, progreso y validación de señas, y se fusionaron a
`main`. Se construyeron las 5 pantallas del frontend (Login, Inicio, Lección, Resumen,
Perfil) con rutas protegidas.

**Probado:** las 9 pruebas automatizadas del backend pasan (`python manage.py test
aprendizaje`). El frontend compila sin errores de TypeScript y pasa su prueba unitaria
existente (`npx vitest run`). No se probó el frontend en un navegador real en esta
sesión.

**Pendiente:** conectar un proyecto real de Firebase (hasta este punto no existía) y
verificar el flujo completo en el navegador.

## 2026-09-27

Se conectó el proyecto real de Firebase (`lsc-2bfd8`): se configuraron las
credenciales del frontend (`VITE_FIREBASE_*`) y la cuenta de servicio del backend
(`FIREBASE_SERVICE_ACCOUNT_KEY_PATH`). Se cargó un módulo piloto de prueba en la base
de datos ("Saludos y presentación personal", 5 señas, 5 ejercicios de los 3 tipos:
video→palabra, palabra→video, orden de pasos) — marcado explícitamente en
`validado_por` como dato de prueba sin validar, para no violar la regla de que ningún
contenido se publica sin validación real por una persona sorda o intérprete
certificado.

**Probado en el navegador real:** registro de un usuario nuevo con correo/contraseña
vía Firebase Auth (funcionó); redirección automática a `/inicio` tras autenticarse;
la pantalla de Inicio cargando racha y módulo desde el backend real; la pantalla de
Perfil mostrando el correo y las rachas del usuario autenticado. En el camino se
encontraron y corrigieron dos bugs de configuración (no de código): `CORS` apuntaba al
puerto equivocado del frontend, y faltaba la cuenta de servicio de Firebase en el
backend.

**No probado:** las pantallas de Lección y Resumen no se verificaron visualmente — la
extensión de automatización del navegador usada en estas sesiones bloquea las
llamadas de red que la página intenta hacer hacia el backend en otro puerto, y esa
limitación se repitió en un intento posterior. Tampoco hay retroalimentación de
usuarios reales todavía; eso no ha ocurrido en ninguna sesión.

## 2026-09-29

Se recuperó `CLAUDE.md` (se había borrado por accidente fuera de esta conversación).
Se documentó en `plan/02-arquitectura-y-stack-tecnico.md` que esta máquina de
desarrollo tiene dos instancias de PostgreSQL compitiendo por el puerto 5432 (un
servicio nativo de Windows y un contenedor Docker huérfano) y cuál es la que el
backend usa realmente, para que no vuelva a causar confusión. Se reinició el entorno
local (backend y frontend) y se confirmó que los datos del módulo piloto cargados el
27 de septiembre siguen intactos.

**Probado:** disponibilidad del backend y el frontend (`curl` a ambos responde 200) y
que `GET /api/modulos` sigue devolviendo el módulo piloto.

**No probado:** se intentó de nuevo verificar Lección/Resumen en el navegador; la
extensión de automatización no logró conectarse en esta sesión, así que sigue sin
verificarse visualmente.

**Pendiente para la próxima sesión:** validación real de contenido por una persona
sorda o intérprete certificado; verificación visual de Lección/Resumen (manual, por
el usuario, o en un entorno donde la extensión de automatización funcione);
despliegue en una URL pública; retroalimentación de 2–3 personas ajenas al equipo,
documentada por escrito.
