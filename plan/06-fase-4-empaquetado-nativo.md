# Fase 4 · Empaquetado nativo

## Alcance

La Fase 4 toma la misma aplicación web construida en las fases anteriores y la empaqueta como aplicación nativa de Android y iPhone usando Capacitor, sin reescribir la lógica de la aplicación desde cero. Esta es la fase que justifica, en retrospectiva, la decisión tomada desde el principio de construir con Ionic en lugar de con un framework puramente web: el mismo código que ya funciona en el navegador queda listo para envolverse en un contenedor nativo.

## Qué cambia y qué no cambia

No cambia la lógica de negocio, los endpoints de la API ni el modelo de datos: todo eso ya está resuelto en las fases anteriores. Lo que cambia es la capa de presentación en detalles específicos de cada plataforma: notificaciones push nativas (usando Firebase Cloud Messaging, ya elegido desde la Fase 1 para autenticación, lo que evita introducir un proveedor nuevo solo para esto), ajustes de gestos táctiles propios de una app instalada frente a una página web, y el ícono y la pantalla de carga de la aplicación.

## Publicación

Publicar en Google Play requiere una cuenta de desarrollador de Google (pago único) y completar la ficha de la aplicación en la consola de Play. Publicar en la App Store de Apple requiere una cuenta de desarrollador de Apple (pago anual) y, en general, una Mac para compilar la versión de iOS, o un servicio de compilación en la nube como Codemagic o Expo Application Services si el equipo no cuenta con una Mac propia; esto conviene decidirlo con tiempo, porque cambia el presupuesto y el cronograma de esta fase de forma importante frente a la publicación en Android. Dado el contexto de un proyecto de grado con presupuesto limitado, es razonable priorizar Google Play primero y dejar la App Store como una meta posterior, sin que eso signifique abandonar el objetivo de estar en ambas tiendas.

## Definición de terminado

La Fase 4 se considera terminada cuando la aplicación está publicada y disponible públicamente en al menos Google Play, construida a partir del mismo código base de la aplicación web, sin una segunda base de código paralela que haya que mantener por separado.
