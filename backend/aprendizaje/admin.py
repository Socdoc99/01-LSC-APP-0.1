from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html

from .models import Ejercicio, Modulo, ProgresoUsuario, Sena, Usuario

admin.site.register(Usuario)
admin.site.register(ProgresoUsuario)


class SenaValidacionFiltro(admin.SimpleListFilter):
    """Filtro rápido para encontrar lo que falta validar sin recorrer todo el módulo."""

    title = 'validación'
    parameter_name = 'validada'

    def lookups(self, request, model_admin):
        return (('si', 'Validadas'), ('no', 'Pendientes de validar'))

    def queryset(self, request, queryset):
        if self.value() == 'si':
            return queryset.exclude(validado_por__isnull=True).exclude(validado_por='')
        if self.value() == 'no':
            return queryset.filter(validado_por__isnull=True) | queryset.filter(validado_por='')
        return queryset


class EjercicioInline(admin.TabularInline):
    """Editar los ejercicios de una seña sin salir de su pantalla."""

    model = Ejercicio
    extra = 0
    fields = ('tipo', 'contenido_json')


@admin.register(Modulo)
class ModuloAdmin(admin.ModelAdmin):
    list_display = ('orden', 'titulo', 'cantidad_senas', 'cantidad_validadas')
    ordering = ('orden',)
    search_fields = ('titulo',)

    @admin.display(description='Señas cargadas')
    def cantidad_senas(self, obj):
        return obj.senas.count()

    @admin.display(description='Señas validadas')
    def cantidad_validadas(self, obj):
        return obj.senas.exclude(validado_por__isnull=True).exclude(validado_por='').count()


@admin.register(Sena)
class SenaAdmin(admin.ModelAdmin):
    list_display = ('palabra', 'modulo', 'validada', 'validado_por', 'fecha_validacion')
    list_filter = ('modulo', SenaValidacionFiltro)
    search_fields = ('palabra',)
    autocomplete_fields = ('modulo',)
    readonly_fields = ('vista_previa_video', 'fecha_validacion')
    fields = ('modulo', 'palabra', 'video_url', 'vista_previa_video', 'validado_por', 'fecha_validacion')
    inlines = [EjercicioInline]

    @admin.display(description='¿Validada?', boolean=True)
    def validada(self, obj):
        return obj.esta_validada

    @admin.display(description='Vista previa')
    def vista_previa_video(self, obj):
        if not obj.video_url:
            return 'Todavía no hay video cargado.'
        return format_html(
            '<video src="{}" controls style="max-width: 320px; max-height: 240px; '
            'border-radius: 12px; background: #000;"></video>',
            obj.video_url,
        )

    def save_model(self, request, obj, form, change):
        """Registra la fecha de validación automáticamente al llenar validado_por,
        para que quede en la base de datos y no dependa de que alguien la escriba a mano."""
        if obj.validado_por:
            if not obj.fecha_validacion:
                obj.fecha_validacion = timezone.now()
        else:
            obj.fecha_validacion = None
        super().save_model(request, obj, form, change)


@admin.register(Ejercicio)
class EjercicioAdmin(admin.ModelAdmin):
    list_display = ('sena', 'tipo')
    list_filter = ('tipo', 'sena__modulo')
    search_fields = ('sena__palabra',)
    autocomplete_fields = ('sena',)
