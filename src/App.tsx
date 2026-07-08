import MenuLateral from "./components/layout/MenuLateral";

function App() {
  return (
    <div className="flex h-screen">

      <MenuLateral />

      <main className="flex-1 bg-slate-100 p-8">

        <h1 className="mb-4 text-3xl font-bold">
          Bienvenido
        </h1>

        <div className="rounded-lg bg-white p-6 shadow">
          Aquí construiremos el sistema.
        </div>

      </main>

    </div>
  );
}

export default App;