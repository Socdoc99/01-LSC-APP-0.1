# Fase 2 · Ecosistema phygital

## Alcance

La Fase 2 conecta, por primera vez, el negocio de productos físicos con la plataforma digital: cada producto (camiseta, mug, gorra, llavero) incluye un código único que la persona puede canjear en la plataforma para desbloquear dos o tres módulos adicionales de contenido, o contenido marcado como premium. Esta fase solo tiene sentido una vez la Fase 1 ya demostró que el flujo de aprendizaje básico funciona; no conviene empezar a vincular productos físicos con una plataforma que todavía no se sabe si funciona bien por sí sola.

## Qué se agrega al modelo de datos

Se agrega una entidad Producto (id, sku, tipo_producto, codigo_canje, usado, usuario_id_canjeo, fecha_canje) que representa cada unidad física vendida y su código asociado. El código de canje debe generarse de forma aleatoria y con suficiente longitud para que no sea adivinable por ensayo y error (por ejemplo, un código alfanumérico de al menos ocho caracteres, evitando caracteres ambiguos como la letra O y el número cero en la misma cadena, ya que el código se imprime físicamente y alguien lo va a transcribir a mano). Un mismo código solo puede canjearse una vez; el intento de canjear un código ya usado debe devolver un mensaje claro y no un error genérico.

## Endpoint nuevo

| Método y ruta | Qué hace |
|---|---|
| POST /api/canjear-codigo | Recibe el código impreso en el producto y, si es válido y no ha sido usado, lo asocia al usuario autenticado y desbloquea el contenido correspondiente. |
| GET /api/admin/productos | (Solo administrador) Lista los códigos emitidos, cuáles se han canjeado y cuándo, como base para las métricas de uso. |

## Consideraciones operativas

La generación de códigos y su impresión en el producto físico es un proceso que involucra al equipo de producción de la marca, no solo al equipo de desarrollo: hay que decidir con tiempo si el código va impreso directamente, en una etiqueta adicional, o mediante un código QR que lleve directo a la pantalla de canje sin que la persona tenga que escribir nada. Esta decisión conviene tomarla antes de cerrar la Fase 2, no durante.

Las métricas de cuántos códigos se emitieron frente a cuántos se canjearon son, en sí mismas, el primer dato de mercado real que el proyecto va a tener sobre el interés efectivo de los compradores en el componente digital, algo que el capítulo de Resultados de la tesis señaló como una hipótesis todavía sin confirmar. Vale la pena guardar esas métricas desde el primer producto vendido con código, no reconstruirlas después de memoria.

## Definición de terminado

La Fase 2 se considera terminada cuando el flujo completo —comprar un producto físico real, encontrar el código, canjearlo en la plataforma y ver el contenido nuevo desbloqueado— se probó de principio a fin con al menos un producto real y una persona real ajena al equipo, y cuando existe un panel simple (puede ser tan sencillo como una vista de administración dentro del propio backend de Django) donde el equipo puede ver cuántos códigos se han emitido y cuántos canjeado.
