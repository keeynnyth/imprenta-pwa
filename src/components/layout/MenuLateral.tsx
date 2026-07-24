
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

function MenuLateral() {
  const navigate = useNavigate();

const cerrarSesion = async () => {
  await supabase.auth.signOut();
  navigate("/login", { replace: true });
};
  return (
    <aside className="w-64 bg-slate-800 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold">
          🖨️ Imprenta
        </h2>
      </div>

      <nav>
        <ul className="space-y-2 px-4">

          <li>
            <Link
             to="/dashboard"
              className="block rounded p-2 hover:bg-slate-700"
            >
              🏠 Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/productos"
              className="block rounded p-2 hover:bg-slate-700"
            >
              📦 Productos
            </Link>
          </li>

          <li>
            <Link
              to="/cotizaciones"
              className="block rounded p-2 hover:bg-slate-700"
            >
              📋 Cotizaciones
            </Link>
          </li>

          <li>
  <Link
    to="/ordenes-trabajo"
    className="block rounded p-2 hover:bg-slate-700"
  >
    🛠️ Órdenes de Trabajo
  </Link>
</li>

          <li>
            <Link
              to="/tasas"
              className="block rounded p-2 hover:bg-slate-700"
            >
              💲 Tasas
            </Link>
          </li>

          <li>
            <Link
              to="/clientes"
              className="block rounded p-2 hover:bg-slate-700"
            >
              👥 Clientes
            </Link>
          </li>

          <li>
  <Link
    to="/ingresos"
    className="block rounded p-2 hover:bg-slate-700"
  >
    💰 Ingresos
  </Link>
</li>

          <li>
            <Link
              to="/configuracion"
              className="block rounded p-2 hover:bg-slate-700"
            >
              ⚙️ Configuración
            </Link>
          </li>
<li>
  <button
    onClick={cerrarSesion}
    className="block w-full rounded p-2 text-left hover:bg-slate-700"
  >
    🚪 Cerrar sesión
  </button>
</li>
        </ul>
      </nav>
    </aside>
  );
}

export default MenuLateral;