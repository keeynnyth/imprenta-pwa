
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearProducto } from "../../services/products.service";

function NewProductPage() {
  const navigate = useNavigate();

  // Estados del formulario
  const [sku, setSku] = useState("");
  const [nombre, setNombre] = useState("");
  const [costoUsd, setCostoUsd] = useState("");

  // Estados de la pantalla
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Guardar producto
  async function guardarProducto(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    // Validaciones básicas
    if (!sku.trim()) {
      setError("Debe ingresar el SKU.");
      return;
    }

    if (!nombre.trim()) {
      setError("Debe ingresar el nombre del producto.");
      return;
    }

    if (!costoUsd || Number(costoUsd) <= 0) {
      setError("Debe ingresar un costo válido.");
      return;
    }

    try {
      setGuardando(true);

      await crearProducto({
        sku: sku.trim().toUpperCase(),
        nombre: nombre.trim(),
        costo_usd: Number(costoUsd),
      });

      navigate("/productos");
    } catch (error) {
      console.error(error);
      setError("No fue posible guardar el producto.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Nuevo Producto
        </h1>

        <button
          onClick={() => navigate("/productos")}
          className="rounded-lg bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
        >
          Volver
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          className="space-y-5"
          onSubmit={guardarProducto}
        >

          {/* SKU */}

          <div>
            <label className="mb-2 block font-medium">
              SKU
            </label>

            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Ej.: TAL-001"
              className="w-full rounded-lg border border-slate-300 p-3 uppercase focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Nombre */}

          <div>
            <label className="mb-2 block font-medium">
              Nombre del producto
            </label>

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej.: Talonario Media Carta"
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Costo */}

          <div>
            <label className="mb-2 block font-medium">
              Costo (USD)
            </label>

            <input
              type="number"
              step="0.01"
              value={costoUsd}
              onChange={(e) => setCostoUsd(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/productos")}
              className="rounded-lg bg-slate-500 px-5 py-2 text-white hover:bg-slate-600"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {guardando ? "Guardando..." : "Guardar"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default NewProductPage;