import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonButton, IonContent, IonPage, IonSpinner, IonText } from '@ionic/react';
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
              <div className="racha-badge">
                <span className="racha-badge__icono" aria-hidden="true">
                  🔥
                </span>
                <span>
                  {racha?.racha_actual ?? 0} día{racha?.racha_actual === 1 ? '' : 's'} de racha
                  {racha && racha.racha_maxima > racha.racha_actual && (
                    <span style={{ fontWeight: 400 }}> (tu mejor marca: {racha.racha_maxima})</span>
                  )}
                </span>
              </div>

              {modulo ? (
                <div className="module-card">
                  <div className="module-card__header">
                    <p className="module-card__eyebrow">Módulo {modulo.orden}</p>
                    <h2 className="module-card__titulo">{modulo.titulo}</h2>
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
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
