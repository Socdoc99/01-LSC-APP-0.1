# LOVE UN IDIOMA UNIVERSAL — Plataforma de aprendizaje de LSC

Este archivo es la memoria de proyecto para Claude Code. Léelo al abrir esta carpeta antes de tocar código, y mantenlo actualizado cuando cambie el stack, la fase activa o una convención.

## Qué es este proyecto

LOVE UN IDIOMA UNIVERSAL es el proyecto de grado de Sandra Patricia Montoya Martínez, Santiago Ospina Calle y Cristian David Guayabo Vizcaya (Universidad Tecnológica de Pereira, Tecnología de Desarrollo de Software). Es una marca de productos personalizados inspirados en la Lengua de Señas Colombiana (LSC) y la cultura sorda, que se está ampliando con una plataforma web de aprendizaje de LSC de estilo Duolingo, vinculada a los productos físicos mediante un código de canje ("experiencia phygital").

Esta carpeta contiene el desarrollo de ese componente tecnológico. El documento de tesis completo (con el planteamiento del problema, marco teórico, marco legal y el diagnóstico de mercado) vive fuera de este repositorio; aquí solo se construye el software.

## Cómo está organizado el trabajo

El desarrollo está dividido en cuatro fases, documentadas una por una dentro de `plan/`, para poder trabajar con Claude Code sin saturar el contexto de una sesión con todo el proyecto de una vez:

- `plan/00-indice-y-como-trabajar.md` — cómo usar estos documentos día a día.
- `plan/01-vision-alcance-objetivos.md` — qué se está construyendo y por qué, ligado a los objetivos de la tesis.
- `plan/02-arquitectura-y-stack-tecnico.md` — stack, estructura de carpetas, entornos.
- `plan/03-fase-1-mvp.md` — módulo piloto, sin tienda ni funciones sociales.
- `plan/04-fase-2-ecosistema-phygital.md` — canje de código físico-digital.
- `plan/05-fase-3-comunidad-y-alianzas.md` — funciones sociales y alianzas institucionales.
- `plan/06-fase-4-empaquetado-nativo.md` — Capacitor, Google Play y App Store.
- `plan/07-accesibilidad-privacidad-etica.md` — no negociables transversales a todas las fases.
- `plan/08-pruebas-calidad-evidencia-tesis.md` — cómo probar el software y cómo esa evidencia alimenta de vuelta la tesis.

**Fase activa: Fase 1 (MVP).** Actualiza esta línea manualmente cuando se cierre una fase y se abra la siguiente.

## Stack técnico (resumen — el detalle justificado está en `plan/02-arquitectura-y-stack-tecnico.md`)

Frontend: Ionic Framework + React (responsivo, web-first). Backend: Django + Django REST Framework + PostgreSQL. Autenticación y notificaciones: Firebase. Empaquetado nativo futuro: Capacitor, sin reescribir código. Automatizaciones: n8n.

## No negociables (ver detalle en `plan/07-accesibilidad-privacidad-etica.md`)

Ninguna funcionalidad puede depender únicamente de una señal sonora, porque el público principal incluye personas sordas. Ningún contenido en LSC se publica sin haber sido grabado o validado por una persona sorda o un intérprete certificado, y esa validación queda registrada en la base de datos, no solo en la memoria del equipo. El tratamiento de datos personales sigue la Ley Estatutaria 1581 de 2012 (habeas data), ya citada en el marco legal de la tesis. No se inventan datos, métricas de uso ni resultados de pruebas: si algo no se ha medido todavía, se documenta como pendiente.

## Convenciones de trabajo

Commits en español, en formato breve tipo `fase1: agrega modelo de progreso de usuario`. Ramas por fase y funcionalidad, por ejemplo `fase1/diccionario-de-señas`. Nunca se sube al repositorio una clave o credencial real; todo secreto vive en un `.env` local que está en `.gitignore`. Cuando una fase se dé por cerrada, se anota la fecha y el resultado en `plan/bitacora-de-avance.md` (se crea la primera vez que haga falta) — esa bitácora es evidencia directa para los anexos de la tesis.

## Cómo pedirle trabajo a Claude Code en este proyecto

Es mejor pedir una sola cosa concreta de una sola fase por conversación, referenciando el archivo correspondiente en `plan/`, en vez de pedir "haz toda la Fase 1" de una vez. Por ejemplo: "lee plan/03-fase-1-mvp.md, sección de modelo de datos, y crea los modelos de Django para Usuario, Modulo, Seña y ProgresoUsuario". Eso evita respuestas genéricas y mantiene el contexto enfocado en lo que realmente se va a construir en esa sesión.
