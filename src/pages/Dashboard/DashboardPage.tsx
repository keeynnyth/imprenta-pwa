function DashboardPage() {
  return (
    <div className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-xl">

      {/* Fachada del local */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/fachada.jpg')",
        }}
      />

      {/* Capa suave para que el contenido sea legible */}
      <div className="absolute inset-0 bg-white/85" />

      {/* Contenido */}
      <div className="relative">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Inicio
          </h1>

          
        </div>

        <div className="rounded-xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur-sm">
          <p className="text-slate-700">
            Bienvenido al sistema de gestión de LAGOGRAPHI.
          </p>
        </div>

      </div>

    </div>
  );
}

export default DashboardPage;