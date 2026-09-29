import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonButton, IonContent, IonPage, IonSpinner, IonText } from '@ionic/react';
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

  const nombre = usuario?.displayName || usuario?.email || '';

  return (
    <IonPage>
      <Encabezado titulo="Perfil" />
      <IonContent className="ion-padding">
        <div className="contenido">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.75rem' }}>
            <div
              aria-hidden="true"
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-violet-deep), var(--color-violet))',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                flexShrink: 0,
              }}
            >
              {nombre.charAt(0).toUpperCase()}
            </div>
            <IonText>
              <h2 style={{ margin: 0, wordBreak: 'break-word' }}>{nombre}</h2>
            </IonText>
          </div>

          {cargando ? (
            <IonSpinner aria-label="Cargando" />
          ) : (
            <div className="racha-badge" style={{ marginBottom: '0.75rem' }}>
              <span className="racha-badge__icono" aria-hidden="true">
                🔥
              </span>
              <span>
                {racha?.racha_actual ?? 0} día{racha?.racha_actual === 1 ? '' : 's'} de racha actual
              </span>
            </div>
          )}

          {!cargando && (
            <p style={{ color: 'var(--color-ink-muted)', marginTop: 0 }}>
              Tu mejor racha hasta ahora: {racha?.racha_maxima ?? 0} día
              {racha?.racha_maxima === 1 ? '' : 's'}.
            </p>
          )}

          <IonButton expand="block" color="danger" onClick={cerrarSesion} style={{ marginTop: '1.5rem' }}>
            Cerrar sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
