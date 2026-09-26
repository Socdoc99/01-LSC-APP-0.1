from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ejercicio, Modulo, ProgresoUsuario, Sena
from .permissions import EsAdministrador
from .serializers import (
    EjercicioSerializer,
    ModuloSerializer,
    ProgresoUsuarioSerializer,
    RachaSerializer,
    SenaCrearSerializer,
    SenaSerializer,
    SenaValidarSerializer,
)


class ModuloListView(generics.ListAPIView):
    """GET /api/modulos — lista los módulos disponibles y su orden."""

    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer
    permission_classes = [permissions.AllowAny]


class ModuloSenasView(generics.ListAPIView):
    """GET /api/modulos/{id}/senas — lista las señas validadas de un módulo."""

    serializer_class = SenaSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Sena.objects.filter(
            modulo_id=self.kwargs['modulo_id'], validado_por__isnull=False
        )


class ModuloEjerciciosView(generics.ListAPIView):
    """GET /api/modulos/{id}/ejercicios — ejercicios de las señas ya validadas del módulo."""

    serializer_class = EjercicioSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Ejercicio.objects.filter(
            sena__modulo_id=self.kwargs['modulo_id'], sena__validado_por__isnull=False
        )


def _actualizar_racha(usuario, progreso_nuevo):
    """Sube la racha en uno si el último ejercicio completado fue ayer, la reinicia
    si hubo un día completo sin actividad, y no cambia nada si ya se contó hoy."""
    ultimo = (
        ProgresoUsuario.objects.filter(usuario=usuario, completado=True)
        .exclude(pk=progreso_nuevo.pk)
        .order_by('-fecha')
        .first()
    )

    if ultimo is None:
        usuario.racha_actual = 1
    else:
        dias = (progreso_nuevo.fecha.date() - ultimo.fecha.date()).days
        if dias == 1:
            usuario.racha_actual += 1
        elif dias > 1:
            usuario.racha_actual = 1
        # dias == 0: ya se contabilizó hoy, la racha no cambia.

    usuario.racha_maxima = max(usuario.racha_maxima, usuario.racha_actual)
    usuario.save(update_fields=['racha_actual', 'racha_maxima'])


class ProgresoCreateView(generics.CreateAPIView):
    """POST /api/progreso — registra un intento y actualiza la racha si corresponde."""

    serializer_class = ProgresoUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        progreso = serializer.save(usuario=self.request.user)
        if progreso.completado:
            _actualizar_racha(self.request.user, progreso)


class UsuarioRachaView(APIView):
    """GET /api/usuario/racha — racha actual y máxima del usuario autenticado."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        datos = RachaSerializer(
            {
                'racha_actual': request.user.racha_actual,
                'racha_maxima': request.user.racha_maxima,
            }
        )
        return Response(datos.data)


class AdminSenaCreateView(generics.CreateAPIView):
    """POST /api/admin/senas — carga una seña nueva, sin marcarla validada todavía."""

    serializer_class = SenaCrearSerializer
    permission_classes = [permissions.IsAuthenticated, EsAdministrador]


class AdminSenaValidarView(APIView):
    """POST /api/admin/senas/{id}/validar — marca una seña como validada."""

    permission_classes = [permissions.IsAuthenticated, EsAdministrador]

    def post(self, request, sena_id):
        try:
            sena = Sena.objects.get(pk=sena_id)
        except Sena.DoesNotExist:
            return Response(
                {'detalle': 'Seña no encontrada.'}, status=status.HTTP_404_NOT_FOUND
            )

        entrada = SenaValidarSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)

        sena.validado_por = entrada.validated_data['validado_por']
        sena.fecha_validacion = timezone.now()
        sena.save(update_fields=['validado_por', 'fecha_validacion'])

        return Response(SenaSerializer(sena).data)
