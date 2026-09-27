import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Modulo {
  id: number;
  titulo: string;
  descripcion: string;
  orden: number;
}

export interface Sena {
  id: number;
  modulo: number;
  palabra: string;
  video_url: string;
  validado_por: string | null;
  fecha_validacion: string | null;
}

export type TipoEjercicio = 'video_a_palabra' | 'palabra_a_video' | 'orden_pasos';

export interface Ejercicio {
  id: number;
  sena: number;
  tipo: TipoEjercicio;
  contenido_json: Record<string, unknown>;
}

export interface Racha {
  racha_actual: number;
  racha_maxima: number;
}

async function peticion<T>(ruta: string, opciones: RequestInit = {}, autenticado = false): Promise<T> {
  const encabezados = new Headers(opciones.headers);
  encabezados.set('Content-Type', 'application/json');

  if (autenticado) {
    const usuarioActual = auth.currentUser;
    if (!usuarioActual) {
      throw new Error('Se requiere haber iniciado sesión para esta operación.');
    }
    const token = await usuarioActual.getIdToken();
    encabezados.set('Authorization', `Bearer ${token}`);
  }

  const respuesta = await fetch(`${BASE_URL}${ruta}`, { ...opciones, headers: encabezados });
  if (!respuesta.ok) {
    const texto = await respuesta.text();
    throw new Error(`Error ${respuesta.status} en ${ruta}: ${texto}`);
  }
  if (respuesta.status === 204) {
    return undefined as T;
  }
  return respuesta.json() as Promise<T>;
}

export const api = {
  listarModulos: () => peticion<Modulo[]>('/api/modulos'),
  listarSenas: (moduloId: number) => peticion<Sena[]>(`/api/modulos/${moduloId}/senas`),
  listarEjercicios: (moduloId: number) => peticion<Ejercicio[]>(`/api/modulos/${moduloId}/ejercicios`),
  registrarProgreso: (ejercicioId: number, completado: boolean, intentos: number) =>
    peticion(
      '/api/progreso',
      { method: 'POST', body: JSON.stringify({ ejercicio: ejercicioId, completado, intentos }) },
      true,
    ),
  obtenerRacha: () => peticion<Racha>('/api/usuario/racha', {}, true),
};
