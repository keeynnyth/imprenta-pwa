import { useEffect, useState } from "react";
import {
  buscarClientes,
  type Cliente,
} from "../../services/clientes.service";

interface Props {
  value: string;

  onSelect: (cliente: Cliente | null) => void;

  onChange: (texto: string) => void;
}

function ClientSelector({
  value,
  onSelect,
  onChange,
}: Props) {
  const [resultados, setResultados] = useState<Cliente[]>([]);

  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    buscar();
  }, [value]);

  async function buscar() {
    if (!value.trim()) {
      setResultados([]);
      return;
    }

    try {
      const data = await buscarClientes(value);

      setResultados(data);

    } catch (error) {
      console.error(error);
    }
  }

  function seleccionar(cliente: Cliente) {
    onChange(cliente.nombre);

    onSelect(cliente);

    setMostrarLista(false);
  }

  return (
    <div className="relative">

      <input
        type="text"
        value={value}
        placeholder="Buscar cliente..."
        onFocus={() => setMostrarLista(true)}
        onChange={(e) => {
          onChange(e.target.value);

          setMostrarLista(true);
        }}
        className="w-full rounded-lg border border-slate-300 p-3"
      />

      {mostrarLista && resultados.length > 0 && (

        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg">

          {resultados.map((cliente) => (

            <button
              key={cliente.id}
              type="button"
              onClick={() => seleccionar(cliente)}
              className="block w-full border-b px-4 py-3 text-left hover:bg-slate-100"
            >

              <div className="font-semibold">

                {cliente.nombre}

              </div>

              <div className="text-sm text-slate-500">

                {cliente.documento || "Sin documento"}

              </div>

            </button>

          ))}

        </div>

      )}

    </div>
  );
}

export default ClientSelector;