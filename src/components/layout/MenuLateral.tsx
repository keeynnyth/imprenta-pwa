
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

          <li className="cursor-pointer rounded p-2 hover:bg-slate-700">
            🏠 Inicio
          </li>

          <li className="cursor-pointer rounded p-2 hover:bg-slate-700">
            📦 Productos
          </li>

          <li className="cursor-pointer rounded p-2 hover:bg-slate-700">
            💲 Tasas
          </li>

          <li className="cursor-pointer rounded p-2 hover:bg-slate-700">
            ⚙️ Configuración
          </li>

        </ul>
      </nav>
    </aside>
  );
}

export default MenuLateral;