# Índice y cómo trabajar con estos documentos

Este conjunto de documentos es el plan de desarrollo del componente tecnológico de LOVE UN IDIOMA UNIVERSAL: la plataforma web de aprendizaje de LSC. Está dividido en partes pequeñas a propósito, para que cada sesión de trabajo con Claude Code se concentre en una sola cosa y no se pierda en un documento enorme con todo el proyecto mezclado.

El orden recomendado de lectura, la primera vez, es: primero `01-vision-alcance-objetivos.md` para entender qué se está construyendo y por qué; luego `02-arquitectura-y-stack-tecnico.md` para dejar montado el proyecto; y después, una por una, las cuatro fases (`03` a `06`), en orden, sin saltarse ninguna aunque parezca tentador adelantarse a la parte más vistosa. Los documentos `07` y `08` no son una fase más: son criterios que aplican a las cuatro fases por igual, y conviene tenerlos presentes desde la Fase 1, no agregarlos al final.

## Método de trabajo sugerido

Cada fase está descrita con su alcance, las historias de usuario que la componen, el modelo de datos que necesita, los endpoints de la API, las pantallas del frontend y una definición clara de cuándo esa fase se puede dar por terminada. Esa definición de terminado no es un formalismo: es lo que en la tesis permite decir, con evidencia, que una fase del desarrollo tecnológico quedó completa.

Al trabajar con Claude Code en esta carpeta, conviene abrir una conversación por tarea concreta y decirle explícitamente qué archivo leer y qué parte de ese archivo abordar, en lugar de pedir que implemente una fase completa de una sola vez. Una fase completa son varios días de trabajo real; pedirla entera en un solo turno produce código genérico y difícil de revisar. Es preferible ir tarea por tarea: primero los modelos de datos, después los endpoints que los usan, después las pantallas que consumen esos endpoints, y al final las pruebas de esa pieza específica.

## Seguimiento del avance

Cuando se complete una tarea, una funcionalidad o una fase entera, vale la pena anotarlo en `bitacora-de-avance.md` dentro de esta misma carpeta `plan/` (no existe todavía; se crea la primera vez que haga falta, con una línea por fecha: qué se hizo, qué se probó y qué quedó pendiente). Esa bitácora cumple dos funciones a la vez: sirve como memoria de proyecto para retomar el trabajo después de una pausa, y es evidencia directa y verificable para los anexos del documento de tesis, algo que el capítulo de Recomendaciones del documento actual señala como pendiente.

## Qué no está en estos documentos

Estos documentos no repiten el planteamiento del problema, el marco teórico ni el marco legal completos: esos ya están desarrollados en el documento de tesis (capítulos 1 y 2). Aquí solo se retoman las partes de esos capítulos que tienen una implicación técnica directa, como la Ley 1581 de 2012 sobre datos personales o el compromiso de remunerar a las personas sordas que validan el contenido. Si en algún momento el desarrollo real genera evidencia que contradice o actualiza algo del documento de tesis (por ejemplo, una prueba de usabilidad real con usuarios sordos), eso debe volver al documento de tesis, no quedarse solo aquí.
