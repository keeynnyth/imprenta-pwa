
import { Link } from "react-router-dom";

function MenuLateral() {
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
              to="/"
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
              to="/configuracion"
              className="block rounded p-2 hover:bg-slate-700"
            >
              ⚙️ Configuración
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
}

export default MenuLateral;