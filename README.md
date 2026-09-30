# LOVE UN IDIOMA UNIVERSAL — Plataforma de aprendizaje de LSC

Proyecto de grado de la Tecnología en Desarrollo de Software (Universidad Tecnológica de Pereira), desarrollado en equipo por Sandra Patricia Montoya Martínez, Santiago Ospina Calle y Cristian David Guayabo Vizcaya.

## Qué hace

Es el componente tecnológico de una marca de productos personalizados inspirados en la Lengua de Señas Colombiana (LSC) y la cultura sorda. La plataforma web, de estilo similar a Duolingo, enseña LSC mediante módulos y señas en video, y se vincula a los productos físicos de la marca a través de un código de canje ("experiencia phygital").

El proyecto está organizado en fases documentadas dentro de la carpeta `plan/`. **Fase actual: Fase 1 (MVP)** — módulo piloto de aprendizaje, sin tienda ni funciones sociales todavía.

## Stack

**Backend:** Django 6 + Django REST Framework + PostgreSQL, con autenticación gestionada por Firebase Admin SDK.
**Frontend:** Ionic + React 19 + TypeScript + Vite, con Firebase Auth en el cliente y Capacitor para un futuro empaquetado nativo (Android/iOS).
**Despliegue:** Render (backend con Gunicorn + Whitenoise).

## Cómo ejecutarlo

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # o source venv/bin/activate en Linux/Mac
pip install -r requirements.txt
cp .env.example .env   # completar variables (base de datos, credenciales de Firebase)
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.production.example  # completar variables de Firebase
npm run dev
```

## Estado del proyecto

En desarrollo activo, en fase de MVP. Los modelos principales (Usuario, Módulo, Seña, Ejercicio, ProgresoUsuario) ya están definidos; la lógica de vistas y endpoints se sigue construyendo módulo por módulo.

## Un principio importante del proyecto

Ninguna funcionalidad puede depender únicamente de una señal sonora, ya que el público principal incluye personas sordas. Ningún contenido en LSC se publica sin haber sido grabado o validado por una persona sorda o un intérprete certificado.
