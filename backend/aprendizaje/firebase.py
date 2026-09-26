import os

import firebase_admin
from firebase_admin import credentials

_app = None


def obtener_app_firebase():
    """Inicializa (una sola vez) y devuelve la app de Firebase Admin, usando la
    cuenta de servicio cuya ruta viene en FIREBASE_SERVICE_ACCOUNT_KEY_PATH."""
    global _app

    if _app is not None:
        return _app

    if firebase_admin._apps:
        _app = firebase_admin.get_app()
        return _app

    ruta_credenciales = os.environ.get('FIREBASE_SERVICE_ACCOUNT_KEY_PATH')
    if not ruta_credenciales:
        raise RuntimeError(
            'Falta la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY_PATH: '
            'debe apuntar al archivo JSON de la cuenta de servicio de Firebase.'
        )

    cred = credentials.Certificate(ruta_credenciales)
    _app = firebase_admin.initialize_app(cred)
    return _app
