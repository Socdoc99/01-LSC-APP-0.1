import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText,
  IonTitle,
} from '@ionic/react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, firebaseConfigurado } from '../firebase';
import { useAuth } from '../context/AuthContext';

type Modo = 'iniciar' | 'registrar';

function traducirError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'El correo no tiene un formato válido.';
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con ese correo.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Correo o contraseña incorrectos.';
      default:
        return 'No se pudo completar la operación. Intenta de nuevo.';
    }
  }
  return 'No se pudo completar la operación. Intenta de nuevo.';
}

export default function Login() {
  const { usuario, cargando } = useAuth();
  const [modo, setModo] = useState<Modo>('iniciar');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (cargando) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner aria-label="Cargando" />
        </IonContent>
      </IonPage>
    );
  }

  if (usuario) {
    return <Navigate to="/inicio" replace />;
  }

  const enviar = async () => {
    setError(null);
    if (!correo || !contrasena) {
      setError('Completa correo y contraseña.');
      return;
    }
    setEnviando(true);
    try {
      if (modo === 'registrar') {
        await createUserWithEmailAndPassword(auth, correo, contrasena);
      } else {
        await signInWithEmailAndPassword(auth, correo, contrasena);
      }
    } catch (err) {
      setError(traducirError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', justifyContent: 'center' }}>
          <IonTitle className="ion-text-center" style={{ marginBottom: '1.5rem' }}>
            LOVE UN IDIOMA UNIVERSAL
          </IonTitle>

          {!firebaseConfigurado && (
            <IonNote color="warning" className="ion-text-center" style={{ display: 'block', marginBottom: '1rem' }}>
              Firebase todavía no está configurado en este entorno (faltan las variables
              VITE_FIREBASE_* en el .env). El registro e inicio de sesión no funcionarán hasta
              completarlas.
            </IonNote>
          )}

          <IonCard>
            <IonCardContent>
              <IonSegment value={modo} onIonChange={(e) => setModo(e.detail.value as Modo)}>
                <IonSegmentButton value="iniciar">Iniciar sesión</IonSegmentButton>
                <IonSegmentButton value="registrar">Registrarme</IonSegmentButton>
              </IonSegment>

              <IonItem style={{ marginTop: '1rem' }}>
                <IonInput
                  label="Correo"
                  labelPlacement="stacked"
                  type="email"
                  value={correo}
                  onIonInput={(e) => setCorreo(e.detail.value ?? '')}
                  autocomplete="email"
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label="Contraseña"
                  labelPlacement="stacked"
                  type="password"
                  value={contrasena}
                  onIonInput={(e) => setContrasena(e.detail.value ?? '')}
                  autocomplete={modo === 'registrar' ? 'new-password' : 'current-password'}
                />
              </IonItem>

              {error && (
                <IonText color="danger">
                  <p role="alert">{error}</p>
                </IonText>
              )}

              {modo === 'registrar' && (
                <IonNote className="ion-text-center" style={{ display: 'block', marginTop: '0.75rem' }}>
                  Al crear tu cuenta usamos tu correo únicamente para identificarte y
                  mostrarte tu progreso; tu nombre y racha se guardan para personalizar
                  tu experiencia de aprendizaje. Nunca se comparten con terceros
                  (Ley 1581 de 2012).
                </IonNote>
              )}

              <IonButton
                expand="block"
                onClick={enviar}
                disabled={enviando || !firebaseConfigurado}
                style={{ marginTop: '1rem' }}
              >
                {enviando
                  ? <IonSpinner name="dots" />
                  : modo === 'registrar'
                    ? 'Acepto y creo mi cuenta'
                    : 'Entrar'}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
