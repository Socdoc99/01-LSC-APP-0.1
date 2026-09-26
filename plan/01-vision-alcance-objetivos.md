# Visión, alcance y objetivos del componente tecnológico

## Visión

La plataforma de aprendizaje de LSC existe para que cada producto físico de LOVE UN IDIOMA UNIVERSAL deje de ser solo un objeto con un diseño bonito y se convierta en la puerta de entrada a una experiencia de aprendizaje real de la Lengua de Señas Colombiana. La persona compra una camiseta o una taza, encuentra un código en ella, lo canjea en la plataforma y a partir de ahí aprende señas reales, grabadas y validadas por personas sordas o intérpretes certificados. El negocio de productos personalizados y el negocio de la plataforma digital no compiten entre sí: se sostienen mutuamente, tal como quedó planteado en el modelo de negocio de la tesis (Anexo C, lienzo de los nueve bloques).

## Alcance general

Está dentro del alcance de este desarrollo: un sitio web responsivo (funciona igual de bien en computador y en celular, sin necesitar instalación) con un diccionario de señas en video, lecciones organizadas por módulos temáticos, ejercicios de práctica, una racha diaria que motiva a volver, y —a partir de la Fase 2— el canje de un código impreso en un producto físico para desbloquear contenido. También está dentro del alcance, más adelante, empaquetar esa misma aplicación como app nativa de Android y iPhone sin reescribirla desde cero, gracias a Capacitor.

Está fuera del alcance, al menos por ahora: desarrollar una aplicación nativa desde el inicio (se decidió explícitamente evitarlo para no duplicar esfuerzo de desarrollo antes de validar la idea), construir una pasarela de pagos propia para la tienda de productos físicos (eso puede resolverse con soluciones ya existentes y no es el foco tecnológico de la tesis), y construir herramientas de traducción automática de LSC por computador, que es un problema de investigación en sí mismo y no lo que este proyecto se propuso resolver.

## Relación con los objetivos de la tesis

El objetivo general de la tesis es evaluar la viabilidad de crear una marca de productos personalizados inspirados en la LSC como alternativa de emprendimiento para una persona sorda. El componente tecnológico no reemplaza esa evaluación: la complementa, porque agrega una segunda fuente de valor e ingresos que hace al negocio menos dependiente de la venta física únicamente, algo que el propio documento de tesis identifica en el capítulo de Resultados (numeral 3.7, Impacto) como un factor de resiliencia del emprendimiento, aunque todavía sin datos reales que lo confirmen.

De los objetivos específicos de la tesis, este desarrollo aporta evidencia directa al que evalúa las condiciones comerciales y económicas de la propuesta: cada fase completada y probada con usuarios reales es, literalmente, el dato primario que el capítulo de Recomendaciones de la tesis identificó como pendiente. Por eso vale la pena, cada vez que una fase quede funcionando con usuarios reales, volver al documento de tesis y mover esa evidencia del capítulo de Recomendaciones al de Resultados.

## Criterios de éxito por fase

No se espera que las cuatro fases se completen con el mismo nivel de exigencia ni en el mismo tiempo; cada una tiene un criterio de éxito distinto, coherente con la hoja de ruta ya presentada en la tesis (Tabla 2, capítulo 3.6).

| Fase | Qué demuestra si tiene éxito |
|---|---|
| Fase 1 · MVP | Que una persona puede aprender de principio a fin un módulo temático completo por su cuenta, sin ayuda, en un sitio web funcional. |
| Fase 2 · Ecosistema phygital | Que el vínculo entre un producto físico real y la plataforma digital funciona y una persona real lo usó después de comprar un producto. |
| Fase 3 · Comunidad y alianzas | Que la plataforma retiene usuarios más allá del interés inicial, gracias a la interacción social o a una alianza institucional. |
| Fase 4 · Empaquetado nativo | Que el mismo producto puede llegar a tiendas de aplicaciones sin haber duplicado el esfuerzo de desarrollo. |

Ninguna fase se considera exitosa solo porque el código "corre en local". El criterio siempre involucra que alguien fuera del equipo de desarrollo la haya usado, para que el resultado sea información real y no una suposición más.
