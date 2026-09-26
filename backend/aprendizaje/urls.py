from django.urls import path

from . import views

urlpatterns = [
    path('modulos', views.ModuloListView.as_view(), name='modulos-list'),
    path('modulos/<int:modulo_id>/senas', views.ModuloSenasView.as_view(), name='modulo-senas'),
    path(
        'modulos/<int:modulo_id>/ejercicios',
        views.ModuloEjerciciosView.as_view(),
        name='modulo-ejercicios',
    ),
    path('progreso', views.ProgresoCreateView.as_view(), name='progreso-crear'),
    path('usuario/racha', views.UsuarioRachaView.as_view(), name='usuario-racha'),
    path('admin/senas', views.AdminSenaCreateView.as_view(), name='admin-senas-crear'),
    path(
        'admin/senas/<int:sena_id>/validar',
        views.AdminSenaValidarView.as_view(),
        name='admin-senas-validar',
    ),
]
