import json
import os

import firebase_admin
from firebase_admin import credentials

_app = None


def obtener_app_firebase():
    """Inicializa (una sola vez) y devuelve la app de Firebase Admin.

    Prueba, en orden:
    1. FIREBASE_AUTH_EMULATOR_HOST — desarrollo local contra el Auth Emulator,
       sin cuenta de servicio real.
    2. FIREBASE_SERVICE_ACCOUNT_JSON — el JSON completo de la cuenta de
       servicio pegado directo en una variable de entorno. Pensado para
       hosting en la nube (Render, etc.) donde no hay un archivo local en el
       que guardar el JSON.
    3. FIREBASE_SERVICE_ACCOUNT_KEY_PATH — ruta local al archivo JSON de la
       cuenta de servicio, como en una máquina de desarrollo."""
    global _app

    if _app is not None:
        return _app

    if firebase_admin._apps:
        _app = firebase_admin.get_app()
        return _app

    if os.environ.get('FIREBASE_AUTH_EMULATOR_HOST'):
        proyecto = os.environ.get('FIREBASE_PROJECT_ID', 'demo-love-lsc')
        _app = firebase_admin.initialize_app(options={'projectId': proyecto})
        return _app

    credenciales_json = os.environ.get('FIREBASE_SERVICE_ACCOUNT_JSON')
    if credenciales_json:
        cred = credentials.Certificate(json.loads(credenciales_json))
        _app = firebase_admin.initialize_app(cred)
        return _app

    ruta_credenciales = os.environ.get('FIREBASE_SERVICE_ACCOUNT_KEY_PATH')
    if not ruta_credenciales:
        raise RuntimeError(
            'Falta configurar Firebase Admin: define FIREBASE_SERVICE_ACCOUNT_JSON '
            '(el JSON completo de la cuenta de servicio) o FIREBASE_SERVICE_ACCOUNT_KEY_PATH '
            '(la ruta local a ese archivo).'
        )

    cred = credentials.Certificate(ruta_credenciales)
    _app = firebase_admin.initialize_app(cred)
    return _app
