
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  crearProducto,
  obtenerProductoPorId,
  actualizarProducto,
  obtenerSiguienteSku,
} from "../../services/products.service";

import { obtenerTasas } from "../../services/rates.service";

function NewProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estados del formulario
  const [sku, setSku] = useState("");
  const [nombre, setNombre] = useState("");
  const [costoUsd, setCostoUsd] = useState("");
  const [tasaTrabajo, setTasaTrabajo] = useState(0);
const [precioBs, setPrecioBs] = useState(0);
const [usdOficial, setUsdOficial] = useState(0);
const [bcv, setBcv] = useState(0);

  // Estados de la pantalla
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Si existe un ID en la URL, cargar el producto
  useEffect(() => {
  cargarTasas();

  if (id) {
    cargarProducto();
  } else {
    cargarNuevoSku();
  }
}, [id]);

  async function cargarProducto() {
    try {
      setCargando(true);

      const producto = await obtenerProductoPorId(id!);

      setSku(producto.sku);
      setNombre(producto.nombre);
      setCostoUsd(producto.costo_usd.toString());
      recalcularValores(producto.costo_usd.toString());
    } catch (error) {
      console.error(error);
      setError("No fue posible cargar el producto.");
    } finally {
      setCargando(false);
    }
  }

  async function cargarNuevoSku() {
  try {
    const siguienteSku = await obtenerSiguienteSku();

    setSku(siguienteSku);
  } catch (error) {
    console.error(error);
  }
}

  async function cargarTasas() {
  try {
    const tasas = await obtenerTasas();

setTasaTrabajo(tasas.tasa_efectiva);
setBcv(tasas.bcv);
  } catch (error) {
    console.error(error);
  }
}

function recalcularValores(costo: string) {
  const costoNumero = Number(costo);

  if (!costoNumero || tasaTrabajo === 0 || bcv === 0) {
    setPrecioBs(0);
    setUsdOficial(0);
    return;
  }

  const bs = costoNumero * tasaTrabajo;

  const usdOficial = bs / bcv;

  setPrecioBs(bs);
  setUsdOficial(usdOficial);
}

  // Guardar o actualizar
  async function guardarProducto(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

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

      const producto = {
        sku: sku.trim().toUpperCase(),
        nombre: nombre.trim(),
        costo_usd: Number(costoUsd),
      };

      if (id) {
        await actualizarProducto(id, producto);
      } else {
        await crearProducto(producto);
      }

      navigate("/productos");
    } catch (error) {
      console.error(error);
      setError("No fue posible guardar el producto.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="p-8">
        Cargando producto...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          {id ? "Editar Producto" : "Nuevo Producto"}
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

          <div>
  <label className="mb-2 block font-medium">
    SKU
  </label>

  <input
    type="text"
    value={sku}
    readOnly
    className="w-full rounded-lg border border-slate-300 bg-slate-100 p-3 font-semibold text-slate-700"
  />

  <p className="mt-1 text-xs text-slate-500">
    El SKU se genera automáticamente.
  </p>
</div>

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

          <div>
            <label className="mb-2 block font-medium">
            Precio de Venta (USD Trabajo)
            </label>

            <input
              type="number"
              step="0.01"
              value={costoUsd}
            onChange={(e) => {
  setCostoUsd(e.target.value);
  recalcularValores(e.target.value);
}}
              placeholder="Ej.: 20.00"
              className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4">

<div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
  Ingrese el precio de venta en USD Trabajo. El sistema calculará automáticamente
  el precio en bolívares usando la Tasa de Trabajo y el equivalente en USD Oficial
  según el BCV vigente.
</div>
  <h3 className="font-semibold text-slate-700">
    Valores calculados
  </h3>

  <div>
    <label className="mb-2 block font-medium">
      Tasa de Trabajo
    </label>

    <input
      readOnly
      value={tasaTrabajo.toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      className="w-full rounded-lg border border-slate-300 bg-slate-100 p-3"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium">
      Precio Bs
    </label>

    <input
      readOnly
      value={precioBs.toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      className="w-full rounded-lg border border-slate-300 bg-slate-100 p-3 text-green-700 font-semibold"
    />
  </div>

  <div>
    <label className="mb-2 block font-medium">
      USD Oficial ( BCV )
    </label>

    <input
      readOnly
      value={usdOficial.toFixed(2)}
      className="w-full rounded-lg border border-slate-300 bg-slate-100 p-3"
    />
  </div>

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