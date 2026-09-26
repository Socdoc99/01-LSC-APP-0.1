from rest_framework.permissions import BasePermission


class EsAdministrador(BasePermission):
    """Permite el acceso solo si el token de Firebase trae el custom claim 'admin': true."""

    message = 'Se requieren permisos de administrador.'

    def has_permission(self, request, view):
        token_decodificado = request.auth
        return bool(token_decodificado) and bool(token_decodificado.get('admin'))
