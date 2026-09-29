import { IonButtons, IonHeader, IonButton, IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

export default function Encabezado({ titulo }: { titulo: string }) {
  const navegar = useNavigate();

  return (
    <IonHeader className="app-header">
      <IonToolbar>
        <IonTitle>{titulo}</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => navegar('/perfil')} aria-label="Perfil">
            <IonIcon icon={personCircleOutline} slot="icon-only" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
}
