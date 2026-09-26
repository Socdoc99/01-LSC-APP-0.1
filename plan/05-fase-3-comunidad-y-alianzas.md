# Fase 3 · Comunidad y alianzas institucionales

## Alcance

La Fase 3 busca que la plataforma retenga usuarios más allá de la curiosidad inicial, agregando un componente social y abriendo la puerta a que una institución educativa (un colegio, una universidad, una academia de idiomas) adopte la plataforma para un grupo completo de estudiantes. Esta fase asume que las Fases 1 y 2 ya están funcionando con usuarios reales; construir funciones sociales sobre una base de aprendizaje que todavía no se ha validado sería invertir esfuerzo en el lugar equivocado.

## Componente social

Se agrega la posibilidad de que un usuario vea, de forma opcional y solo si decide compartirlo, su racha y su progreso frente a un grupo pequeño de personas (amigos que también usan la plataforma, o compañeros de un mismo grupo institucional). Este componente debe ser estrictamente opt-in: nadie queda expuesto a que su progreso sea visible para otros sin haberlo decidido explícitamente, tanto por una buena práctica de producto como por lo que exige la Ley 1581 de 2012 sobre tratamiento de datos personales, ya citada en el marco legal de la tesis.

## Componente institucional

Se agrega la posibilidad de que una institución aliada reciba un código de grupo que sus estudiantes usan al registrarse, quedando asociados a esa institución. La institución obtiene acceso a un panel con el progreso agregado del grupo (por ejemplo, cuántos estudiantes completaron cada módulo), pero no al detalle individual de cada estudiante sin su consentimiento explícito, siguiendo el mismo principio de minimización de datos que el componente social.

## Modelo de datos adicional

Se agrega una entidad Institucion (id, nombre, codigo_grupo) y una relación entre Usuario e Institucion a través del código de grupo usado al registrarse. El panel institucional se construye a partir de consultas agregadas sobre ProgresoUsuario filtradas por institución, sin crear una copia separada de los datos de progreso.

## Definición de terminado

La Fase 3 se considera terminada cuando al menos una alianza institucional piloto está funcionando con un grupo real de estudiantes usando la plataforma con su propio código de grupo, y cuando el componente social opcional está siendo usado por al menos un grupo de usuarios reales que decidieron activarlo, no solo probado internamente por el equipo de desarrollo.
