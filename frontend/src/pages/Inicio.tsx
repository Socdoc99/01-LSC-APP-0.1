import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { flameOutline } from 'ionicons/icons';
import Encabezado from '../components/Encabezado';
import { api } from '../api';
import type { Modulo, Racha } from '../api';

export default function Inicio() {
  const navegar = useNavigate();
  const [modulo, setModulo] = useState<Modulo | null>(null);
  const [racha, setRacha] = useState<Racha | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [modulos, rachaActual] = await Promise.all([api.listarModulos(), api.obtenerRacha()]);
        if (!activo) return;
        setModulo(modulos.length > 0 ? modulos[0] : null);
        setRacha(rachaActual);
      } catch {
        if (activo) setError('No se pudo cargar tu módulo. Verifica tu conexión e intenta de nuevo.');
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <IonPage>
      <Encabezado titulo="Inicio" />
      <IonContent className="ion-padding">
        {cargando && (
          <div className="ion-text-center">
            <IonSpinner aria-label="Cargando" />
          </div>
        )}

        {!cargando && error && (
          <IonText color="danger">
            <p role="alert">{error}</p>
          </IonText>
        )}

        {!cargando && !error && (
          <>
            <IonChip color="warning" style={{ marginBottom: '1rem' }}>
              <IonIcon icon={flameOutline} />
              <IonLabel>
                Racha actual: {racha?.racha_actual ?? 0} día(s) · Máxima: {racha?.racha_maxima ?? 0}
              </IonLabel>
            </IonChip>

            {modulo ? (
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>Módulo {modulo.orden}</IonCardSubtitle>
                  <IonCardTitle>{modulo.titulo}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{modulo.descripcion}</p>
                  <IonButton expand="block" onClick={() => navegar(`/leccion/${modulo.id}`)}>
                    Comenzar módulo
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ) : (
              <IonText>
                <p>Todavía no hay ningún módulo disponible. Vuelve más tarde.</p>
              </IonText>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
