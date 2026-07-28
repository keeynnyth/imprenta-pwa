
import { createContext, useContext } from "react";

export interface UsuarioAutenticado {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "operador";
  activo: boolean;
}

interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  loading: boolean;
  cerrarSesion: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
}