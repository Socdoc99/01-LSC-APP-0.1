# Arquitectura y stack técnico

## Decisión de fondo: web primero, nativo después

Se descartó desarrollar una aplicación nativa (Android/iOS) desde el principio porque hubiera duplicado el trabajo de frontend en dos códigos distintos antes de saber siquiera si la idea funciona con usuarios reales. En su lugar, se eligió un stack híbrido: una única aplicación web, construida de forma responsiva, que funciona en el navegador de un computador o un celular sin instalación, y que más adelante —en la Fase 4— puede empaquetarse como app nativa para Android y iPhone sin reescribir la lógica de la aplicación, usando Capacitor. Esta decisión ya está documentada en el capítulo 1 de la tesis y aquí simplemente se traduce en la arquitectura concreta.

## Piezas del sistema

El frontend está construido con Ionic Framework sobre React. Ionic aporta componentes de interfaz ya pensados para verse bien tanto en web como dentro de un contenedor nativo más adelante, y React aporta un ecosistema amplio y bien documentado para construir la lógica de las pantallas. El backend está construido con Django y Django REST Framework, que exponen una API en formato JSON consumida por el frontend, con PostgreSQL como base de datos relacional para todo el contenido y el progreso de los usuarios. Firebase se usa exclusivamente para autenticación de usuarios (registro e inicio de sesión) y para notificaciones push más adelante; no se usa como base de datos principal, para evitar tener la información repartida entre dos sistemas distintos sin necesidad. Los videos de señas se almacenan en un servicio de almacenamiento de archivos (puede ser Firebase Storage, o un bucket compatible con S3 si más adelante conviene por costo), y la base de datos solo guarda la referencia (URL) a cada video, nunca el archivo en sí. n8n se reserva para automatizaciones que no son parte del flujo principal de la aplicación, como el envío de un recordatorio cuando un usuario está a punto de perder su racha diaria, o avisar al equipo de contenido cuando una seña nueva queda pendiente de validación.

| Componente | Tecnología | Rol |
|---|---|---|
| Interfaz de usuario | Ionic Framework + React | Frontend web responsivo; mismo código reutilizable en una futura versión nativa. |
| Backend y API | Django + Django REST Framework | Lógica de negocio, reglas de progreso y racha, exposición de datos vía API. |
| Base de datos | PostgreSQL | Usuarios, módulos, señas, ejercicios, progreso, códigos de canje. |
| Autenticación y notificaciones | Firebase Auth / Firebase Cloud Messaging | Registro, inicio de sesión y avisos push; no almacena el contenido de la app. |
| Almacenamiento de video | Firebase Storage (o equivalente S3) | Archivos de video de las señas; la base de datos solo guarda la referencia. |
| Automatización de procesos | n8n | Recordatorios, avisos internos de validación de contenido, tareas programadas. |
| Empaquetado nativo (Fase 4) | Capacitor | Publica el mismo código web como app de Android y iOS. |

## Estructura de carpetas del repositorio

Se recomienda un único repositorio (monorepo) con el frontend y el backend como carpetas hermanas, y esta misma carpeta de planeación versionada junto con el código, para que la documentación nunca quede desactualizada respecto al proyecto real.

```
Desarrollo AP LSC/
  CLAUDE.md
  plan/
    00-indice-y-como-trabajar.md
    01-vision-alcance-objetivos.md
    02-arquitectura-y-stack-tecnico.md
    03-fase-1-mvp.md
    04-fase-2-ecosistema-phygital.md
    05-fase-3-comunidad-y-alianzas.md
    06-fase-4-empaquetado-nativo.md
    07-accesibilidad-privacidad-etica.md
    08-pruebas-calidad-evidencia-tesis.md
    bitacora-de-avance.md
  frontend/           (proyecto Ionic + React)
  backend/            (proyecto Django)
  .gitignore
```

## Entornos y puesta en marcha local

Para trabajar en Windows conviene instalar Node.js (versión LTS), Python 3.11 o superior, PostgreSQL (o usar Docker para no instalarlo directamente sobre Windows), y Git. El backend y el frontend se ejecutan como dos procesos separados durante el desarrollo local: el backend expone la API en un puerto (por ejemplo, `localhost:8000`) y el frontend consume esa API desde otro puerto (por ejemplo, `localhost:5173` o el que use Ionic), configurado mediante una variable de entorno que apunte a la URL del backend. Ninguna credencial real —ni la de la base de datos, ni las claves de Firebase— se escribe directamente en el código: todas viven en un archivo `.env` local, que se agrega a `.gitignore` desde el primer commit del proyecto para que nunca llegue a subirse al repositorio por accidente.

Para el despliegue, cuando llegue el momento de que alguien externo al equipo pruebe la plataforma (requisito de éxito de todas las fases, según el documento de visión y alcance), conviene usar servicios con un nivel gratuito o de bajo costo acorde con un proyecto de grado: por ejemplo, Vercel o Netlify para el frontend, y Render o Railway para el backend junto con la base de datos PostgreSQL. La elección exacta de proveedor no es una decisión que deba tomarse ahora; alcanza con confirmarla al llegar al final de la Fase 1, cuando haya algo real que desplegar.

## Convenciones de código

Los commits se escriben en español y en minúscula, con el formato `fase<n>: descripción breve en presente`, por ejemplo `fase1: agrega endpoint de progreso de usuario`. Las ramas se nombran `fase<n>/nombre-de-la-funcionalidad`. El código en sí (nombres de variables, funciones y clases) puede escribirse en español o en inglés según lo que el equipo decida, pero debe mantenerse consistente dentro de cada proyecto (frontend y backend) una vez elegido, para no mezclar los dos idiomas en el mismo archivo.
