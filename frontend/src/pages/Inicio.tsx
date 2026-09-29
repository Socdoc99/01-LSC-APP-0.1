import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonButton, IonContent, IonPage, IonSpinner, IonText } from '@ionic/react';
import Encabezado from '../components/Encabezado';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import type { Modulo, Racha, Sena } from '../api';

function saludoSegunHora(hora: number): string {
  if (hora < 12) return 'Buenos días';
  if (hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Inicio() {
  const navegar = useNavigate();
  const { usuario } = useAuth();
  const [modulo, setModulo] = useState<Modulo | null>(null);
  const [racha, setRacha] = useState<Racha | null>(null);
  const [senas, setSenas] = useState<Sena[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [modulos, rachaActual] = await Promise.all([api.listarModulos(), api.obtenerRacha()]);
        if (!activo) return;
        const primerModulo = modulos.length > 0 ? modulos[0] : null;
        setModulo(primerModulo);
        setRacha(rachaActual);
        if (primerModulo) {
          const senasModulo = await api.listarSenas(primerModulo.id);
          if (activo) setSenas(senasModulo);
        }
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

  const nombre = (usuario?.displayName || usuario?.email || '').split(' ')[0].split('@')[0];
  const saludo = saludoSegunHora(new Date().getHours());
  const rachaActual = racha?.racha_actual ?? 0;

  return (
    <IonPage>
      <Encabezado titulo="Inicio" />
      <IonContent className="ion-padding">
        <div className="contenido">
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
              <div className="home-greeting">
                <h1 className="home-greeting__titulo">
                  {saludo}
                  {nombre ? `, ${nombre}` : ''}
                </h1>
                <p className="home-greeting__subtexto">
                  {rachaActual > 0
                    ? `Llevas ${rachaActual} día${rachaActual === 1 ? '' : 's'} seguidos practicando.`
                    : 'Hoy es un buen día para empezar tu racha.'}
                </p>
                <div className="racha-badge" style={{ marginTop: '0.85rem' }}>
                  <span className="racha-badge__icono" aria-hidden="true">
                    🔥
                  </span>
                  <span>
                    {rachaActual} día{rachaActual === 1 ? '' : 's'} de racha
                    {racha && racha.racha_maxima > racha.racha_actual && (
                      <span style={{ fontWeight: 400 }}> (tu mejor marca: {racha.racha_maxima})</span>
                    )}
                  </span>
                </div>
              </div>

              {modulo ? (
                <div className="module-card">
                  <div className="module-card__header">
                    <p className="module-card__eyebrow">Módulo {modulo.orden}</p>
                    <h2 className="module-card__titulo">{modulo.titulo}</h2>
                    {senas.length > 0 && (
                      <span className="module-card__meta">
                        {senas.length} seña{senas.length === 1 ? '' : 's'} por aprender
                      </span>
                    )}
                  </div>
                  <div className="module-card__body">
                    <p className="module-card__descripcion">{modulo.descripcion}</p>
                    <IonButton
                      expand="block"
                      color="secondary"
                      onClick={() => navegar(`/leccion/${modulo.id}`)}
                    >
                      Comenzar módulo
                    </IonButton>
                  </div>
                </div>
              ) : (
                <IonText>
                  <p>Todavía no hay ningún módulo disponible. Vuelve más tarde.</p>
                </IonText>
              )}

              {senas.length > 0 && (
                <div className="senas-preview">
                  <p className="senas-preview__etiqueta">Lo que vas a aprender</p>
                  <div className="senas-preview__lista">
                    {senas.map((sena) => (
                      <span className="sena-chip" key={sena.id}>
                        <span className="sena-chip__marca" aria-hidden="true">
                          {sena.palabra.charAt(0).toUpperCase()}
                        </span>
                        {sena.palabra}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
