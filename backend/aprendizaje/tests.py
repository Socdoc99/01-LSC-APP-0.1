from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from .models import Ejercicio, Modulo, ProgresoUsuario, Sena, Usuario
from .views import _actualizar_racha


def crear_usuario(**kwargs):
    datos = {
        'firebase_uid': 'uid-test',
        'nombre': 'Persona de prueba',
        'correo': 'persona@example.com',
    }
    datos.update(kwargs)
    return Usuario.objects.create(**datos)


def crear_ejercicio(validado=True):
    modulo = Modulo.objects.create(titulo='Saludos', descripcion='Saludos básicos', orden=1)
    sena = Sena.objects.create(
        modulo=modulo,
        palabra='Hola',
        video_url='https://example.com/hola.mp4',
        validado_por='Interprete certificado' if validado else None,
        fecha_validacion=timezone.now() if validado else None,
    )
    return Ejercicio.objects.create(
        sena=sena, tipo=Ejercicio.Tipo.VIDEO_A_PALABRA, contenido_json={'opciones': ['Hola', 'Adiós']}
    )


def registrar_progreso(usuario, ejercicio, fecha):
    """Crea un ProgresoUsuario completado con `fecha` forzada (auto_now_add ignora
    el valor en create, así que se actualiza aparte con un UPDATE directo)."""
    progreso = ProgresoUsuario.objects.create(usuario=usuario, ejercicio=ejercicio, completado=True)
    ProgresoUsuario.objects.filter(pk=progreso.pk).update(fecha=fecha)
    progreso.refresh_from_db()
    return progreso


class ActualizarRachaTests(APITestCase):
    """Lógica de racha: sube un día consecutivo, se reinicia si hay un hueco,
    no cambia si ya se contó hoy, y racha_maxima nunca baja.

    Usa un mediodía fijo como ancla (en vez de timezone.now()) para que las
    comparaciones de "mismo día" no dependan de qué tan cerca de la
    medianoche corra la suite."""

    ANCLA = timezone.make_aware(timezone.datetime(2026, 6, 15, 12, 0, 0))

    def setUp(self):
        self.usuario = crear_usuario()
        self.ejercicio = crear_ejercicio()

    def test_primer_progreso_deja_racha_en_uno(self):
        progreso = registrar_progreso(self.usuario, self.ejercicio, self.ANCLA)
        _actualizar_racha(self.usuario, progreso)
        self.assertEqual(self.usuario.racha_actual, 1)
        self.assertEqual(self.usuario.racha_maxima, 1)

    def test_dia_consecutivo_sube_la_racha(self):
        registrar_progreso(self.usuario, self.ejercicio, self.ANCLA - timedelta(days=1))
        self.usuario.racha_actual = 1
        self.usuario.racha_maxima = 1
        self.usuario.save()

        progreso_hoy = registrar_progreso(self.usuario, self.ejercicio, self.ANCLA)
        _actualizar_racha(self.usuario, progreso_hoy)

        self.assertEqual(self.usuario.racha_actual, 2)
        self.assertEqual(self.usuario.racha_maxima, 2)

    def test_hueco_de_mas_de_un_dia_reinicia_la_racha(self):
        registrar_progreso(self.usuario, self.ejercicio, self.ANCLA - timedelta(days=3))
        self.usuario.racha_actual = 5
        self.usuario.racha_maxima = 5
        self.usuario.save()

        progreso_hoy = registrar_progreso(self.usuario, self.ejercicio, self.ANCLA)
        _actualizar_racha(self.usuario, progreso_hoy)

        self.assertEqual(self.usuario.racha_actual, 1)
        self.assertEqual(self.usuario.racha_maxima, 5)

    def test_segundo_progreso_el_mismo_dia_no_cambia_la_racha(self):
        registrar_progreso(self.usuario, self.ejercicio, self.ANCLA - timedelta(hours=1))
        self.usuario.racha_actual = 1
        self.usuario.racha_maxima = 1
        self.usuario.save()

        progreso_hoy = registrar_progreso(self.usuario, self.ejercicio, self.ANCLA)
        _actualizar_racha(self.usuario, progreso_hoy)

        self.assertEqual(self.usuario.racha_actual, 1)
        self.assertEqual(self.usuario.racha_maxima, 1)


class ProgresoAPITests(APITestCase):
    """POST /api/progreso registra el intento y solo mueve la racha cuando completado=True."""

    def setUp(self):
        self.usuario = crear_usuario()
        self.ejercicio = crear_ejercicio()
        self.client.force_authenticate(user=self.usuario)

    def test_progreso_completado_sube_la_racha(self):
        respuesta = self.client.post(
            '/api/progreso', {'ejercicio': self.ejercicio.id, 'completado': True, 'intentos': 1}
        )
        self.assertEqual(respuesta.status_code, 201)
        self.usuario.refresh_from_db()
        self.assertEqual(self.usuario.racha_actual, 1)
        self.assertEqual(self.usuario.racha_maxima, 1)

    def test_progreso_no_completado_no_cambia_la_racha(self):
        respuesta = self.client.post(
            '/api/progreso', {'ejercicio': self.ejercicio.id, 'completado': False, 'intentos': 1}
        )
        self.assertEqual(respuesta.status_code, 201)
        self.usuario.refresh_from_db()
        self.assertEqual(self.usuario.racha_actual, 0)
        self.assertEqual(self.usuario.racha_maxima, 0)

    def test_endpoint_de_racha_devuelve_los_valores_del_usuario_autenticado(self):
        self.usuario.racha_actual = 3
        self.usuario.racha_maxima = 7
        self.usuario.save()

        respuesta = self.client.get('/api/usuario/racha')

        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data['racha_actual'], 3)
        self.assertEqual(respuesta.data['racha_maxima'], 7)


class AdminValidarSenaAPITests(APITestCase):
    """POST /api/admin/senas/{id}/validar solo funciona para administradores y deja
    registro de quién validó, tal como exige el no-negociable de validación de contenido."""

    def setUp(self):
        modulo = Modulo.objects.create(titulo='Saludos', descripcion='Saludos básicos', orden=1)
        self.sena = Sena.objects.create(
            modulo=modulo, palabra='Gracias', video_url='https://example.com/gracias.mp4'
        )
        self.usuario = crear_usuario()

    def test_administrador_puede_validar_una_sena(self):
        self.client.force_authenticate(user=self.usuario, token={'admin': True})

        respuesta = self.client.post(
            f'/api/admin/senas/{self.sena.id}/validar', {'validado_por': 'Interprete certificado'}
        )

        self.assertEqual(respuesta.status_code, 200)
        self.sena.refresh_from_db()
        self.assertEqual(self.sena.validado_por, 'Interprete certificado')
        self.assertIsNotNone(self.sena.fecha_validacion)

    def test_usuario_sin_permiso_de_administrador_no_puede_validar(self):
        self.client.force_authenticate(user=self.usuario, token={'admin': False})

        respuesta = self.client.post(
            f'/api/admin/senas/{self.sena.id}/validar', {'validado_por': 'Interprete certificado'}
        )

        self.assertEqual(respuesta.status_code, 403)
        self.sena.refresh_from_db()
        self.assertIsNone(self.sena.validado_por)
