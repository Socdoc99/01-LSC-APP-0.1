from firebase_admin import auth as firebase_auth
from rest_framework import authentication, exceptions

from .firebase import obtener_app_firebase
from .models import Usuario


class AutenticacionFirebase(authentication.BaseAuthentication):
    """Verifica el ID token de Firebase enviado como 'Authorization: Bearer <token>'
    y resuelve (o crea, en el primer request) el Usuario correspondiente."""

    keyword = 'Bearer'

    def authenticate(self, request):
        encabezado = authentication.get_authorization_header(request).decode('utf-8')
        if not encabezado or not encabezado.startswith(f'{self.keyword} '):
            return None

        token = encabezado[len(self.keyword) + 1 :].strip()
        if not token:
            raise exceptions.AuthenticationFailed('Falta el token de Firebase.')

        obtener_app_firebase()
        try:
            token_decodificado = firebase_auth.verify_id_token(token)
        except Exception as error:
            raise exceptions.AuthenticationFailed(f'Token de Firebase inválido: {error}')

        firebase_uid = token_decodificado.get('uid')
        usuario, _ = Usuario.objects.get_or_create(
            firebase_uid=firebase_uid,
            defaults={
                'nombre': token_decodificado.get('name') or token_decodificado.get('email', ''),
                'correo': token_decodificado.get('email', ''),
            },
        )
        return (usuario, token_decodificado)
