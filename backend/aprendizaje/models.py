from django.db import models


class Usuario(models.Model):
    """Perfil de aprendizaje del usuario. La autenticación (contraseña) la maneja
    Firebase Auth; firebase_uid es el vínculo con esa identidad, no hay contraseña aquí."""

    firebase_uid = models.CharField(max_length=128, unique=True)
    nombre = models.CharField(max_length=150)
    correo = models.EmailField(unique=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    racha_actual = models.PositiveIntegerField(default=0)
    racha_maxima = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return self.nombre


class Modulo(models.Model):
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    orden = models.PositiveIntegerField(unique=True)

    class Meta:
        verbose_name = "Módulo"
        verbose_name_plural = "Módulos"
        ordering = ["orden"]

    def __str__(self):
        return self.titulo


class Sena(models.Model):
    """Una seña (palabra) validada o pendiente de validar dentro de un módulo."""

    modulo = models.ForeignKey(Modulo, on_delete=models.CASCADE, related_name="senas")
    palabra = models.CharField(max_length=150)
    video_url = models.URLField()
    validado_por = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="Nombre de la persona sorda o intérprete certificado que validó esta seña.",
    )
    fecha_validacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Seña"
        verbose_name_plural = "Señas"

    def __str__(self):
        return self.palabra

    @property
    def esta_validada(self):
        return bool(self.validado_por)


class Ejercicio(models.Model):
    class Tipo(models.TextChoices):
        VIDEO_A_PALABRA = "video_a_palabra", "Ver video, elegir palabra"
        PALABRA_A_VIDEO = "palabra_a_video", "Ver palabra, elegir video"
        ORDEN_PASOS = "orden_pasos", "Reconstruir orden de los pasos"

    sena = models.ForeignKey(Sena, on_delete=models.CASCADE, related_name="ejercicios")
    tipo = models.CharField(max_length=20, choices=Tipo.choices)
    contenido_json = models.JSONField()

    class Meta:
        verbose_name = "Ejercicio"
        verbose_name_plural = "Ejercicios"

    def __str__(self):
        return f"{self.get_tipo_display()} · {self.sena.palabra}"


class ProgresoUsuario(models.Model):
    """Un registro por intento; permite calcular la racha sin recalcular todo el historial."""

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="progresos")
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE, related_name="progresos")
    completado = models.BooleanField(default=False)
    fecha = models.DateTimeField(auto_now_add=True)
    intentos = models.PositiveIntegerField(default=1)

    class Meta:
        verbose_name = "Progreso de usuario"
        verbose_name_plural = "Progresos de usuario"
        ordering = ["-fecha"]

    def __str__(self):
        return f"{self.usuario.nombre} · {self.ejercicio} · {'ok' if self.completado else 'pendiente'}"
