# Pruebas, calidad y evidencia para la tesis

## Estrategia de pruebas

En el backend, la lógica que más vale la pena cubrir con pruebas automatizadas es la de progreso y racha (que un ejercicio completado efectivamente suba la racha, que un día sin actividad efectivamente la reinicie, que un código de canje usado no pueda volver a usarse), porque son reglas de negocio con casos borde fáciles de romper sin darse cuenta al modificar el código más adelante. En el frontend, conviene priorizar pruebas de los componentes que manejan la lógica de un ejercicio (que se marque correcto o incorrecto según corresponda) por encima de pruebas puramente visuales. Antes de dar por cerrada cualquier fase, además de las pruebas automatizadas, hace falta una prueba manual del flujo completo de principio a fin, hecha por alguien del equipo simulando ser un usuario nuevo.

## Pruebas de usabilidad con usuarios reales

Ninguna fase se da por terminada solo porque el equipo de desarrollo la probó internamente; cada definición de terminado, en los documentos de cada fase, exige que personas ajenas al equipo la hayan usado. Siempre que sea posible, esas pruebas deben incluir a personas sordas o usuarias de LSC, no solo a personas oyentes, porque son quienes mejor pueden evaluar si el contenido y la interfaz realmente cumplen su propósito. Cada prueba de usabilidad debe documentarse con la fecha, quién participó (con su consentimiento para que esa información se use como evidencia), qué se les pidió hacer, y qué observó el equipo, sin maquillar los resultados negativos: un problema encontrado en una prueba de usabilidad es información valiosa tanto para el desarrollo como para la tesis, no algo que ocultar.

## De la evidencia técnica a la tesis

El documento de tesis, en su capítulo de Resultados, está hoy construido como un diagnóstico documental porque todavía no existían datos primarios reales. Cada fase de este desarrollo que se complete con usuarios reales genera exactamente el tipo de dato primario que ese capítulo señaló como pendiente: una prueba de usabilidad real, una métrica real de códigos canjeados, una alianza institucional real. Cuando eso ocurra, vale la pena volver al documento de tesis y mover esa evidencia del capítulo de Recomendaciones (donde hoy se dice qué falta por hacer) al capítulo de Resultados (donde se reportaría como un hallazgo ya confirmado), en lugar de dejar el documento de tesis desactualizado frente al estado real del proyecto.

## Bitácora de avance

Se recomienda mantener un archivo `plan/bitacora-de-avance.md`, con una entrada por fecha relevante, indicando qué se implementó, qué se probó, con quién, y qué quedó pendiente. No hace falta crearlo de antemano vacío: se crea la primera vez que haya algo real que registrar. Con el tiempo, esa bitácora se convierte en la fuente más confiable para escribir tanto el avance real del desarrollo como la sección de anexos del documento de tesis, sin depender de la memoria del equipo meses después.
