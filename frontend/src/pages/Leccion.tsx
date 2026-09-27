import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonList,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { api } from '../api';
import type { Ejercicio, Sena } from '../api';

/**
 * Formato esperado de `contenido_json` por tipo de ejercicio (definido aquí porque
 * el backend lo guarda como JSON libre; ver plan/03-fase-1-mvp.md):
 * - video_a_palabra / palabra_a_video: { opciones: string[] } — incluye la respuesta correcta
 *   (palabra o video_url de la seña) entre las opciones.
 * - orden_pasos: { pasos: string[], orden_correcto: number[] } — pasos en el orden en que se
 *   muestran (desordenados) y los índices que forman la secuencia correcta.
 */

type ContenidoOpciones = { opciones: string[] };
type ContenidoOrdenPasos = { pasos: string[]; orden_correcto: number[] };

interface Feedback {
  correcto: boolean;
}

export default function Leccion() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navegar = useNavigate();

  const [senas, setSenas] = useState<Sena[]>([]);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [indice, setIndice] = useState(0);
  const [intentos, setIntentos] = useState(1);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [secuencia, setSecuencia] = useState<number[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const id = Number(moduloId);
        const [senasModulo, ejerciciosModulo] = await Promise.all([
          api.listarSenas(id),
          api.listarEjercicios(id),
        ]);
        if (!activo) return;
        setSenas(senasModulo);
        setEjercicios(ejerciciosModulo);
      } catch {
        if (activo) setError('No se pudo cargar la lección. Verifica tu conexión e intenta de nuevo.');
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, [moduloId]);

  const senasPorId = useMemo(() => new Map(senas.map((sena) => [sena.id, sena])), [senas]);
  const ejercicioActual = ejercicios[indice];
  const senaActual = ejercicioActual ? senasPorId.get(ejercicioActual.sena) : undefined;

  const terminarEjercicio = async (correcto: boolean) => {
    setFeedback({ correcto });
    try {
      await api.registrarProgreso(ejercicioActual.id, correcto, intentos);
    } catch {
      // El progreso no se pudo registrar en el servidor; se deja avanzar igual para no
      // bloquear la lección, pero la racha podría no reflejar este intento.
    }
  };

  const responderOpcion = (opcion: string) => {
    if (feedback || !ejercicioActual || !senaActual) return;
    const contenido = ejercicioActual.contenido_json as ContenidoOpciones;
    const correcta =
      ejercicioActual.tipo === 'video_a_palabra' ? senaActual.palabra : senaActual.video_url;
    if (opcion === correcta) {
      terminarEjercicio(true);
    } else if (intentos < contenido.opciones.length) {
      setIntentos((valor) => valor + 1);
    } else {
      terminarEjercicio(false);
    }
  };

  const alternarPaso = (indicePaso: number) => {
    if (feedback) return;
    setSecuencia((actual) =>
      actual.includes(indicePaso) ? actual.filter((valor) => valor !== indicePaso) : [...actual, indicePaso],
    );
  };

  const comprobarOrden = () => {
    if (feedback || !ejercicioActual) return;
    const contenido = ejercicioActual.contenido_json as ContenidoOrdenPasos;
    const correcto =
      secuencia.length === contenido.orden_correcto.length &&
      secuencia.every((valor, posicion) => valor === contenido.orden_correcto[posicion]);
    if (correcto || intentos >= 2) {
      terminarEjercicio(correcto);
    } else {
      setIntentos((valor) => valor + 1);
      setSecuencia([]);
    }
  };

  const siguiente = () => {
    setFeedback(null);
    setIntentos(1);
    setSecuencia([]);
    if (indice + 1 < ejercicios.length) {
      setIndice((valor) => valor + 1);
    } else {
      navegar(`/resumen/${moduloId}`, { state: { totalSenas: senas.length } });
    }
  };

  if (cargando) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonText color="danger">{error}</IonText>
        </IonContent>
      </IonPage>
    );
  }

  if (!ejercicioActual || !senaActual) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonText>Este módulo todavía no tiene ejercicios disponibles.</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/inicio" />
          </IonButtons>
          <IonTitle>
            Ejercicio {indice + 1} de {ejercicios.length}
          </IonTitle>
        </IonToolbar>
        <IonProgressBar value={(indice + (feedback ? 1 : 0)) / ejercicios.length} />
      </IonHeader>
      <IonContent className="ion-padding">
        {ejercicioActual.tipo === 'video_a_palabra' && (
          <>
            <video src={senaActual.video_url} controls style={{ width: '100%', maxHeight: 300 }} />
            <IonText>
              <p>¿Qué palabra corresponde a esta seña?</p>
            </IonText>
            <IonList>
              {(ejercicioActual.contenido_json as ContenidoOpciones).opciones.map((opcion) => (
                <IonButton
                  key={opcion}
                  expand="block"
                  fill="outline"
                  disabled={Boolean(feedback)}
                  onClick={() => responderOpcion(opcion)}
                >
                  {opcion}
                </IonButton>
              ))}
            </IonList>
          </>
        )}

        {ejercicioActual.tipo === 'palabra_a_video' && (
          <>
            <IonText>
              <h2 className="ion-text-center">{senaActual.palabra}</h2>
              <p className="ion-text-center">¿Cuál video muestra correctamente esta seña?</p>
            </IonText>
            <IonList>
              {(ejercicioActual.contenido_json as ContenidoOpciones).opciones.map((url, posicion) => (
                <div key={url} style={{ marginBottom: '1rem' }}>
                  <video src={url} controls style={{ width: '100%', maxHeight: 220 }} />
                  <IonButton
                    expand="block"
                    disabled={Boolean(feedback)}
                    onClick={() => responderOpcion(url)}
                  >
                    Elegir video {posicion + 1}
                  </IonButton>
                </div>
              ))}
            </IonList>
          </>
        )}

        {ejercicioActual.tipo === 'orden_pasos' && (
          <>
            <IonText>
              <p>Toca los pasos en el orden correcto para formar la seña "{senaActual.palabra}".</p>
            </IonText>
            <IonList>
              {(ejercicioActual.contenido_json as ContenidoOrdenPasos).pasos.map((paso, posicion) => {
                const orden = secuencia.indexOf(posicion);
                return (
                  <IonButton
                    key={paso}
                    expand="block"
                    fill={orden === -1 ? 'outline' : 'solid'}
                    disabled={Boolean(feedback)}
                    onClick={() => alternarPaso(posicion)}
                  >
                    {orden !== -1 ? `${orden + 1}. ` : ''}
                    {paso}
                  </IonButton>
                );
              })}
            </IonList>
            <IonButton
              expand="block"
              color="secondary"
              disabled={Boolean(feedback) || secuencia.length === 0}
              onClick={comprobarOrden}
            >
              Comprobar orden
            </IonButton>
          </>
        )}

        {feedback && (
          <IonChip color={feedback.correcto ? 'success' : 'danger'} style={{ marginTop: '1rem' }}>
            <IonIcon icon={feedback.correcto ? checkmarkCircle : closeCircle} />
            <IonLabel>{feedback.correcto ? '¡Correcto!' : 'No era esa. La respuesta correcta era otra.'}</IonLabel>
          </IonChip>
        )}

        {feedback && (
          <IonButton expand="block" style={{ marginTop: '1rem' }} onClick={siguiente}>
            {indice + 1 < ejercicios.length ? 'Siguiente' : 'Ver resumen'}
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
}
