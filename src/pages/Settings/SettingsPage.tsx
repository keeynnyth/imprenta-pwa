function SettingsPage() {
  return (
    <div className="space-y-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Configuración
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Información y configuración general del sistema.
        </p>
      </div>

      {/* Información del sistema */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Información del sistema
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Datos generales de la aplicación.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nombre
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              LAGOGRAPHI
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Aplicación
            </p>

            <p className="mt-2 font-semibold text-slate-800">
              Sistema de Gestión de Imprenta
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Gestión de productos
            </p>

            <p className="mt-2 text-sm text-slate-700">
              Catálogo, precios y actualización de tasas.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Gestión administrativa
            </p>

            <p className="mt-2 text-sm text-slate-700">
              Clientes, cotizaciones, órdenes y movimientos.
            </p>
          </div>

        </div>
      </div>

      {/* Tasas */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Tasas y precios
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            La configuración de las tasas se administra desde la sección correspondiente.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="font-medium text-orange-800">
              Configuración de tasas
            </p>

            <p className="mt-1 text-sm text-orange-700">
              Consulta y modifica el factor de trabajo desde la sección Tasas.
            </p>
          </div>

          <a
            href="/tasas"
            className="inline-flex justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Ir a Tasas
          </a>

        </div>

      </div>

      {/* Preferencias futuras */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Preferencias
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Opciones adicionales que podrán incorporarse posteriormente.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <p className="font-medium text-slate-700">
            No hay preferencias adicionales configuradas.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Esta sección queda preparada para futuras configuraciones.
          </p>
        </div>

      </div>

    </div>
  );
}

export default SettingsPage;