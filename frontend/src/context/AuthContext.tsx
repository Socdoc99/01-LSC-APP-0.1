import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, firebaseConfigurado } from '../firebase';

interface AuthContextValue {
  usuario: User | null;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextValue>({ usuario: null, cargando: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!firebaseConfigurado) {
      setCargando(false);
      return;
    }
    const cancelar = onAuthStateChanged(auth, (usuarioActual) => {
      setUsuario(usuarioActual);
      setCargando(false);
    });
    return cancelar;
  }, []);

  return <AuthContext.Provider value={{ usuario, cargando }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
