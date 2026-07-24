
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAuthenticated(!!session);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}