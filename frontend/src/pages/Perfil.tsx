import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IonButton,
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
} from '@ionic/react';
import { flameOutline, trophyOutline } from 'ionicons/icons';
import { signOut } from 'firebase/auth';
import Encabezado from '../components/Encabezado';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import type { Racha } from '../api';

export default function Perfil() {
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const [racha, setRacha] = useState<Racha | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    api
      .obtenerRacha()
      .then((valor) => activo && setRacha(valor))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
    navegar('/login', { replace: true });
  };

  return (
    <IonPage>
      <Encabezado titulo="Perfil" />
      <IonContent className="ion-padding">
        <IonText>
          <h2>{usuario?.displayName || usuario?.email}</h2>
        </IonText>

        {cargando ? (
          <IonSpinner aria-label="Cargando" />
        ) : (
          <IonList>
            <IonItem>
              <IonIcon icon={flameOutline} slot="start" color="warning" aria-hidden="true" />
              <IonLabel>Racha actual</IonLabel>
              <IonChip slot="end">{racha?.racha_actual ?? 0} día(s)</IonChip>
            </IonItem>
            <IonItem>
              <IonIcon icon={trophyOutline} slot="start" color="secondary" aria-hidden="true" />
              <IonLabel>Racha máxima</IonLabel>
              <IonChip slot="end">{racha?.racha_maxima ?? 0} día(s)</IonChip>
            </IonItem>
          </IonList>
        )}

        <IonButton expand="block" color="danger" onClick={cerrarSesion} style={{ marginTop: '2rem' }}>
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
