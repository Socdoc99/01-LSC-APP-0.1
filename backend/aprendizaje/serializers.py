from rest_framework import serializers

from .models import Ejercicio, Modulo, ProgresoUsuario, Sena


class ModuloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modulo
        fields = ['id', 'titulo', 'descripcion', 'orden']


class SenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sena
        fields = ['id', 'modulo', 'palabra', 'video_url', 'validado_por', 'fecha_validacion']


class SenaCrearSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sena
        fields = ['id', 'modulo', 'palabra', 'video_url']


class SenaValidarSerializer(serializers.Serializer):
    validado_por = serializers.CharField(max_length=150)


class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = ['id', 'sena', 'tipo', 'contenido_json']


class ProgresoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgresoUsuario
        fields = ['id', 'ejercicio', 'completado', 'fecha', 'intentos']
        read_only_fields = ['id', 'fecha']


class RachaSerializer(serializers.Serializer):
    racha_actual = serializers.IntegerField()
    racha_maxima = serializers.IntegerField()
