import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './context/AuthContext';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Leccion from './pages/Leccion';
import Resumen from './pages/Resumen';
import Perfil from './pages/Perfil';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Esta app tiene un tema de marca claro deliberado (ver theme/variables.css);
 * no se activa el modo oscuro automático de Ionic para evitar una versión
 * oscura sin diseñar mezclada con la paleta propia.
 */

/* Tokens de la marca (colores, tipografía) */
import './theme/variables.css';
/* Estilos globales, componentes propios y animaciones */
import './theme/global.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" element={<Login />} />
          <Route
            path="/inicio"
            element={
              <RutaProtegida>
                <Inicio />
              </RutaProtegida>
            }
          />
          <Route
            path="/leccion/:moduloId"
            element={
              <RutaProtegida>
                <Leccion />
              </RutaProtegida>
            }
          />
          <Route
            path="/resumen/:moduloId"
            element={
              <RutaProtegida>
                <Resumen />
              </RutaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RutaProtegida>
                <Perfil />
              </RutaProtegida>
            }
          />
          <Route path="/" element={<Navigate to="/inicio" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
