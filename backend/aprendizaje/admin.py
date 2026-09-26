from django.contrib import admin

from .models import Ejercicio, Modulo, ProgresoUsuario, Sena, Usuario

admin.site.register(Usuario)
admin.site.register(Modulo)
admin.site.register(Sena)
admin.site.register(Ejercicio)
admin.site.register(ProgresoUsuario)
