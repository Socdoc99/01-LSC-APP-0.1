import { useLocation, useNavigate } from 'react-router-dom';
import { IonButton, IonContent, IonIcon, IonPage, IonText } from '@ionic/react';
import { ribbonOutline } from 'ionicons/icons';

export default function Resumen() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const totalSenas = (ubicacion.state as { totalSenas?: number } | null)?.totalSenas ?? 0;

  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        <div style={{ marginTop: '3rem' }}>
          <IonIcon
            icon={ribbonOutline}
            aria-hidden="true"
            style={{ fontSize: '4rem', color: 'var(--ion-color-success)' }}
          />
          <IonText>
            <h1>¡Módulo completado!</h1>
            <p>
              Aprendiste {totalSenas} seña{totalSenas === 1 ? '' : 's'} en este módulo.
            </p>
          </IonText>
          <IonButton expand="block" onClick={() => navegar('/inicio')} style={{ marginTop: '2rem' }}>
            Volver a inicio
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
