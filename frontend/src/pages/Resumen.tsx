import { useLocation, useNavigate } from 'react-router-dom';
import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import MarcaManual from '../components/MarcaManual';

export default function Resumen() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const totalSenas = (ubicacion.state as { totalSenas?: number } | null)?.totalSenas ?? 0;

  return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        <div className="contenido" style={{ marginTop: '3.5rem' }}>
          <MarcaManual
            className="celebracion"
            style={{ width: 88, height: 88, color: 'var(--color-violet)' }}
          />
          <IonText>
            <h1 style={{ marginTop: '1rem' }}>¡Módulo completado!</h1>
            <p style={{ color: 'var(--color-ink-muted)' }}>
              Aprendiste {totalSenas} seña{totalSenas === 1 ? '' : 's'} en este módulo.
            </p>
          </IonText>
          <IonButton
            expand="block"
            color="secondary"
            onClick={() => navegar('/inicio')}
            style={{ marginTop: '2rem' }}
          >
            Volver a inicio
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
