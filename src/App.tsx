
function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow">
        <div className="mx-auto flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold">🖨️ Sistema de Imprenta</h1>

          <span>Administrador</span>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">
            Bienvenido
          </h2>

          <p>
            Nuestro sistema de imprenta está comenzando 🚀
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;